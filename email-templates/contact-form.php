<?php
/**
 * KOL Telecom - Contact Form Handler
 * Processes contact form submissions and sends email
 * Created: 2026-02-13
 */

require_once __DIR__ . '/FormHandler.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method not allowed');
}

// Initialize form handler
$handler = new FormHandler();

// Check rate limiting
if (!$handler->checkRateLimit('contact')) {
    $handler->jsonResponse(false, 'Too many submissions. Please try again in an hour.');
}

// Validate CSRF token
$csrfToken = $_POST['csrf_token'] ?? '';
if (!$handler->validateCSRFToken($csrfToken)) {
    $handler->jsonResponse(false, 'Security validation failed. Please refresh the page and try again.');
}

// Validate reCAPTCHA (if enabled)
$recaptchaToken = $_POST['g-recaptcha-response'] ?? '';
if (!$handler->validateRecaptcha($recaptchaToken, 'contact_form')) {
    $handler->jsonResponse(false, 'reCAPTCHA verification failed. Please try again.');
}

// Get and sanitize form data
$data = [
    'name' => $handler->sanitize($_POST['name'] ?? ''),
    'email' => $handler->sanitize($_POST['email'] ?? '', 'email'),
    'mobile' => $handler->sanitize($_POST['mobile'] ?? ''),
    'country' => $handler->sanitize($_POST['country'] ?? ''),
    'service' => $handler->sanitize($_POST['service'] ?? ''),
    'message' => $handler->sanitize($_POST['message'] ?? '')
];

// Validate required fields
$requiredFields = ['name', 'email'];
if (!$handler->validateRequired($requiredFields, $data)) {
    $handler->jsonResponse(false, 'Please fill in all required fields.');
}

// Validate email format
if (!$handler->validateEmail($data['email'])) {
    $handler->jsonResponse(false, 'Please enter a valid email address.');
}

// Build email content
$emailFields = [
    'Name' => $data['name'],
    'Email' => $data['email'],
    'Mobile' => $data['mobile'] ?: 'Not provided',
    'Country' => $data['country'] ?: 'Not provided',
    'Service/Product' => $data['service'] ?: 'Not specified',
    'Message' => $data['message'] ?: 'No message',
    'IP Address' => $handler->getClientIP(),
    'Submitted At' => date('F j, Y \a\t g:i A')
];

$emailBody = $handler->buildEmailTemplate('New Contact Form Submission', $emailFields);

// Send email
$subject = 'New Contact Form Submission - ' . $data['name'];
$emailSent = $handler->sendEmail(
    EMAIL_CONTACT_TO,
    $subject,
    $emailBody,
    $data['email'] // Reply-to address
);

if ($emailSent) {
    $handler->jsonResponse(true, 'Thank you for contacting us! We will get back to you soon.');
} else {
    $handler->jsonResponse(false, 'Sorry, there was an error sending your message. Please try again or email us directly at ' . EMAIL_CONTACT_TO);
}
