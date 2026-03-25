// Main JavaScript for AmkyawDev
// This file initializes all the functionality using Alpine.js

(function() {
    // Initialize Firebase if not already initialized
    if (typeof firebase !== 'undefined' && typeof window.firebaseConfig !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
        }
        console.log('Firebase initialized');
    }
    
    // Wait for Alpine.js to be ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Initialize app data
        initAppData();
        
        // Initialize 3D effects
        if (typeof initCard3D === 'function') {
            initCard3D();
        }
        
        // Initialize smooth scroll
        if (typeof initSmoothScroll === 'function') {
            initSmoothScroll();
        }
        
        // Initialize search
        if (typeof window.search === 'object') {
            window.search.init();
        }
        
        // Initialize auth
        if (typeof window.auth === 'object') {
            window.auth.init();
        }
        
        // Initialize chat
        if (typeof window.chatWidget === 'object') {
            // Chat widget is auto-initialized
        }
        
        console.log('AmkyawDev initialized');
    }

    // Main App Data for Alpine.js
    function initAppData() {
        // Check if Alpine is available
        if (typeof Alpine === 'undefined') {
            console.warn('Alpine.js not loaded');
            return;
        }

        // Global app data
        Alpine.data('appData', () => ({
            user: null,
            isAuthenticated: false,
            templates: [],
            projects: [],
            docs: [],
            loading: true,
            
            async init() {
                await this.loadData();
            },
            
            async loadData() {
                this.loading = true;
                try {
                    // Load templates
                    const templatesRes = await fetch('data/templates.json');
                    this.templates = await templatesRes.json();
                    
                    // Load projects
                    const projectsRes = await fetch('data/projects.json');
                    this.projects = await projectsRes.json();
                    
                    // Load docs
                    const docsRes = await fetch('data/docs.json');
                    this.docs = await docsRes.json();
                } catch (error) {
                    console.error('Error loading data:', error);
                    // Use default data from provided structure
                    this.templates = getDefaultTemplates();
                    this.projects = getDefaultProjects();
                    this.docs = getDefaultDocs();
                }
                this.loading = false;
            }
        }));

        // Dashboard data
        Alpine.data('dashboard', () => ({
            user: null,
            isAuthenticated: false,
            stats: {
                downloads: 12,
                projects: 3,
                favorites: 8,
                messages: 24
            },
            recentDownloads: [],
            favorites: [],
            notifications: [],
            
            async init() {
                this.checkAuth();
                
                // Subscribe to auth changes
                if (window.auth) {
                    window.auth.onAuthStateChange((user) => {
                        this.user = user;
                        this.isAuthenticated = !!user;
                    });
                }
            },
            
            checkAuth() {
                if (window.auth) {
                    this.user = window.auth.getCurrentUser();
                    this.isAuthenticated = window.auth.isAuthenticated();
                }
            },
            
            async login() {
                if (window.auth) {
                    await window.auth.loginWithGoogle();
                }
            },
            
            async logout() {
                if (window.auth) {
                    await window.auth.logout();
                }
            }
        }));

        // Templates page data
        Alpine.data('templates', () => ({
            templates: [],
            filteredTemplates: [],
            category: 'all',
            search: '',
            loading: true,
            
            async init() {
                await this.loadTemplates();
            },
            
            async loadTemplates() {
                this.loading = true;
                try {
                    const res = await fetch('data/templates.json');
                    this.templates = await res.json();
                } catch (error) {
                    console.error('Error loading templates:', error);
                    this.templates = getDefaultTemplates();
                }
                this.filteredTemplates = this.templates;
                this.loading = false;
            },
            
            get filteredTemplates() {
                let filtered = this.templates;
                
                if (this.category !== 'all') {
                    filtered = filtered.filter(t => t.category === this.category);
                }
                
                if (this.search) {
                    const query = this.search.toLowerCase();
                    filtered = filtered.filter(t => 
                        t.name.toLowerCase().includes(query) ||
                        t.description.toLowerCase().includes(query)
                    );
                }
                
                return filtered;
            },
            
            downloadTemplate(id) {
                if (!this.isAuthenticated) {
                    if (window.auth) {
                        window.auth.showNotification('Please login to download', 'error');
                    }
                    window.location.href = 'dashboard.html?redirect=web-template.html';
                    return;
                }
                
                // Simulate download
                if (window.auth) {
                    window.auth.showNotification('Download started!', 'success');
                }
            }
        }));

        // Projects page data
        Alpine.data('projects', () => ({
            projects: [],
            loading: true,
            
            async init() {
                await this.loadProjects();
            },
            
            async loadProjects() {
                this.loading = true;
                try {
                    const res = await fetch('data/projects.json');
                    this.projects = await res.json();
                } catch (error) {
                    console.error('Error loading projects:', error);
                    this.projects = getDefaultProjects();
                }
                this.loading = false;
            }
        }));

        // Contact form data
        Alpine.data('contactForm', () => ({
            formData: {
                name: '',
                email: '',
                subject: '',
                message: ''
            },
            submitting: false,
            submitted: false,
            
            async submitForm() {
                this.submitting = true;
                
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                this.submitted = true;
                this.submitting = false;
                
                // Reset form
                this.formData = {
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                };
                
                if (window.auth) {
                    window.auth.showNotification('Message sent successfully!', 'success');
                }
            }
        }));

        // Docs page data
        Alpine.data('docs', () => ({
            docs: [],
            loading: true,
            selectedCategory: 'all',
            
            async init() {
                await this.loadDocs();
            },
            
            async loadDocs() {
                this.loading = true;
                try {
                    const res = await fetch('data/docs.json');
                    this.docs = await res.json();
                } catch (error) {
                    console.error('Error loading docs:', error);
                    this.docs = getDefaultDocs();
                }
                this.loading = false;
            }
        }));

        // Admin panel data
        Alpine.data('admin', () => ({
            user: null,
            isAdmin: false,
            activeTab: 'dashboard',
            stats: {
                downloads: 234,
                users: 156,
                revenue: 2450,
                messages: 48
            },
            
            async init() {
                this.checkAuth();
                
                if (window.auth) {
                    window.auth.onAuthStateChange((user) => {
                        this.user = user;
                        this.isAdmin = window.auth.isAdmin();
                    });
                }
            },
            
            checkAuth() {
                if (window.auth) {
                    this.user = window.auth.getCurrentUser();
                    this.isAdmin = window.auth.isAdmin();
                }
            },
            
            async login() {
                if (window.auth) {
                    await window.auth.loginWithGoogle();
                }
            },
            
            async logout() {
                if (window.auth) {
                    await window.auth.logout();
                }
            },
            
            switchTab(tab) {
                this.activeTab = tab;
            }
        }));
    }

    // Default data functions
    function getDefaultTemplates() {
        return [
            {
                id: 1,
                name: "Portfolio Pro",
                price: 10,
                image: "assets/images/templates/p1.png",
                category: "portfolio",
                description: "Modern portfolio template with 3D effects",
                features: ["Responsive", "3D Animation", "Dark Mode"],
                demoUrl: "https://demo.portfolio-pro.com",
                createdAt: "2024-01-01",
                downloads: 150
            },
            {
                id: 2,
                name: "Ecommerce Elite",
                price: 25,
                image: "assets/images/templates/p2.png",
                category: "ecommerce",
                description: "Powerful ecommerce template with admin panel",
                features: ["Shopping Cart", "Payment Gateway", "Admin Dashboard"],
                demoUrl: "https://demo.ecommerce-elite.com",
                createdAt: "2024-01-15",
                downloads: 89
            }
        ];
    }

    function getDefaultProjects() {
        return [
            {
                id: 1,
                name: "Corporate Website Redesign",
                client: "Tech Corp",
                price: 500,
                image: "assets/images/projects/project1.png",
                category: "web development",
                technologies: ["React", "Node.js", "MongoDB"],
                completionDate: "2024-02-01",
                status: "completed"
            }
        ];
    }

    function getDefaultDocs() {
        return [
            {
                id: 1,
                title: "Getting Started with Templates",
                category: "tutorial",
                content: "Step by step guide to install and customize templates...",
                author: "AmkyawDev",
                date: "2024-01-10",
                tags: ["tutorial", "beginner"],
                readTime: 5
            }
        ];
    }

    // Export for debugging
    window.amkyawDev = {
        version: '1.0.0',
        init
    };
})();
// ================================
// Scroll Animations
// ================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade elements
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ================================
// Counter Animation
// ================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

// Initialize counters
document.addEventListener('DOMContentLoaded', animateCounters);

// ================================
// Enhanced Navbar Scroll Effect
// ================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize navbar
document.addEventListener('DOMContentLoaded', initNavbarScroll);
