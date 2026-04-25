// MATZON - app.js
window.MATZON = window.MATZON || {};

document.addEventListener('app:ready', function() {
    const slides   = document.querySelectorAll('.banner-slide');
    const dots     = document.querySelectorAll('#bannerControls .dot');
    const carousel = document.getElementById('bannerCarousel');
    if (!slides.length) return;
    let current = 0;
    let transitioning = false;

    function transition(n) {
        if (transitioning) return;
        transitioning = true;

        // Dots juntam-se
        dots.forEach(d => d.classList.add('merging'));

        setTimeout(() => {
            // Troca o slide
            slides[current].classList.remove('active');
            slides[current].querySelector('video').pause();
            slides[current].querySelector('video').currentTime = 0;
            dots[current].classList.remove('active');
            dots[current].style.setProperty('--progress', '0%');

            current = (n + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');

            const vid = slides[current].querySelector('video');
            vid.currentTime = 0;
            vid.play();

            // Dots separam-se
            dots.forEach(d => d.classList.remove('merging'));
            dots.forEach(d => d.classList.add('separating'));
            setTimeout(() => dots.forEach(d => d.classList.remove('separating')), 400);

            transitioning = false;

            vid.ontimeupdate = function() {
                if (!vid.duration) return;
                const pct = (vid.currentTime / vid.duration) * 100;
                dots[current].style.setProperty('--progress', pct + '%');
            };
            vid.onended = () => transition(current + 1);

        }, 400);
    }

    // Botões
    const prev = document.querySelector('#bannerControls .arrow-prev');
    const next = document.querySelector('#bannerControls .arrow-next');
    if (prev) prev.addEventListener('click', () => transition(current - 1));
    if (next) next.addEventListener('click', () => transition(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => transition(i)));

    // Swipe
    if (carousel) {
        let startX = 0;
        carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) transition(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });
    }

    transition(0);
});
