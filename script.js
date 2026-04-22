document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 0. HEADER SCROLL HIDE/SHOW
    // =========================================
    let lastScrollTop = 0;
    const headerEl = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 60) {
            if (headerEl) headerEl.classList.add('header--hidden');
        } else {
            if (headerEl) headerEl.classList.remove('header--hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });


    // =========================================
    // 1. ROUTING — SINGLE PAGE APP
    // =========================================
    const dashboardView      = document.getElementById('dashboardView');
    const tournamentsView    = document.getElementById('tournamentsView');
    const profileView        = document.getElementById('profileView');

    const logoMatzon         = document.getElementById('logoMatzon');
    const headerBackBtn      = document.getElementById('headerBackBtn');
    const headerProfileTitle = document.getElementById('headerProfileTitle');
    const btnGoTournaments   = document.getElementById('btnGoTournaments');
    const menuTournaments    = document.getElementById('menuTournaments');
    const menuProfile        = document.getElementById('menuProfile');
    const menuBtn            = document.getElementById('menuBtn');
    const sideMenu           = document.getElementById('sideMenu');
    const menuItems          = document.querySelectorAll('.menu-item');

    function setHeaderDefault() {
        if (logoMatzon)         logoMatzon.style.display         = '';
        if (headerBackBtn)      headerBackBtn.style.display      = 'none';
        if (headerProfileTitle) headerProfileTitle.style.display = 'none';
    }

    function setHeaderProfile() {
        if (logoMatzon)         logoMatzon.style.display         = 'none';
        if (headerBackBtn)      headerBackBtn.style.display      = 'flex';
        if (headerProfileTitle) headerProfileTitle.style.display = 'block';
    }

    function closeMenu() {
        if (sideMenu) sideMenu.classList.remove('open');
        if (menuBtn)  menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
        document.body.classList.remove('modal-open');
    }

    function showDashboard() {
        if (dashboardView)   dashboardView.style.display   = 'block';
        if (tournamentsView) tournamentsView.style.display = 'none';
        if (profileView)     profileView.style.display     = 'none';
        setHeaderDefault();
        window.scrollTo(0, 0);
        menuItems.forEach(el => el.classList.remove('active'));
        if (menuProfile) menuProfile.classList.add('active');
        closeMenu();
    }

    function showTournaments() {
        if (dashboardView)   dashboardView.style.display   = 'none';
        if (tournamentsView) tournamentsView.style.display = 'block';
        if (profileView)     profileView.style.display     = 'none';
        setHeaderDefault();
        window.scrollTo(0, 0);
        menuItems.forEach(el => el.classList.remove('active'));
        if (menuTournaments) menuTournaments.classList.add('active');
        closeMenu();
    }

    function showProfile() {
        if (dashboardView)   dashboardView.style.display   = 'none';
        if (tournamentsView) tournamentsView.style.display = 'none';
        if (profileView)     profileView.style.display     = 'block';
        setHeaderProfile();
        window.scrollTo(0, 0);
        menuItems.forEach(el => el.classList.remove('active'));
        closeMenu();
        animateProfileBars();
    }

    if (btnGoTournaments) btnGoTournaments.addEventListener('click', showTournaments);
    if (menuTournaments)  menuTournaments.addEventListener('click', showTournaments);
    if (menuProfile)      menuProfile.addEventListener('click', showProfile);
    if (logoMatzon)       logoMatzon.addEventListener('click', showDashboard);
    if (headerBackBtn)    headerBackBtn.addEventListener('click', showDashboard);


    // =========================================
    // 2. MENU HAMBÚRGUER
    // =========================================
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isOpen = sideMenu.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
                if (sideMenu) sideMenu.classList.add('open');
                document.body.classList.add('modal-open');
            }
        });
    }


    // =========================================
    // 3. BANNER CAROUSEL
    // =========================================
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


    // =========================================
    // 4. SCHEDULE CAROUSEL (SETAS)
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
    // 5. ACTIVE STATE (TABS, PILLS, ROUND-BTNS)
    // =========================================
    function setupActiveState(selector) {
        const items = document.querySelectorAll(selector);
        items.forEach(item => {
            item.addEventListener('click', function () {
                const parent = this.parentElement;
                parent.querySelectorAll(selector).forEach(s => s.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    setupActiveState('.tab-item');
    setupActiveState('.pill');
    setupActiveState('.round-btn');

    function setupHorizontalScroll(containerId, leftBtnClass, rightBtnClass) {
        const container = document.getElementById(containerId);
        const leftBtn   = leftBtnClass  ? document.querySelector(leftBtnClass)  : null;
        const rightBtn  = rightBtnClass ? document.querySelector(rightBtnClass) : null;
        if (!container) return;
        if (leftBtn)  leftBtn.addEventListener('click',  () => container.scrollBy({ left: -150, behavior: 'smooth' }));
        if (rightBtn) rightBtn.addEventListener('click', () => container.scrollBy({ left:  150, behavior: 'smooth' }));
    }

    setupHorizontalScroll('mainTabsScroll2', '.js-main-left2', '.js-main-right2');
    setupHorizontalScroll('zoneScroll', '.js-zone-left', null);


    // =========================================
    // 6. PERFIL — TABS + BARRAS DE PERFORMANCE
    // =========================================
    function animateProfileBars() {
        document.querySelectorAll('#profileView .prf-panel.active .prf-bar-fill').forEach(fill => {
            const target = fill.dataset.width + '%';
            fill.style.width = '0%';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                fill.style.width = target;
            }));
        });
    }

    const prfTabs = document.querySelectorAll('.js-prf-tab');
    prfTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            prfTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.prf-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById(tab.getAttribute('data-target'));
            if (panel) {
                panel.classList.add('active');
                panel.querySelectorAll('.prf-bar-fill').forEach(fill => {
                    const target = fill.dataset.width + '%';
                    fill.style.width = '0%';
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        fill.style.width = target;
                    }));
                });
            }
        });
    });


    // =========================================
    // 7. MODAL MATCH DETAILS
    // =========================================
    function createEmojiImage(emoji) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="54"><rect width="100%" height="100%" fill="#222a35" rx="4"/><text x="50%" y="50%" font-size="32" font-family="sans-serif" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    const accHeader    = document.getElementById('matchupAccordionHeader');
    const accContainer = document.getElementById('matchupDetailsAccordion');
    if (accHeader && accContainer) {
        accHeader.addEventListener('click', () => accContainer.classList.toggle('matchup-open'));
    }

    const matchModal    = document.getElementById('matchModalOverlay');
    const matchCloseBtn = document.getElementById('closeMatchModal');

    // Apenas elementos do dashboard e tournaments abrem o modal
    const allMatches = document.querySelectorAll(
        '#dashboardView .match-col, #dashboardView .compact-match-col, #tournamentsView .match-card'
    );

    if (matchModal && matchCloseBtn) {
        allMatches.forEach(match => {
            match.addEventListener('click', (e) => {
                e.preventDefault();

                let team1 = "TBD", team2 = "TBD";
                const defaultShield = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='54'><rect width='100%' height='100%' fill='%23222a35' rx='4'/><path d='M40 12L22 18v12c0 11 8 21 18 24 10-3 18-13 18-24V18L40 12z' fill='none' stroke='%238e9bb0' stroke-width='2'/></svg>";
                let flag1 = defaultShield, flag2 = defaultShield;
                let time = "00:00", date = "TBD";

                try {
                    if (match.classList.contains('match-col')) {
                        const teamNames = match.querySelectorAll('.team-name');
                        if (teamNames[0]) team1 = teamNames[0].textContent.trim();
                        if (teamNames[1]) team2 = teamNames[1].textContent.trim();
                        const imgs = match.querySelectorAll('img.flag, svg.team-shield');
                        if (imgs[0] && imgs[0].tagName.toLowerCase() === 'img') flag1 = imgs[0].src;
                        if (imgs[1] && imgs[1].tagName.toLowerCase() === 'img') flag2 = imgs[1].src;
                        const timeEl = match.querySelector('.time');
                        if (timeEl) time = timeEl.textContent.trim();
                        const dayGroup = match.closest('.day-group');
                        if (dayGroup) {
                            const dateEl = dayGroup.querySelector('.day-title');
                            if (dateEl) date = dateEl.textContent.trim();
                        }
                    } else if (match.classList.contains('compact-match-col')) {
                        const timeEl = match.querySelector('.compact-time');
                        if (timeEl) time = timeEl.textContent.trim();
                        date = "TODAY"; team1 = "Player 1"; team2 = "Player 2";
                        const emojiSpans = match.querySelectorAll('.compact-flags span');
                        if (emojiSpans[0]) flag1 = createEmojiImage(emojiSpans[0].textContent);
                        if (emojiSpans[1]) flag2 = createEmojiImage(emojiSpans[1].textContent);
                    } else if (match.classList.contains('match-card')) {
                        const matchTeams = match.querySelectorAll('.match-team');
                        if (matchTeams[0]) { team1 = matchTeams[0].textContent.trim(); const i = matchTeams[0].querySelector('img'); if (i) flag1 = i.src; }
                        if (matchTeams[1]) { team2 = matchTeams[1].textContent.trim(); const i = matchTeams[1].querySelector('img'); if (i) flag2 = i.src; }
                        const timeEl = match.querySelector('.match-time');
                        if (timeEl) time = timeEl.textContent.trim();
                        const dateEl = match.querySelector('.match-date');
                        if (dateEl) date = dateEl.textContent.trim();
                    }

                    const modalTeamNames = matchModal.querySelectorAll('.matchup-team-name');
                    if (modalTeamNames[0]) modalTeamNames[0].textContent = team1;
                    if (modalTeamNames[1]) modalTeamNames[1].textContent = team2;
                    const modalFlags = matchModal.querySelectorAll('.matchup-flag');
                    if (modalFlags[0]) modalFlags[0].src = flag1;
                    if (modalFlags[1]) modalFlags[1].src = flag2;
                    const modalDateTime = matchModal.querySelector('.matchup-datetime');
                    if (modalDateTime) modalDateTime.textContent = `${date} - ${time}`;
                    const detailRows = matchModal.querySelectorAll('.matchup-detail-row span:last-child');
                    if (detailRows[0]) detailRows[0].textContent = date;
                    if (detailRows[1]) detailRows[1].textContent = time;
                    const breadcrumbLink = matchModal.querySelector('.matchup-breadcrumbs a');
                    if (breadcrumbLink) breadcrumbLink.textContent = `${team1} vs ${team2}`;

                    matchModal.classList.add('open');
                    document.body.classList.add('modal-open');
                } catch (err) {
                    console.error('Modal error:', err);
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

// Global — tabs dentro do modal de match
window.switchMatchupTab = function (clickedTab) {
    document.querySelectorAll('.matchup-tab').forEach(tab => tab.classList.remove('matchup-active'));
    clickedTab.classList.add('matchup-active');
};
