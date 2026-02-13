/**
 * Social Share Functionality
 * Handles sharing blog articles on social media platforms
 */

(function() {
    'use strict';

    // Initialize social sharing on page load
    document.addEventListener('DOMContentLoaded', function() {
        setupSocialShare();
    });

    function setupSocialShare() {
        // Get page details for sharing
        const pageTitle = document.title || 'KOL Telecom Blog';
        const pageUrl = encodeURIComponent(window.location.href);
        const pageDescription = document.querySelector('meta[name="description"]')?.content || '';

        // Get article-specific info if available
        const articleTitle = document.querySelector('h1')?.textContent || pageTitle;
        const encodedTitle = encodeURIComponent(articleTitle);
        const encodedDescription = encodeURIComponent(pageDescription);

        // Find all share buttons
        const shareButtons = document.querySelectorAll('[data-share]');

        shareButtons.forEach(button => {
            const platform = button.getAttribute('data-share');
            const shareUrl = getShareUrl(platform, pageUrl, encodedTitle, encodedDescription);

            if (shareUrl) {
                button.href = shareUrl;
                button.target = '_blank';
                button.rel = 'noopener noreferrer';

                // Add click event for tracking
                button.addEventListener('click', function(e) {
                    trackShare(platform, articleTitle);
                });
            }
        });

        // Also handle old-style share buttons (without data-share attribute)
        setupLegacyShareButtons(pageUrl, encodedTitle, encodedDescription);
    }

    function getShareUrl(platform, pageUrl, title, description) {
        const shareUrls = {
            'facebook': `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
            'twitter': `https://twitter.com/intent/tweet?url=${pageUrl}&text=${title}&via=KOLTELECOM`,
            'linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
            'whatsapp': `https://wa.me/?text=${title}%20${pageUrl}`,
            'telegram': `https://t.me/share/url?url=${pageUrl}&text=${title}`,
            'email': `mailto:?subject=${title}&body=${description}%0A%0A${pageUrl}`
        };

        return shareUrls[platform] || null;
    }

    function setupLegacyShareButtons(pageUrl, title, description) {
        // Handle Facebook share buttons
        const facebookButtons = document.querySelectorAll('a[href="#"]:has(.fa-facebook-f), a[href="#"]:has(.fa-facebook)');
        facebookButtons.forEach(btn => {
            if (btn.href === window.location.href + '#' || btn.href.endsWith('#')) {
                btn.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                btn.target = '_blank';
                btn.rel = 'noopener noreferrer';
                btn.addEventListener('click', (e) => trackShare('facebook', decodeURIComponent(title)));
            }
        });

        // Handle Twitter share buttons
        const twitterButtons = document.querySelectorAll('a[href="#"]:has(.fa-x-twitter), a[href="#"]:has(.fa-twitter)');
        twitterButtons.forEach(btn => {
            if (btn.href === window.location.href + '#' || btn.href.endsWith('#')) {
                btn.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${title}&via=KOLTELECOM`;
                btn.target = '_blank';
                btn.rel = 'noopener noreferrer';
                btn.addEventListener('click', (e) => trackShare('twitter', decodeURIComponent(title)));
            }
        });

        // Handle LinkedIn share buttons
        const linkedinButtons = document.querySelectorAll('a[href="#"]:has(.fa-linkedin-in), a[href="#"]:has(.fa-linkedin)');
        linkedinButtons.forEach(btn => {
            if (btn.href === window.location.href + '#' || btn.href.endsWith('#')) {
                btn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                btn.target = '_blank';
                btn.rel = 'noopener noreferrer';
                btn.addEventListener('click', (e) => trackShare('linkedin', decodeURIComponent(title)));
            }
        });

        // Handle WhatsApp share buttons
        const whatsappButtons = document.querySelectorAll('a[href="#"]:has(.fa-whatsapp)');
        whatsappButtons.forEach(btn => {
            if (btn.href === window.location.href + '#' || btn.href.endsWith('#')) {
                btn.href = `https://wa.me/?text=${title}%20${pageUrl}`;
                btn.target = '_blank';
                btn.rel = 'noopener noreferrer';
                btn.addEventListener('click', (e) => trackShare('whatsapp', decodeURIComponent(title)));
            }
        });
    }

    function trackShare(platform, articleTitle) {
        // Track share event
        console.log(`Shared on ${platform}: ${articleTitle}`);

        // Store share event for analytics
        try {
            const shares = JSON.parse(localStorage.getItem('blog_shares') || '[]');
            shares.push({
                platform: platform,
                article: articleTitle,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });

            // Keep only last 100 shares
            if (shares.length > 100) {
                shares.shift();
            }

            localStorage.setItem('blog_shares', JSON.stringify(shares));
        } catch (e) {
            console.error('Failed to track share:', e);
        }
    }

    // Expose function for manual use
    window.shareArticle = function(platform) {
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.querySelector('h1')?.textContent || document.title);
        const pageDescription = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');

        const shareUrl = getShareUrl(platform, pageUrl, pageTitle, pageDescription);
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            trackShare(platform, decodeURIComponent(pageTitle));
        }
    };

    // Copy link to clipboard function
    window.copyBlogLink = function(event) {
        const button = event.currentTarget;
        const url = window.location.href;

        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function() {
                showCopySuccess(button);
                trackShare('copy-link', document.querySelector('h1')?.textContent || document.title);
            }).catch(function(err) {
                // Fallback to old method
                fallbackCopyLink(url, button);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyLink(url, button);
        }
    };

    // Fallback copy method
    function fallbackCopyLink(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showCopySuccess(button);
            trackShare('copy-link', document.querySelector('h1')?.textContent || document.title);
        } catch (err) {
            alert('Failed to copy link. Please copy manually: ' + text);
        }

        document.body.removeChild(textArea);
    }

    // Show copy success message
    function showCopySuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fa fa-check"></i> Copied!';
        button.style.color = '#2ebb79';

        setTimeout(function() {
            button.innerHTML = originalHTML;
            button.style.color = '';
        }, 2000);
    }

})();
