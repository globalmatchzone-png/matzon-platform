// MATZON - router.js
'use strict';

document.addEventListener("app:ready", () => {

    // ── Elementos ─────────────────────────────────────────
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
    const menuSettingsBtn    = document.getElementById('menuSettingsBtn');
    const searchBtn          = document.getElementById('searchBtn');
    const searchOverlay      = document.getElementById('searchOverlay');
    const searchCloseBtn     = document.getElementById('searchCloseBtn');
    const searchInput        = document.getElementById('searchInput');
    const searchResults      = document.getElementById('searchResults');
    const commBackToMainBtn  = document.getElementById('commBackToMainBtn');
    const commBackToListBtn  = document.getElementById('commBackToListBtn');
    const openGroupInfoBtn   = document.getElementById('openGroupInfoBtn');
    const openGroupInfoBtn2  = document.getElementById('openGroupInfoBtn2');
    const closeGroupInfoBtn  = document.getElementById('closeGroupInfoBtn');
    const commMenuToggleBtn  = document.getElementById('commMenuToggleBtn');
    const commDropdown       = document.getElementById('commDropdown');
    const menuAvatar         = document.getElementById('menuAvatar');

    // ── Estado ────────────────────────────────────────────
    let settingsOpen = false;

    const ICON_HAMBURGER = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
    const ICON_CLOSE_MENU = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    const ICON_SETTINGS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    const ICON_CLOSE_SETTINGS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    // ── Helpers ───────────────────────────────────────────
    function resetSettings() {
        settingsOpen = false;
        const main = document.getElementById('menuMainContent');
        const nav  = document.getElementById('navSettingsContent');
        const lang = document.getElementById('navLanguageContent');
        if (main) main.classList.remove('slide-out');
        if (nav)  nav.classList.remove('slide-in');
        if (lang) lang.classList.remove('slide-in');
        if (menuSettingsBtn) menuSettingsBtn.innerHTML = ICON_SETTINGS;
    }

    function closeMenu() {
        if (sideMenu) sideMenu.classList.remove('open');
        if (menuBtn)  menuBtn.innerHTML = ICON_HAMBURGER;
        if (menuSettingsBtn) menuSettingsBtn.classList.remove('visible');
        document.body.classList.remove('modal-open');
        resetSettings();
    }

    function openMenu() {
        if (sideMenu) sideMenu.classList.add('open');
        if (menuBtn)  menuBtn.innerHTML = ICON_CLOSE_MENU;
        if (menuSettingsBtn) menuSettingsBtn.classList.add('visible');
        document.body.classList.add('modal-open');
    }

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

    // ── Views ─────────────────────────────────────────────
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
        if (window.MATZON && typeof window.MATZON.animateProfileBars === 'function') {
            window.MATZON.animateProfileBars();
        }
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

    // ── Header scroll ─────────────────────────────────────
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

    // ── Menu hambúrguer ───────────────────────────────────
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (sideMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Fechar ao clicar fora do menu
    document.addEventListener('click', (e) => {
        if (!sideMenu) return;
        if (sideMenu.classList.contains('open') &&
            !sideMenu.contains(e.target) &&
            e.target !== menuBtn &&
            !menuBtn.contains(e.target) &&
            (!menuSettingsBtn || !menuSettingsBtn.contains(e.target))) {
            closeMenu();
        }
    });

    // ── Settings dentro do menu ───────────────────────────
    if (menuSettingsBtn) {
        menuSettingsBtn.addEventListener('click', () => {
            const main = document.getElementById('menuMainContent');
            const nav  = document.getElementById('navSettingsContent');
            settingsOpen = !settingsOpen;
            if (settingsOpen) {
                if (main) main.classList.add('slide-out');
                if (nav)  nav.classList.add('slide-in');
                menuSettingsBtn.innerHTML = ICON_CLOSE_SETTINGS;
            } else {
                resetSettings();
            }
        });
    }

    // ── Navegação ─────────────────────────────────────────
    if (btnGoTournaments) btnGoTournaments.addEventListener('click', showTournaments);
    if (menuTournaments)  menuTournaments.addEventListener('click', showTournaments);
    if (menuRanking)      menuRanking.addEventListener('click', showRanking);
    if (menuComunidade)   menuComunidade.addEventListener('click', showCommunity);
    if (menuChat)         menuChat.addEventListener('click', showCommunity);
    if (logoMatzon)       logoMatzon.addEventListener('click', showDashboard);
    if (headerBackBtn)    headerBackBtn.addEventListener('click', showDashboard);
    if (menuAvatar)       menuAvatar.addEventListener('click', showProfile);

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

    // ── Pesquisa ──────────────────────────────────────────
    let searchFilter = 'all';

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchOverlay) searchOverlay.style.display = 'flex';
            if (searchInput) searchInput.focus();
            document.body.classList.add('modal-open');
        });
    }

    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', () => {
            if (searchOverlay) searchOverlay.style.display = 'none';
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
            document.body.classList.remove('modal-open');
        });
    }

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
        if (!q) { if (searchResults) searchResults.innerHTML = ''; return; }

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
            if (searchResults) searchResults.innerHTML = html;
        });
    }

    if (searchInput) searchInput.addEventListener('input', triggerSearch);

    // ── Comunidade ────────────────────────────────────────
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

// ── Language panel ────────────────────────────────────
document.addEventListener('app:ready', () => {
    const langItem = Array.from(document.querySelectorAll('#navSettingsContent .menu-item'))
        .find(el => el.textContent.trim() === 'Language');

    if (langItem) {
        langItem.addEventListener('click', () => {
            const settings = document.getElementById('navSettingsContent');
            const lang     = document.getElementById('navLanguageContent');
            if (settings) { settings.classList.remove('slide-in'); settings.style.pointerEvents = 'none'; }
            if (lang)     lang.classList.add('slide-in');
        });
    }

    document.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.lang-item').forEach(i => i.classList.remove('lang-item--active'));
            item.classList.add('lang-item--active');
            const lang = item.dataset.lang;
            document.documentElement.lang = lang;
            localStorage.setItem('matzon-lang', lang);
            setTimeout(() => {
                const langPanel = document.getElementById('navLanguageContent');
                const settings  = document.getElementById('navSettingsContent');
                if (langPanel) langPanel.classList.remove('slide-in');
                if (settings)  { settings.classList.add('slide-in'); settings.style.pointerEvents = 'auto'; }
            }, 600);
        });
    });

    const saved = localStorage.getItem('matzon-lang');
    if (saved) {
        document.querySelectorAll('.lang-item').forEach(i => {
            i.classList.toggle('lang-item--active', i.dataset.lang === saved);
        });
        document.documentElement.lang = saved;
    }
});
