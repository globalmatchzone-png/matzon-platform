// MATZON - router.js
// Routing, hamburger, comunidade
'use strict';

document.addEventListener('DOMContentLoaded', () => {

// Header Scroll

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

// Routing

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

// Menu Hamburguer

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

// Comunidade

// Comunidade
    const menuComunidade    = document.getElementById('menuComunidade');
    const communityWrapper  = document.getElementById('communityWrapper');
    const communityListView = document.getElementById('communityListView');
    const commChatView      = document.getElementById('commChatView');
    const commGroupInfoView = document.getElementById('commGroupInfoView');
    const commBackToMainBtn = document.getElementById('commBackToMainBtn');
    const commBackToListBtn = document.getElementById('commBackToListBtn');
    const openGroupInfoBtn  = document.getElementById('openGroupInfoBtn');
    const openGroupInfoBtn2 = document.getElementById('openGroupInfoBtn2');
    const closeGroupInfoBtn = document.getElementById('closeGroupInfoBtn');
    const commMenuToggleBtn = document.getElementById('commMenuToggleBtn');
    const commDropdown      = document.getElementById('commDropdown');

    function showCommunity() {
        if (dashboardView)    dashboardView.style.display    = 'none';
        if (tournamentsView)  tournamentsView.style.display  = 'none';
        if (profileView)      profileView.style.display      = 'none';
        setHeaderDefault();
        if (headerEl) headerEl.style.display = 'none';
        communityWrapper.style.display = 'flex';
        communityListView.style.display = 'flex';
        commChatView.style.display = 'none';
        commGroupInfoView.style.display = 'none';
        window.scrollTo(0, 0);
        menuItems.forEach(el => el.classList.remove('active'));
        if (menuComunidade) menuComunidade.classList.add('active');
        closeMenu();
    }

    function hideCommunity() {
        communityWrapper.style.display = 'none';
        if (headerEl) headerEl.style.display = '';
        showDashboard();
    }

    if (menuComunidade)    menuComunidade.addEventListener('click', showCommunity);
    if (commBackToMainBtn) commBackToMainBtn.addEventListener('click', hideCommunity);

    document.querySelectorAll('.js-open-chat').forEach(item => {
        item.addEventListener('click', () => {
            communityListView.style.display = 'none';
            commChatView.style.display = 'flex';
            const body = document.getElementById('commChatBody');
            if (body) body.scrollTop = body.scrollHeight;
        });
    });

    if (commBackToListBtn) {
        commBackToListBtn.addEventListener('click', () => {
            commChatView.style.display = 'none';
            communityListView.style.display = 'flex';
        });
    }

    [openGroupInfoBtn, openGroupInfoBtn2].forEach(btn => {
        if (btn) btn.addEventListener('click', () => {
            commGroupInfoView.style.display = 'block';
        });
    });

    if (closeGroupInfoBtn) {
        closeGroupInfoBtn.addEventListener('click', () => {
            commGroupInfoView.style.display = 'none';
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
