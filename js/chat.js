class RLAChat {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.initializeElements();
        this.attachEventListeners();
        this.autoResizeTextarea();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
    }

    attachEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    autoResizeTextarea() {
        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
        });
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isLoading) return;

        // Clear input and reset height
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';

        // Add user message
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();
        this.isLoading = true;
        this.sendButton.disabled = true;

        try {
            // Call OpenAI API (you'll implement this)
            const response = await this.callOpenAI(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add assistant response
            this.addMessage(response, 'assistant');
        } catch (error) {
            console.error('Error calling OpenAI:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        } finally {
            this.isLoading = false;
            this.sendButton.disabled = false;
        }
    }

    addMessage(content, sender) {
        // Remove welcome message if it exists
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'YOU' : 'RLA';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Store message
        this.messages.push({ role: sender === 'user' ? 'user' : 'assistant', content });
    }

    showTypingIndicator() {
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.remove('show');
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    async callOpenAI(message) {
        try {
            const response = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: this.messages
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('API call failed:', error);
            // Fallback to local responses if API fails
            const responses = this.getContextualResponse(message);
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    getContextualResponse(message) {
        const lowerMessage = message.toLowerCase();

        // OptiU specific responses
        if (lowerMessage.includes('opti') || lowerMessage.includes('optimization')) {
            return [
                "OptiU transforms complex optimization challenges into conversational experiences. Our platform uses Autonomous Optimization Models (AOMs) to deliver optimal solutions for supply chain, logistics, finance, and resource allocation problems.",
                "Opti is your ChatGPT for optimization! Simply describe your challenge in natural language - like 'optimize my vendor mix under $2M budget' - and Opti automatically selects the right AOM to deliver optimal decisions with clear explanations.",
                "Our optimization platform handles everything from personal finance optimization to enterprise-level supply chain management. What specific optimization challenge are you facing?"
            ];
        }

        if (lowerMessage.includes('aom') || lowerMessage.includes('autonomous optimization model')) {
            return [
                "Autonomous Optimization Models (AOMs) are specialized AI models designed to solve specific types of optimization problems. OptiU automatically selects the right AOM based on your problem description and data structure.",
                "AOMs are the core of our platform - they're like having expert optimization consultants available 24/7. Each AOM is trained on specific optimization domains like logistics, finance, or resource allocation.",
                "Think of AOMs as specialized optimization experts. When you describe your problem, Opti analyzes it and routes it to the most appropriate AOM for optimal results."
            ];
        }

        if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            return [
                "We offer three tiers: Starter ($100/month for up to 1,000 decisions), Pro ($250/month for up to 10,000 decisions with API access), and Team ($500/month for unlimited decisions with custom models). All include Excel I/O and explainable outputs.",
                "Our pricing is based on optimization decisions rather than users, making it cost-effective for teams. Each tier includes full access to our AOM library, video tutorials, and support.",
                "Start with our 2-day free trial on any tier to experience the power of conversational optimization before committing."
            ];
        }

        if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('use'))) {
            return [
                "Using OptiU is simple: 1) Describe your optimization problem in natural language, 2) Upload your data or connect to your systems, 3) Opti selects the right AOM, 4) Get optimal decisions with clear explanations and confidence scores.",
                "It's as easy as having a conversation! Tell Opti what you want to optimize, provide your constraints and data, and receive actionable optimization results that you can export to Excel or integrate with your existing systems.",
                "The magic happens through natural language processing and automated model selection. No need to understand complex optimization mathematics - just describe your business challenge!"
            ];
        }

        if (lowerMessage.includes('supply chain') || lowerMessage.includes('logistics') || lowerMessage.includes('vendor')) {
            return [
                "OptiU excels at supply chain optimization! We can help optimize vendor selection, inventory levels, distribution networks, route planning, and capacity allocation while considering multiple constraints and objectives.",
                "Our supply chain AOMs handle complex scenarios like multi-objective vendor optimization, demand forecasting integration, risk assessment, and cost-service trade-offs. What specific supply chain challenge are you facing?",
                "From procurement optimization to last-mile delivery, OptiU's specialized AOMs can handle supply chain complexities while providing clear, actionable insights."
            ];
        }

        if (lowerMessage.includes('finance') || lowerMessage.includes('budget') || lowerMessage.includes('investment')) {
            return [
                "OptiU's financial optimization capabilities include portfolio optimization, budget allocation, investment planning, and resource allocation across departments or projects while respecting regulatory and business constraints.",
                "Our financial AOMs can optimize everything from personal finance decisions to enterprise capital allocation, considering risk tolerance, liquidity requirements, and strategic objectives.",
                "Whether it's optimizing your investment portfolio or allocating budgets across business units, OptiU provides mathematically optimal solutions with clear risk assessments."
            ];
        }

        if (lowerMessage.includes('excel') || lowerMessage.includes('integration') || lowerMessage.includes('api')) {
            return [
                "OptiU seamlessly integrates with your existing workflows! Import data from Excel, connect via API to your ERP/CRM systems, or use our Azure integration for enterprise deployments.",
                "All optimization results can be exported to Excel with detailed explanations, or integrated directly into your systems via our REST API. We support real-time optimization for dynamic business environments.",
                "Our platform is designed for easy integration - whether you prefer uploading spreadsheets or connecting live data sources, OptiU adapts to your workflow."
            ];
        }

        // General helpful responses
        return [
            "I'm here to help you understand how OptiU can transform your optimization challenges! What specific area would you like to explore - supply chain, finance, logistics, or something else?",
            "OptiU makes complex optimization accessible through conversation. Tell me about your business challenge and I'll explain how our platform can help optimize it!",
            "Whether you're optimizing resources, costs, schedules, or strategic decisions, OptiU has specialized AOMs to help. What optimization problem are you trying to solve?",
            "I can explain any aspect of OptiU - from how our AOMs work to specific use cases and pricing. What would you like to know more about?",
            "OptiU is like having a team of optimization experts available 24/7. What business challenge would you like to optimize?"
        ];
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RLAChat();
});