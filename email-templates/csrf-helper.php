<?php
/**
 * CSRF Helper - Include this file in your HTML pages to generate CSRF tokens
 * Usage: <?php include('email-templates/csrf-helper.php'); ?>
 * Then use: <?php echo csrf_token_field(); ?> in your forms
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Generate CSRF Token
 */
function get_csrf_token() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Generate CSRF Token Hidden Field for Forms
 */
function csrf_token_field() {
    $token = get_csrf_token();
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token) . '">';
}

/**
 * Generate meta tag for AJAX requests
 */
function csrf_token_meta() {
    $token = get_csrf_token();
    return '<meta name="csrf-token" content="' . htmlspecialchars($token) . '">';
}
