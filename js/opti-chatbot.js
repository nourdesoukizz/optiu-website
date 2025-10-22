// Opti Chatbot Widget
class OptiChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createChatbot();
        this.attachEventListeners();
        this.loadGreeting();
    }

    createChatbot() {
        // Create chatbot container
        const chatbotHTML = `
            <div id="opti-chatbot" class="opti-chatbot">
                <!-- Floating Button -->
                <div id="opti-chat-button" class="opti-chat-button">
                    <div class="opti-avatar">
                        <div class="opti-character">
                            <div class="opti-face">
                                <div class="opti-eyes">
                                    <div class="opti-eye opti-eye-left"></div>
                                    <div class="opti-eye opti-eye-right"></div>
                                </div>
                                <div class="opti-mouth"></div>
                            </div>
                            <div class="opti-pulse-ring"></div>
                        </div>
                    </div>
                    <div class="opti-tooltip">Ask Opti</div>
                    <div class="opti-notification-dot"></div>
                </div>

                <!-- Chat Widget -->
                <div id="opti-chat-widget" class="opti-chat-widget">
                    <div class="opti-chat-header">
                        <div class="opti-header-avatar">
                            <div class="opti-character-small">
                                <div class="opti-face-small">
                                    <div class="opti-eyes-small">
                                        <div class="opti-eye-small"></div>
                                        <div class="opti-eye-small"></div>
                                    </div>
                                    <div class="opti-mouth-small"></div>
                                </div>
                            </div>
                        </div>
                        <div class="opti-header-info">
                            <div class="opti-header-title">Opti Chat</div>
                            <div class="opti-header-status">
                                <div class="opti-status-dot"></div>
                                <span>Online</span>
                            </div>
                        </div>
                        <div class="opti-header-actions">
                            <button id="opti-minimize-btn" class="opti-action-btn" title="Minimize">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <button id="opti-close-btn" class="opti-action-btn" title="Close">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="opti-chat-messages" id="opti-chat-messages">
                        <!-- Messages will be dynamically added here -->
                    </div>

                    <div class="opti-chat-input-container">
                        <div class="opti-typing-indicator" id="opti-typing">
                            <div class="opti-typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span class="opti-typing-text">Opti is thinking...</span>
                        </div>
                        <div class="opti-input-wrapper">
                            <input type="text" id="opti-chat-input" placeholder="Ask me anything about OptiU..." />
                            <button id="opti-send-btn" class="opti-send-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22,2 15,22 11,13 2,9"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const chatButton = document.getElementById('opti-chat-button');
        const closeBtn = document.getElementById('opti-close-btn');
        const minimizeBtn = document.getElementById('opti-minimize-btn');
        const sendBtn = document.getElementById('opti-send-btn');
        const chatInput = document.getElementById('opti-chat-input');
        const chatHeader = document.querySelector('.opti-chat-header');

        // Toggle chat
        chatButton.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        minimizeBtn.addEventListener('click', () => this.minimizeChat());

        // Send message
        sendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Dragging functionality
        chatHeader.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Auto-hide tooltip after showing
        setTimeout(() => {
            const tooltip = document.querySelector('.opti-tooltip');
            if (tooltip) tooltip.style.opacity = '0';
        }, 3000);

        // Add some character personality
        this.addCharacterPersonality();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const widget = document.getElementById('opti-chat-widget');
        const button = document.getElementById('opti-chat-button');
        const notification = document.querySelector('.opti-notification-dot');

        if (this.isOpen) {
            widget.style.display = 'flex';
            setTimeout(() => widget.classList.add('opti-show'), 10);
            button.classList.add('opti-active');
            notification.style.display = 'none';
            document.getElementById('opti-chat-input').focus();
        } else {
            widget.classList.remove('opti-show');
            setTimeout(() => widget.style.display = 'none', 300);
            button.classList.remove('opti-active');
        }
    }

    closeChat() {
        this.isOpen = false;
        const widget = document.getElementById('opti-chat-widget');
        const button = document.getElementById('opti-chat-button');

        widget.classList.remove('opti-show');
        setTimeout(() => widget.style.display = 'none', 300);
        button.classList.remove('opti-active');
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        const widget = document.getElementById('opti-chat-widget');
        
        if (this.isMinimized) {
            widget.classList.add('opti-minimized');
        } else {
            widget.classList.remove('opti-minimized');
        }
    }

    startDrag(e) {
        this.isDragging = true;
        const widget = document.getElementById('opti-chat-widget');
        const rect = widget.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        widget.style.transition = 'none';
    }

    drag(e) {
        if (!this.isDragging) return;

        const widget = document.getElementById('opti-chat-widget');
        const newX = e.clientX - this.dragOffset.x;
        const newY = e.clientY - this.dragOffset.y;

        // Keep within viewport bounds
        const maxX = window.innerWidth - widget.offsetWidth;
        const maxY = window.innerHeight - widget.offsetHeight;

        const boundedX = Math.max(0, Math.min(newX, maxX));
        const boundedY = Math.max(0, Math.min(newY, maxY));

        widget.style.left = boundedX + 'px';
        widget.style.top = boundedY + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
    }

    stopDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        const widget = document.getElementById('opti-chat-widget');
        widget.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    loadGreeting() {
        setTimeout(() => {
            const greetings = [
                "Hi! I'm Opti, your optimization assistant. Ask me anything about OptiU, our features, or how we can help optimize your business! 🚀",
                "Hello there! 👋 I'm Opti, and I'm here to help you understand how OptiU can transform your decision-making process!",
                "Hey! I'm Opti, your friendly optimization expert. Ready to discover how AOMs can revolutionize your business? 💡",
                "Welcome! I'm Opti, and I love talking about optimization. What would you like to know about OptiU? ✨"
            ];
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            this.addMessage('opti', randomGreeting);
            this.showNotification();
            
            // Add a follow-up message after a delay
            setTimeout(() => {
                this.addMessage('opti', "💡 Pro tip: Try asking me about pricing, features, or how AOMs work!");
            }, 3000);
        }, 2000);
    }

    sendMessage() {
        const input = document.getElementById('opti-chat-input');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Simulate response delay
        setTimeout(() => {
            this.hideTyping();
            this.generateResponse(message);
        }, 1000 + Math.random() * 2000);
    }

    addMessage(sender, message) {
        const messagesContainer = document.getElementById('opti-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `opti-message opti-message-${sender}`;

        if (sender === 'opti') {
            messageDiv.innerHTML = `
                <div class="opti-message-avatar">
                    <div class="opti-character-tiny">
                        <div class="opti-face-tiny">
                            <div class="opti-eyes-tiny">
                                <div class="opti-eye-tiny"></div>
                                <div class="opti-eye-tiny"></div>
                            </div>
                            <div class="opti-mouth-tiny"></div>
                        </div>
                    </div>
                </div>
                <div class="opti-message-content">${message}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="opti-message-content">${message}</div>
                <div class="opti-message-avatar opti-user-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Animate message appearance
        setTimeout(() => messageDiv.classList.add('opti-message-show'), 10);
    }

    generateResponse(userMessage) {
        const responses = this.getContextualResponses(userMessage);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage('opti', randomResponse);
    }

    getContextualResponses(message) {
        const lowerMessage = message.toLowerCase();
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

        // Page-specific responses
        if (currentPage === 'pricing') {
            if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
                return [
                    "Our pricing is designed to scale with your needs! We offer Starter ($100), Pro ($250), and Team ($500) plans. All include a 2-day free trial with no credit card required! 💳",
                    "Great question about pricing! Our plans start at just $100/month for the Starter tier. The Pro plan at $250 is our most popular choice. Want to know what's included in each? 📊",
                ];
            }
        }

        if (currentPage === 'opti') {
            if (lowerMessage.includes('opti') || lowerMessage.includes('feature')) {
                return [
                    "Opti is like ChatGPT for optimization! Just describe your problem in natural language, upload your Excel data, and get optimal solutions instantly. It's that simple! ✨",
                    "Opti transforms complex optimization into conversation. Upload your data, ask questions, and get explainable results in seconds. Try our demo! 🎯",
                ];
            }
        }

        // General responses
        if (lowerMessage.includes('aom') || lowerMessage.includes('autonomous')) {
            return [
                "AOMs (Autonomous Optimization Models) are AI that don't just predict - they prescribe optimal actions and execute them automatically. Think of them as your decision-making autopilot! 🤖",
                "Autonomous Optimization Models are the future of business decisions. They continuously optimize, adapt to changes, and explain their reasoning. Pretty cool, right? 🚀",
            ];
        }

        if (lowerMessage.includes('demo') || lowerMessage.includes('try')) {
            return [
                "I'd love to show you a demo! You can try Opti right now with our interactive demo, or schedule a personal demo with our team. What interests you most? 🎮",
                "Ready to see OptiU in action? Check out our demo page or start a free trial - no credit card needed! Let's optimize something together! ⚡",
            ];
        }

        if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
            return [
                "I'm here to help! You can ask me about OptiU features, pricing, how AOMs work, or anything else. What would you like to know? 💡",
                "Happy to help! I can explain our technology, walk you through features, or help you get started. What's on your mind? 🤔",
            ];
        }

        // Default responses
        return [
            "That's an interesting question! OptiU specializes in making optimization simple and accessible. Would you like to know more about our features or see a demo? 🌟",
            "Great question! OptiU helps businesses make better decisions through AI-powered optimization. What specific challenge are you trying to solve? 🎯",
            "I'd be happy to help with that! OptiU transforms complex business problems into simple, conversational solutions. Want to learn more? 💬",
            "Thanks for asking! OptiU makes optimization as easy as having a conversation. Are you interested in learning about our technology or trying a demo? 🚀",
        ];
    }

    showTyping() {
        const typing = document.getElementById('opti-typing');
        typing.style.display = 'flex';
        setTimeout(() => typing.classList.add('opti-show'), 10);
    }

    hideTyping() {
        const typing = document.getElementById('opti-typing');
        typing.classList.remove('opti-show');
        setTimeout(() => typing.style.display = 'none', 300);
    }

    showNotification() {
        const notification = document.querySelector('.opti-notification-dot');
        if (!this.isOpen) {
            notification.style.display = 'block';
        }
    }

    addCharacterPersonality() {
        const eyes = document.querySelectorAll('.opti-eye, .opti-eye-small, .opti-eye-tiny');
        const mouths = document.querySelectorAll('.opti-mouth, .opti-mouth-small, .opti-mouth-tiny');
        const characters = document.querySelectorAll('.opti-character, .opti-character-small, .opti-character-tiny');

        // Random blinking animation
        setInterval(() => {
            if (Math.random() < 0.3) {
                eyes.forEach(eye => {
                    eye.style.transform = 'scaleY(0.1)';
                    setTimeout(() => {
                        eye.style.transform = 'scaleY(1)';
                    }, 150);
                });
            }
        }, 2000);

        // Random eye movement
        setInterval(() => {
            if (Math.random() < 0.4) {
                const direction = Math.random() < 0.5 ? 'left' : 'right';
                eyes.forEach(eye => {
                    eye.style.transform = `translateX(${direction === 'left' ? '-2px' : '2px'})`;
                    setTimeout(() => {
                        eye.style.transform = 'translateX(0)';
                    }, 1000);
                });
            }
        }, 3000);

        // Talking animation when typing
        const originalShowTyping = this.showTyping.bind(this);
        this.showTyping = function() {
            originalShowTyping();
            
            // Start talking animation
            const talkInterval = setInterval(() => {
                mouths.forEach(mouth => {
                    mouth.style.height = Math.random() < 0.5 ? '3px' : '1px';
                    mouth.style.borderRadius = Math.random() < 0.5 ? '50%' : '0';
                });
            }, 200);

            // Store interval to clear it later
            this._talkInterval = talkInterval;
        };

        const originalHideTyping = this.hideTyping.bind(this);
        this.hideTyping = function() {
            originalHideTyping();
            
            // Stop talking animation
            if (this._talkInterval) {
                clearInterval(this._talkInterval);
                mouths.forEach(mouth => {
                    mouth.style.height = '';
                    mouth.style.borderRadius = '';
                });
            }
        };

        // Character bounce on hover
        characters.forEach(character => {
            character.addEventListener('mouseenter', () => {
                character.style.transform = 'scale(1.1)';
                character.style.transition = 'transform 0.2s ease';
            });
            
            character.addEventListener('mouseleave', () => {
                character.style.transform = 'scale(1)';
            });
        });

        // Random cheerful animations
        setInterval(() => {
            if (Math.random() < 0.1 && !this.isOpen) {
                const mainCharacter = document.querySelector('.opti-character');
                if (mainCharacter) {
                    mainCharacter.style.animation = 'opti-bounce 0.6s ease';
                    setTimeout(() => {
                        mainCharacter.style.animation = '';
                    }, 600);
                }
            }
        }, 10000);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OptiChatbot();
});