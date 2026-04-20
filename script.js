document.addEventListener('DOMContentLoaded', () => {

    // 1. Menu Hamburger e Sidebar
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    let isMenuOpen = false;

    menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        // Alterna o ícone
        menuBtn.innerHTML = isMenuOpen
            ? '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
            
        // Abre/Fecha o menu lateral
        if (sideMenu) {
            sideMenu.classList.toggle('open');
        }
    });

    // Navegação nos itens do Sidebar (Muda o ativo e fecha o menu)
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            // Fecha o menu após clicar
            isMenuOpen = false;
            menuBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
            if (sideMenu) sideMenu.classList.remove('open');
        });
    });

    // 2. Navegação do Schedule Card
    const scheduleCarousel = document.getElementById('matchesCarousel');
    const btnPrevMatch     = document.getElementById('prevMatchBtn');
    const btnNextMatch     = document.getElementById('nextMatchBtn');

    if (scheduleCarousel && btnPrevMatch && btnNextMatch) {

        const getCardScrollAmount = () => {
            const firstCol = scheduleCarousel.querySelector('.match-col');
            if (!firstCol) return 0;
            const style = window.getComputedStyle(scheduleCarousel.querySelector('.day-matches'));
            const gap = parseFloat(style.gap) || 0;
            return firstCol.offsetWidth + gap;
        };

        btnPrevMatch.addEventListener('click', () => {
            scheduleCarousel.scrollBy({ left: -getCardScrollAmount(), behavior: 'smooth' });
        });

        btnNextMatch.addEventListener('click', () => {
            scheduleCarousel.scrollBy({ left: getCardScrollAmount(), behavior: 'smooth' });
        });
    }

    // 3. Dots para Carrosséis Secundários
    const setupCarouselDots = (scrollContainerSelector, dotsContainerSelector) => {
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

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === dotIndex);
            });
        });
    };

    // 4. Setas para Banners e Loja
    const setupCarouselArrows = (sliderSelector, controlsContainerId) => {
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

        if (prevBtn) {
            prevBtn.style.cursor = 'pointer';
            prevBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.style.cursor = 'pointer';
            nextBtn.addEventListener('click', () => {
                slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });
        }
    };

    // Inicialização
    setupCarouselDots('#merchSlider', '#merchControls .dots');
    setupCarouselArrows('#merchSlider', 'merchControls');
    setupCarouselArrows('.banner-slider-wrapper', 'bannerControls');
});
