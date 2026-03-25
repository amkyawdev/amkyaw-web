// Smooth Scroll for AmkyawDev
(function() {
    // Initialize smooth scroll when DOM is ready
    document.addEventListener('DOMContentLoaded', initSmoothScroll);

    function initSmoothScroll() {
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });

        // Handle navigation links with hash
        document.querySelectorAll('.nav-links a[href*="#"]').forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Initialize scroll-triggered animations
        initScrollAnimations();

        // Add scroll-based navbar effect
        initNavbarScroll();
    }

    function handleSmoothScroll(e) {
        const href = this.getAttribute('href');
        
        // Only handle hash links
        if (!href || href === '#') return;

        const targetId = href.substring(1);
        if (!targetId) return;

        const target = document.getElementById(targetId);
        
        if (target) {
            e.preventDefault();
            
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            // Check if browser supports smooth scrolling
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Fallback for older browsers
                animateScroll(targetPosition);
            }

            // Update URL without jumping
            history.pushState(null, null, href);
        }
    }

    function animateScroll(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(1000, Math.abs(distance) * 0.5);
        let startTime = null;

        function step(currentTime) {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            
            // Ease out quad
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            
            window.scrollTo(0, startPosition + (distance * easeProgress));

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.feature-card, .template-card, .project-card, .doc-card, .stat-card, .testimonial-card'
        );

        // Set initial state
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation delay
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class based on scroll position
            if (currentScroll > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Export for use in other modules
    window.initSmoothScroll = initSmoothScroll;
})();