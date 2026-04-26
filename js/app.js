// MATZON - app.js
// Carrossel de vídeos do banner
'use strict';

window.MATZON = window.MATZON || {};

document.addEventListener('app:ready', () => {

    const slides   = document.querySelectorAll('.banner-slide');
    const dots     = document.querySelectorAll('#bannerControls .dot');
    const carousel = document.getElementById('bannerCarousel');

    if (!slides.length) return;

    let current      = 0;
    let transitioning = false;

    function goTo(n) {
        if (transitioning) return;
        transitioning = true;

        const controls = document.getElementById('bannerControls');

        // Dots juntam-se
        if (controls) controls.classList.add('merging');
        dots.forEach(d => { d.classList.remove('separating'); d.classList.add('merging'); });

        setTimeout(() => {
            // Desactiva slide actual
            slides[current].classList.remove('active');
            const oldVid = slides[current].querySelector('video');
            if (oldVid) { oldVid.pause(); oldVid.currentTime = 0; }
            if (dots[current]) {
                dots[current].classList.remove('active');
                dots[current].style.setProperty('--progress', '0%');
            }

            // Activa novo slide
            current = (n + slides.length) % slides.length;
            slides[current].classList.add('active');
            if (dots[current]) dots[current].classList.add('active');

            const vid = slides[current].querySelector('video');
            if (vid) {
                vid.currentTime = 0;
                vid.play().catch(() => {});

                vid.ontimeupdate = () => {
                    if (!vid.duration) return;
                    const pct = (vid.currentTime / vid.duration) * 100;
                    if (dots[current]) dots[current].style.setProperty('--progress', pct + '%');
                };

                vid.onended = () => goTo(current + 1);
            }

            // Dots separam-se
            if (controls) { controls.classList.remove('merging'); controls.classList.add('separating'); }
            dots.forEach(d => { d.classList.remove('merging'); d.classList.add('separating'); });
            setTimeout(() => {
                if (controls) controls.classList.remove('separating');
                dots.forEach(d => d.classList.remove('separating'));
            }, 500);

            transitioning = false;

        }, 400);
    }

    // Controlos
    const prev = document.querySelector('#bannerControls .arrow-prev');
    const next = document.querySelector('#bannerControls .arrow-next');
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Swipe
    if (carousel) {
        let startX = 0;
        carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });
    }

    // Iniciar primeiro slide
    const firstVid = slides[0].querySelector('video');
    if (firstVid) {
        firstVid.play().catch(() => {});
        firstVid.ontimeupdate = () => {
            if (!firstVid.duration) return;
            const pct = (firstVid.currentTime / firstVid.duration) * 100;
            if (dots[0]) dots[0].style.setProperty('--progress', pct + '%');
        };
        firstVid.onended = () => goTo(1);
    }

});
