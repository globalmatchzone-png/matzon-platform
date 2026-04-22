document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // HEADER SCROLL HIDE/SHOW LOGIC
    // =========================================
    let lastScrollTop = 0;
    const headerEl = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 60) {
            if(headerEl) headerEl.classList.add('header--hidden');
        } else {
            if(headerEl) headerEl.classList.remove('header--hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // =========================================
    // LÓGICA DO PERFIL (TABS E PROGRESS BARS)
    // =========================================
    const prfTabs = document.querySelectorAll('.js-prf-tab');
    prfTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active das tabs do perfil
            prfTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.prf-panel').forEach(p => p.classList.remove('active'));
            
            // Ativa tab e painel clicado
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const panel = document.getElementById(targetId);
            
            if (panel) {
                panel.classList.add('active');
                // Re-anima as barras de progresso ao abrir a aba correspondente
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

    // Iniciar barras no 1º load da página
    const initialFills = document.querySelectorAll('.prf-panel.active .prf-bar-fill');
    initialFills.forEach(fill => {
        const target = fill.dataset.width + '%';
        fill.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            fill.style.width = target;
        }));
    });

    // =========================================
    // MENU HAMBÚRGUER E SIDEBAR
    // =========================================
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    
    function closeMenu() {
        if(sideMenu) sideMenu.classList.remove('open');
        if(menuBtn) {
            menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-muted"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>';
        }
        document.body.classList.remove('modal-open'); 
    }

    if (menuBtn && sideMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = sideMenu.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-muted"><path d="M18 6L6 18M6 6l12 12"/></svg>';
                sideMenu.classList.add('open');
                document.body.classList.add('modal-open'); 
            }
        });
    }

    // Fecha o menu ao clicar num item da lista
    const menuItemsList = document.querySelectorAll('.menu-item');
    menuItemsList.forEach(item => {
        item.addEventListener('click', () => {
            menuItemsList.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            closeMenu();
        });
    });
});
