/**
 * WhatsApp Floating Button Auto-Inject
 * Automatically adds WhatsApp contact button to all pages
 * KOL Telecom - Phone: +1 (302) 867-5050
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        phoneNumber: '13028675050', // WhatsApp number (country code + number, no spaces)
        defaultMessage: "I'm inquiring about KOL Telecom",
        position: {
            bottom: '20px',
            right: '20px'
        }
    };

    /**
     * Create WhatsApp button HTML
     */
    function createWhatsAppButton() {
        const whatsappDiv = document.createElement('div');
        whatsappDiv.className = 'phone-call cbh-phone cbh-green cbh-show cbh-static';
        whatsappDiv.id = 'clbh_phone_div';
        whatsappDiv.style.position = 'fixed';
        whatsappDiv.style.bottom = config.position.bottom;
        whatsappDiv.style.right = config.position.right;
        whatsappDiv.style.zIndex = '9999';

        // Get page-specific message
        const pageMessage = getPageSpecificMessage();
        const whatsappUrl = `https://wa.me/${config.phoneNumber}?text=${encodeURIComponent(pageMessage)}`;

        whatsappDiv.innerHTML = `
            <a id="WhatsApp-button"
               href="${whatsappUrl}"
               class="phoneJs"
               title="Chat with us on WhatsApp"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Contact us on WhatsApp">
                <div class="cbh-ph-circle"></div>
                <div class="cbh-ph-circle-fill"></div>
                <div class="cbh-ph-img-circle1"></div>
            </a>
        `;

        return whatsappDiv;
    }

    /**
     * Get page-specific WhatsApp message based on current page
     */
    function getPageSpecificMessage() {
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');

        const messages = {
            'index': "Hi! I'm interested in KOL Telecom's services",
            'products-sms': "I'd like to know more about your SMS (A2P) service",
            'products-voice': "I'm interested in your Voice solutions",
            'products-whatsapp': "I want to learn about WhatsApp Business API",
            'products-rcs': "Tell me more about your RCS service",
            'products-did': "I'm interested in DID numbers",
            'products-mblastr': "I'd like to know about mBlastr platform",
            'products-vkolu': "Tell me more about VKOLU",
            'products-viber': "I'm interested in Viber messaging",
            'products-instagram': "I want to know about Instagram integration",
            'products-number-lookup': "I need information about Number Lookup",
            'products-hlr': "Tell me about HLR service",
            'products-mnp': "I'm interested in MNP service",
            'contact-us': "I have a question and would like to speak with someone",
            'about-us': "I'd like to learn more about KOL Telecom",
            'careers': "I'm interested in career opportunities at KOL",
            'blog': "I have a question about your blog post",
            'pricing': "I'd like to discuss pricing for your services",
            'demo-corporate': "I want to schedule a demo",
            'partners-become': "I'm interested in becoming a partner",
            'partners-key': "I'd like to know about key partnerships"
        };

        return messages[pageName] || config.defaultMessage;
    }

    /**
     * Initialize WhatsApp button
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addButton);
        } else {
            addButton();
        }
    }

    /**
     * Add button to page
     */
    function addButton() {
        // Check if button already exists
        if (document.getElementById('clbh_phone_div')) {
            console.log('WhatsApp button already exists on page');
            return;
        }

        // Create and add button
        const button = createWhatsAppButton();
        document.body.appendChild(button);

        // Add click tracking (optional - for analytics)
        button.querySelector('a').addEventListener('click', function() {
            console.log('WhatsApp button clicked');

            // Google Analytics tracking (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'contact',
                    'event_label': window.location.pathname
                });
            }

            // Facebook Pixel tracking (if available)
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact', {
                    method: 'whatsapp'
                });
            }
        });

        console.log('WhatsApp button initialized successfully');
    }

    // Initialize
    init();

})();
