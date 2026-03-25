// Chat System for AmkyawDev
(function() {
    // Chat system state
    let conversations = [];
    let activeConversation = null;

    // Initialize chat system
    function initChatSystem() {
        loadConversations();
        setupChatHandlers();
    }

    function loadConversations() {
        // Load from localStorage or API
        const stored = localStorage.getItem('chat_conversations');
        if (stored) {
            conversations = JSON.parse(stored);
        }
    }

    function saveConversations() {
        localStorage.setItem('chat_conversations', JSON.stringify(conversations));
    }

    function setupChatHandlers() {
        // Chat form submission
        const chatForm = document.querySelector('.chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', handleChatSubmit);
        }

        // Start new conversation button
        const newChatBtn = document.querySelector('.new-chat');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', startNewConversation);
        }
    }

    function handleChatSubmit(e) {
        e.preventDefault();
        
        const input = document.getElementById('chat-message');
        const message = input?.value?.trim();
        
        if (!message || !activeConversation) return;

        // Add message to conversation
        addMessageToConversation(activeConversation.id, {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        });

        input.value = '';

        // Simulate response
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessageToConversation(activeConversation.id, {
                id: Date.now() + 1,
                text: response,
                sender: 'agent',
                timestamp: new Date().toISOString()
            });
        }, 1500);
    }

    function addMessageToConversation(conversationId, message) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.messages.push(message);
            conversation.lastMessage = message.text;
            conversation.lastMessageTime = message.timestamp;
            saveConversations();
            updateChatUI(conversationId);
        }
    }

    function startNewConversation() {
        const newConversation = {
            id: Date.now(),
            title: 'New Conversation',
            messages: [],
            lastMessage: '',
            lastMessageTime: null,
            createdAt: new Date().toISOString()
        };

        conversations.unshift(newConversation);
        activeConversation = newConversation;
        saveConversations();
        
        // Update UI
        renderConversations();
        renderMessages(newConversation.id);
    }

    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        const responses = {
            greeting: [
                "Hello! How can I assist you today?",
                "Hi there! What can I help you with?",
                "Hey! How may I help you?"
            ],
            template: [
                "We offer premium web templates starting at $10. Our templates include Portfolio Pro, Ecommerce Elite, and more!",
                "Our templates feature 3D effects, responsive design, and are easy to customize. Check out our Templates page!"
            ],
            pricing: [
                "Our pricing varies by template. Basic templates start at $10, while premium ones are $25-50.",
                "For custom projects, we offer flexible pricing based on your requirements. Contact us for a quote!"
            ],
            contact: [
                "You can reach us at info@amkyawdev.com or use the contact form on our website.",
                "We're available Mon-Fri 9AM-6PM. Email us for quick responses!"
            ],
            default: [
                "Thanks for reaching out! I'll connect you with our team.",
                "That's a great question! Let me look into that for you.",
                "I understand. Let me help you with that."
            ]
        };

        // Simple keyword matching
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return randomResponse(responses.greeting);
        }
        if (lowerMessage.includes('template') || lowerMessage.includes('theme')) {
            return randomResponse(responses.template);
        }
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
            return randomResponse(responses.pricing);
        }
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            return randomResponse(responses.contact);
        }

        return randomResponse(responses.default);
    }

    function randomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function updateChatUI(conversationId) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        const messagesContainer = document.getElementById('conversation-messages');
        if (messagesContainer) {
            renderMessages(conversationId);
        }

        const preview = document.querySelector('.conversation-preview');
        if (preview) {
            preview.textContent = conversation.lastMessage || 'No messages yet';
        }
    }

    function renderConversations() {
        const container = document.getElementById('conversations-list');
        if (!container) return;

        container.innerHTML = conversations.map(conv => `
            <div class="conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}" 
                 data-id="${conv.id}">
                <h4>${conv.title}</h4>
                <p>${conv.lastMessage || 'No messages yet'}</p>
                <span class="time">${formatTime(conv.lastMessageTime)}</span>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const conv = conversations.find(c => c.id === id);
                if (conv) {
                    activeConversation = conv;
                    renderMessages(id);
                    renderConversations();
                }
            });
        });
    }

    function renderMessages(conversationId) {
        const container = document.getElementById('messages-container');
        if (!container) return;

        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        container.innerHTML = conversation.messages.map(msg => `
            <div class="message ${msg.sender}">
                <div class="message-content">
                    <p>${msg.text}</p>
                    <span class="time">${formatTime(msg.timestamp)}</span>
                </div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;
    }

    function formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString();
    }

    // Export functions
    window.chatSystem = {
        init: initChatSystem,
        startNewConversation,
        loadConversations
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatSystem);
    } else {
        initChatSystem();
    }
})();