// MATZON - tournaments.js
'use strict';

document.addEventListener('app:ready', () => {

    let data        = [];
    let youAvatar   = 'https://randomuser.me/api/portraits/men/1.jpg';
    let youGamertag = 'AlexTactical';

    fetch('data/player.json')
        .then(r => r.json())
        .then(json => {
            youAvatar   = json.player.avatar   || youAvatar;
            youGamertag = json.player.gamertag || youGamertag;
        });

    fetch('data/tournaments.json')
        .then(r => r.json())
        .then(json => { data = json.tournaments; render(data); })
        .catch(err => console.error('Tournaments load error:', err));

    const images = {
        't001': 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=600',
        't002': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600',
        't003': 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=600',
        't004': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=600',
        't005': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600',
    };

    // ── Avatar stack ──────────────────────────────────────
    function avatarStack(participants, playerJoined, filled) {
        const show  = participants.slice(0, 3);
        const extra = filled - show.length - (playerJoined ? 1 : 0);
        const youImg = playerJoined
            ? `<img src="${youAvatar}" style="width:16px;height:16px;border-radius:50%;object-fit:cover;border:1px solid var(--accent-orange);margin-right:-4px;flex-shrink:0;">`
            : '';
        const imgs = show.map(p =>
            `<img src="${p.avatar}" style="width:16px;height:16px;border-radius:50%;object-fit:cover;border:1px solid var(--bg-card);margin-right:-4px;flex-shrink:0;" onerror="this.style.display='none'">`
        ).join('');
        const more = extra > 0
            ? `<span style="font-size:9px;font-weight:700;color:var(--text-muted);margin-left:8px;">+${extra}</span>`
            : '';
        return `<span style="display:inline-flex;align-items:center;">${youImg}${imgs}${more}</span>`;
    }

    // ── Render lista de cards ─────────────────────────────
    function render(list) {
        const container = document.getElementById('tournament-join-list');
        if (!container) return;

        const featured = `
        <div class="news-item js-trn-open" data-id="t001" style="cursor:pointer;">
            <div class="news-img" style="background-image:url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300');">
                <div class="link-icon">
                    <svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z" fill="white"/></svg>
                </div>
            </div>
            <div class="news-content">
                <p><strong>MATZON NATIONS LEAGUE</strong> Starting tomorrow with AFRICA, ASIA (WEST) &amp; EUROPE on CONSOLE! Follow the competition here</p>
                <div class="news-meta">
                    2 DAYS AGO &nbsp;•&nbsp;
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/EFootball_logo.svg" alt="efoot" style="background:blue;padding:1px;height:12px;">
                    &nbsp;•&nbsp;
                    <span class="author">BY MATZON</span>
                </div>
            </div>
        </div>`;

        const cards = list.map(t => {
            const filled    = t.slots - t.slotsLeft;
            const statusKey = t.slotsLeft === 0 ? 'full' : t.status;
            const statusLabel = { open:'OPEN', ongoing:'ONGOING', full:'FULL' }[statusKey];
            const statusColor = { open:'#10b981', ongoing:'var(--accent-blue)', full:'var(--text-muted)' }[statusKey];
            const img = images[t.id] || images['t002'];

            return `
            <div class="news-item js-trn-open" data-id="${t.id}" style="cursor:pointer;${t.playerJoined ? 'border:1px solid rgba(255,122,0,0.3);' : ''}">
                <div class="news-img" style="background-image:url('${img}');">
                    <div class="link-icon">
                        <svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z" fill="white"/></svg>
                    </div>
                </div>
                <div class="news-content">
                    <p><strong>${t.name}</strong> ${t.game} · ${t.zone} · ${t.reward}</p>
                    <div class="news-meta" style="color:${statusColor};">
                        ${statusLabel} &nbsp;•&nbsp;
                        ${avatarStack(t.participants, t.playerJoined, filled)}
                        &nbsp;•&nbsp;
                        <span style="color:var(--text-muted);">${filled}/${t.slots}</span>
                    </div>
                    <div class="news-meta" style="margin-top:4px;">
                        ${t.startDate} &nbsp;•&nbsp;
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/EFootball_logo.svg"
                             alt="efoot" style="background:blue;padding:1px;">
                        &nbsp;•&nbsp;
                        <span class="author">BY MATZON</span>
                    </div>
                </div>
            </div>`;
        }).join('');

        container.innerHTML = featured + cards;

        container.querySelectorAll('.js-trn-open').forEach(card => {
            card.addEventListener('click', (e) => {
                // Não activar se clicou num botão
                if (e.target.closest('button')) return;
                openDetail(card.dataset.id);
            });
        });
    }

    // ── Overlay de detalhe ────────────────────────────────
    function openDetail(id) {
        const overlay = document.getElementById('trnDetailOverlay');
        const body    = document.getElementById('trnDetailBody');
        if (!overlay || !body) return;

        const t = data.find(x => x.id === id);
        if (!t) return;

        const filled    = t.slots - t.slotsLeft;
        const statusKey = t.slotsLeft === 0 ? 'full' : t.status;
        const statusLabel = { open:'OPEN', ongoing:'ONGOING', full:'FULL' }[statusKey];
        const statusBg    = { open:'rgba(34,197,94,0.9)', ongoing:'rgba(0,86,227,0.9)', full:'rgba(100,100,100,0.85)' }[statusKey];
        const statusTxt   = { open:'#000', ongoing:'#fff', full:'#fff' }[statusKey];
        const img = images[t.id] || images['t002'];

        // Hero
        const hero = document.getElementById('trnDetailHero');
        if (hero) hero.style.backgroundImage = `url('${img}')`;

        const statusEl = document.getElementById('trnDetailStatus');
        if (statusEl) {
            statusEl.textContent      = statusLabel;
            statusEl.style.background = statusBg;
            statusEl.style.color      = statusTxt;
        }

        const nameEl = document.getElementById('trnDetailName');
        if (nameEl) nameEl.textContent = t.name;

        const subEl = document.getElementById('trnDetailSub');
        if (subEl) subEl.textContent = `${t.game}  ·  ${t.zone}`;

        const titleEl = document.getElementById('trnDetailTitle');
        if (titleEl) titleEl.textContent = t.name;

        // Botão JOIN
        let joinBtnHtml = '';
        if (t.playerJoined) {
            joinBtnHtml = `<button id="trnDetailJoinBtn" data-id="${t.id}" style="width:100%;padding:16px;border-radius:12px;background:transparent;color:#22c55e;font-family:var(--font-body);font-size:14px;font-weight:800;border:1px solid rgba(34,197,94,0.3);cursor:pointer;">REGISTERED — TAP TO LEAVE</button>`;
        } else if (t.status === 'open' && t.slotsLeft > 0) {
            joinBtnHtml = `<button id="trnDetailJoinBtn" data-id="${t.id}" style="width:100%;padding:16px;border-radius:12px;background:var(--accent-blue);color:#fff;font-family:var(--font-body);font-size:14px;font-weight:800;border:none;cursor:pointer;">JOIN TOURNAMENT</button>`;
        } else {
            joinBtnHtml = `<button disabled style="width:100%;padding:16px;border-radius:12px;background:transparent;color:var(--text-muted);font-family:var(--font-body);font-size:14px;font-weight:700;border:1px solid var(--border-color);cursor:not-allowed;">CLOSED</button>`;
        }

        // Standings
        const standingsRows = t.standings.map((s, i) => `
            <div class="standing-row ${i < 2 ? 'advancing' : ''}">
                <div class="st-left">
                    <span class="st-rank">${s.pos}</span>
                    <img src="${s.avatar}" alt="${s.name}"
                         style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;"
                         onerror="this.style.display='none'">
                    <span class="st-name">${s.name}</span>
                </div>
                <div class="st-right">
                    <span>${s.mp}</span>
                    <span>${s.gd > 0 ? '+'+s.gd : s.gd}</span>
                    <span class="st-pts">${s.pts}</span>
                </div>
            </div>`).join('');

        // Matchups
        const matchupCards = t.matchups.map(m => `
            <div class="match-card">
                <div class="match-row">
                    <div class="match-team">
                        <img src="${m.av1}" alt="${m.p1}"
                             class="m-flag" style="border-radius:50%;object-fit:cover;"
                             onerror="this.style.display='none'">
                        ${m.p1}
                    </div>
                    <div class="match-time">${m.time}</div>
                </div>
                <div class="match-row mt-12">
                    <div class="match-team">
                        <img src="${m.av2}" alt="${m.p2}"
                             class="m-flag" style="border-radius:50%;object-fit:cover;"
                             onerror="this.style.display='none'">
                        ${m.p2}
                    </div>
                    <div class="match-date">${m.date}</div>
                </div>
            </div>`).join('');

        // Participantes
        const youRow = t.playerJoined ? `
            <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border-color);">
                <img src="${youAvatar}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--accent-orange);flex-shrink:0;">
                <div>
                    <div style="font-size:13px;font-weight:700;">${youGamertag}
                        <span style="font-size:9px;font-weight:800;color:var(--accent-orange);background:rgba(255,122,0,0.12);padding:2px 6px;border-radius:4px;margin-left:6px;">YOU</span>
                    </div>
                    <div style="font-size:10px;color:#22c55e;font-weight:600;margin-top:2px;">Registered</div>
                </div>
            </div>` : '';

        const participantRows = t.participants.map(p => `
            <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border-color);">
                <img src="${p.avatar}" alt="${p.gamertag}"
                     style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--border-color);flex-shrink:0;"
                     onerror="this.style.display='none'">
                <div style="font-size:13px;font-weight:600;">${p.gamertag}</div>
            </div>`).join('');

        body.innerHTML = `
            <!-- Reward -->
            <div style="display:flex;align-items:center;gap:12px;padding:20px 16px;border-bottom:1px solid var(--border-color);">
                <div style="width:40px;height:40px;background:rgba(255,122,0,0.1);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent-orange)"><path d="M12 2L3 6V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V6L12 2Z"/></svg>
                </div>
                <div>
                    <div style="font-size:15px;font-weight:800;color:var(--accent-orange);">${t.reward}</div>
                    <div style="font-size:10px;color:var(--text-muted);font-weight:600;margin-top:2px;text-transform:uppercase;letter-spacing:0.4px;">Tournament Reward</div>
                </div>
            </div>

            <!-- Info -->
            <div style="padding:0 16px;">
                <div class="matchup-detail-row"><span>Game</span><span>${t.game}</span></div>
                <div class="matchup-detail-row"><span>Zone</span><span>${t.zone}</span></div>
                <div class="matchup-detail-row"><span>Start Date</span><span>${t.startDate}</span></div>
                <div class="matchup-detail-row"><span>Players</span><span>${filled} / ${t.slots}</span></div>
                <div class="matchup-detail-row"><span>Status</span><span style="color:${statusKey === 'open' ? '#22c55e' : statusKey === 'ongoing' ? 'var(--accent-blue)' : 'var(--text-muted)'};">${statusLabel}</span></div>
            </div>

            <!-- Standings -->
            <section class="standings-section">
                <h2 class="section-title">Standings</h2>
                <div class="table-header">
                    <div class="th-left"><span>#</span><span>PARTICIPANT</span></div>
                    <div class="th-right"><span>MP</span><span>GD</span><span>PTS</span></div>
                </div>
                <div class="standings-list">${standingsRows}</div>
                <div class="legend-box"><div class="legend-color"></div> Advancing</div>
            </section>

            <!-- Matchups -->
            <section class="matchups-section">
                <h2 class="section-title">Matchups</h2>
                <div class="match-cards">${matchupCards}</div>
            </section>

            <!-- Participantes -->
            <div style="padding:20px 16px 0;">
                <h2 class="section-title" style="margin-bottom:14px;">Participants</h2>
                ${youRow}${participantRows}
            </div>

            <!-- JOIN -->
            <div style="padding:24px 16px 8px;">${joinBtnHtml}</div>
        `;

        // Bind join/leave
        const joinBtn = document.getElementById('trnDetailJoinBtn');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                if (t.playerJoined) {
                    leave(t.id);
                } else {
                    join(t.id);
                }
                overlay.classList.remove('open');
                document.body.classList.remove('modal-open');
            });
        }

        overlay.classList.add('open');
        document.body.classList.add('modal-open');
        // Scroll ao topo do body do overlay
        body.scrollTop = 0;
    }

    // ── Fechar ────────────────────────────────────────────
    const closeBtn = document.getElementById('closeTrnDetail');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('trnDetailOverlay').classList.remove('open');
            document.body.classList.remove('modal-open');
        });
    }

    // ── Join / Leave ──────────────────────────────────────
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

    // ── Tabs ──────────────────────────────────────────────
    // Tab switching handled by competition.js

    const scroll   = document.getElementById('trnTabsScroll');
    const leftBtn  = document.querySelector('.js-trn-tab-left');
    const rightBtn = document.querySelector('.js-trn-tab-right');
    if (leftBtn  && scroll) leftBtn.addEventListener('click',  () => scroll.scrollBy({ left:-120, behavior:'smooth' }));
    if (rightBtn && scroll) rightBtn.addEventListener('click', () => scroll.scrollBy({ left: 120, behavior:'smooth' }));

    document.querySelectorAll('.js-trn-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.js-trn-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            render(f === 'all' ? data : data.filter(t => t.status === f));
        });
    });

    const btnJoin = document.getElementById('btnJoinTournament');
    if (btnJoin) {
        btnJoin.addEventListener('click', () => {
            const menuT = document.getElementById('menuTournaments');
            if (menuT) menuT.dispatchEvent(new Event('click'));
            setTimeout(() => {
                const list = document.getElementById('tournament-join-list');
                if (list) list.scrollIntoView({ behavior:'smooth' });
            }, 150);
        });
    }

    // ── Competition Hub Navigation ────────────────────────

    const allSections = ['compHub','compLeague','compChampions','compNations','compWorldCup','compOpen'];

    function showSection(id) {
        allSections.forEach(s => {
            const el = document.getElementById(s);
            if (el) el.style.display = s === id ? 'block' : 'none';
        });
        window.scrollTo(0, 0);
    }

    // My Competition cards → navegação
    const cardLeague = document.getElementById('myCardLeague');
    const cardChamp  = document.getElementById('myCardChamp');
    const cardWC     = document.getElementById('myCardWC');
    if (cardLeague) cardLeague.addEventListener('click', () => showSection('compLeague'));
    if (cardChamp)  cardChamp.addEventListener('click',  () => showSection('compChampions'));
    if (cardWC)     cardWC.addEventListener('click',     () => showSection('compWorldCup'));

    // Progression pyramid → navegação
    const pyDomestic  = document.getElementById('pyDomestic');
    const pyChampions = document.getElementById('pyChampions');
    const pyNations   = document.getElementById('pyNations');
    const pyWorldCup  = document.getElementById('pyWorldCup');
    if (pyDomestic)  pyDomestic.addEventListener('click',  () => showSection('compLeague'));
    if (pyChampions) pyChampions.addEventListener('click', () => showSection('compChampions'));
    if (pyNations)   pyNations.addEventListener('click',   () => showSection('compNations'));
    if (pyWorldCup)  pyWorldCup.addEventListener('click',  () => showSection('compWorldCup'));

    // Competition grid cards → navegação
    document.querySelectorAll('[data-goto]').forEach(el => {
        el.addEventListener('click', () => {
            const target = el.dataset.goto;
            if (target) showSection(target);
        });
    });

    // Back buttons → volta ao hub
    document.querySelectorAll('.comp-back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const back = btn.dataset.back || 'hub';
            showSection(back === 'hub' ? 'compHub' : back);
        });
    });

    // Botão do perfil → Open Events
    const btnJoinTournament = document.getElementById('btnJoinTournament');
    if (btnJoinTournament) {
        btnJoinTournament.addEventListener('click', () => {
            const menuT = document.getElementById('menuTournaments');
            if (menuT) menuT.dispatchEvent(new Event('click'));
            setTimeout(() => showSection('compOpen'), 100);
        });
    }


    // ── Competition Hub Navigation ────────────────────────

    const allSections = ['compHub','compDomestic','compLeague','compLeagueDetail','compChampions','compNations','compWorldCup','compOpen'];

    function showSection(id) {
        allSections.forEach(s => {
            const el = document.getElementById(s);
            if (el) el.style.display = s === id ? 'block' : 'none';
        });
        window.scrollTo(0, 0);
    }

    // Hub discover cards
    const hubCards = {
        'hubCardDomestic': 'compDomestic',
        'hubCardChampions': 'compChampions',
        'hubCardNations':   'compNations',
        'hubCardWorldCup':  'compWorldCup',
        'hubCardOpen':      'compOpen'
    };
    Object.entries(hubCards).forEach(([cardId, sectionId]) => {
        const el = document.getElementById(cardId);
        if (el) el.addEventListener('click', () => showSection(sectionId));
    });

    // My Competition cards
    const myCards = {
        'myCardLeague': 'compLeague',
        'myCardChamp':  'compChampions',
        'myCardWC':     'compWorldCup'
    };
    Object.entries(myCards).forEach(([cardId, sectionId]) => {
        const el = document.getElementById(cardId);
        if (el) el.addEventListener('click', () => showSection(sectionId));
    });

    // Progression pyramid
    const pyramid = {
        'pyDomestic':  'compDomestic',
        'pyChampions': 'compChampions',
        'pyNations':   'compNations',
        'pyWorldCup':  'compWorldCup'
    };
    Object.entries(pyramid).forEach(([rowId, sectionId]) => {
        const el = document.getElementById(rowId);
        if (el) el.addEventListener('click', () => showSection(sectionId));
    });

    // Back buttons
    document.querySelectorAll('.comp-back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const back = btn.dataset.back;
            if (back === 'hub' || !back) showSection('compHub');
            else showSection(back);
        });
    });

    // Botão do perfil → Open Events
    const btnJoinProfile = document.getElementById('btnJoinTournament');
    if (btnJoinProfile) {
        btnJoinProfile.addEventListener('click', () => {
            const menuT = document.getElementById('menuTournaments');
            if (menuT) menuT.dispatchEvent(new Event('click'));
            setTimeout(() => showSection('compOpen'), 100);
        });
    }

    // Iniciar sempre no hub
    showSection('compHub');


});
