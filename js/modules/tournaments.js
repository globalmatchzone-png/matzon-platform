// MATZON - tournaments.js
// Lista de torneios, join/leave, ligação com perfil
'use strict';

document.addEventListener('app:ready', () => {

    let tournamentsData = [];

    fetch('data/tournaments.json')
        .then(r => r.json())
        .then(data => {
            tournamentsData = data.tournaments;
            renderTournamentList(tournamentsData);
        })
        .catch(err => console.error('Tournaments load error:', err));

    function renderTournamentList(list) {
        const container = document.getElementById('tournament-join-list');
        if (!container) return;

        container.innerHTML = list.map(t => {
            const isOpen    = t.status === 'open';
            const isOngoing = t.status === 'ongoing';
            const isFull    = t.slotsLeft === 0;
            const pct       = Math.round(((t.slots - t.slotsLeft) / t.slots) * 100);

            let statusBadge = '';
            if (isOngoing) statusBadge = `<span class="trn-badge trn-badge-ongoing">ONGOING</span>`;
            else if (isFull) statusBadge = `<span class="trn-badge trn-badge-full">FULL</span>`;
            else statusBadge = `<span class="trn-badge trn-badge-open">OPEN</span>`;

            let actionBtn = '';
            if (t.playerJoined) {
                actionBtn = `<button class="trn-btn-joined" data-id="${t.id}">✓ JOINED</button>`;
            } else if (isOpen && !isFull) {
                actionBtn = `<button class="trn-btn-join" data-id="${t.id}">JOIN</button>`;
            } else {
                actionBtn = `<button class="trn-btn-disabled" disabled>CLOSED</button>`;
            }

            return `
            <div class="trn-card" id="trn-card-${t.id}">
                <div class="trn-card-top">
                    <div class="trn-info">
                        <div class="trn-name">${t.name}</div>
                        <div class="trn-meta">${t.game} · ${t.zone} · ${t.startDate}</div>
                    </div>
                    ${statusBadge}
                </div>
                <div class="trn-reward">🏆 ${t.reward}</div>
                <div class="trn-slots-row">
                    <div class="trn-slots-track">
                        <div class="trn-slots-fill" style="width:${pct}%"></div>
                    </div>
                    <span class="trn-slots-label">${t.slots - t.slotsLeft}/${t.slots} players</span>
                </div>
                <div class="trn-card-bottom">
                    ${actionBtn}
                </div>
            </div>`;
        }).join('');

        // Bind join buttons
        container.querySelectorAll('.trn-btn-join').forEach(btn => {
            btn.addEventListener('click', () => handleJoin(btn.dataset.id));
        });

        container.querySelectorAll('.trn-btn-joined').forEach(btn => {
            btn.addEventListener('click', () => handleLeave(btn.dataset.id));
        });
    }

    function handleJoin(id) {
        const t = tournamentsData.find(x => x.id === id);
        if (!t || t.playerJoined || t.slotsLeft === 0) return;

        t.playerJoined = true;
        t.slotsLeft    = Math.max(0, t.slotsLeft - 1);

        // Feedback visual imediato
        const btn = document.querySelector(`#trn-card-${id} .trn-btn-join`);
        if (btn) {
            btn.textContent  = '✓ JOINED';
            btn.className    = 'trn-btn-joined';
            btn.dataset.id   = id;
            btn.addEventListener('click', () => handleLeave(id));

            // Flash animation
            const card = document.getElementById(`trn-card-${id}`);
            if (card) {
                card.style.borderColor = '#4ade80';
                setTimeout(() => { card.style.borderColor = ''; }, 1000);
            }
        }

        // Actualiza barra de slots
        const pct = Math.round(((t.slots - t.slotsLeft) / t.slots) * 100);
        const fill  = document.querySelector(`#trn-card-${id} .trn-slots-fill`);
        const label = document.querySelector(`#trn-card-${id} .trn-slots-label`);
        if (fill)  fill.style.width = pct + '%';
        if (label) label.textContent = `${t.slots - t.slotsLeft}/${t.slots} players`;

        // Dispara evento para o loop core
        document.dispatchEvent(new CustomEvent('player:joined-tournament', { detail: t }));
    }

    function handleLeave(id) {
        const t = tournamentsData.find(x => x.id === id);
        if (!t || !t.playerJoined) return;

        t.playerJoined = false;
        t.slotsLeft    = Math.min(t.slots, t.slotsLeft + 1);
        renderTournamentList(tournamentsData);
    }

    // CTA do perfil → scroll para lista de join
    const btnJoin = document.getElementById('btnJoinTournament');
    if (btnJoin) {
        btnJoin.addEventListener('click', () => {
            // Navega para tournaments via evento global
            document.dispatchEvent(new CustomEvent('nav:goto', { detail: 'tournaments' }));
            setTimeout(() => {
                const list = document.getElementById('tournament-join-list');
                if (list) list.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });
    }

    // Filtro de estado
    document.querySelectorAll('.js-trn-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.js-trn-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            if (filter === 'all') {
                renderTournamentList(tournamentsData);
            } else {
                renderTournamentList(tournamentsData.filter(t => t.status === filter));
            }
        });
    });

});
