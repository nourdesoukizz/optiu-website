// Professional Opti Chatbot Widget
class OptiChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbot();
        this.attachEventListeners();
        this.loadWelcomeMessage();
    }

    createChatbot() {
        // Create chatbot container with professional design
        const chatbotHTML = `
            <div id="opti-chatbot" class="opti-chatbot">
                <!-- Modern Floating Button -->
                <button id="opti-chat-button" class="opti-chat-button" aria-label="Open chat">
                    <div class="opti-chat-icon">
                        <svg class="opti-message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                            <path d="M7 9h10v2H7zm0-3h10v2H7z"/>
                        </svg>
                        <svg class="opti-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </div>
                    <div class="opti-notification-badge">1</div>
                </button>

                <!-- Professional Chat Widget -->
                <div id="opti-chat-widget" class="opti-chat-widget">
                    <!-- Header -->
                    <div class="opti-chat-header">
                        <div class="opti-header-left">
                            <div class="opti-header-logo">AI</div>
                            <div class="opti-header-info">
                                <div class="opti-header-title">OptiU Assistant</div>
                                <div class="opti-header-status">
                                    <span class="opti-status-dot"></span>
                                    <span>Online - Ready to help</span>
                                </div>
                            </div>
                        </div>
                        <div class="opti-header-actions">
                            <button class="opti-action-btn" aria-label="Minimize">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <button class="opti-action-btn" id="opti-close-btn" aria-label="Close">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Messages Area -->
                    <div class="opti-chat-messages" id="opti-chat-messages">
                        <!-- Messages will be added here dynamically -->
                    </div>

                    <!-- Typing Indicator -->
                    <div class="opti-typing-indicator" id="opti-typing-indicator">
                        <div class="opti-typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="opti-chat-input-container">
                        <div class="opti-input-wrapper">
                            <input 
                                type="text" 
                                id="opti-chat-input" 
                                placeholder="Type your message..."
                                autocomplete="off"
                            />
                            <div class="opti-input-actions">
                                <button class="opti-attach-btn" aria-label="Attach file">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                                    </svg>
                                </button>
                                <button class="opti-send-btn" id="opti-send-btn" aria-label="Send message">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to page
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const chatButton = document.getElementById('opti-chat-button');
        const closeBtn = document.getElementById('opti-close-btn');
        const sendBtn = document.getElementById('opti-send-btn');
        const chatInput = document.getElementById('opti-chat-input');
        const chatWidget = document.getElementById('opti-chat-widget');

        // Toggle chat
        chatButton.addEventListener('click', () => this.toggleChat());

        // Close chat
        closeBtn.addEventListener('click', () => this.toggleChat());

        // Send message
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Enter key to send
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !chatWidget.contains(e.target) && 
                !chatButton.contains(e.target)) {
                // Optionally close when clicking outside
                // this.toggleChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatButton = document.getElementById('opti-chat-button');
        const chatWidget = document.getElementById('opti-chat-widget');
        const badge = document.querySelector('.opti-notification-badge');

        if (this.isOpen) {
            chatButton.classList.add('opti-active');
            chatWidget.classList.add('opti-show');
            badge.classList.remove('opti-show');
            document.getElementById('opti-chat-input').focus();
        } else {
            chatButton.classList.remove('opti-active');
            chatWidget.classList.remove('opti-show');
        }
    }

    loadWelcomeMessage() {
        setTimeout(() => {
            this.addMessage(
                'Assistant',
                'Hello! I\'m here to answer any questions you have about OptiU and how our AI-powered optimization platform can help transform your business operations.',
                'opti'
            );
        }, 1000);
    }

    async sendMessage() {
        const input = document.getElementById('opti-chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage('You', message, 'user');
        
        // Clear input
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            console.log('Sending message to API:', message);
            // Call backend API
            const response = await this.callOpenAI(message);
            console.log('Received response:', response);
            this.hideTypingIndicator();
            this.addMessage('Assistant', response, 'opti');
        } catch (error) {
            this.hideTypingIndicator();
            console.error('Chat error:', error);
            // Use fallback response instead of generic error
            const fallbackResponse = this.getFallbackResponse(message);
            this.addMessage('Assistant', fallbackResponse, 'opti');
        }
    }

    addMessage(sender, text, type = 'opti') {
        const messagesContainer = document.getElementById('opti-chat-messages');
        const messageHTML = `
            <div class="opti-message opti-message-${type}">
                <div class="opti-message-avatar ${type === 'opti' ? 'opti-bot-avatar' : 'opti-user-avatar'}">
                    ${type === 'opti' ? 'AI' : 'U'}
                </div>
                <div class="opti-message-content">
                    ${text}
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ sender, text, type, timestamp: new Date() });
    }

    async callOpenAI(userMessage) {
        try {
            console.log('Making API request to http://localhost:5001/api/chat');
            
            // Use the same backend API as the main chat
            const requestBody = {
                message: userMessage,
                history: this.messages.slice(-10).map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.text
                }))
            };
            
            console.log('Request body:', requestBody);
            
            const response = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response:', data);
            
            if (data.response) {
                return data.response;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('API call failed:', error);
            console.log('Using fallback response');
            // Fallback to contextual responses if API fails
            return this.getFallbackResponse(userMessage);
        }
    }

    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! I\'m here to help you learn about OptiU and how our AI-powered optimization platform can transform your business operations. What would you like to know?';
        } else if (lowerMessage.includes('aom') || lowerMessage.includes('model')) {
            return 'Our AOMs (Autonomous Optimization Models) are pre-built AI solutions that optimize specific business functions like forecasting, inventory management, and supply chain operations. Would you like to learn more about a specific AOM?';
        } else if (lowerMessage.includes('demo') || lowerMessage.includes('poc')) {
            return 'We offer free Proof of Concepts to demonstrate the value of our solutions. You can request one directly from our marketplace page. Would you like me to guide you there?';
        } else {
            return 'I\'d be happy to help you learn more about OptiU. We specialize in AI-powered optimization for supply chain, operations, and business decision-making. What specific area interests you?';
        }
    }

    showTypingIndicator() {
        const indicator = document.getElementById('opti-typing-indicator');
        indicator.classList.add('opti-show');
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('opti-typing-indicator');
        indicator.classList.remove('opti-show');
    }

    showNotification() {
        const badge = document.querySelector('.opti-notification-badge');
        if (!this.isOpen) {
            badge.classList.add('opti-show');
        }
    }
}

// Initialize chatbot when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new OptiChatbot();
    });
} else {
    new OptiChatbot();
}