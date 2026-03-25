// Chat API for AmkyawDev
const express = require('express');
const router = express.Router();

// In-memory storage
let conversations = [];
let messages = {};

// GET conversations
router.get('/conversations', (req, res) => {
    res.json(conversations);
});

// GET messages for a conversation
router.get('/messages/:conversationId', (req, res) => {
    const conversationMessages = messages[req.params.conversationId] || [];
    res.json(conversationMessages);
});

// POST new message
router.post('/messages', (req, res) => {
    const { conversationId, message, sender } = req.body;
    
    if (!messages[conversationId]) {
        messages[conversationId] = [];
    }
    
    const newMessage = {
        id: Date.now(),
        message,
        sender,
        timestamp: new Date().toISOString()
    };
    
    messages[conversationId].push(newMessage);
    
    // Auto-reply for demo
    setTimeout(() => {
        const reply = {
            id: Date.now() + 1,
            message: getAutoReply(message),
            sender: 'bot',
            timestamp: new Date().toISOString()
        };
        messages[conversationId].push(reply);
    }, 1000);
    
    res.status(201).json(newMessage);
});

// POST new conversation
router.post('/conversations', (req, res) => {
    const { title } = req.body;
    
    const newConversation = {
        id: Date.now(),
        title: title || 'New Conversation',
        createdAt: new Date().toISOString(),
        lastMessage: ''
    };
    
    conversations.push(newConversation);
    res.status(201).json(newConversation);
});

// Helper function for auto-reply
function getAutoReply(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! How can I help you today?";
    }
    if (lowerMessage.includes('template') || lowerMessage.includes('price')) {
        return "We have templates starting at $10. Check our Templates page!";
    }
    if (lowerMessage.includes('contact')) {
        return "Contact us at info@amkyawdev.com";
    }
    
    return "Thanks for your message! We'll get back to you soon.";
}

module.exports = router;