<?php
/**
 * KOL Telecom - Form Configuration
 * Email-only configuration (no database)
 * Created: 2026-02-13
 */

// Prevent direct access
if (!defined('FORM_HANDLER')) {
    die('Direct access not permitted');
}

// ========================================
// SMTP Configuration (Office365)
// ========================================
define('SMTP_ENABLED', true);
define('SMTP_HOST', 'smtp.office365.com');
define('SMTP_PORT', 587);
define('SMTP_ENCRYPTION', 'tls'); // tls or ssl
define('SMTP_USERNAME', 'mailsender@koltelecom.com');
define('SMTP_PASSWORD', '~GUDby8VY}3th[/ukK');

// ========================================
// Email Settings
// ========================================
define('EMAIL_FROM_ADDRESS', 'mailsender@koltelecom.com');
define('EMAIL_FROM_NAME', 'KOL Telecom Website');

// Email recipients for different forms (all go to info@koltelecom.com)
define('EMAIL_CONTACT_TO', 'info@koltelecom.com');
define('EMAIL_CAREERS_TO', 'info@koltelecom.com'); // Career applications
define('EMAIL_PARTNERS_TO', 'info@koltelecom.com');
define('EMAIL_NEWSLETTER_TO', 'info@koltelecom.com');

// ========================================
// Security Settings
// ========================================
// Enable CSRF Protection
define('CSRF_ENABLED', true);

// Google reCAPTCHA v3 Settings
// Get your keys from: https://www.google.com/recaptcha/admin
define('RECAPTCHA_ENABLED', false); // Set to true when you have keys
define('RECAPTCHA_SITE_KEY', 'YOUR_RECAPTCHA_SITE_KEY'); // Public key
define('RECAPTCHA_SECRET_KEY', 'YOUR_RECAPTCHA_SECRET_KEY'); // Private key
define('RECAPTCHA_MIN_SCORE', 0.5); // Minimum score (0.0 to 1.0)

// ========================================
// File Upload Settings (for career forms)
// ========================================
define('UPLOAD_ENABLED', true);
define('UPLOAD_DIR', __DIR__ . '/../uploads/resumes/');
define('UPLOAD_MAX_SIZE', 5 * 1024 * 1024); // 5MB in bytes
define('UPLOAD_ALLOWED_TYPES', ['pdf', 'doc', 'docx']);

// ========================================
// Rate Limiting (prevent spam)
// ========================================
define('RATE_LIMIT_ENABLED', true);
define('RATE_LIMIT_MAX_ATTEMPTS', 5); // Max submissions
define('RATE_LIMIT_TIME_WINDOW', 3600); // Per 1 hour (in seconds)

// ========================================
// General Settings
// ========================================
define('SITE_URL', 'http://localhost/kol'); // Update this to your domain
define('COMPANY_NAME', 'KOL Telecom Services LLC');
define('COMPANY_LOGO_URL', SITE_URL . '/images/kolimg/KOLLOGO.png');

// ========================================
// Timezone
// ========================================
date_default_timezone_set('America/New_York'); // Update to your timezone

// ========================================
// Error Reporting (Disable in production)
// ========================================
if ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1') {
    // Development mode
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    define('DEBUG_MODE', true);
} else {
    // Production mode
    error_reporting(0);
    ini_set('display_errors', 0);
    define('DEBUG_MODE', false);
}

// ========================================
// Create upload directory if it doesn't exist
// ========================================
if (UPLOAD_ENABLED && !file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}
