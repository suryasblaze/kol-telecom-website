/**
 * Modern AI-Powered Chatbot for KOL Communications
 * Features: Intelligent responses, CTA forms, context awareness, multi-page support
 */

class KOLChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userName = '';
        this.userEmail = '';
        this.currentPage = this.detectPage();
        this.sessionId = this.getSessionId();

        // Knowledge base - context-aware responses
        this.knowledgeBase = {
            greeting: [
                "👋 Hi there! Welcome to KOL Communications! How can I help you today?",
                "Hello! 👋 I'm here to assist you with our communication solutions. What brings you here?",
                "Hey! 😊 Welcome! I'm your virtual assistant. How can I make your day better?"
            ],
            products: {
                sms: {
                    description: "Our SMS (A2P) service provides reliable message delivery with 99.9% uptime, supporting bulk messaging, personalization, and real-time delivery reports.",
                    features: ["Bulk SMS", "Two-way messaging", "Unicode support", "Delivery reports", "API integration"],
                    usecase: "Perfect for marketing campaigns, OTPs, alerts, and notifications."
                },
                voice: {
                    description: "Enterprise-grade voice solutions with crystal-clear call quality, advanced routing, and comprehensive analytics.",
                    features: ["HD voice calls", "IVR systems", "Call recording", "Number masking", "SIP trunking"],
                    usecase: "Ideal for customer support, voice broadcasting, and telemarketing."
                },
                whatsapp: {
                    description: "WhatsApp Business API enables you to engage customers on their favorite messaging platform with rich media and automation.",
                    features: ["Rich media support", "Template messages", "Chatbots", "Session messages", "Verified business profile"],
                    usecase: "Great for customer service, order updates, and conversational marketing."
                },
                rcs: {
                    description: "Rich Communication Services - the next evolution of SMS with enhanced features like carousels, buttons, and rich media.",
                    features: ["Rich cards", "Suggested actions", "Branding", "Read receipts", "Location sharing"],
                    usecase: "Perfect for interactive marketing and enhanced customer engagement."
                },
                did: {
                    description: "Direct Inward Dialing numbers for professional business communications across 150+ countries.",
                    features: ["Local numbers", "Toll-free", "Virtual numbers", "Call forwarding", "Multi-channel"],
                    usecase: "Essential for global business presence and customer accessibility."
                },
                mblastr: {
                    description: "mBlastr - Our comprehensive CPaaS platform for omnichannel customer engagement.",
                    features: ["Multi-channel messaging", "Campaign management", "Analytics dashboard", "Contact management", "Automation"],
                    usecase: "All-in-one solution for marketing and communication teams."
                },
                vkolu: {
                    description: "VKOLU - Advanced communication platform with AI-powered features and seamless integrations.",
                    features: ["AI chatbots", "Workflow automation", "CRM integration", "Real-time analytics", "API-first design"],
                    usecase: "Enterprise communication automation and customer engagement."
                },
                viber: {
                    description: "Viber Business Messaging for connecting with 1+ billion Viber users worldwide.",
                    features: ["Rich media", "Promotional messages", "Transaction messages", "Chatbots", "Analytics"],
                    usecase: "Engage customers in regions where Viber is popular."
                },
                instagram: {
                    description: "Instagram Messaging API for seamless customer interactions on Instagram.",
                    features: ["Direct messages", "Story replies", "Quick replies", "Media sharing", "Bot integration"],
                    usecase: "Connect with younger demographics and visual-focused customers."
                },
                numberlookup: {
                    description: "Validate and verify phone numbers in real-time to improve campaign efficiency.",
                    features: ["Number validation", "Carrier lookup", "Line type detection", "Portability check", "Fraud prevention"],
                    usecase: "Reduce bounce rates and improve marketing ROI."
                },
                hlr: {
                    description: "Home Location Register lookup to verify mobile number status and roaming information.",
                    features: ["Real-time verification", "Network status", "Roaming info", "Batch processing", "API access"],
                    usecase: "Ensure message deliverability and reduce costs."
                },
                mnp: {
                    description: "Mobile Number Portability lookup to identify current network operator.",
                    features: ["Operator identification", "Port status", "Real-time lookup", "Bulk verification", "Global coverage"],
                    usecase: "Optimize routing and reduce messaging costs."
                }
            },
            services: {
                ippbx: "Cloud-based IP PBX solutions for modern business communications",
                itmanaged: "Comprehensive IT infrastructure management and support",
                mailhosting: "Secure enterprise email hosting with 99.9% uptime"
            },
            solutions: {
                cedar: "CEDAR - Customer Engagement & Data Analytics Platform",
                echt: "ECHT - Enterprise Communication Hub & Tools",
                textr: "TEXTR - Text messaging automation platform"
            },
            common: {
                pricing: "Our pricing is flexible and based on volume. Would you like me to connect you with our sales team for a custom quote? 💼",
                demo: "I'd be happy to arrange a demo! Let me collect your details and our team will reach out to you shortly. 🎯",
                support: "Our support team is available 24/7. You can reach us at support@kol.com or call +1-XXX-XXX-XXXX. How can I help you right now? 🛟",
                integration: "We offer easy integration via REST APIs, SDKs (Python, Node.js, PHP, Java), and webhooks. Need technical documentation? 📚",
                trial: "Yes! We offer a free trial for most of our services. Let me get your details to set that up! ✨",
                security: "We're ISO 27001 certified with enterprise-grade security, end-to-end encryption, and GDPR compliance. Your data security is our priority. 🔒",
                coverage: "We provide global coverage across 190+ countries with tier-1 carrier partnerships for optimal reliability. 🌍"
            }
        };

        // Popup messages
        this.popupMessages = [
            {
                title: "👋 Hey there!",
                text: "How can I help you today?",
                delay: 3000
            },
            {
                title: "💬 Got questions?",
                text: "I'm here to help! Ask me anything.",
                delay: 3000
            },
            {
                title: "🚀 Let's connect!",
                text: "Discover our communication solutions.",
                delay: 3000
            },
            {
                title: "✨ Need assistance?",
                text: "I'm your personal guide!",
                delay: 3000
            }
        ];

        this.init();
    }

    init() {
        this.injectHTML();
        this.attachEventListeners();
        this.loadSession();

        // Show welcome message after delay (only add to messages, don't render yet)
        setTimeout(() => this.showWelcomeMessage(), 1000);

        // Show popup after delay if chat not opened
        setTimeout(() => {
            if (!this.isOpen && !sessionStorage.getItem('chatbot_popup_dismissed')) {
                this.showPopup();
            }
        }, 4000);

        // Auto-hide popup after 8 seconds
        setTimeout(() => {
            const popup = document.getElementById('chatbot-popup');
            if (popup && popup.classList.contains('show')) {
                popup.classList.remove('show');
            }
        }, 12000);
    }

    injectHTML() {
        const html = `
            <!-- Chatbot Popup -->
            <!-- Chatbot Popup -->
            <div id="chatbot-popup">
                <button class="popup-close" onclick="kolChatbot.dismissPopup()">&times;</button>
                <div class="popup-content">
                    <div class="popup-icon">🤖</div>
                    <div class="popup-text">
                        <h4 id="popup-title">👋 Hey there!</h4>
                        <p id="popup-message">How can I help you today?</p>
                    </div>
                </div>
            </div>

            <!-- Chatbot Button -->
            <button id="chatbot-button" onclick="kolChatbot.toggleChat()">
                <span class="chat-icon">🤖</span>
                <span class="close-icon">✕</span>
            </button>

            <!-- Chatbot Window -->
            <div id="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-header-left">
                        <div class="chatbot-avatar">🤖</div>
                        <div class="chatbot-info">
                            <h3>KOL Assistant</h3>
                            <p>Online • Replies instantly</p>
                        </div>
                    </div>
                    <button class="chatbot-close" onclick="kolChatbot.closeChat()">✕</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-input-area">
                    <div class="chatbot-input-wrapper">
                        <textarea
                            id="chatbot-input"
                            placeholder="Type your message..."
                            rows="1"
                            onkeypress="if(event.key==='Enter' && !event.shiftKey){event.preventDefault();kolChatbot.sendMessage();}"
                        ></textarea>
                        <button id="chatbot-send" onclick="kolChatbot.sendMessage()">
                            <svg viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    attachEventListeners() {
        // Auto-resize textarea
        const input = document.getElementById('chatbot-input');
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }

    detectPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');

        // Map pages to categories
        if (page.includes('products-')) return page.replace('products-', '');
        if (page.includes('services-')) return 'services';
        if (page.includes('solutions-')) return 'solutions';
        if (page === 'index' || page === '') return 'home';
        return page;
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('chatbot_session');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('chatbot_session', sessionId);
        }
        return sessionId;
    }

    loadSession() {
        const savedMessages = sessionStorage.getItem('chatbot_messages');
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
            this.renderMessages();
        }
    }

    saveSession() {
        sessionStorage.setItem('chatbot_messages', JSON.stringify(this.messages));
    }

    showPopup() {
        const popup = document.getElementById('chatbot-popup');
        const randomMessage = this.popupMessages[Math.floor(Math.random() * this.popupMessages.length)];

        document.getElementById('popup-title').textContent = randomMessage.title;
        document.getElementById('popup-message').textContent = randomMessage.text;

        popup.classList.add('show');

        // Auto-hide after 8 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 8000);
    }

    dismissPopup() {
        document.getElementById('chatbot-popup').classList.remove('show');
        sessionStorage.setItem('chatbot_popup_dismissed', 'true');
    }

    showWelcomeMessage() {
        if (this.messages.length === 0) {
            const welcomeMsg = this.getContextualWelcome();
            const msg = { type: 'bot', text: welcomeMsg, timestamp: Date.now() };
            this.messages.push(msg);
            this.saveSession();
        }
    }

    getContextualWelcome() {
        const page = this.currentPage;
        const time = new Date().getHours();
        const greeting = time < 12 ? "Good morning" : time < 18 ? "Good afternoon" : "Good evening";

        const pageWelcomes = {
            sms: `${greeting}! 👋 I see you're interested in our SMS solutions. I can help you with bulk messaging, API integration, pricing, or any questions you have!`,
            voice: `${greeting}! 📞 Looking into our Voice solutions? I'm here to help with call quality, IVR setup, pricing, or technical questions!`,
            whatsapp: `${greeting}! 💚 Interested in WhatsApp Business API? I can explain features, pricing, use cases, and help you get started!`,
            rcs: `${greeting}! ✨ Exploring RCS? This is the future of messaging! Let me show you how it can transform your customer engagement.`,
            did: `${greeting}! 📱 Need a business number? I can help you choose the right DID solution for your needs across 150+ countries!`,
            mblastr: `${greeting}! 🚀 Welcome to mBlastr! Our most comprehensive CPaaS platform. How can I help you today?`,
            vkolu: `${greeting}! 🤖 Interested in VKOLU? Our AI-powered communication platform can revolutionize your customer engagement!`,
            home: `${greeting}! 👋 Welcome to KOL Communications! We're a leading CPaaS provider. What brings you here today?`
        };

        return pageWelcomes[page] || pageWelcomes.home;
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        document.getElementById('chatbot-window').classList.add('show');
        document.getElementById('chatbot-button').classList.add('active');
        document.getElementById('chatbot-popup').classList.remove('show');
        document.body.classList.add('chatbot-open');

        // Render messages if opening for first time
        if (this.messages.length > 0 && document.getElementById('chatbot-messages').children.length === 0) {
            this.renderMessages();
        }

        // Focus input
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 300);

        // If first time opening, show quick replies
        if (this.messages.length === 1) {
            this.showQuickReplies();
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chatbot-window').classList.remove('show');
        document.getElementById('chatbot-button').classList.remove('active');
        document.body.classList.remove('chatbot-open');
    }

    showQuickReplies() {
        const quickReplies = [
            "📦 View Products",
            "💰 Pricing Info",
            "📚 API Documentation",
            "🎯 Request Demo",
            "💬 Talk to Sales"
        ];

        const repliesHTML = quickReplies.map(reply =>
            `<button class="quick-reply-btn" onclick="kolChatbot.handleQuickReply('${reply}')">${reply}</button>`
        ).join('');

        const messagesContainer = document.getElementById('chatbot-messages');
        const repliesDiv = document.createElement('div');
        repliesDiv.className = 'quick-replies';
        repliesDiv.innerHTML = repliesHTML;
        messagesContainer.appendChild(repliesDiv);
        this.scrollToBottom();
    }

    handleQuickReply(reply) {
        // Remove quick replies
        const quickReplies = document.querySelector('.quick-replies');
        if (quickReplies) quickReplies.remove();

        // Send as user message
        this.addUserMessage(reply);

        // Process the reply
        setTimeout(() => {
            this.processQuickReply(reply);
        }, 800);
    }

    processQuickReply(reply) {
        if (reply.includes('Products')) {
            this.showProductsMenu();
        } else if (reply.includes('Pricing')) {
            this.addBotMessage(this.knowledgeBase.common.pricing);
            this.showContactForm('pricing');
        } else if (reply.includes('API')) {
            this.addBotMessage(this.knowledgeBase.common.integration);
            this.addBotMessage("Would you like me to send you our API documentation? 📧");
            this.showContactForm('documentation');
        } else if (reply.includes('Demo')) {
            this.addBotMessage(this.knowledgeBase.common.demo);
            this.showContactForm('demo');
        } else if (reply.includes('Sales')) {
            this.addBotMessage("Perfect! Let me connect you with our sales team. They'll help you find the best solution for your needs. 🎯");
            this.showContactForm('sales');
        }
    }

    showProductsMenu() {
        const products = `
            <strong>Our Product Categories:</strong><br><br>
            <strong>📱 CPaaS Platforms:</strong><br>
            • mBlastr - Omnichannel engagement<br>
            • VKOLU - AI-powered automation<br><br>

            <strong>💬 Messaging:</strong><br>
            • SMS (A2P) - Bulk messaging<br>
            • RCS - Rich messaging<br>
            • WhatsApp Business API<br>
            • Viber Business<br>
            • Instagram Messaging<br><br>

            <strong>📞 Voice:</strong><br>
            • Voice API & SIP Trunking<br>
            • DID Numbers (150+ countries)<br>
            • IP PBX Solutions<br><br>

            <strong>🔍 Number Services:</strong><br>
            • Number Lookup & Validation<br>
            • HLR Lookup<br>
            • MNP Lookup<br><br>

            Which product would you like to know more about?
        `;

        this.addBotMessage(products);
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';
        input.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message
        setTimeout(() => {
            this.hideTypingIndicator();
            this.processMessage(message);
        }, 1000 + Math.random() * 1000);
    }

    addUserMessage(message) {
        const msg = { type: 'user', text: message, timestamp: Date.now() };
        this.messages.push(msg);
        this.renderMessage(msg);
        this.saveSession();
        this.scrollToBottom();
    }

    addBotMessage(message, isWelcome = false) {
        const msg = { type: 'bot', text: message, timestamp: Date.now() };
        if (!isWelcome) {
            this.messages.push(msg);
            this.saveSession();
        }
        this.renderMessage(msg);
        this.scrollToBottom();
    }

    renderMessages() {
        const container = document.getElementById('chatbot-messages');
        container.innerHTML = '';
        this.messages.forEach(msg => this.renderMessage(msg));
        this.scrollToBottom();
    }

    renderMessage(msg) {
        const container = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = msg.type === 'bot' ? '🤖' : '👤';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = msg.text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        container.appendChild(messageDiv);
    }

    showTypingIndicator() {
        const container = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'typing-indicator';
        typing.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        container.appendChild(typing);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    processMessage(message) {
        const lowerMsg = message.toLowerCase();
        let response = '';

        // Intent detection
        if (this.matchIntent(lowerMsg, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
            const greetings = this.knowledgeBase.greeting;
            response = greetings[Math.floor(Math.random() * greetings.length)];
        }
        else if (this.matchIntent(lowerMsg, ['price', 'pricing', 'cost', 'how much', 'quote'])) {
            response = this.knowledgeBase.common.pricing;
            this.showContactForm('pricing');
        }
        else if (this.matchIntent(lowerMsg, ['demo', 'trial', 'test', 'try'])) {
            response = "Great! I can set up a demo for you. " + this.knowledgeBase.common.trial;
            this.showContactForm('demo');
        }
        else if (this.matchIntent(lowerMsg, ['api', 'integration', 'integrate', 'sdk', 'documentation', 'docs'])) {
            response = this.knowledgeBase.common.integration;
        }
        else if (this.matchIntent(lowerMsg, ['support', 'help', 'contact', 'call', 'email'])) {
            response = this.knowledgeBase.common.support;
        }
        else if (this.matchIntent(lowerMsg, ['security', 'secure', 'encryption', 'compliance', 'gdpr'])) {
            response = this.knowledgeBase.common.security;
        }
        else if (this.matchIntent(lowerMsg, ['coverage', 'countries', 'global', 'international'])) {
            response = this.knowledgeBase.common.coverage;
        }
        // Product-specific queries
        else if (this.matchIntent(lowerMsg, ['sms', 'text message', 'bulk sms'])) {
            response = this.getProductInfo('sms');
        }
        else if (this.matchIntent(lowerMsg, ['voice', 'call', 'calling'])) {
            response = this.getProductInfo('voice');
        }
        else if (this.matchIntent(lowerMsg, ['whatsapp'])) {
            response = this.getProductInfo('whatsapp');
        }
        else if (this.matchIntent(lowerMsg, ['rcs', 'rich communication'])) {
            response = this.getProductInfo('rcs');
        }
        else if (this.matchIntent(lowerMsg, ['did', 'number', 'phone number'])) {
            response = this.getProductInfo('did');
        }
        else if (this.matchIntent(lowerMsg, ['mblastr', 'mBlastr'])) {
            response = this.getProductInfo('mblastr');
        }
        else if (this.matchIntent(lowerMsg, ['vkolu', 'VKOLU'])) {
            response = this.getProductInfo('vkolu');
        }
        else if (this.matchIntent(lowerMsg, ['viber'])) {
            response = this.getProductInfo('viber');
        }
        else if (this.matchIntent(lowerMsg, ['instagram'])) {
            response = this.getProductInfo('instagram');
        }
        else if (this.matchIntent(lowerMsg, ['number lookup', 'lookup', 'validation'])) {
            response = this.getProductInfo('numberlookup');
        }
        else if (this.matchIntent(lowerMsg, ['products', 'services', 'solutions', 'what do you offer'])) {
            this.showProductsMenu();
            return;
        }
        else if (this.matchIntent(lowerMsg, ['sales', 'speak', 'talk', 'representative'])) {
            response = "I'd be happy to connect you with our sales team! They're experts at finding the perfect solution for your needs. 🎯";
            this.showContactForm('sales');
        }
        else {
            // Default response with helpful suggestions
            response = "That's a great question! While I want to give you the most accurate information, I'd like to connect you with our team who can provide detailed answers. Would you like to: <br><br>• 📞 Schedule a call<br>• 📧 Get contacted via email<br>• 💬 Chat with a specialist<br><br>Or feel free to ask about our products, pricing, or features!";
            this.showContactForm('general');
        }

        this.addBotMessage(response);
    }

    matchIntent(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getProductInfo(product) {
        const info = this.knowledgeBase.products[product];
        if (!info) return "I'd be happy to help! Could you tell me more about what you're looking for?";

        return `
            <strong>${product.toUpperCase()} Solution</strong><br><br>
            ${info.description}<br><br>
            <strong>Key Features:</strong><br>
            ${info.features.map(f => `• ${f}`).join('<br>')}<br><br>
            <strong>Best for:</strong> ${info.usecase}<br><br>
            Would you like to know more about pricing, see a demo, or speak with our team?
        `;
    }

    showContactForm(purpose) {
        const formHTML = `
            <div class="cta-form">
                <h4>${this.getFormTitle(purpose)}</h4>
                <form id="chatbot-cta-form" onsubmit="kolChatbot.submitForm(event, '${purpose}')">
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" name="name" required placeholder="Your name">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" placeholder="+1 (555) 000-0000">
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" name="company" placeholder="Your company name">
                    </div>
                    ${purpose === 'demo' || purpose === 'general' ? `
                    <div class="form-group">
                        <label>Message</label>
                        <textarea name="message" rows="3" placeholder="Tell us about your needs..."></textarea>
                    </div>` : ''}
                    <button type="submit" class="form-submit">Submit ${this.getFormButton(purpose)}</button>
                </form>
            </div>
        `;

        const container = document.getElementById('chatbot-messages');
        const formDiv = document.createElement('div');
        formDiv.className = 'message bot';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = formHTML;

        formDiv.appendChild(avatar);
        formDiv.appendChild(content);
        container.appendChild(formDiv);

        this.scrollToBottom();
    }

    getFormTitle(purpose) {
        const titles = {
            pricing: '💰 Get Custom Pricing',
            demo: '🎯 Request a Demo',
            sales: '💬 Talk to Sales',
            documentation: '📚 Get Documentation',
            general: '📝 Get in Touch'
        };
        return titles[purpose] || '📝 Contact Us';
    }

    getFormButton(purpose) {
        const buttons = {
            pricing: '💰',
            demo: '🎯',
            sales: '💬',
            documentation: '📚',
            general: '📧'
        };
        return buttons[purpose] || '→';
    }

    submitForm(event, purpose) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            message: formData.get('message'),
            purpose: purpose,
            page: this.currentPage,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
        };

        // Store user info
        this.userName = data.name;
        this.userEmail = data.email;

        // Remove form
        form.closest('.message').remove();

        // Show success message
        const successMsg = `
            <div class="success-message">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <span>Thanks ${data.name}! We've received your request. Our team will contact you shortly at ${data.email}!</span>
            </div>
        `;

        this.addBotMessage(successMsg);
        this.addBotMessage("Is there anything else I can help you with? 😊");

        // Here you would typically send data to your backend
        console.log('Form submitted:', data);

        // Optional: Send to backend API
        // this.sendToBackend(data);
    }

    sendToBackend(data) {
        // Example API call
        fetch('/api/chatbot/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    scrollToBottom() {
        const container = document.getElementById('chatbot-messages');
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.kolChatbot = new KOLChatbot();
    });
} else {
    window.kolChatbot = new KOLChatbot();
}
