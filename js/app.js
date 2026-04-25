// MATZON - app.js
window.MATZON = window.MATZON || {};

// Banner video carousel — espera app:ready
document.addEventListener('app:ready', function() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots   = document.querySelectorAll('#bannerControls .dot');
    if (!slides.length) return;
    let current = 0;

    function goTo(n) {
        slides[current].classList.remove('active');
        slides[current].querySelector('video').pause();
        dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        slides[current].querySelector('video').play();
        dots[current].classList.add('active');
    }

    const prev = document.querySelector('#bannerControls .arrow-prev');
    const next = document.querySelector('#bannerControls .arrow-next');
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    setInterval(() => goTo(current + 1), 6000);
});
