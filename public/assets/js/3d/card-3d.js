// 3D Card Tilt Effect for AmkyawDev
(function() {
    // Wait for DOM and Three.js
    document.addEventListener('DOMContentLoaded', initCard3D);

    function initCard3D() {
        // Hero card 3D effect
        const heroCard = document.getElementById('hero-card');
        if (heroCard) {
            initTiltEffect(heroCard);
        }

        // Initialize all cards with 3D effect
        document.querySelectorAll('.card-3d').forEach(card => {
            initTiltEffect(card);
        });

        // Auto-apply to template and project cards
        document.querySelectorAll('.template-card, .project-card').forEach(card => {
            if (!card.classList.contains('card-3d')) {
                initTiltEffect(card);
            }
        });
    }

    function initTiltEffect(element) {
        if (!element) return;

        const cardContent = element.querySelector('.card-content');
        if (!cardContent) return;

        // Mouse tracking
        let bounds;
        let mouseX = 0;
        let mouseY = 0;
        let rotateX = 0;
        let rotateY = 0;

        // Configuration
        const config = {
            maxRotation: 15, // degrees
            speed: 0.15,
            perspective: 1000,
            scaleOnHover: 1.02,
            glowOnHover: true
        };

        // Set initial perspective
        element.style.perspective = `${config.perspective}px`;
        element.style.transformStyle = 'preserve-3d';

        element.addEventListener('mouseenter', () => {
            bounds = element.getBoundingClientRect();
            
            if (config.scaleOnHover) {
                cardContent.style.transition = 'transform 0.3s ease';
                cardContent.style.transform = `scale(${config.scaleOnHover}) translateZ(20px)`;
            }

            if (config.glowOnHover) {
                cardContent.style.boxShadow = '0 0 40px rgba(79, 70, 229, 0.5), 0 0 80px rgba(79, 70, 229, 0.3)';
            }
        });

        element.addEventListener('mousemove', (e) => {
            if (!bounds) bounds = element.getBoundingClientRect();

            // Calculate mouse position relative to card center
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;

            mouseX = (e.clientX - centerX) / bounds.width;
            mouseY = (e.clientY - centerY) / bounds.height;

            // Calculate rotation
            rotateY = mouseX * config.maxRotation;
            rotateX = -mouseY * config.maxRotation;

            // Apply transform
            cardContent.style.transition = 'none';
            cardContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${config.scaleOnHover || 1}) translateZ(20px)`;
        });

        element.addEventListener('mouseleave', () => {
            // Reset position
            cardContent.style.transition = 'transform 0.5s ease';
            cardContent.style.transform = 'rotateX(0) rotateY(0) scale(1) translateZ(0)';
            
            if (config.glowOnHover) {
                cardContent.style.boxShadow = '';
            }

            // Clear bounds to force recalculation on next enter
            setTimeout(() => {
                bounds = null;
            }, 500);
        });

        // Touch device support
        if ('ontouchstart' in window) {
            element.addEventListener('touchstart', () => {
                bounds = element.getBoundingClientRect();
            });

            element.addEventListener('touchmove', (e) => {
                if (!bounds) return;
                
                const touch = e.touches[0];
                const centerX = bounds.left + bounds.width / 2;
                const centerY = bounds.top + bounds.height / 2;

                mouseX = (touch.clientX - centerX) / bounds.width;
                mouseY = (touch.clientY - centerY) / bounds.height;

                rotateY = mouseX * config.maxRotation;
                rotateX = -mouseY * config.maxRotation;

                cardContent.style.transition = 'none';
                cardContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${config.scaleOnHover || 1}) translateZ(20px)`;
            });

            element.addEventListener('touchend', () => {
                cardContent.style.transition = 'transform 0.5s ease';
                cardContent.style.transform = 'rotateX(0) rotateY(0) scale(1) translateZ(0)';
                bounds = null;
            });
        }
    }

    // Export for use in other modules
    window.initCard3D = initCard3D;
})();