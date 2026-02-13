/**
 * Blog Analytics Tracker
 * Tracks page views, reads, and engagement without database
 * Uses localStorage and JSON files for data persistence
 */

(function() {
    'use strict';

    // Initialize analytics on page load
    document.addEventListener('DOMContentLoaded', function() {
        trackPageView();
        trackReadTime();
        trackScrollDepth();
    });

    // Track page view
    function trackPageView() {
        const pagePath = window.location.pathname;
        const pageTitle = document.title;
        const timestamp = new Date().toISOString();
        const referrer = document.referrer;

        const viewData = {
            path: pagePath,
            title: pageTitle,
            timestamp: timestamp,
            referrer: referrer,
            userAgent: navigator.userAgent,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language
        };

        // Store in localStorage
        try {
            const views = JSON.parse(localStorage.getItem('page_views') || '[]');
            views.push(viewData);

            // Keep only last 500 views
            if (views.length > 500) {
                views.splice(0, views.length - 500);
            }

            localStorage.setItem('page_views', JSON.stringify(views));

            // Send to server if available (optional)
            sendAnalyticsToServer(viewData);
        } catch (e) {
            console.error('Failed to track page view:', e);
        }
    }

    // Track reading time
    function trackReadTime() {
        let startTime = Date.now();
        let isActive = true;
        let totalTime = 0;

        // Track when user leaves/returns to page
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                isActive = false;
                totalTime += Date.now() - startTime;
            } else {
                isActive = true;
                startTime = Date.now();
            }
        });

        // Save reading time on page unload
        window.addEventListener('beforeunload', function() {
            if (isActive) {
                totalTime += Date.now() - startTime;
            }

            const readData = {
                path: window.location.pathname,
                title: document.title,
                duration: Math.floor(totalTime / 1000), // seconds
                timestamp: new Date().toISOString()
            };

            try {
                const reads = JSON.parse(localStorage.getItem('reading_time') || '[]');
                reads.push(readData);

                if (reads.length > 200) {
                    reads.shift();
                }

                localStorage.setItem('reading_time', JSON.stringify(reads));
            } catch (e) {
                console.error('Failed to save reading time:', e);
            }
        });
    }

    // Track scroll depth
    function trackScrollDepth() {
        let maxScroll = 0;
        const depths = [25, 50, 75, 100];
        const tracked = new Set();

        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
            }

            // Track depth milestones
            depths.forEach(depth => {
                if (scrollPercent >= depth && !tracked.has(depth)) {
                    tracked.add(depth);

                    const scrollData = {
                        path: window.location.pathname,
                        depth: depth,
                        timestamp: new Date().toISOString()
                    };

                    try {
                        const scrolls = JSON.parse(localStorage.getItem('scroll_depth') || '[]');
                        scrolls.push(scrollData);

                        if (scrolls.length > 200) {
                            scrolls.shift();
                        }

                        localStorage.setItem('scroll_depth', JSON.stringify(scrolls));
                    } catch (e) {
                        console.error('Failed to track scroll depth:', e);
                    }
                }
            });
        });
    }

    // Send analytics to server (optional - requires backend)
    function sendAnalyticsToServer(data) {
        // Uncomment if you have a backend endpoint
        /*
        fetch('email-templates/analytics-tracker.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(err => console.error('Failed to send analytics:', err));
        */
    }

    // Get analytics data (for admin dashboard)
    window.getAnalyticsData = function() {
        return {
            pageViews: JSON.parse(localStorage.getItem('page_views') || '[]'),
            readingTime: JSON.parse(localStorage.getItem('reading_time') || '[]'),
            scrollDepth: JSON.parse(localStorage.getItem('scroll_depth') || '[]'),
            shares: JSON.parse(localStorage.getItem('blog_shares') || '[]')
        };
    };

    // Clear analytics data
    window.clearAnalyticsData = function() {
        localStorage.removeItem('page_views');
        localStorage.removeItem('reading_time');
        localStorage.removeItem('scroll_depth');
        localStorage.removeItem('blog_shares');
        console.log('Analytics data cleared');
    };

})();
