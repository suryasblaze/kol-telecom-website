/**
 * KOL Telecom - Form Handler JavaScript
 * Handles form submissions, CSRF tokens, and validation
 * Created: 2026-02-13
 */

(function() {
    'use strict';

    // Generate CSRF token for session
    function generateCSRFToken() {
        // Check if token exists in sessionStorage
        let token = sessionStorage.getItem('csrf_token');

        if (!token) {
            // Generate new token
            token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            sessionStorage.setItem('csrf_token', token);
        }

        return token;
    }

    // Set CSRF token in all forms
    function setCSRFTokens() {
        const token = generateCSRFToken();
        const tokenInputs = document.querySelectorAll('input[name="csrf_token"]');

        tokenInputs.forEach(input => {
            input.value = token;
        });
    }

    // Execute reCAPTCHA and get token
    function executeRecaptcha(action) {
        return new Promise((resolve, reject) => {
            // Check if reCAPTCHA is loaded
            if (typeof grecaptcha === 'undefined' || !window.RECAPTCHA_SITE_KEY) {
                resolve(null); // reCAPTCHA not enabled
                return;
            }

            grecaptcha.ready(function() {
                grecaptcha.execute(window.RECAPTCHA_SITE_KEY, { action: action })
                    .then(function(token) {
                        resolve(token);
                    })
                    .catch(function(error) {
                        console.error('reCAPTCHA error:', error);
                        reject(error);
                    });
            });
        });
    }

    // Form submission handler
    function handleFormSubmit(form, successCallback, errorCallback) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Disable submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';

            // Get form action name for reCAPTCHA
            const formAction = form.id || 'form_submit';

            try {
                // Execute reCAPTCHA (if enabled)
                const recaptchaToken = await executeRecaptcha(formAction);

                // Get form data
                const formData = new FormData(form);

                // Add reCAPTCHA token if available
                if (recaptchaToken) {
                    formData.append('g-recaptcha-response', recaptchaToken);
                }

                // Send AJAX request
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (data.success) {
                    // Success
                    if (successCallback) {
                        successCallback(data);
                    } else {
                        showMessage(form, 'success', data.message);
                        form.reset();
                    }
                } else {
                    // Error
                    if (errorCallback) {
                        errorCallback(data);
                    } else {
                        const errorMsg = data.errors && data.errors.length > 0
                            ? data.errors.join('<br>')
                            : data.message;
                        showMessage(form, 'error', errorMsg);
                    }
                }
            })
            .catch(error => {
                // Network or server error
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (errorCallback) {
                    errorCallback({ success: false, message: 'An error occurred. Please try again.' });
                } else {
                    showMessage(form, 'error', 'An error occurred. Please try again.');
                }
            });

            } catch (error) {
                // reCAPTCHA error
                console.error('Form submission error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                showMessage(form, 'error', 'Security verification failed. Please try again.');
            }
        });
    }

    // Show message
    function showMessage(form, type, message) {
        const messageDiv = form.querySelector('.form-results') || createMessageDiv(form);

        messageDiv.className = 'form-results mt-20px';
        messageDiv.classList.remove('d-none');

        if (type === 'success') {
            messageDiv.className += ' alert alert-success';
            messageDiv.innerHTML = '<i class="fa fa-check-circle"></i> ' + message;
        } else {
            messageDiv.className += ' alert alert-danger';
            messageDiv.innerHTML = '<i class="fa fa-exclamation-circle"></i> ' + message;
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.classList.add('d-none');
        }, 5000);
    }

    // Create message div if it doesn't exist
    function createMessageDiv(form) {
        const div = document.createElement('div');
        div.className = 'form-results mt-20px d-none';
        form.appendChild(div);
        return div;
    }

    // Initialize forms on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Set CSRF tokens
        setCSRFTokens();

        // Contact Form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            handleFormSubmit(contactForm);
        }

        // Career Form
        const careerForm = document.getElementById('careerForm');
        if (careerForm) {
            handleFormSubmit(careerForm, function(data) {
                showMessage(careerForm, 'success', data.message);
                careerForm.reset();
                // Clear file input display if any
                const fileInput = careerForm.querySelector('input[type="file"]');
                if (fileInput) {
                    const fileLabel = fileInput.parentElement.querySelector('.file-name');
                    if (fileLabel) fileLabel.textContent = '';
                }
            });
        }

        // Partner Form
        const partnerForm = document.getElementById('partnerForm');
        if (partnerForm) {
            handleFormSubmit(partnerForm);
        }

        // Newsletter Form
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            handleFormSubmit(form);
        });

        // File upload preview
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', function() {
                const fileName = this.files[0] ? this.files[0].name : '';
                const fileSize = this.files[0] ? (this.files[0].size / 1024 / 1024).toFixed(2) + ' MB' : '';

                let fileLabel = this.parentElement.querySelector('.file-name');
                if (!fileLabel) {
                    fileLabel = document.createElement('div');
                    fileLabel.className = 'file-name mt-2 text-sm';
                    this.parentElement.appendChild(fileLabel);
                }

                if (fileName) {
                    fileLabel.innerHTML = `<i class="fa fa-file"></i> ${fileName} (${fileSize})`;
                } else {
                    fileLabel.textContent = '';
                }
            });
        });
    });

    // Phone number formatting (optional enhancement)
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters (except + and -)
            let value = this.value.replace(/[^\d+\-\s()]/g, '');
            this.value = value;
        });
    });

})();
