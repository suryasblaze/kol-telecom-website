<?php
/**
 * KOL Telecom - Career Application Form Handler
 * Processes career applications with resume uploads
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
if (!$handler->checkRateLimit('career')) {
    $handler->jsonResponse(false, 'Too many submissions. Please try again in an hour.');
}

// Validate CSRF token
$csrfToken = $_POST['csrf_token'] ?? '';
if (!$handler->validateCSRFToken($csrfToken)) {
    $handler->jsonResponse(false, 'Security validation failed. Please refresh the page and try again.');
}

// Validate reCAPTCHA (if enabled)
$recaptchaToken = $_POST['g-recaptcha-response'] ?? '';
if (!$handler->validateRecaptcha($recaptchaToken, 'career_form')) {
    $handler->jsonResponse(false, 'reCAPTCHA verification failed. Please try again.');
}

// Get and sanitize form data
$data = [
    'name' => $handler->sanitize($_POST['name'] ?? ''),
    'email' => $handler->sanitize($_POST['email'] ?? '', 'email'),
    'mobile' => $handler->sanitize($_POST['mobile'] ?? ''),
    'country' => $handler->sanitize($_POST['country'] ?? ''),
    'job_position' => $handler->sanitize($_POST['job_position'] ?? '')
];

// Validate required fields
$requiredFields = ['name', 'email', 'job_position'];
if (!$handler->validateRequired($requiredFields, $data)) {
    $handler->jsonResponse(false, 'Please fill in all required fields.');
}

// Validate email format
if (!$handler->validateEmail($data['email'])) {
    $handler->jsonResponse(false, 'Please enter a valid email address.');
}

// Handle resume upload
$resumeFile = $handler->handleFileUpload('resume', ['pdf', 'doc', 'docx']);

if ($handler->hasErrors()) {
    $handler->jsonResponse(false, 'Error processing your application: ' . implode(', ', $handler->getErrors()));
}

// Build email content
$emailFields = [
    'Name' => $data['name'],
    'Email' => $data['email'],
    'Mobile' => $data['mobile'] ?: 'Not provided',
    'Country' => $data['country'] ?: 'Not provided',
    'Position Applied For' => $data['job_position'],
    'Resume' => $resumeFile ? $resumeFile['original_name'] . ' (' . round($resumeFile['size'] / 1024, 2) . ' KB)' : 'Not attached',
    'IP Address' => $handler->getClientIP(),
    'Submitted At' => date('F j, Y \a\t g:i A')
];

$emailBody = $handler->buildEmailTemplate('New Career Application', $emailFields);

// Prepare attachments
$attachments = [];
if ($resumeFile) {
    $attachments[] = [
        'path' => $resumeFile['path'],
        'name' => $resumeFile['original_name']
    ];
}

// Send email
$subject = 'New Career Application - ' . $data['job_position'] . ' - ' . $data['name'];
$emailSent = $handler->sendEmail(
    EMAIL_CAREERS_TO,
    $subject,
    $emailBody,
    $data['email'], // Reply-to address
    $attachments
);

if ($emailSent) {
    $handler->jsonResponse(true, 'Thank you for your application! We will review your resume and contact you if there is a suitable opportunity.');
} else {
    // Clean up uploaded file if email failed
    if ($resumeFile && file_exists($resumeFile['path'])) {
        unlink($resumeFile['path']);
    }
    $handler->jsonResponse(false, 'Sorry, there was an error submitting your application. Please try again or email your resume to ' . EMAIL_CAREERS_TO);
}
