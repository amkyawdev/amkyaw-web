// Lightweight Slider
(function() {
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(container => {
        const wrapper = container.querySelector('.slider-wrapper');
        const cards = container.querySelectorAll('.slider-card');
        const prev = container.querySelector('.slider-prev');
        const next = container.querySelector('.slider-next');
        if (!wrapper || cards.length === 0) return;
        let index = 0, perView = getPerView();
        function getPerView() { return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3; }
        function update() { wrapper.style.transform = `translateX(-${index * (100 / perView)}%)`; }
        prev?.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
        next?.addEventListener('click', () => { index = Math.min(cards.length - perView, index + 1); update(); });
        window.addEventListener('resize', () => { perView = getPerView(); update(); });
    });
    // Auto-rotate carousel
    document.querySelectorAll('.carousel-auto').forEach(carousel => {
        const wrapper = carousel.querySelector('.carousel-wrapper');
        if (!wrapper) return;
        let scrollPos = 0;
        const scroll = () => { scrollPos++; if (scrollPos >= wrapper.scrollWidth / 2) scrollPos = 0; wrapper.scrollLeft = scrollPos; };
        setInterval(scroll, 3000);
    });
})();
