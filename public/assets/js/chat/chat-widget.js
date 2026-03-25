// Chat Widget for AmkyawDev
(function() {
    // Initialize chat widget
    document.addEventListener('DOMContentLoaded', initChatWidget);

    let chatOpen = false;
    let chatMessages = [];

    function initChatWidget() {
        const widget = document.querySelector('.chat-widget');
        if (!widget) return;

        // Toggle chat
        const toggleBtn = widget.querySelector('.chat-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleChat);
        }

        // Close button
        const closeBtn = widget.querySelector('.chat-header button');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeChat);
        }

        // Send message
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            const sendBtn = widget.querySelector('.chat-input button');
            if (sendBtn) {
                sendBtn.addEventListener('click', sendMessage);
            }
        }
    }

    function toggleChat() {
        chatOpen = !chatOpen;
        const window = document.querySelector('.chat-window');
        if (window) {
            if (chatOpen) {
                window.style.display = 'block';
                window.classList.add('active');
                // Focus input
                setTimeout(() => {
                    document.getElementById('chat-input')?.focus();
                }, 100);
            } else {
                window.classList.remove('active');
                setTimeout(() => {
                    window.style.display = 'none';
                }, 300);
            }
        }
    }

    function closeChat() {
        chatOpen = false;
        const window = document.querySelector('.chat-window');
        if (window) {
            window.classList.remove('active');
            setTimeout(() => {
                window.style.display = 'none';
            }, 300);
        }
    }

    function sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;

        const message = input.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }

    function addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        chatMessages.push({ text, sender, timestamp: new Date() });
    }

    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Simple keyword-based responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! How can I help you today?";
        }
        
        if (lowerMessage.includes('template') || lowerMessage.includes('price')) {
            return "We have various templates starting from $10. Check out our Templates page for more details!";
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('talk')) {
            return "You can contact us at info@amkyawdev.com or use the contact form on our Contact page.";
        }
        
        if (lowerMessage.includes('help')) {
            return "I'm here to help! You can ask me about our templates, pricing, or services.";
        }
        
        if (lowerMessage.includes('thank')) {
            return "You're welcome! Let me know if you need anything else.";
        }

        // Default response
        return "Thanks for your message! I'll get back to you soon. For urgent inquiries, please email us at info@amkyawdev.com";
    }

    // Export for external use
    window.chatWidget = {
        toggleChat,
        closeChat,
        sendMessage
    };
})();