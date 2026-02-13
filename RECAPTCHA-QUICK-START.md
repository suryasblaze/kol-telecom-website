# 🔐 reCAPTCHA Quick Start Guide

Your forms are **READY** for reCAPTCHA! Just follow these 3 simple steps:

---

## ⚡ **Quick Setup (5 Minutes)**

### **Step 1: Get Your Keys** (2 min)
1. Go to: https://www.google.com/recaptcha/admin/create
2. Create new site:
   - **Label:** KOL Telecom
   - **Type:** reCAPTCHA v3
   - **Domains:**
     - `localhost` (for testing)
     - `koltelecom.com` (your domain)
3. Click **Submit**
4. **Copy both keys:**
   - 🔑 **Site Key** (public)
   - 🔒 **Secret Key** (private)

---

### **Step 2: Add Keys to Backend** (1 min)

Open: `email-templates/config.php`

**Find lines 31-34 and update:**

```php
// Change these 3 lines:
define('RECAPTCHA_ENABLED', true);  // ← Change from false to true
define('RECAPTCHA_SITE_KEY', 'YOUR_SITE_KEY_HERE');  // ← Paste Site Key
define('RECAPTCHA_SECRET_KEY', 'YOUR_SECRET_KEY_HERE');  // ← Paste Secret Key
```

**Save the file.**

---

### **Step 3: Add Script to HTML** (2 min)

**Copy this code block:**

```html
<!-- reCAPTCHA v3 -->
<script>
    window.RECAPTCHA_SITE_KEY = 'YOUR_SITE_KEY_HERE';
</script>
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY_HERE"></script>
```

**Replace** `YOUR_SITE_KEY_HERE` with your actual Site Key (from Step 1)

**Add this code to 7 HTML files** (paste before `</head>` tag):

1. ✅ `index.html`
2. ✅ `contact-us.html`
3. ✅ `careers.html`
4. ✅ `partners-become.html`
5. ✅ `coming-soon.html`
6. ✅ `solutions-cedar.html`
7. ✅ `solutions-textr.html`

---

## 🧪 **Test It**

1. Open any form: `http://localhost/kol/contact-us.html`
2. Fill out the form
3. Submit
4. Should work! ✅
5. Check your reCAPTCHA dashboard for stats

---

## 📍 **Where to Add in HTML**

**Example for contact-us.html:**

```html
<!doctype html>
<html>
<head>
    <title>Contact Us</title>
    <!-- ... other head content ... -->

    <!-- ADD reCAPTCHA HERE (before closing </head>) -->
    <script>
        window.RECAPTCHA_SITE_KEY = '6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    </script>
    <script src="https://www.google.com/recaptcha/api.js?render=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"></script>
    <!-- END reCAPTCHA -->

</head>
<body>
    <!-- page content -->
</body>
</html>
```

---

## ⚙️ **Settings (Optional)**

### Adjust Strictness

Edit `email-templates/config.php`:

```php
define('RECAPTCHA_MIN_SCORE', 0.5);  // Range: 0.0 to 1.0
```

**Score Guide:**
- `0.7 - 1.0` = Very strict (may block some humans)
- `0.5` = **Recommended** (balanced)
- `0.3 - 0.4` = Lenient (fewer false positives)
- `0.0 - 0.2` = Very lenient (some bots may pass)

---

## 🚨 **Current Status**

✅ **Backend** - reCAPTCHA handler ready
✅ **JavaScript** - Token generation ready
✅ **Config** - Settings file ready
⏳ **HTML** - Waiting for you to add script
⏳ **Keys** - Waiting for you to add keys

**Once you complete Steps 1-3 above, reCAPTCHA will be FULLY ACTIVE!**

---

## 🔧 **Troubleshooting**

### Forms not submitting?
1. Check browser console for errors
2. Verify Site Key is correct in HTML
3. Make sure `RECAPTCHA_ENABLED` is `true` in config.php

### Getting "verification failed" error?
1. Check Secret Key in config.php
2. Make sure both keys match (Site Key in HTML and config.php)
3. Try regenerating keys at Google reCAPTCHA admin

### Want to disable temporarily?
Edit `config.php`:
```php
define('RECAPTCHA_ENABLED', false);  // Set to false
```

---

## 📊 **Monitor Your reCAPTCHA**

View stats and analytics:
👉 https://www.google.com/recaptcha/admin

You'll see:
- Total requests
- Bot detection rate
- Score distribution
- Domain verification

---

## 🎯 **What's Already Done**

✅ All forms have reCAPTCHA integration code
✅ CSRF protection active
✅ Rate limiting active
✅ Input sanitization active
✅ SMTP email sending configured

**Just add your reCAPTCHA keys and you're 100% protected!** 🔐

---

**Need help?** Check the detailed guide: `recaptcha-setup.html`

**Questions?** All forms work WITHOUT reCAPTCHA too - it's an optional extra security layer.
