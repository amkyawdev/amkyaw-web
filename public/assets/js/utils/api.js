// API Utility for AmkyawDev
(function() {
    // API base URL (can be configured)
    const API_BASE = '/server/api';

    // Cache for API responses
    const cache = new Map();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Fetch wrapper with caching
    async function fetchWithCache(url, options = {}) {
        const cacheKey = url;
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Cache successful responses
        cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });

        return data;
    }

    // Templates API
    const templates = {
        async getAll() {
            return fetchWithCache(`${API_BASE}/templates.js`);
        },

        async getById(id) {
            const templates = await this.getAll();
            return templates.find(t => t.id === parseInt(id));
        },

        async getByCategory(category) {
            const templates = await this.getAll();
            return templates.filter(t => t.category === category);
        },

        async search(query) {
            const templates = await this.getAll();
            const lowerQuery = query.toLowerCase();
            
            return templates.filter(t => 
                t.name.toLowerCase().includes(lowerQuery) ||
                t.description.toLowerCase().includes(lowerQuery) ||
                t.features.some(f => f.toLowerCase().includes(lowerQuery))
            );
        }
    };

    // Projects API
    const projects = {
        async getAll() {
            return fetchWithCache(`${API_BASE}/projects.js`);
        },

        async getById(id) {
            const projects = await this.getAll();
            return projects.find(p => p.id === parseInt(id));
        },

        async getByStatus(status) {
            const projects = await this.getAll();
            return projects.filter(p => p.status === status);
        },

        async getByClient(client) {
            const projects = await this.getAll();
            return projects.filter(p => p.client.toLowerCase().includes(client.toLowerCase()));
        }
    };

    // Docs API
    const docs = {
        async getAll() {
            return fetchWithCache(`${API_BASE}/docs.js`);
        },

        async getById(id) {
            const docs = await this.getAll();
            return docs.find(d => d.id === parseInt(id));
        },

        async getByCategory(category) {
            const docs = await this.getAll();
            return docs.filter(d => d.category === category);
        },

        async search(query) {
            const docs = await this.getAll();
            const lowerQuery = query.toLowerCase();
            
            return docs.filter(d => 
                d.title.toLowerCase().includes(lowerQuery) ||
                d.content.toLowerCase().includes(lowerQuery) ||
                d.tags.some(t => t.toLowerCase().includes(lowerQuery))
            );
        }
    };

    // Chat API
    const chat = {
        async sendMessage(conversationId, message) {
            const response = await fetch(`${API_BASE}/chat.js`, {
                method: 'POST',
                body: JSON.stringify({
                    conversationId,
                    message,
                    timestamp: new Date().toISOString()
                })
            });
            return response.json();
        },

        async getConversations() {
            return fetchWithCache(`${API_BASE}/chat.js?type=conversations`);
        },

        async getMessages(conversationId) {
            return fetchWithCache(`${API_BASE}/chat.js?conversation=${conversationId}`);
        }
    };

    // Generic API methods
    const api = {
        templates,
        projects,
        docs,
        chat,

        // Clear cache
        clearCache() {
            cache.clear();
        },

        // Direct fetch
        async get(endpoint) {
            return fetchWithCache(`${API_BASE}/${endpoint}.js`);
        },

        async post(endpoint, data) {
            const response = await fetch(`${API_BASE}/${endpoint}.js`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            return response.json();
        },

        async put(endpoint, data) {
            const response = await fetch(`${API_BASE}/${endpoint}.js`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            return response.json();
        },

        async delete(endpoint) {
            const response = await fetch(`${API_BASE}/${endpoint}.js`, {
                method: 'DELETE'
            });
            return response.json();
        }
    };

    // Export to global scope
    window.api = api;

    // Also export specific modules
    window.templatesAPI = templates;
    window.projectsAPI = projects;
    window.docsAPI = docs;
    window.chatAPI = chat;
})();