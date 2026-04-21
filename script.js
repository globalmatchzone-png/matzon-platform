document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 0. HEADER SCROLL HIDE/SHOW LOGIC
    // =========================================
    let lastScrollTop = 0;
    const headerEl = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 60) {
            // Scrolling down: esconde header
            if(headerEl) headerEl.classList.add('header--hidden');
        } else {
            // Scrolling up: mostra header
            if(headerEl) headerEl.classList.remove('header--hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });


    // =========================================
    // 1. ROTEAMENTO: SINGLE PAGE APP (VIEWS)
    // =========================================
    const dashboardView = document.getElementById('dashboardView');
    const tournamentsView = document.getElementById('tournamentsView');
    
    const btnGoTournaments = document.getElementById('btnGoTournaments'); 
    const menuTournaments = document.getElementById('menuTournaments');
    const menuProfile = document.getElementById('menuProfile');
    const logoMatzon = document.getElementById('logoMatzon');
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuItems = document.querySelectorAll('.menu-item');

    function closeMenu() {
        if(sideMenu) sideMenu.classList.remove('open');
        if(menuBtn) menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
        document.body.classList.remove('modal-open'); // Remove scroll lock do fundo
    }

    function showTournaments() {
        if(dashboardView) dashboardView.style.display = 'none';
        if(tournamentsView) tournamentsView.style.display = 'block';
        window.scrollTo(0, 0);
        menuItems.forEach(el => el.classList.remove('active'));
        if(menuTournaments) menuTournaments.classList.add('active');
        closeMenu();
    }

    function showDashboard() {
        if(dashboardView) dashboardView.style.display = 'block';
        if(tournamentsView) tournamentsView.style.display = 'none';
        window.scrollTo(0, 0);
        menuItems.forEach(el => el.classList.remove('active'));
        if(menuProfile) menuProfile.classList.add('active');
        closeMenu();
    }

    if(btnGoTournaments) btnGoTournaments.addEventListener('click', showTournaments);
    if(menuTournaments) menuTournaments.addEventListener('click', showTournaments);
    if(menuProfile) menuProfile.addEventListener('click', showDashboard);
    if(logoMatzon) logoMatzon.addEventListener('click', showDashboard);


    // =========================================
    // 2. BUG FIX: MENU HAMBÚRGUER MATZON
    // =========================================
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isOpen = sideMenu.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                // Altera ícone para o 'X'
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
                if (sideMenu) sideMenu.classList.add('open');
                document.body.classList.add('modal-open'); // Previne o scroll do fundo!
            }
        });
    }

    // =========================================
    // 3. CALENDÁRIO: CARROSSEL DAS SETAS
    // =========================================
    const scheduleCarousel = document.getElementById('matchesCarousel');
    const btnPrevMatch     = document.getElementById('prevMatchBtn');
    const btnNextMatch     = document.getElementById('nextMatchBtn');

    if (scheduleCarousel && btnPrevMatch && btnNextMatch) {
        btnPrevMatch.addEventListener('click', () => {
            scheduleCarousel.scrollBy({ left: -(scheduleCarousel.clientWidth * 0.8), behavior: 'smooth' });
        });
        btnNextMatch.addEventListener('click', () => {
            scheduleCarousel.scrollBy({ left: (scheduleCarousel.clientWidth * 0.8), behavior: 'smooth' });
        });
    }

    // =========================================
    // 4. CARROSSEIS SECUNDÁRIOS (TABS E PILLS)
    // =========================================
    function setupActiveState(selector) {
        const items = document.querySelectorAll(selector);
        items.forEach(item => {
            item.addEventListener('click', function() {
                const parent = this.parentElement;
                const siblings = parent.querySelectorAll(selector);
                siblings.forEach(sibling => sibling.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    setupActiveState('.tab-item');     
    setupActiveState('.pill');         
    setupActiveState('.round-btn');    

    function setupHorizontalScroll(containerId, leftBtnClass, rightBtnClass) {
        const container = document.getElementById(containerId);
        const leftBtn = leftBtnClass ? document.querySelector(leftBtnClass) : null;
        const rightBtn = rightBtnClass ? document.querySelector(rightBtnClass) : null;

        if (!container) return;
        if (leftBtn) leftBtn.addEventListener('click', () => container.scrollBy({ left: -150, behavior: 'smooth' }));
        if (rightBtn) rightBtn.addEventListener('click', () => container.scrollBy({ left: 150, behavior: 'smooth' }));
    }

    setupHorizontalScroll('mainTabsScroll', '.js-main-left', '.js-main-right');
    setupHorizontalScroll('mainTabsScroll2', '.js-main-left2', '.js-main-right2');
    setupHorizontalScroll('zoneScroll', '.js-zone-left', null);
    setupHorizontalScroll('groupScroll', '.js-group-left', null);


    // =========================================
    // 5. BUG FIX: LÓGICA DO MODAL 100% NATIVA
    // =========================================
    function createEmojiImage(emoji) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="54"><rect width="100%" height="100%" fill="#222a35" rx="4"/><text x="50%" y="50%" font-size="32" font-family="sans-serif" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    const accHeader = document.getElementById('matchupAccordionHeader');
    const accContainer = document.getElementById('matchupDetailsAccordion');
    if (accHeader && accContainer) {
        accHeader.addEventListener('click', () => accContainer.classList.toggle('matchup-open'));
    }

    const matchModal = document.getElementById('matchModalOverlay');
    const matchCloseBtn = document.getElementById('closeMatchModal');
    
    // Removemos qualquer drag logic e usamos 'click' nativo que resolve conflitos de swipe.
    const allMatches = document.querySelectorAll('.match-col, .compact-match-col, .match-card');

    if (matchModal && matchCloseBtn) {
        allMatches.forEach(match => {
            match.addEventListener('click', (e) => {
                e.preventDefault();

                let team1 = "TBD";
                let team2 = "TBD";
                
                // Escudo oficial cinzento (fallback seguro para não quebrar no TBD)
                const defaultShield = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='54'><rect width='100%' height='100%' fill='%23222a35' rx='4'/><path d='M40 12L22 18v12c0 11 8 21 18 24 10-3 18-13 18-24V18L40 12z' fill='none' stroke='%238e9bb0' stroke-width='2'/></svg>";
                
                let flag1 = defaultShield; 
                let flag2 = defaultShield;
                let time = "00:00";
                let date = "TBD";

                try {
                    // Extração caso 1: Dashboard Principal
                    if (match.closest('.match-col')) {
                        const teamNames = match.querySelectorAll('.team-name');
                        if (teamNames.length > 0) team1 = teamNames[0].textContent.trim();
                        if (teamNames.length > 1) team2 = teamNames[1].textContent.trim();

                        const imgs = match.querySelectorAll('img.flag, svg.team-shield');
                        if (imgs.length > 0 && imgs[0].tagName.toLowerCase() === 'img') flag1 = imgs[0].src;
                        if (imgs.length > 1 && imgs[1].tagName.toLowerCase() === 'img') flag2 = imgs[1].src;

                        const timeEl = match.querySelector('.time');
                        if (timeEl) time = timeEl.textContent.trim();

                        const dayGroup = match.closest('.day-group');
                        if (dayGroup) {
                            const dateEl = dayGroup.querySelector('.day-title');
                            if (dateEl) date = dateEl.textContent.trim();
                        }
                    } 
                    // Extração caso 2: Ticker Inferior
                    else if (match.closest('.compact-match-col')) {
                        const timeEl = match.querySelector('.compact-time');
                        if (timeEl) time = timeEl.textContent.trim();
                        date = "TODAY";
                        team1 = "Player 1";
                        team2 = "Player 2";
                        
                        const emojiSpans = match.querySelectorAll('.compact-flags span');
                        if (emojiSpans.length > 0) flag1 = createEmojiImage(emojiSpans[0].textContent);
                        if (emojiSpans.length > 1) flag2 = createEmojiImage(emojiSpans[1].textContent);
                    }
                    // Extração caso 3: Menu de Torneios
                    else if (match.closest('.match-card')) {
                        const matchTeams = match.querySelectorAll('.match-team');
                        if (matchTeams.length > 0) {
                            team1 = matchTeams[0].textContent.trim();
                            const img1 = matchTeams[0].querySelector('img');
                            if (img1) flag1 = img1.src;
                        }
                        if (matchTeams.length > 1) {
                            team2 = matchTeams[1].textContent.trim();
                            const img2 = matchTeams[1].querySelector('img');
                            if (img2) flag2 = img2.src;
                        }
                        
                        const timeEl = match.querySelector('.match-time');
                        if (timeEl) time = timeEl.textContent.trim();
                        const dateEl = match.querySelector('.match-date');
                        if (dateEl) date = dateEl.textContent.trim();
                    }

                    // Preenche o Modal
                    const modalTeamNames = matchModal.querySelectorAll('.matchup-team-name');
                    if (modalTeamNames.length > 0) modalTeamNames[0].textContent = team1;
                    if (modalTeamNames.length > 1) modalTeamNames[1].textContent = team2;

                    const modalFlags = matchModal.querySelectorAll('.matchup-flag');
                    if (modalFlags.length > 0) modalFlags[0].src = flag1;
                    if (modalFlags.length > 1) modalFlags[1].src = flag2;

                    const modalDateTime = matchModal.querySelector('.matchup-datetime');
                    if (modalDateTime) modalDateTime.textContent = `${date} - ${time}`;
                    
                    const detailRows = matchModal.querySelectorAll('.matchup-detail-row span:last-child');
                    if (detailRows.length > 0) detailRows[0].textContent = date; 
                    if (detailRows.length > 1) detailRows[1].textContent = time; 

                    // Abre o Modal com fluidez
                    matchModal.classList.add('open');
                    document.body.classList.add('modal-open');
                } catch(e) {
                    console.error("Safely Handled Error", e);
                    matchModal.classList.add('open');
                    document.body.classList.add('modal-open');
                }
            });
        });

        matchCloseBtn.addEventListener('click', () => {
            matchModal.classList.remove('open');
            document.body.classList.remove('modal-open');
        });
    }
});

// Separadores dentro do Modal
window.switchMatchupTab = function(clickedTab) {
    const tabs = document.querySelectorAll('.matchup-tab');
    tabs.forEach(tab => tab.classList.remove('matchup-active'));
    clickedTab.classList.add('matchup-active');
};
