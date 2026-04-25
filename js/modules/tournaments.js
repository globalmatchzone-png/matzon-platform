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
            ? `<img src="${youAvatar}" alt="You"
                    style="width:16px;height:16px;border-radius:50%;object-fit:cover;border:1px solid var(--accent-orange);margin-right:-4px;flex-shrink:0;">`
            : '';

        const imgs = show.map(p =>
            `<img src="${p.avatar}" alt="${p.gamertag}"
                  style="width:16px;height:16px;border-radius:50%;object-fit:cover;border:1px solid var(--bg-card);margin-right:-4px;flex-shrink:0;"
                  onerror="this.style.display='none'">`
        ).join('');

        const more = extra > 0
            ? `<span style="font-size:9px;font-weight:700;color:var(--text-muted);margin-left:8px;">+${extra}</span>`
            : '';

        return `<span style="display:inline-flex;align-items:center;">${youImg}${imgs}${more}</span>`;
    }

    // ── Render lista ──────────────────────────────────────
    function render(list) {
        const container = document.getElementById('tournament-join-list');
        if (!container) return;

        const featured = `
        <div class="news-item js-trn-open" data-id="featured">
            <div class="news-img" style="background-image:url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300');">
                <div class="link-icon">
                    <svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z" fill="white"/></svg>
                </div>
            </div>
            <div class="news-content">
                <p><strong>MATZON NATIONS LEAGUE</strong> Starting tomorrow with AFRICA, ASIA (WEST) &amp; EUROPE on CONSOLE! Follow the competition here</p>
                <div class="news-meta">
                    2 DAYS AGO &nbsp;•&nbsp;
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/EFootball_logo.svg" alt="eFootball" style="background:blue;padding:1px;height:12px;">
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
            <div class="news-item js-trn-open" data-id="${t.id}"
                 style="${t.playerJoined ? 'border:1px solid rgba(255,122,0,0.3);' : ''}">
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

        // Clique em qualquer card → abre detalhe
        container.querySelectorAll('.js-trn-open').forEach(card => {
            card.addEventListener('click', () => openDetail(card.dataset.id));
        });
    }

    // ── Abrir overlay de detalhe ──────────────────────────
    function openDetail(id) {
        const overlay = document.getElementById('trnDetailOverlay');
        if (!overlay) return;

        if (id === 'featured') {
            // Abre com dados do t001
            id = 't001';
        }

        const t = data.find(x => x.id === id);
        if (!t) return;

        const filled    = t.slots - t.slotsLeft;
        const statusKey = t.slotsLeft === 0 ? 'full' : t.status;
        const statusLabel = { open:'OPEN', ongoing:'ONGOING', full:'FULL' }[statusKey];
        const statusBg    = { open:'rgba(34,197,94,0.9)', ongoing:'rgba(0,86,227,0.9)', full:'rgba(100,100,100,0.9)' }[statusKey];
        const statusTxt   = { open:'#000', ongoing:'#fff', full:'#fff' }[statusKey];
        const img = images[t.id] || images['t002'];

        // Hero
        const hero = document.getElementById('trnDetailHero');
        if (hero) hero.style.backgroundImage = `url('${img}')`;

        const statusEl = document.getElementById('trnDetailStatus');
        if (statusEl) {
            statusEl.textContent   = statusLabel;
            statusEl.style.background = statusBg;
            statusEl.style.color      = statusTxt;
        }

        setText('trnDetailName',       t.name);
        setText('trnDetailSub',        `${t.game}  ·  ${t.zone}`);
        setText('trnDetailReward',     t.reward);
        setText('trnDetailGame',       t.game);
        setText('trnDetailZone',       t.zone);
        setText('trnDetailDate',       t.startDate);
        setText('trnDetailSlots',      `${filled} / ${t.slots} players`);
        setText('trnDetailStatusText', statusLabel);

        // Participantes
        const pList = document.getElementById('trnDetailParticipants');
        if (pList) {
            const youRow = t.playerJoined ? `
                <div style="display:flex;align-items:center;gap:12px;">
                    <img src="${youAvatar}" alt="You"
                         style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--accent-orange);flex-shrink:0;">
                    <div>
                        <div style="font-size:13px;font-weight:700;">${youGamertag} <span style="font-size:9px;font-weight:800;color:var(--accent-orange);background:rgba(255,122,0,0.12);padding:2px 6px;border-radius:4px;">YOU</span></div>
                        <div style="font-size:10px;color:var(--text-muted);font-weight:600;margin-top:2px;">Registered</div>
                    </div>
                </div>` : '';

            const rows = t.participants.map(p => `
                <div style="display:flex;align-items:center;gap:12px;">
                    <img src="${p.avatar}" alt="${p.gamertag}"
                         style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--border-color);flex-shrink:0;"
                         onerror="this.style.display='none'">
                    <div style="font-size:13px;font-weight:600;">${p.gamertag}</div>
                </div>`).join('');

            pList.innerHTML = youRow + rows;
        }

        // Botão JOIN/REGISTERED/CLOSED
        const joinBtn = document.getElementById('trnDetailJoinBtn');
        if (joinBtn) {
            if (t.playerJoined) {
                joinBtn.textContent   = 'REGISTERED';
                joinBtn.style.background = 'transparent';
                joinBtn.style.color      = '#22c55e';
                joinBtn.style.border     = '1px solid rgba(34,197,94,0.3)';
                joinBtn.onclick = () => { leave(t.id); overlay.classList.remove('open'); document.body.classList.remove('modal-open'); };
            } else if (t.status === 'open' && t.slotsLeft > 0) {
                joinBtn.textContent   = 'JOIN TOURNAMENT';
                joinBtn.style.background = 'var(--accent-blue)';
                joinBtn.style.color      = '#fff';
                joinBtn.style.border     = 'none';
                joinBtn.onclick = () => { join(t.id); overlay.classList.remove('open'); document.body.classList.remove('modal-open'); };
            } else {
                joinBtn.textContent   = 'CLOSED';
                joinBtn.style.background = 'transparent';
                joinBtn.style.color      = 'var(--text-muted)';
                joinBtn.style.border     = '1px solid var(--border-color)';
                joinBtn.onclick = null;
            }
        }

        overlay.classList.add('open');
        document.body.classList.add('modal-open');
    }

    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    // ── Fechar overlay ────────────────────────────────────
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
    document.querySelectorAll('.js-trn-main-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.js-trn-main-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.trn-panel').forEach(p => p.style.display = 'none');
            tab.classList.add('active');
            const panel = document.getElementById(tab.dataset.target);
            if (panel) panel.style.display = 'block';
        });
    });

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

});
