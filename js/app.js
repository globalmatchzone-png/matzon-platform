// MATZON - app.js
window.MATZON = window.MATZON || {};

document.addEventListener('app:ready', function() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots   = document.querySelectorAll('#bannerControls .dot');
    if (!slides.length) return;
    let current = 0;

    function goTo(n) {
        slides[current].classList.remove('active');
        const prevVid = slides[current].querySelector('video');
        prevVid.pause();
        prevVid.currentTime = 0;
        dots[current].classList.remove('active');
        dots[current].style.setProperty('--progress', '0%');

        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');

        const vid = slides[current].querySelector('video');
        vid.currentTime = 0;
        vid.play();

        // Progresso no dot
        vid.ontimeupdate = function() {
            if (!vid.duration) return;
            const pct = (vid.currentTime / vid.duration) * 100;
            dots[current].style.setProperty('--progress', pct + '%');
        };

        // Troca automática ao terminar
        vid.onended = function() {
            goTo(current + 1);
        };
    }

    // Botões
    const prev = document.querySelector('#bannerControls .arrow-prev');
    const next = document.querySelector('#bannerControls .arrow-next');
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Swipe
    const carousel = document.getElementById('bannerCarousel');
    if (carousel) {
        let startX = 0;
        carousel.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });
    }

    goTo(0);
});
