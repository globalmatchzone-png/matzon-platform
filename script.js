document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. MENU HAMBÚRGUER E SIDEBAR
    // =========================================
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    let isMenuOpen = false;

    menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        menuBtn.innerHTML = isMenuOpen
            ? '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
            
        if (sideMenu) {
            sideMenu.classList.toggle('open');
        }
    });

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            isMenuOpen = false;
            menuBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
            if (sideMenu) sideMenu.classList.remove('open');
        });
    });


    // =========================================
    // 2. NAVEGAÇÃO DO SCHEDULE CARD (SETAS)
    // =========================================
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


    // =========================================
    // 3. DOTS E SETAS SECUNDÁRIAS (LOJA/BANNERS)
    // =========================================
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

    setupCarouselDots('#merchSlider', '#merchControls .dots');
    setupCarouselArrows('#merchSlider', 'merchControls');
    setupCarouselArrows('.banner-slider-wrapper', 'bannerControls');


    // =========================================
    // 4. LÓGICA DO MODAL (MATCH DETAILS DINÂMICO)
    // =========================================
    const accHeader = document.getElementById('matchupAccordionHeader');
    const accContainer = document.getElementById('matchupDetailsAccordion');

    if (accHeader && accContainer) {
        accHeader.addEventListener('click', () => {
            accContainer.classList.toggle('matchup-open');
        });
    }

    const matchModal = document.getElementById('matchModalOverlay');
    const matchCloseBtn = document.getElementById('closeMatchModal');
    const allMatches = document.querySelectorAll('.match-col, .compact-match-col');

    if (matchModal && matchCloseBtn) {
        
        allMatches.forEach(match => {
            match.addEventListener('click', () => {
                
                // Variáveis padrão (caso a informação falhe)
                let team1 = "Equipa 1";
                let team2 = "Equipa 2";
                let flag1 = "https://flagcdn.com/w80/un.png"; // Bandeira neutra placeholder
                let flag2 = "https://flagcdn.com/w80/un.png";
                let time = "00:00";
                let date = "TBD";

                // Lógica de extração: Se for clicado um jogo do carrossel principal
                if (match.classList.contains('match-col')) {
                    const teamNames = match.querySelectorAll('.team-name');
                    if (teamNames.length >= 2) {
                        team1 = teamNames[0].textContent;
                        team2 = teamNames[1].textContent;
                    }
                    
                    const imgs = match.querySelectorAll('img.flag, img.team-logo');
                    if (imgs.length >= 2) {
                        flag1 = imgs[0].src;
                        flag2 = imgs[1].src;
                    } else if (imgs.length === 1) {
                        // Trata os casos com SVG (ex: TBD ou Syndicates)
                        flag1 = "https://via.placeholder.com/80x54/1b2028/8e9bb0?text=TBD";
                        flag2 = imgs[0].src;
                    }

                    const timeEl = match.querySelector('.time');
                    if (timeEl) time = timeEl.textContent;

                    const dayGroup = match.closest('.day-group');
                    if (dayGroup) {
                        const dateEl = dayGroup.querySelector('.day-title');
                        if (dateEl) date = dateEl.textContent;
                    }
                } 
                // Lógica de extração: Se for clicado no Ticker inferior (eFootball compact)
                else if (match.classList.contains('compact-match-col')) {
                    const timeEl = match.querySelector('.compact-time');
                    if (timeEl) time = timeEl.textContent;
                    
                    date = "TODAY";
                    team1 = "Player 1";
                    team2 = "Player 2";
                }

                // Injetar os dados extraídos para dentro do Modal
                const modalTeamNames = matchModal.querySelectorAll('.matchup-team-name');
                const modalFlags = matchModal.querySelectorAll('.matchup-flag');
                const modalDateTime = matchModal.querySelector('.matchup-datetime');
                
                // Injeta no Acordeão
                const detailRows = matchModal.querySelectorAll('.matchup-detail-row span:last-child');

                if (modalTeamNames.length >= 2) {
                    modalTeamNames[0].textContent = team1;
                    modalTeamNames[1].textContent = team2;
                }
                
                if (modalFlags.length >= 2) {
                    modalFlags[0].src = flag1;
                    modalFlags[1].src = flag2;
                }
                
                if (modalDateTime) {
                    modalDateTime.textContent = `${date} - ${time}`;
                }

                if (detailRows.length >= 2) {
                    detailRows[0].textContent = date; // Date
                    detailRows[1].textContent = time; // Time
                }

                // Abrir o Modal
                matchModal.classList.add('open');
                document.body.style.overflow = 'hidden'; 
            });
        });

        // Fechar Modal
        matchCloseBtn.addEventListener('click', () => {
            matchModal.classList.remove('open');
            document.body.style.overflow = ''; 
        });
    }
});

// Troca de Tabs no Modal
window.switchMatchupTab = function(clickedTab) {
    const tabs = document.querySelectorAll('.matchup-tab');
    tabs.forEach(tab => tab.classList.remove('matchup-active'));
    clickedTab.classList.add('matchup-active');
};
