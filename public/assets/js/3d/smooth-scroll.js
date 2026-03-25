// Lightweight Smooth Scroll for AmkyawDev
(function() {
    'use strict';

    // Native smooth scroll (one line!)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Lightweight scroll animations using IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Auto-observe animated elements
    document.querySelectorAll('.feature-card, .template-card, .project-card, .doc-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
        .navbar.scrolled { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); }
    `;
    document.head.appendChild(style);

    // Navbar scroll effect (passive)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    navbar.classList.toggle('scrolled', window.scrollY > 50);
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();
