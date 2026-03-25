// Environment Configuration for AmkyawDev

// Environment settings
const environment = {
    // Application settings
    app: {
        name: 'AmkyawDev',
        version: '1.0.0',
        description: 'Professional Web Development Services'
    },

    // API configuration
    api: {
        baseUrl: '/server/api',
        timeout: 30000,
        retryAttempts: 3
    },

    // Feature flags
    features: {
        chat: true,
        admin: true,
        authentication: true,
        analytics: false,
        darkMode: true
    },

    // Social links
    social: {
        github: 'https://github.com/amkyawdev',
        linkedin: 'https://linkedin.com/in/amkyawdev',
        twitter: 'https://twitter.com/amkyawdev',
        facebook: 'https://facebook.com/amkyawdev'
    },

    // Contact info
    contact: {
        email: 'info@amkyawdev.com',
        phone: '+1 234 567 890',
        address: 'City, Country'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { environment };
}

if (typeof window !== 'undefined') {
    window.environment = environment;
}