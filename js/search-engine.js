/**
 * KOL Telecom - Search Engine
 * Live search across all content types (Products, Services, Solutions, Blog)
 * Created: 2026-02-13
 */

(function() {
    'use strict';

    // All searchable content from KOL Telecom website
    const searchDatabase = [
        // Products - cPaaS
        {
            category: 'product',
            title: 'mBlastr - cPaaS Platform',
            description: 'Comprehensive communication platform as a service. Integrate SMS, Voice, WhatsApp, and more into your applications with our powerful APIs.',
            keywords: ['cpaas', 'api', 'sms', 'voice', 'messaging', 'whatsapp', 'communication', 'platform', 'mblastr'],
            url: 'products-mblastr.html'
        },
        {
            category: 'product',
            title: 'VKOLU - Video Conferencing',
            description: 'Enterprise-grade video conferencing and collaboration platform. Crystal clear HD video calls, screen sharing, and team collaboration tools.',
            keywords: ['video', 'conferencing', 'vkolu', 'meetings', 'collaboration', 'webinar', 'screen sharing'],
            url: 'products-vkolu.html'
        },

        // Products - Wholesale
        {
            category: 'product',
            title: 'Voice - Wholesale Voice Services',
            description: 'Premium quality wholesale voice termination services. Global coverage with competitive rates and excellent call quality.',
            keywords: ['voice', 'wholesale', 'termination', 'voip', 'sip', 'carrier', 'telecom'],
            url: 'products-voice.html'
        },
        {
            category: 'product',
            title: 'SMS (A2P) - Bulk SMS Services',
            description: 'Application-to-Person SMS messaging. Send bulk SMS campaigns, OTPs, notifications with high delivery rates worldwide.',
            keywords: ['sms', 'a2p', 'bulk', 'messaging', 'text', 'otp', 'notification', 'alerts'],
            url: 'products-sms.html'
        },

        // Products - Retail
        {
            category: 'product',
            title: 'RCS - Rich Communication Services',
            description: 'Next-generation messaging with rich media, interactive features, and verified sender badges. Enhanced customer engagement.',
            keywords: ['rcs', 'rich', 'messaging', 'interactive', 'media', 'verified', 'engagement'],
            url: 'products-rcs.html'
        },
        {
            category: 'product',
            title: 'DID - Direct Inward Dialing',
            description: 'Virtual phone numbers from 100+ countries. Get local presence worldwide with our DID numbers and call forwarding.',
            keywords: ['did', 'virtual', 'numbers', 'phone', 'local', 'international', 'forwarding'],
            url: 'products-did.html'
        },

        // Products - Instant Messaging
        {
            category: 'product',
            title: 'WhatsApp Business API',
            description: 'Official WhatsApp Business API integration. Send notifications, provide customer support, and automate conversations at scale.',
            keywords: ['whatsapp', 'business', 'api', 'messaging', 'chat', 'automation', 'chatbot', 'notification'],
            url: 'products-whatsapp.html'
        },
        {
            category: 'product',
            title: 'Instagram Messaging',
            description: 'Connect with customers on Instagram. Automated messaging, quick replies, and seamless integration with your CRM.',
            keywords: ['instagram', 'messaging', 'social', 'dm', 'automation', 'chat'],
            url: 'products-instagram.html'
        },
        {
            category: 'product',
            title: 'Viber Business',
            description: 'Reach customers on Viber with rich messaging features. Send promotional messages, notifications, and provide support.',
            keywords: ['viber', 'messaging', 'chat', 'notification', 'promotional'],
            url: 'products-viber.html'
        },

        // Products - Number Lookup
        {
            category: 'product',
            title: 'Number Lookup',
            description: 'Validate and verify phone numbers in real-time. Check number validity, carrier info, and line type before sending messages.',
            keywords: ['number', 'lookup', 'validation', 'verification', 'hlr', 'carrier', 'check'],
            url: 'products-number-lookup.html'
        },
        {
            category: 'product',
            title: 'HLR Lookup',
            description: 'Home Location Register lookup service. Verify mobile number status, check if number is active, and get carrier information.',
            keywords: ['hlr', 'lookup', 'mobile', 'verification', 'status', 'carrier', 'active'],
            url: 'products-hlr.html'
        },
        {
            category: 'product',
            title: 'MNP Lookup',
            description: 'Mobile Number Portability lookup. Identify the current carrier of ported numbers for accurate message routing.',
            keywords: ['mnp', 'portability', 'carrier', 'lookup', 'routing', 'mobile'],
            url: 'products-mnp.html'
        },

        // Services
        {
            category: 'service',
            title: 'Mail Hosting Services',
            description: 'Professional email hosting with custom domain. Secure, reliable email service with 99.9% uptime and spam protection.',
            keywords: ['email', 'mail', 'hosting', 'domain', 'smtp', 'imap', 'business', 'secure'],
            url: 'services-mail-hosting.html'
        },
        {
            category: 'service',
            title: 'IT Managed Services',
            description: 'Comprehensive IT infrastructure management. Server maintenance, network monitoring, security, and 24/7 technical support.',
            keywords: ['it', 'managed', 'infrastructure', 'server', 'network', 'monitoring', 'support', 'maintenance'],
            url: 'services-it-managed.html'
        },
        {
            category: 'service',
            title: 'IP PBX Solutions',
            description: 'Cloud-based IP PBX phone systems. Advanced call routing, IVR, call recording, and unified communications for businesses.',
            keywords: ['ip', 'pbx', 'phone', 'system', 'voip', 'ivr', 'call', 'routing', 'cloud'],
            url: 'services-ip-pbx.html'
        },

        // Solutions
        {
            category: 'solution',
            title: 'ECHT - Enterprise Communication Hub',
            description: 'Unified enterprise communication platform. Centralize all your communication channels - voice, SMS, email, chat in one dashboard.',
            keywords: ['echt', 'unified', 'communication', 'enterprise', 'hub', 'dashboard', 'omnichannel'],
            url: 'solutions-echt.html'
        },
        {
            category: 'solution',
            title: 'Textr - SMS Marketing Platform',
            description: 'Powerful SMS marketing and automation platform. Create campaigns, schedule messages, track engagement with detailed analytics.',
            keywords: ['textr', 'sms', 'marketing', 'campaign', 'automation', 'analytics', 'engagement'],
            url: 'solutions-textr.html'
        },
        {
            category: 'solution',
            title: 'Cedar - Customer Engagement Platform',
            description: 'AI-powered customer engagement solution. Automate support, send personalized messages, and improve customer satisfaction.',
            keywords: ['cedar', 'customer', 'engagement', 'ai', 'automation', 'support', 'chatbot', 'personalization'],
            url: 'solutions-cedar.html'
        },

        // Blog Posts
        {
            category: 'blog',
            title: 'The Future of Business Communication: RCS vs Traditional SMS',
            description: 'Explore how Rich Communication Services (RCS) is revolutionizing business messaging. Compare features, benefits, and use cases of RCS versus traditional SMS messaging.',
            keywords: ['rcs', 'sms', 'messaging', 'business', 'communication', 'future', 'comparison'],
            url: 'blog-rcs-vs-sms.html'
        },
        {
            category: 'blog',
            title: 'WhatsApp Business API: Complete Integration Guide',
            description: 'Step-by-step guide to integrating WhatsApp Business API into your applications. Learn about message templates, webhooks, and best practices.',
            keywords: ['whatsapp', 'business', 'api', 'integration', 'guide', 'tutorial', 'webhook'],
            url: 'blog-whatsapp-integration.html'
        },
        {
            category: 'blog',
            title: 'How to Choose the Right cPaaS Provider in 2026',
            description: 'Essential factors to consider when selecting a Communication Platform as a Service provider. Coverage, pricing, APIs, and support compared.',
            keywords: ['cpaas', 'provider', 'selection', 'guide', 'comparison', 'api', 'communication'],
            url: 'blog-choose-cpaas.html'
        },
        {
            category: 'blog',
            title: '10 Ways to Improve SMS Delivery Rates',
            description: 'Proven strategies to boost your SMS delivery rates. From sender ID optimization to message timing and content best practices.',
            keywords: ['sms', 'delivery', 'rates', 'optimization', 'tips', 'best practices', 'marketing'],
            url: 'blog-improve-sms-delivery.html'
        },
        {
            category: 'blog',
            title: 'Voice over IP (VoIP): Benefits for Modern Businesses',
            description: 'Discover how VoIP technology can reduce communication costs and improve business efficiency. Features, benefits, and implementation guide.',
            keywords: ['voip', 'voice', 'business', 'benefits', 'cost', 'efficiency', 'communication'],
            url: 'blog-voip-benefits.html'
        },
        {
            category: 'blog',
            title: 'AI Chatbots: Transforming Customer Service',
            description: 'How AI-powered chatbots are revolutionizing customer service. Use cases, implementation tips, and ROI analysis for businesses.',
            keywords: ['ai', 'chatbot', 'customer', 'service', 'automation', 'support', 'roi'],
            url: 'blog-ai-chatbots.html'
        }
    ];

    let currentCategory = 'all';
    let currentResults = [];

    // Initialize search on page load
    document.addEventListener('DOMContentLoaded', function() {
        initializeSearch();
        setupEventListeners();
        checkURLParams();
    });

    // Initialize search functionality
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');

        // Live search on typing
        searchInput.addEventListener('input', debounce(function() {
            performSearch();
        }, 300));

        // Enter key to search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Setup event listeners for category filters
    function setupEventListeners() {
        const categoryButtons = document.querySelectorAll('.category-btn');

        categoryButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                categoryButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Update current category
                currentCategory = this.getAttribute('data-category');

                // Re-filter results
                displayResults(currentResults);
            });
        });
    }

    // Check URL parameters for search query
    function checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query) {
            document.getElementById('searchInput').value = query;
            performSearch();
        }
    }

    // Perform search
    window.performSearch = function() {
        const query = document.getElementById('searchInput').value.trim();

        if (!query) {
            showSuggestions();
            return;
        }

        // Show loading
        showLoading();

        // Simulate slight delay for better UX
        setTimeout(() => {
            const results = searchContent(query);
            currentResults = results;
            displayResults(results);
        }, 200);
    };

    // Search through content
    function searchContent(query) {
        const searchTerm = query.toLowerCase();
        const results = [];

        searchDatabase.forEach(item => {
            let score = 0;

            // Check title match (highest priority)
            if (item.title.toLowerCase().includes(searchTerm)) {
                score += 10;
            }

            // Check description match
            if (item.description.toLowerCase().includes(searchTerm)) {
                score += 5;
            }

            // Check keywords match
            item.keywords.forEach(keyword => {
                if (keyword.includes(searchTerm) || searchTerm.includes(keyword)) {
                    score += 3;
                }
            });

            // Add to results if score > 0
            if (score > 0) {
                results.push({ ...item, score });
            }
        });

        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);

        return results;
    }

    // Display search results
    function displayResults(results) {
        const container = document.getElementById('resultsContainer');
        const countElement = document.getElementById('resultsCount');

        // Filter by category
        let filteredResults = results;
        if (currentCategory !== 'all') {
            filteredResults = results.filter(r => r.category === currentCategory);
        }

        // Update count
        if (filteredResults.length === 0) {
            countElement.textContent = 'No results found';
            showNoResults(container);
            return;
        }

        countElement.textContent = `Found ${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`;

        // Display results
        let html = '';
        filteredResults.forEach(result => {
            html += `
                <div class="result-card" onclick="window.location.href='${result.url}'">
                    <span class="result-category ${result.category}">${result.category}</span>
                    <h3 class="result-title">${highlightText(result.title)}</h3>
                    <p class="result-description">${highlightText(result.description)}</p>
                    <a href="${result.url}" class="result-link">
                        Learn more <i class="feather icon-feather-arrow-right"></i>
                    </a>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Highlight search terms in text
    function highlightText(text) {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();

        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: #fff3cd; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    }

    // Show no results message
    function showNoResults(container) {
        container.innerHTML = `
            <div class="no-results">
                <i class="feather icon-feather-search"></i>
                <h3>No results found</h3>
                <p>Try different keywords or browse our popular searches below</p>
                <div class="search-suggestions mt-4">
                    <h5 class="fw-600 mb-3">Popular Searches:</h5>
                    <span class="suggestion-tag" onclick="searchSuggestion('WhatsApp')">WhatsApp</span>
                    <span class="suggestion-tag" onclick="searchSuggestion('SMS')">SMS</span>
                    <span class="suggestion-tag" onclick="searchSuggestion('Voice')">Voice</span>
                    <span class="suggestion-tag" onclick="searchSuggestion('RCS')">RCS</span>
                    <span class="suggestion-tag" onclick="searchSuggestion('Cloud')">Cloud</span>
                    <span class="suggestion-tag" onclick="searchSuggestion('API')">API</span>
                </div>
            </div>
        `;
    }

    // Show loading state
    function showLoading() {
        const container = document.getElementById('resultsContainer');
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Searching...</p>
            </div>
        `;
    }

    // Show suggestions
    function showSuggestions() {
        const container = document.getElementById('resultsContainer');
        const countElement = document.getElementById('resultsCount');

        countElement.textContent = 'Enter a search term to get started';
        container.innerHTML = `
            <div class="search-suggestions">
                <h5 class="fw-600 mb-3">Popular Searches:</h5>
                <span class="suggestion-tag" onclick="searchSuggestion('WhatsApp')">WhatsApp</span>
                <span class="suggestion-tag" onclick="searchSuggestion('SMS')">SMS</span>
                <span class="suggestion-tag" onclick="searchSuggestion('Voice')">Voice</span>
                <span class="suggestion-tag" onclick="searchSuggestion('RCS')">RCS</span>
                <span class="suggestion-tag" onclick="searchSuggestion('Cloud')">Cloud</span>
                <span class="suggestion-tag" onclick="searchSuggestion('API')">API</span>
                <span class="suggestion-tag" onclick="searchSuggestion('DID')">DID</span>
                <span class="suggestion-tag" onclick="searchSuggestion('Number Lookup')">Number Lookup</span>
            </div>
        `;
    }

    // Search suggestion click
    window.searchSuggestion = function(term) {
        document.getElementById('searchInput').value = term;
        performSearch();

        // Smooth scroll to results
        document.querySelector('.results-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // Debounce function for live search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

})();
