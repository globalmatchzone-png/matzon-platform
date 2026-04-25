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

    // Imagens por torneio
    const images = {
        't001': 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=300',
        't002': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300',
        't003': 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=300',
        't004': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=300',
        't005': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300',
    };

    function avatarStack(participants, playerJoined, filled, slots) {
        const show  = participants.slice(0, 3);
        const extra = filled - show.length - (playerJoined ? 1 : 0);

        const youImg = playerJoined
            ? `<img src="${youAvatar}" alt="You" class="trn-avatar trn-avatar--you" title="${youGamertag}">`
            : '';

        const imgs = show.map(p =>
            `<img src="${p.avatar}" alt="${p.gamertag}" class="trn-avatar" title="${p.gamertag}"
                  onerror="this.style.display='none'">`
        ).join('');

        const more = extra > 0
            ? `<div class="trn-avatar trn-avatar--more">+${extra}</div>`
            : '';

        return `<div class="trn-avatar-stack">${youImg}${imgs}${more}</div>`;
    }

    function render(list) {
        const container = document.getElementById('tournament-join-list');
        if (!container) return;

        container.innerHTML = list.map(t => {
            const filled   = t.slots - t.slotsLeft;
            const isOpen   = t.status === 'open' && t.slotsLeft > 0;
            const statusKey = t.slotsLeft === 0 ? 'full' : t.status;

            const statusLabel = { open:'OPEN', ongoing:'ONGOING', full:'FULL' }[statusKey];
            const statusCls   = { open:'trn-news-status--open', ongoing:'trn-news-status--ongoing', full:'trn-news-status--full' }[statusKey];

            let actionBtn = '';
            if (t.playerJoined) {
                actionBtn = `<button class="trn-btn-joined" data-id="${t.id}">REGISTERED</button>`;
            } else if (isOpen) {
                actionBtn = `<button class="trn-btn-join" data-id="${t.id}">JOIN</button>`;
            } else {
                actionBtn = `<button class="trn-btn-closed" disabled>CLOSED</button>`;
            }

            const img = images[t.id] || images['t002'];

            return `
            <div class="trn-news-card ${t.playerJoined ? 'trn-card--joined' : ''}" id="trn-card-${t.id}">
                <div class="trn-news-img" style="background-image:url('${img}');">
                    <span class="trn-news-status ${statusCls}">${statusLabel}</span>
                </div>
                <div class="trn-news-body">
                    <p class="trn-news-title"><strong>${t.name}</strong></p>
                    <p class="trn-news-reward">${t.reward}</p>
                    <div class="trn-news-players">
                        ${avatarStack(t.participants, t.playerJoined, filled, t.slots)}
                        <span class="trn-news-count">${filled} / ${t.slots}</span>
                    </div>
                    <div class="trn-news-meta">
                        ${t.startDate}
                        &nbsp;·&nbsp;
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/EFootball_logo.svg"
                             alt="eFootball" style="height:10px;background:blue;padding:1px;border-radius:1px;vertical-align:middle;">
                        &nbsp;·&nbsp;
                        <span>${t.zone}</span>
                    </div>
                    ${actionBtn}
                </div>
            </div>`;
        }).join('');

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

    // Tabs
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
