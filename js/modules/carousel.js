// MATZON - carousel.js
// Todos os carrosseis
'use strict';

document.addEventListener('DOMContentLoaded', () => {

const bannerEl   = document.getElementById('mainBanner');
    const bannerDots = document.querySelectorAll('#bannerControls .dot');
    const bannerPrev = document.querySelector('#bannerControls .arrow-prev');
    const bannerNext = document.querySelector('#bannerControls .arrow-next');

    const bannerSlides = [
        'MATZON World Cup 2026™ Challenger Series - Claim your ranked position! →',
        'MATZON Nations League 2026 — All Groups Now Live! →',
        'MATZON World Ranking updated 13.04.2026 — See where your nation stands! →'
    ];
    let bannerIndex = 0;

    function goToBannerSlide(i) {
        if (!bannerEl) return;
        bannerIndex = (i + bannerSlides.length) % bannerSlides.length;
        bannerEl.querySelector('h2').textContent = bannerSlides[bannerIndex];
        bannerDots.forEach((d, idx) => d.classList.toggle('active', idx === bannerIndex));
    }

    if (bannerEl && bannerDots.length) {
        if (bannerPrev) bannerPrev.addEventListener('click', () => goToBannerSlide(bannerIndex - 1));
        if (bannerNext) bannerNext.addEventListener('click', () => goToBannerSlide(bannerIndex + 1));
        bannerDots.forEach((dot, idx) => dot.addEventListener('click', () => goToBannerSlide(idx)));
    }

const scheduleCarousel = document.getElementById('matchesCarousel');
    const btnPrevMatch     = document.getElementById('prevMatchBtn');
    const btnNextMatch     = document.getElementById('nextMatchBtn');

    if (scheduleCarousel && btnPrevMatch && btnNextMatch) {
        const getScheduleScrollAmount = () => {
            const firstCol = scheduleCarousel.querySelector('.match-col');
            if (!firstCol) return scheduleCarousel.clientWidth * 0.8;
            const dayMatches = scheduleCarousel.querySelector('.day-matches');
            const gap = dayMatches ? parseFloat(window.getComputedStyle(dayMatches).gap) || 0 : 0;
            return firstCol.offsetWidth + gap;
        };

        btnPrevMatch.addEventListener('click', () => {
            scheduleCarousel.scrollBy({ left: -getScheduleScrollAmount(), behavior: 'smooth' });
        });
        btnNextMatch.addEventListener('click', () => {
            scheduleCarousel.scrollBy({ left: getScheduleScrollAmount(), behavior: 'smooth' });
        });
    }

/** Sync dots to scroll position of a container */
    function setupCarouselDots(scrollContainerSelector, dotsContainerSelector) {
        const scrollContainer = document.querySelector(scrollContainerSelector);
        const dotsWrapper     = document.querySelector(dotsContainerSelector);
        if (!scrollContainer || !dotsWrapper) return;
        const dots = dotsWrapper.querySelectorAll('.dot');
        if (dots.length === 0) return;

        scrollContainer.addEventListener('scroll', () => {
            const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            if (maxScrollLeft <= 0) return;
            const scrollRatio = scrollContainer.scrollLeft / maxScrollLeft;
            const dotIndex    = Math.round(scrollRatio * (dots.length - 1));
            dots.forEach((dot, index) => dot.classList.toggle('active', index === dotIndex));
        }, { passive: true });
    }

    /** Wire prev/next arrows to scroll a slider */
    function setupCarouselArrows(sliderSelector, controlsContainerId) {
        const slider   = document.querySelector(sliderSelector);
        const controls = document.getElementById(controlsContainerId);
        if (!slider || !controls) return;

        const prevBtn = controls.querySelector('.arrow-prev');
        const nextBtn = controls.querySelector('.arrow-next');

        const getScrollAmount = () => {
            const firstChild = slider.firstElementChild;
            if (!firstChild) return 0;
            const gap = parseFloat(window.getComputedStyle(slider).gap) || 0;
            return firstChild.offsetWidth + gap;
        };

        if (prevBtn) prevBtn.addEventListener('click', () => slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));
        if (nextBtn) nextBtn.addEventListener('click', () => slider.scrollBy({ left:  getScrollAmount(), behavior: 'smooth' }));
    }

    // Wire merchandise slider
    setupCarouselDots('#merchSlider', '#merchControls .dots');
    setupCarouselArrows('#merchSlider', 'merchControls');

});
