<?php
/**
 * KOL Telecom - Newsletter Subscription Handler
 * Processes newsletter subscription requests
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
if (!$handler->checkRateLimit('newsletter')) {
    $handler->jsonResponse(false, 'Too many submissions. Please try again in an hour.');
}

// Validate CSRF token
$csrfToken = $_POST['csrf_token'] ?? '';
if (!$handler->validateCSRFToken($csrfToken)) {
    $handler->jsonResponse(false, 'Security validation failed. Please refresh the page and try again.');
}

// Validate reCAPTCHA (if enabled)
$recaptchaToken = $_POST['g-recaptcha-response'] ?? '';
if (!$handler->validateRecaptcha($recaptchaToken, 'newsletter_form')) {
    $handler->jsonResponse(false, 'reCAPTCHA verification failed. Please try again.');
}

// Get and sanitize email
$email = $handler->sanitize($_POST['email'] ?? '', 'email');

// Validate email
if (empty($email)) {
    $handler->jsonResponse(false, 'Please enter your email address.');
}

if (!$handler->validateEmail($email)) {
    $handler->jsonResponse(false, 'Please enter a valid email address.');
}

// Build email content for notification
$emailFields = [
    'Email' => $email,
    'IP Address' => $handler->getClientIP(),
    'Subscribed At' => date('F j, Y \a\t g:i A')
];

$emailBody = $handler->buildEmailTemplate('New Newsletter Subscription', $emailFields);

// Send notification email
$subject = 'New Newsletter Subscription - ' . $email;
$emailSent = $handler->sendEmail(
    EMAIL_NEWSLETTER_TO,
    $subject,
    $emailBody
);

// Also send confirmation email to subscriber
$confirmationBody = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 30px; text-align: center;">
                <img src="' . COMPANY_LOGO_URL . '" alt="KOL Telecom" style="max-width: 180px; height: auto;">
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Welcome to KOL Telecom!</h2>
                <p style="margin: 0 0 15px 0; color: #666; line-height: 1.6;">Thank you for subscribing to our newsletter.</p>
                <p style="margin: 0 0 15px 0; color: #666; line-height: 1.6;">You\'ll receive updates about our latest products, services, and industry insights.</p>
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">Stay tuned for exciting updates!</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="' . SITE_URL . '" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600;">Visit Our Website</a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                <p style="margin: 0;">© ' . date('Y') . ' ' . COMPANY_NAME . '. All rights reserved.</p>
                <p style="margin: 10px 0 0 0;">
                    <a href="' . SITE_URL . '/contact-us.html" style="color: #FF6B35; text-decoration: none;">Contact Us</a> |
                    <a href="' . SITE_URL . '/terms-conditions.html" style="color: #FF6B35; text-decoration: none;">Terms & Conditions</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>';

$handler->sendEmail(
    $email,
    'Welcome to KOL Telecom Newsletter',
    $confirmationBody,
    EMAIL_FROM_ADDRESS
);

if ($emailSent) {
    $handler->jsonResponse(true, 'Thank you for subscribing! Please check your email for confirmation.');
} else {
    $handler->jsonResponse(false, 'Sorry, there was an error processing your subscription. Please try again.');
}
