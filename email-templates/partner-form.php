<?php
/**
 * KOL Telecom - Partner Application Form Handler
 * Processes partner application submissions
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
if (!$handler->checkRateLimit('partner')) {
    $handler->jsonResponse(false, 'Too many submissions. Please try again in an hour.');
}

// Validate CSRF token
$csrfToken = $_POST['csrf_token'] ?? '';
if (!$handler->validateCSRFToken($csrfToken)) {
    $handler->jsonResponse(false, 'Security validation failed. Please refresh the page and try again.');
}

// Validate reCAPTCHA (if enabled)
$recaptchaToken = $_POST['g-recaptcha-response'] ?? '';
if (!$handler->validateRecaptcha($recaptchaToken, 'partner_form')) {
    $handler->jsonResponse(false, 'reCAPTCHA verification failed. Please try again.');
}

// Check honeypot field (bot protection)
$honeypot = $_POST['website_url'] ?? '';
if (!empty($honeypot)) {
    // This is likely a bot submission
    $handler->jsonResponse(true, 'Thank you for your submission!'); // Fake success to fool bots
}

// Get and sanitize form data
$data = [
    'first_name' => $handler->sanitize($_POST['first_name'] ?? ''),
    'last_name' => $handler->sanitize($_POST['last_name'] ?? ''),
    'email' => $handler->sanitize($_POST['email'] ?? '', 'email'),
    'phone' => $handler->sanitize($_POST['phone'] ?? ''),
    'company' => $handler->sanitize($_POST['company'] ?? ''),
    'country' => $handler->sanitize($_POST['country'] ?? ''),
    'partnership_type' => $handler->sanitize($_POST['partnership_type'] ?? ''),
    'message' => $handler->sanitize($_POST['message'] ?? '')
];

// Validate required fields
$requiredFields = ['first_name', 'last_name', 'email', 'company', 'country'];
if (!$handler->validateRequired($requiredFields, $data)) {
    $handler->jsonResponse(false, 'Please fill in all required fields.');
}

// Validate email format
if (!$handler->validateEmail($data['email'])) {
    $handler->jsonResponse(false, 'Please enter a valid email address.');
}

// Build email content
$partnershipTypes = [
    'reseller' => 'Reseller Partner',
    'technology' => 'Technology Partner',
    'referral' => 'Referral Partner',
    'integration' => 'Integration Partner',
    'other' => 'Other'
];

$emailFields = [
    'First Name' => $data['first_name'],
    'Last Name' => $data['last_name'],
    'Email' => $data['email'],
    'Phone' => $data['phone'] ?: 'Not provided',
    'Company' => $data['company'],
    'Country' => $data['country'],
    'Partnership Type' => $data['partnership_type'] ? ($partnershipTypes[$data['partnership_type']] ?? $data['partnership_type']) : 'Not specified',
    'Message' => $data['message'] ?: 'No message',
    'IP Address' => $handler->getClientIP(),
    'Submitted At' => date('F j, Y \a\t g:i A')
];

$emailBody = $handler->buildEmailTemplate('New Partner Application', $emailFields);

// Send email
$subject = 'New Partner Application - ' . $data['company'];
$emailSent = $handler->sendEmail(
    EMAIL_PARTNERS_TO,
    $subject,
    $emailBody,
    $data['email'] // Reply-to address
);

if ($emailSent) {
    $handler->jsonResponse(true, 'Thank you for your interest in partnering with us! Our partnership team will review your application and contact you soon.');
} else {
    $handler->jsonResponse(false, 'Sorry, there was an error submitting your application. Please try again or email us directly at ' . EMAIL_PARTNERS_TO);
}
