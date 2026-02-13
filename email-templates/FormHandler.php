<?php
/**
 * KOL Telecom - Secure Form Handler Class
 * Handles form validation, CSRF protection, email sending
 * Created: 2026-02-13
 */

define('FORM_HANDLER', true);
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class FormHandler {

    private $errors = [];
    private $mail;

    public function __construct() {
        // Start session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Initialize PHPMailer
        $this->mail = new PHPMailer(true);
        $this->configureSMTP();
    }

    /**
     * Configure SMTP settings
     */
    private function configureSMTP() {
        try {
            if (SMTP_ENABLED) {
                $this->mail->isSMTP();
                $this->mail->Host = SMTP_HOST;
                $this->mail->SMTPAuth = true;
                $this->mail->Username = SMTP_USERNAME;
                $this->mail->Password = SMTP_PASSWORD;
                $this->mail->SMTPSecure = SMTP_ENCRYPTION;
                $this->mail->Port = SMTP_PORT;
                $this->mail->CharSet = 'UTF-8';
            }
        } catch (Exception $e) {
            $this->addError('SMTP configuration failed: ' . $e->getMessage());
        }
    }

    /**
     * Generate CSRF Token
     */
    public static function generateCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Validate CSRF Token
     */
    public function validateCSRFToken($token) {
        if (!CSRF_ENABLED) {
            return true;
        }

        if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
            $this->addError('Invalid security token. Please refresh and try again.');
            return false;
        }
        return true;
    }

    /**
     * Validate reCAPTCHA
     */
    public function validateRecaptcha($token, $action = '') {
        if (!RECAPTCHA_ENABLED) {
            return true;
        }

        if (empty($token)) {
            $this->addError('reCAPTCHA verification failed.');
            return false;
        }

        $data = [
            'secret' => RECAPTCHA_SECRET_KEY,
            'response' => $token
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $result = json_decode($response, true);

        if (!isset($result['success']) || !$result['success']) {
            $this->addError('reCAPTCHA verification failed.');
            return false;
        }

        // Check score for v3
        if (isset($result['score']) && $result['score'] < RECAPTCHA_MIN_SCORE) {
            $this->addError('Suspicious activity detected. Please try again.');
            return false;
        }

        // Check action if provided
        if (!empty($action) && isset($result['action']) && $result['action'] !== $action) {
            $this->addError('reCAPTCHA action mismatch.');
            return false;
        }

        return true;
    }

    /**
     * Rate Limiting Check
     */
    public function checkRateLimit($formType) {
        if (!RATE_LIMIT_ENABLED) {
            return true;
        }

        $ip = $this->getClientIP();
        $sessionKey = 'rate_limit_' . $formType . '_' . md5($ip);

        if (!isset($_SESSION[$sessionKey])) {
            $_SESSION[$sessionKey] = [
                'count' => 1,
                'first_attempt' => time()
            ];
            return true;
        }

        $data = $_SESSION[$sessionKey];
        $timePassed = time() - $data['first_attempt'];

        // Reset if time window passed
        if ($timePassed > RATE_LIMIT_TIME_WINDOW) {
            $_SESSION[$sessionKey] = [
                'count' => 1,
                'first_attempt' => time()
            ];
            return true;
        }

        // Check limit
        if ($data['count'] >= RATE_LIMIT_MAX_ATTEMPTS) {
            $this->addError('Too many submissions. Please try again later.');
            return false;
        }

        // Increment count
        $_SESSION[$sessionKey]['count']++;
        return true;
    }

    /**
     * Sanitize input data
     */
    public function sanitize($data, $type = 'string') {
        if (is_array($data)) {
            return array_map(function($item) use ($type) {
                return $this->sanitize($item, $type);
            }, $data);
        }

        $data = trim($data);

        switch ($type) {
            case 'email':
                return filter_var($data, FILTER_SANITIZE_EMAIL);
            case 'url':
                return filter_var($data, FILTER_SANITIZE_URL);
            case 'int':
                return filter_var($data, FILTER_SANITIZE_NUMBER_INT);
            default:
                return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        }
    }

    /**
     * Validate email address
     */
    public function validateEmail($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->addError('Invalid email address.');
            return false;
        }
        return true;
    }

    /**
     * Validate required fields
     */
    public function validateRequired($fields, $data) {
        foreach ($fields as $field) {
            if (empty($data[$field])) {
                $fieldName = ucfirst(str_replace('_', ' ', $field));
                $this->addError("{$fieldName} is required.");
            }
        }
        return empty($this->errors);
    }

    /**
     * Handle file upload
     */
    public function handleFileUpload($fileInput, $allowedTypes = null) {
        if (!UPLOAD_ENABLED) {
            $this->addError('File uploads are disabled.');
            return false;
        }

        if (!isset($_FILES[$fileInput]) || $_FILES[$fileInput]['error'] === UPLOAD_ERR_NO_FILE) {
            return null; // No file uploaded (optional field)
        }

        $file = $_FILES[$fileInput];

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $this->addError('File upload failed. Please try again.');
            return false;
        }

        // Check file size
        if ($file['size'] > UPLOAD_MAX_SIZE) {
            $maxSizeMB = UPLOAD_MAX_SIZE / (1024 * 1024);
            $this->addError("File size exceeds maximum limit of {$maxSizeMB}MB.");
            return false;
        }

        // Check file type
        $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = $allowedTypes ?? UPLOAD_ALLOWED_TYPES;

        if (!in_array($fileExt, $allowed)) {
            $this->addError('Invalid file type. Allowed: ' . implode(', ', $allowed));
            return false;
        }

        // Generate unique filename
        $newFilename = uniqid() . '_' . time() . '.' . $fileExt;
        $uploadPath = UPLOAD_DIR . $newFilename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $this->addError('Failed to save uploaded file.');
            return false;
        }

        return [
            'original_name' => $file['name'],
            'saved_name' => $newFilename,
            'path' => $uploadPath,
            'size' => $file['size'],
            'type' => $file['type']
        ];
    }

    /**
     * Send email
     */
    public function sendEmail($to, $subject, $body, $replyTo = null, $attachments = []) {
        try {
            // Clear previous recipients
            $this->mail->clearAddresses();
            $this->mail->clearAttachments();

            // Set sender
            $this->mail->setFrom(EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME);

            // Set recipient
            $this->mail->addAddress($to);

            // Set reply-to if provided
            if ($replyTo) {
                $this->mail->addReplyTo($replyTo);
            }

            // Set subject and body
            $this->mail->Subject = $subject;
            $this->mail->isHTML(true);
            $this->mail->Body = $body;

            // Add attachments
            foreach ($attachments as $attachment) {
                if (file_exists($attachment['path'])) {
                    $this->mail->addAttachment($attachment['path'], $attachment['name']);
                }
            }

            // Send
            if (!$this->mail->send()) {
                $this->addError('Failed to send email: ' . $this->mail->ErrorInfo);
                return false;
            }

            return true;

        } catch (Exception $e) {
            $this->addError('Email error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Build HTML email template
     */
    public function buildEmailTemplate($title, $fields) {
        $rows = '';
        foreach ($fields as $label => $value) {
            if (empty($value)) continue;

            $rows .= '<tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; color: #555; width: 200px;">' .
                htmlspecialchars($label) . ':</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">' .
                nl2br(htmlspecialchars($value)) . '</td>
            </tr>';
        }

        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 30px; text-align: center;">
                <img src="' . COMPANY_LOGO_URL . '" alt="KOL Telecom" style="max-width: 180px; height: auto;">
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">' . htmlspecialchars($title) . '</h2>
                <p style="margin: 0 0 20px 0; color: #666;">You have received a new form submission:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    ' . $rows . '
                </table>
            </td>
        </tr>
        <tr>
            <td style="background: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                <p style="margin: 0;">© ' . date('Y') . ' ' . COMPANY_NAME . '. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">Submitted on: ' . date('F j, Y \a\t g:i A') . '</p>
            </td>
        </tr>
    </table>
</body>
</html>';

        return $html;
    }

    /**
     * Get client IP address
     */
    public function getClientIP() {
        $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'];
        foreach ($ipKeys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
                        return $ip;
                    }
                }
            }
        }
        return 'Unknown';
    }

    /**
     * Add error message
     */
    private function addError($message) {
        $this->errors[] = $message;
    }

    /**
     * Get all errors
     */
    public function getErrors() {
        return $this->errors;
    }

    /**
     * Check if there are errors
     */
    public function hasErrors() {
        return !empty($this->errors);
    }

    /**
     * Send JSON response
     */
    public function jsonResponse($success, $message, $data = []) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'errors' => $this->errors
        ]);
        exit;
    }
}
