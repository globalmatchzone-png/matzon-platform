// MATZON - tournaments.js
'use strict';

document.addEventListener('app:ready', () => {

    let data = [];

    fetch('data/tournaments.json')
        .then(r => r.json())
        .then(json => { data = json.tournaments; render(data); })
        .catch(err => console.error('Tournaments load error:', err));

    function render(list) {
        const container = document.getElementById('tournament-join-list');
        if (!container) return;

        container.innerHTML = list.map(t => {
            const filled = t.slots - t.slotsLeft;
            const pct    = Math.round((filled / t.slots) * 100);
            const isOpen = t.status === 'open' && t.slotsLeft > 0;

            const statusDot   = `trn-status-dot--${t.slotsLeft === 0 ? 'full' : t.status}`;
            const statusLabel = t.slotsLeft === 0 ? 'FULL' : t.status.toUpperCase();
            const statusClass = `trn-status-label--${t.slotsLeft === 0 ? 'full' : t.status}`;
            const fillClass   = t.slotsLeft === 0 ? 'trn-slots-fill trn-slots-fill--full' : 'trn-slots-fill';

            let actionBtn = '';
            if (t.playerJoined) {
                actionBtn = `<button class="trn-btn-joined" data-id="${t.id}">REGISTERED</button>`;
            } else if (isOpen) {
                actionBtn = `<button class="trn-btn-join" data-id="${t.id}">JOIN</button>`;
            } else {
                actionBtn = `<button class="trn-btn-closed" disabled>CLOSED</button>`;
            }

            return `
            <div class="trn-card ${t.playerJoined ? 'trn-card--joined' : ''}" id="trn-card-${t.id}">
                <div class="trn-card-header">
                    <div>
                        <div class="trn-card-title">${t.name}</div>
                        <div class="trn-card-meta">${t.game}&nbsp;&nbsp;·&nbsp;&nbsp;${t.zone}</div>
                    </div>
                    <div class="trn-status">
                        <div class="trn-status-dot ${statusDot}"></div>
                        <span class="trn-status-label ${statusClass}">${statusLabel}</span>
                    </div>
                </div>

                <div class="trn-reward-row">
                    <div class="trn-reward-icon">
                        <svg viewBox="0 0 24 24"><path d="M12 2L3 6V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V6L12 2Z"/></svg>
                    </div>
                    <span class="trn-reward-text">${t.reward}</span>
                </div>

                <div class="trn-slots-row">
                    <div class="trn-slots-track">
                        <div class="${fillClass}" style="width:${pct}%"></div>
                    </div>
                    <span class="trn-slots-label">${filled} / ${t.slots}</span>
                </div>

                <div class="trn-card-footer">
                    <span class="trn-start-date">${t.startDate}</span>
                    ${actionBtn}
                </div>
            </div>`;
        }).join('');

        bindButtons(container);
    }

    function bindButtons(container) {
        container.querySelectorAll('.trn-btn-join').forEach(btn => {
            btn.addEventListener('click', () => join(btn.dataset.id));
        });
        container.querySelectorAll('.trn-btn-joined').forEach(btn => {
            btn.addEventListener('click', () => leave(btn.dataset.id));
        });
    }

    function join(id) {
        const t = data.find(x => x.id === id);
        if (!t || t.playerJoined || t.slotsLeft === 0) return;
        t.playerJoined = true;
        t.slotsLeft    = Math.max(0, t.slotsLeft - 1);
        render(data);
        document.dispatchEvent(new CustomEvent('player:joined-tournament', { detail: t }));
    }

    function leave(id) {
        const t = data.find(x => x.id === id);
        if (!t || !t.playerJoined) return;
        t.playerJoined = false;
        t.slotsLeft    = Math.min(t.slots, t.slotsLeft + 1);
        render(data);
    }

    // Tabs principais da página
    document.querySelectorAll('.js-trn-main-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.js-trn-main-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.trn-panel').forEach(p => p.style.display = 'none');
            tab.classList.add('active');
            const panel = document.getElementById(tab.dataset.target);
            if (panel) panel.style.display = 'block';
        });
    });

    // Tab arrows scroll
    const scroll = document.getElementById('trnTabsScroll');
    const leftBtn  = document.querySelector('.js-trn-tab-left');
    const rightBtn = document.querySelector('.js-trn-tab-right');
    if (leftBtn  && scroll) leftBtn.addEventListener('click',  () => scroll.scrollBy({ left: -120, behavior: 'smooth' }));
    if (rightBtn && scroll) rightBtn.addEventListener('click', () => scroll.scrollBy({ left:  120, behavior: 'smooth' }));

    // Filtros
    document.querySelectorAll('.js-trn-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.js-trn-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            render(f === 'all' ? data : data.filter(t => t.status === f));
        });
    });

    // CTA do perfil → navega para Open Events
    const btnJoin = document.getElementById('btnJoinTournament');
    if (btnJoin) {
        btnJoin.addEventListener('click', () => {
            const menuT = document.getElementById('menuTournaments');
            if (menuT) menuT.dispatchEvent(new Event('click'));
            setTimeout(() => {
                const list = document.getElementById('tournament-join-list');
                if (list) list.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        });
    }

});
