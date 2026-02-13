# KOL Telecom - Form System Setup Instructions

## 📋 Overview
Your forms are now configured to send emails via **SMTP (Office365)** with proper security features:
- ✅ CSRF Protection
- ✅ Rate Limiting (5 submissions per hour)
- ✅ Input Sanitization
- ✅ Email Validation
- ✅ File Upload Security (for career forms)
- ✅ Honeypot Bot Protection (partner form)
- ✅ Beautiful HTML Email Templates

---

## 🚀 Quick Start

### Step 1: Test Your Setup
1. Open your browser and go to: `http://localhost/kol/contact-us.html`
2. Fill out the contact form
3. Click "Send Message"
4. Check your email at **info@koltelecom.com**

### Step 2: Create Uploads Folder
For career applications with resume uploads:
```bash
mkdir uploads
mkdir uploads/resumes
chmod 755 uploads
chmod 755 uploads/resumes
```

---

## 📁 Files Created

### Backend PHP Files (in `email-templates/` folder):
1. **config.php** - SMTP and security settings
2. **FormHandler.php** - Main form processing class
3. **contact-form.php** - Contact form handler
4. **career-form.php** - Career application handler (with file uploads)
5. **partner-form.php** - Partner application handler
6. **subscribe-newsletter.php** - Newsletter subscription handler
7. **csrf-helper.php** - CSRF token generator (if you want PHP-based tokens)

### Frontend JavaScript:
1. **js/form-handler.js** - Form submission and validation

### Updated HTML Forms:
1. **contact-us.html** - Updated with CSRF token and form handler

---

## ⚙️ Configuration

### 1. SMTP Settings (Already Configured)
File: `email-templates/config.php`

```php
SMTP_HOST: smtp.office365.com
SMTP_PORT: 587
SMTP_USERNAME: mailsender@koltelecom.com
SMTP_PASSWORD: ********** (already set)
```

### 2. Email Recipients
Edit `email-templates/config.php` to change where emails are sent:

```php
EMAIL_CONTACT_TO = 'info@koltelecom.com'
EMAIL_CAREERS_TO = 'hr@koltelecom.com'  // Change if needed
EMAIL_PARTNERS_TO = 'info@koltelecom.com'
EMAIL_NEWSLETTER_TO = 'info@koltelecom.com'
```

### 3. Enable reCAPTCHA (Optional but Recommended)
1. Get your reCAPTCHA keys from: https://www.google.com/recaptcha/admin
2. Edit `email-templates/config.php`:
   ```php
   define('RECAPTCHA_ENABLED', true);
   define('RECAPTCHA_SITE_KEY', 'your_site_key_here');
   define('RECAPTCHA_SECRET_KEY', 'your_secret_key_here');
   ```
3. Add to your HTML forms (before `</head>`):
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=your_site_key_here"></script>
   ```

### 4. Update Site URL
Edit `email-templates/config.php`:
```php
define('SITE_URL', 'https://koltelecom.com'); // Your production URL
```

---

## 🔧 Update Remaining Forms

### Forms That Need Updating:

#### 1. **careers.html** - Career Application Form
Add to the form:
```html
<form action="email-templates/career-form.php" method="post" id="careerForm" enctype="multipart/form-data">
    <input type="hidden" name="csrf_token" value="">
    <!-- Rest of form fields -->
</form>
```

Add before `</body>`:
```html
<script src="js/form-handler.js"></script>
```

#### 2. **partners-become.html** - Partner Application
Add to the form:
```html
<form action="email-templates/partner-form.php" method="post" id="partnerForm">
    <input type="hidden" name="csrf_token" value="">
    <!-- Keep existing honeypot field: -->
    <input type="text" name="website_url" style="display:none">
    <!-- Rest of form fields -->
</form>
```

Add before `</body>`:
```html
<script src="js/form-handler.js"></script>
```

#### 3. **coming-soon.html** - Newsletter
Update the form:
```html
<form action="email-templates/subscribe-newsletter.php" method="post" class="newsletter-form">
    <input type="hidden" name="csrf_token" value="">
    <input type="email" name="email" required>
    <button type="submit">Notify me</button>
