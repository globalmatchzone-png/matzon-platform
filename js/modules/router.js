// MATZON - router.js
'use strict';

document.addEventListener("app:ready", () => {

    const headerEl           = document.getElementById('mainHeader');
    const dashboardView      = document.getElementById('dashboardView');
    const tournamentsView    = document.getElementById('tournamentsView');
    const profileView        = document.getElementById('profileView');
    const rankingView        = document.getElementById('rankingView');
    const communityWrapper   = document.getElementById('communityWrapper');
    const communityListView  = document.getElementById('communityListView');
    const commChatView       = document.getElementById('commChatView');
    const commGroupInfoView  = document.getElementById('commGroupInfoView');

    const logoMatzon         = document.getElementById('logoMatzon');
    const searchBtn          = document.getElementById('searchBtn');
    const searchOverlay      = document.getElementById('searchOverlay');
    const searchCloseBtn     = document.getElementById('searchCloseBtn');
    const searchInput        = document.getElementById('searchInput');
    const searchResults      = document.getElementById('searchResults');
    const headerBackBtn      = document.getElementById('headerBackBtn');
    const headerProfileTitle = document.getElementById('headerProfileTitle');
    const btnGoTournaments   = document.getElementById('btnGoTournaments');
    const menuTournaments    = document.getElementById('menuTournaments');
    const menuRanking        = document.getElementById('menuRanking');
    const menuComunidade     = document.getElementById('menuComunidade');
    const menuChat           = document.getElementById('menuChat');
    const menuBtn            = document.getElementById('menuBtn');
    const sideMenu           = document.getElementById('sideMenu');
    const menuItems          = document.querySelectorAll('.menu-item');

    const commBackToMainBtn  = document.getElementById('commBackToMainBtn');
    const commBackToListBtn  = document.getElementById('commBackToListBtn');
    const openGroupInfoBtn   = document.getElementById('openGroupInfoBtn');
    const openGroupInfoBtn2  = document.getElementById('openGroupInfoBtn2');
    const closeGroupInfoBtn  = document.getElementById('closeGroupInfoBtn');
    const commMenuToggleBtn  = document.getElementById('commMenuToggleBtn');
    const commDropdown       = document.getElementById('commDropdown');

    // Header scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 60) {
            if (headerEl) headerEl.classList.add('header--hidden');
        } else {
            if (headerEl) headerEl.classList.remove('header--hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // Helpers
    function hideAllViews() {
        if (dashboardView)    dashboardView.style.display    = 'none';
        if (tournamentsView)  tournamentsView.style.display  = 'none';
        if (profileView)      profileView.style.display      = 'none';
        if (rankingView)      rankingView.style.display      = 'none';
        if (communityWrapper) communityWrapper.style.display = 'none';
        if (headerEl)         headerEl.style.display         = '';
    }

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

    function setActiveMenu(el) {
        menuItems.forEach(i => i.classList.remove('active'));
        if (el) el.classList.add('active');
    }

    const menuSettingsBtn = document.getElementById('menuSettingsBtn');
    const settingsPanel   = document.getElementById('settingsPanel');

    function closeMenu() {
        if (sideMenu) sideMenu.classList.remove('open');
        if (menuBtn)  menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
        document.body.classList.remove('modal-open');
        const msb = document.getElementById('menuSettingsBtn');
        if (msb) msb.classList.remove('visible');
        const main2 = document.getElementById('menuMainContent');
        const nav2  = document.getElementById('navSettingsContent');
        if (main2) main2.classList.remove('slide-out');
        if (nav2)  nav2.classList.remove('slide-in');
    }

    // Views
    function showDashboard() {
        hideAllViews();
        if (dashboardView) dashboardView.style.display = 'block';
        setHeaderDefault();
        setActiveMenu(null);
        window.scrollTo(0, 0);
        closeMenu();
    }

    function showTournaments() {
        hideAllViews();
        if (tournamentsView) tournamentsView.style.display = 'block';
        setHeaderDefault();
        setActiveMenu(menuTournaments);
        window.scrollTo(0, 0);
        closeMenu();
    }

    function showProfile() {
        hideAllViews();
        if (profileView) profileView.style.display = 'block';
        setHeaderProfile();
        setActiveMenu(null);
        window.scrollTo(0, 0);
        closeMenu();
        if (typeof animateProfileBars === 'function') animateProfileBars();
    }

    function showRanking() {
        hideAllViews();
        if (rankingView) rankingView.style.display = 'block';
        setHeaderDefault();
        setActiveMenu(menuRanking);
        window.scrollTo(0, 0);
        closeMenu();
    }

    function showCommunity() {
        hideAllViews();
        if (headerEl)          headerEl.style.display          = 'none';
        if (communityWrapper)  communityWrapper.style.display  = 'flex';
        if (communityListView) communityListView.style.display = 'flex';
        if (commChatView)      commChatView.style.display      = 'none';
        if (commGroupInfoView) commGroupInfoView.style.display = 'none';
        setActiveMenu(menuComunidade);
        window.scrollTo(0, 0);
        closeMenu();
    }

    // Navegação
    if (btnGoTournaments) btnGoTournaments.addEventListener('click', showTournaments);

    if (menuSettingsBtn) {
        menuSettingsBtn.addEventListener('click', () => {
            const main = document.getElementById('menuMainContent');
            const nav  = document.getElementById('navSettingsContent');
            if (main) main.classList.add('slide-out');
            if (nav)  nav.classList.add('slide-in');
        });
    }

    const navSettingsBack = document.getElementById('navSettingsBack');
    if (navSettingsBack) {
        navSettingsBack.addEventListener('click', () => {
            const main = document.getElementById('menuMainContent');
            const nav  = document.getElementById('navSettingsContent');
            if (main) main.classList.remove('slide-out');
            if (nav)  nav.classList.remove('slide-in');
        });
    }

    const settingsCloseBtn = document.getElementById('settingsCloseBtn');
    if (settingsCloseBtn) {
        settingsCloseBtn.addEventListener('click', () => {
            const msb = document.getElementById('menuSettingsBtn');
        if (msb) msb.classList.remove('visible');
        const main2 = document.getElementById('menuMainContent');
        const nav2  = document.getElementById('navSettingsContent');
        if (main2) main2.classList.remove('slide-out');
        if (nav2)  nav2.classList.remove('slide-in');
            document.body.classList.remove('modal-open');
        });
    }

    const newsNations = document.getElementById('newsNationsLeague');
    if (newsNations) {
        newsNations.addEventListener('click', () => {
            showTournaments();
            setTimeout(() => {
                const card = document.getElementById('trn-card-t001');
                if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
        });
    }
    if (menuTournaments)  menuTournaments.addEventListener('click', showTournaments);
    if (menuRanking)      menuRanking.addEventListener('click', showRanking);
    if (menuComunidade)   menuComunidade.addEventListener('click', showCommunity);
    if (menuChat)         menuChat.addEventListener('click', showCommunity);
    if (logoMatzon) logoMatzon.addEventListener('click', showDashboard);

    // Search
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.style.display = 'flex';
            searchInput.focus();
            document.body.classList.add('modal-open');
        });
    }
    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', () => {
            searchOverlay.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '';
            document.body.classList.remove('modal-open');
        });
    }
    let searchFilter = 'all';

    document.querySelectorAll('.search-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.search-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            searchFilter = btn.dataset.filter;
            triggerSearch();
        });
    });

    function triggerSearch() {
        if (!searchInput) return;
        const q = searchInput.value.toLowerCase().trim();
        if (!q) { searchResults.innerHTML = ''; return; }

        Promise.all([
            fetch('data/players.json').then(r => r.json()),
            fetch('data/tournaments.json').then(r => r.json())
        ]).then(([pd, td]) => {
            const players     = pd.players.filter(p => p.gamertag.toLowerCase().includes(q));
            const tournaments = td.tournaments.filter(t => t.name.toLowerCase().includes(q));
            let html = '';

            if (searchFilter !== 'tournaments' && players.length) {
                html += '<div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Players</div>';
                html += players.map(p => `
                    <div style="display:flex;align-items:center;gap:12px;padding:12px 0;">
                        <img src="${p.avatar}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                        <div>
                            <div style="font-size:14px;font-weight:700;">${p.gamertag}</div>
                            <div style="font-size:11px;color:var(--text-muted);">#${p.rank} · ${p.nation}</div>
                        </div>
                        <div style="margin-left:auto;font-size:13px;font-weight:800;color:var(--accent-orange);">${p.points} pts</div>
                    </div>`).join('');
            }

            if (searchFilter !== 'players' && tournaments.length) {
                html += '<div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin:16px 0 10px;">Tournaments</div>';
                html += tournaments.map(t => `
                    <div style="display:flex;align-items:center;gap:12px;padding:12px 0;">
                        <div style="width:40px;height:40px;border-radius:8px;background:var(--bg-card);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent-orange)"><path d="M12 2L3 6V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V6L12 2Z"/></svg>
                        </div>
                        <div>
                            <div style="font-size:14px;font-weight:700;">${t.name}</div>
                            <div style="font-size:11px;color:var(--text-muted);">${t.game} · ${t.zone}</div>
                        </div>
                    </div>`).join('');
            }

            if (!html) html = '<div style="text-align:center;color:var(--text-muted);padding:40px 0;font-size:14px;">No results found</div>';
            searchResults.innerHTML = html;
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', triggerSearch);
    }

    const menuAvatar = document.getElementById('menuAvatar');
    if (menuAvatar) menuAvatar.addEventListener('click', showProfile);
    if (headerBackBtn)    headerBackBtn.addEventListener('click', showDashboard);

    // Menu hambúrguer
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isOpen = sideMenu.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
                if (sideMenu) sideMenu.classList.add('open');
                document.body.classList.add('modal-open');
                const msb = document.getElementById('menuSettingsBtn');
                if (msb) msb.classList.add('visible');

            }
        });
    }

    // Comunidade interna
    if (commBackToMainBtn) commBackToMainBtn.addEventListener('click', showDashboard);

    document.querySelectorAll('.js-open-chat').forEach(item => {
        item.addEventListener('click', () => {
            if (communityListView) communityListView.style.display = 'none';
            if (commChatView)      commChatView.style.display      = 'flex';
            const body = document.getElementById('commChatBody');
            if (body) body.scrollTop = body.scrollHeight;
        });
    });

    if (commBackToListBtn) {
        commBackToListBtn.addEventListener('click', () => {
            if (commChatView)      commChatView.style.display      = 'none';
            if (communityListView) communityListView.style.display = 'flex';
        });
    }

    [openGroupInfoBtn, openGroupInfoBtn2].forEach(btn => {
        if (btn) btn.addEventListener('click', () => {
            if (commGroupInfoView) commGroupInfoView.style.display = 'block';
        });
    });

    if (closeGroupInfoBtn) {
        closeGroupInfoBtn.addEventListener('click', () => {
            if (commGroupInfoView) commGroupInfoView.style.display = 'none';
        });
    }

    if (commMenuToggleBtn && commDropdown) {
        commMenuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            commDropdown.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!commDropdown.contains(e.target) && e.target !== commMenuToggleBtn) {
                commDropdown.classList.remove('open');
            }
        });
    }

});
