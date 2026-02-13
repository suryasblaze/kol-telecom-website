-- KOL Telecom Form Submissions Database Schema
-- Created: 2026-02-13
-- Purpose: Store all form submissions with proper security and tracking

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS kol_forms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE kol_forms;

-- ========================================
-- Contact Form Submissions Table
-- ========================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    service VARCHAR(100) DEFAULT NULL,
    message TEXT DEFAULT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    notes TEXT DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Career Applications Table
-- ========================================
CREATE TABLE IF NOT EXISTS career_applications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    job_position VARCHAR(255) NOT NULL,
    resume_filename VARCHAR(255) DEFAULT NULL,
    resume_path VARCHAR(500) DEFAULT NULL,
    resume_size INT UNSIGNED DEFAULT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'screening', 'shortlisted', 'interviewed', 'rejected', 'hired') DEFAULT 'new',
    notes TEXT DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_job_position (job_position),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Partner Applications Table
-- ========================================
CREATE TABLE IF NOT EXISTS partner_applications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    company VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    partnership_type ENUM('reseller', 'technology', 'referral', 'integration', 'other') DEFAULT NULL,
    message TEXT DEFAULT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'review', 'approved', 'rejected', 'active') DEFAULT 'new',
    notes TEXT DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_company (company),
    INDEX idx_partnership_type (partnership_type),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Newsletter Subscriptions Table
-- ========================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
    unsubscribe_token VARCHAR(64) DEFAULT NULL,
    unsubscribed_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_subscribed_at (subscribed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Admin Users Table (for admin panel)
-- ========================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'viewer',
    last_login TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active',
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Activity Log Table (for tracking admin actions)
-- ========================================
CREATE TABLE IF NOT EXISTS activity_log (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id INT UNSIGNED,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT UNSIGNED,
    description TEXT,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Create Default Admin User
-- Username: admin
-- Password: Admin@123 (CHANGE THIS IMMEDIATELY!)
-- ========================================
INSERT INTO admin_users (username, password_hash, email, full_name, role, status)
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@koltelecom.com', 'System Administrator', 'admin', 'active')
ON DUPLICATE KEY UPDATE username=username;

-- ========================================
-- View for Quick Stats (for admin dashboard)
-- ========================================
CREATE OR REPLACE VIEW form_stats AS
SELECT
    (SELECT COUNT(*) FROM contact_submissions WHERE status='new') as new_contacts,
    (SELECT COUNT(*) FROM career_applications WHERE status='new') as new_careers,
    (SELECT COUNT(*) FROM partner_applications WHERE status='new') as new_partners,
    (SELECT COUNT(*) FROM newsletter_subscriptions WHERE status='active') as active_subscribers,
    (SELECT COUNT(*) FROM contact_submissions WHERE DATE(submitted_at) = CURDATE()) as today_contacts,
    (SELECT COUNT(*) FROM career_applications WHERE DATE(submitted_at) = CURDATE()) as today_careers,
    (SELECT COUNT(*) FROM partner_applications WHERE DATE(submitted_at) = CURDATE()) as today_partners,
    (SELECT COUNT(*) FROM newsletter_subscriptions WHERE DATE(subscribed_at) = CURDATE()) as today_subscribers;

-- ========================================
-- Success Message
-- ========================================
SELECT 'Database schema created successfully!' as message;
SELECT 'Default admin user created: username=admin, password=Admin@123 (CHANGE THIS!)' as warning;