</form>
```

Add before `</body>`:
```html
<script src="js/form-handler.js"></script>
```

#### 4. **solutions-cedar.html & solutions-textr.html** - Newsletter Forms
Same as above - add `csrf_token` and the script.

---

## 🧪 Testing Checklist

### Test Contact Form:
- [ ] Open http://localhost/kol/contact-us.html
- [ ] Fill form with valid data
- [ ] Submit and check for success message
- [ ] Check email at info@koltelecom.com
- [ ] Try submitting again 6 times (should be rate-limited)
- [ ] Try submitting with empty required fields (should show validation error)

### Test Career Form:
- [ ] Open http://localhost/kol/careers.html
- [ ] Fill form and upload a PDF resume
- [ ] Check email with resume attachment
- [ ] Try uploading a .exe file (should be rejected)
- [ ] Try uploading a 10MB file (should be rejected - max 5MB)

### Test Partner Form:
- [ ] Fill all required fields
- [ ] Check honeypot protection (bots fill the hidden `website_url` field)

### Test Newsletter:
- [ ] Subscribe with valid email
- [ ] Check confirmation email sent to subscriber
- [ ] Check notification email sent to you

---

## 🛡️ Security Features

### 1. CSRF Protection
- Every form submission requires a valid CSRF token
- Tokens are session-based and expire when browser closes
- Prevents cross-site request forgery attacks

### 2. Rate Limiting
- Max 5 submissions per hour per IP address
- Prevents spam and abuse
- Can be adjusted in `config.php`

### 3. Input Sanitization
- All form inputs are sanitized to prevent XSS attacks
- Email addresses are validated
- HTML special characters are escaped

### 4. File Upload Security
- Only PDF, DOC, DOCX files allowed for resumes
- Maximum file size: 5MB
- Files are renamed with unique IDs to prevent overwrites
- Uploaded files are stored outside webroot (recommended)

### 5. SQL Injection Prevention
- No database used (email-only setup)
- All inputs are sanitized even though no SQL queries

### 6. Honeypot Protection
- Partner form has a hidden field that bots fill but humans don't
- If filled, submission is silently discarded

---

## 🐛 Troubleshooting

### Problem: Emails not sending
**Solution:**
1. Check SMTP credentials in `config.php`
2. Enable debug mode:
   ```php
   define('DEBUG_MODE', true);
   ```
3. Check PHP error logs in Laragon: `C:\laragon\www\kol\error.log`
4. Test SMTP connection:
   ```bash
   telnet smtp.office365.com 587
   ```

### Problem: Form shows "CSRF validation failed"
**Solution:**
1. Make sure `form-handler.js` is loaded
2. Check browser console for JavaScript errors
3. Clear browser cache and cookies
4. Check if session is working: `session_start()` in PHP

### Problem: File upload fails
**Solution:**
1. Check if `uploads/resumes/` folder exists
2. Check folder permissions (should be 755)
3. Check PHP upload settings in `php.ini`:
   ```ini
   upload_max_filesize = 10M
   post_max_size = 10M
   ```

### Problem: Rate limit blocking legitimate users
**Solution:**
Edit `config.php`:
```php
define('RATE_LIMIT_MAX_ATTEMPTS', 10); // Increase from 5 to 10
define('RATE_LIMIT_TIME_WINDOW', 7200); // 2 hours instead of 1
```

---

## 📧 Email Template Customization

### Customize Email Design
Edit `FormHandler.php` → `buildEmailTemplate()` method

### Add Company Logo
Make sure your logo is accessible:
```php
define('COMPANY_LOGO_URL', 'http://localhost/kol/images/kolimg/KOLLOGO.png');
```

For production, use full URL:
```php
define('COMPANY_LOGO_URL', 'https://koltelecom.com/images/kolimg/KOLLOGO.png');
```

---

## 🚀 Production Deployment

### Before Going Live:

1. **Update config.php:**
   ```php
   define('SITE_URL', 'https://koltelecom.com');
   define('DEBUG_MODE', false);
   ```

2. **Enable reCAPTCHA:**
   - Get keys from Google reCAPTCHA
   - Update `config.php` with your keys
   - Set `RECAPTCHA_ENABLED` to `true`

3. **Test all forms** on production server

4. **Set proper file permissions:**
   ```bash
   chmod 644 email-templates/*.php
   chmod 755 uploads/
   ```

5. **Monitor email delivery:**
   - Check spam folders
   - Add SPF/DKIM records for your domain
   - Use email monitoring tools

---

## 📞 Need Help?

### Common Issues:
- Forms not submitting → Check JavaScript console
- Emails not arriving → Check SMTP settings
- File uploads failing → Check folder permissions

### Configuration Reference:
- SMTP: Office365 (smtp.office365.com:587)
- Security: CSRF + Rate Limiting + Sanitization
- Max File Size: 5MB
- Allowed Files: PDF, DOC, DOCX

---

## ✅ Next Steps

1. ✅ **Test contact form** - Should work now!
2. ⏳ **Update remaining HTML forms** (careers, partners, newsletter)
3. ⏳ **Enable reCAPTCHA** (optional but recommended)
4. ⏳ **Test on production server**

---

**Created:** 2026-02-13
**Version:** 1.0
**Support:** For issues, check the troubleshooting section above
