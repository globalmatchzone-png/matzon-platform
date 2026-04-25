// MATZON - app.js
window.MATZON = window.MATZON || {};

document.addEventListener('app:ready', function() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots   = document.querySelectorAll('#bannerControls .dot');
    if (!slides.length) return;
    let current = 0;
    let autoTimer;

    function goTo(n) {
        slides[current].classList.remove('active');
        slides[current].querySelector('video').pause();
        dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        slides[current].querySelector('video').play();
        dots[current].classList.add('active');
    }

    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 6000);
    }

    // Botões
    const prev = document.querySelector('#bannerControls .arrow-prev');
    const next = document.querySelector('#bannerControls .arrow-next');
    if (prev) prev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    if (next) next.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetTimer(); }));

    // Swipe
    const carousel = document.getElementById('bannerCarousel');
    if (carousel) {
        let startX = 0;
        carousel.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                goTo(diff > 0 ? current + 1 : current - 1);
                resetTimer();
            }
        }, { passive: true });
    }

    // Auto avança
    resetTimer();
});
