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
    const headerBackBtn      = document.getElementById('headerBackBtn');
    const headerProfileTitle = document.getElementById('headerProfileTitle');
    const btnGoTournaments   = document.getElementById('btnGoTournaments');
    const menuTournaments    = document.getElementById('menuTournaments');
    const menuProfile        = document.getElementById('menuProfile');
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

    function closeMenu() {
        if (sideMenu) sideMenu.classList.remove('open');
        if (menuBtn)  menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8a96a6"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
        document.body.classList.remove('modal-open');
    }

    // Views
    function showDashboard() {
        hideAllViews();
        if (dashboardView) dashboardView.style.display = 'block';
        setHeaderDefault();
        setActiveMenu(menuProfile);
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
    if (menuProfile)      menuProfile.addEventListener('click', showProfile);
    if (menuRanking)      menuRanking.addEventListener('click', showRanking);
    if (menuComunidade)   menuComunidade.addEventListener('click', showCommunity);
    if (menuChat)         menuChat.addEventListener('click', showCommunity);
    if (logoMatzon)       logoMatzon.addEventListener('click', showDashboard);

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
