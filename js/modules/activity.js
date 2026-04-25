// MATZON - activity.js
// Simula ambiente multiplayer: feed, jogadores online, partidas recentes
'use strict';

document.addEventListener('app:ready', () => {

    // ── Dados simulados ────────────────────────────────────
    const PLAYERS = [
        { id:'p010', name:'ShadowStrike',  nation:'br', rank:1  },
        { id:'p011', name:'NeonBlitz',     nation:'kr', rank:2  },
        { id:'p012', name:'IronWall',      nation:'de', rank:3  },
        { id:'p013', name:'PacificEdge',   nation:'jp', rank:4  },
        { id:'p014', name:'VoltDrive',     nation:'ar', rank:5  },
        { id:'p015', name:'ColdFront',     nation:'pl', rank:6  },
        { id:'p016', name:'TacticalX',     nation:'ma', rank:7  },
        { id:'p017', name:'RedShift',      nation:'tr', rank:8  },
        { id:'p018', name:'SilentAce',     nation:'ng', rank:9  },
        { id:'p019', name:'DuskHunter',    nation:'mx', rank:10 },
        { id:'p020', name:'GridLock',      nation:'it', rank:11 },
        { id:'p021', name:'ApexPulse',     nation:'eg', rank:12 },
        { id:'p022', name:'NorthStar',     nation:'ca', rank:13 },
        { id:'p023', name:'StormCore',     nation:'gh', rank:14 },
        { id:'p024', name:'PhaseShift',    nation:'pt', rank:15 },
    ];

    const TOURNAMENTS = [
        'Nations League', 'Open Series', 'Weekend Blitz',
        'Rocket Cup', 'Asia Cup', 'Euro Qualifier'
    ];

    const YOU = { id:'p001', name:'AlexTactical', nation:'fr', rank:18 };

    // ── Estado ─────────────────────────────────────────────
    const state = {
        feed:    [],
        online:  {},
        matches: [],
        youPts:  980,
        youRank: 18,
    };

    // Inicializar status de todos os jogadores
    PLAYERS.forEach(p => {
        state.online[p.id] = randomStatus();
    });

    // ── Utilitários ────────────────────────────────────────
    function rand(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomStatus() {
        const r = Math.random();
        if (r < 0.45) return 'online';
        if (r < 0.75) return 'playing';
        return 'offline';
    }

    function timeAgo(seconds) {
        if (seconds < 60)  return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
        return `${Math.floor(seconds/3600)}h ago`;
    }

    function pushFeed(event) {
        event.ts = Date.now();
        state.feed.unshift(event);
        if (state.feed.length > 8) state.feed.pop();
        renderFeed();
    }

    // ── Eventos do feed ────────────────────────────────────
    function genJoinEvent() {
        const p = rand(PLAYERS);
        const t = rand(TOURNAMENTS);
        return { type:'join', player:p, tournament:t,
            text:`${p.name} joined ${t}` };
    }

    function genRankEvent() {
        const p = rand(PLAYERS.slice(0, 10));
        const jump = randInt(1, 4);
        const newRank = Math.max(1, p.rank - jump);
        return { type:'rank', player:p, jump,
            text:`${p.name} reached rank #${newRank}` };
    }

    function genMatchEvent() {
        const p1 = rand(PLAYERS);
        let p2 = rand(PLAYERS);
        while (p2.id === p1.id) p2 = rand(PLAYERS);
        const score1 = randInt(0, 5);
        const score2 = randInt(0, score1);
        state.matches.unshift({
            winner: p1, loser: p2,
            score: `${score1} - ${score2}`,
            ts: Date.now()
        });
        if (state.matches.length > 6) state.matches.pop();
        renderMatches();
        return { type:'match', player:p1,
            text:`${p1.name} defeated ${p2.name} (${score1}-${score2})` };
    }

    function genYouEvent(pts, oldRank, newRank) {
        const moved = oldRank - newRank;
        const rankStr = moved > 0
            ? `Rank ${oldRank} → ${newRank} (↑${moved})`
            : `Rank ${newRank}`;
        return { type:'you', pts, rankStr,
            text:`You gained +${pts} pts · ${rankStr}` };
    }

    // ── Renders ────────────────────────────────────────────

    // Feed
    function renderFeed() {
        const container = document.getElementById('act-feed-list');
        if (!container) return;

        container.innerHTML = state.feed.map(e => {
            const age = Math.floor((Date.now() - e.ts) / 1000);
            const isYou = e.type === 'you';

            let dot = '';
            if (e.type === 'join')  dot = 'act-dot--blue';
            if (e.type === 'rank')  dot = 'act-dot--orange';
            if (e.type === 'match') dot = 'act-dot--muted';
            if (e.type === 'you')   dot = 'act-dot--orange';

            const flag = e.player
                ? `<img src="https://flagcdn.com/w40/${e.player.nation}.png" class="act-flag" alt="">`
                : '';

            return `
            <div class="act-feed-item ${isYou ? 'act-feed-item--you' : ''}">
                <div class="act-dot ${dot}"></div>
                ${flag}
                <span class="act-feed-text">${e.text}</span>
                <span class="act-feed-time">${timeAgo(age)}</span>
            </div>`;
        }).join('');
    }

    // Online players
    function renderOnline() {
        const container = document.getElementById('act-online-list');
        if (!container) return;

        const sorted = [...PLAYERS]
            .map(p => ({ ...p, status: state.online[p.id] }))
            .sort((a, b) => {
                const order = { playing:0, online:1, offline:2 };
                return order[a.status] - order[b.status];
            })
            .slice(0, 8);

        const count = Object.values(state.online)
            .filter(s => s !== 'offline').length;

        const countEl = document.getElementById('act-online-count');
        if (countEl) countEl.textContent = count + ' online';

        container.innerHTML = sorted.map(p => {
            const dotClass = p.status === 'playing' ? 'act-status--playing'
                           : p.status === 'online'  ? 'act-status--online'
                           : 'act-status--offline';
            const label = p.status === 'playing' ? 'Playing' : p.status;

            return `
            <div class="act-player-row">
                <div class="act-player-flag-wrap">
                    <img src="https://flagcdn.com/w40/${p.nation}.png" class="act-flag" alt="">
                    <div class="act-status-dot ${dotClass}"></div>
                </div>
                <div class="act-player-info">
                    <span class="act-player-name">${p.name}</span>
                    <span class="act-player-status">${label}</span>
                </div>
                <span class="act-player-rank">#${p.rank}</span>
            </div>`;
        }).join('');
    }

    // Partidas recentes
    function renderMatches() {
        const container = document.getElementById('act-matches-list');
        if (!container) return;
        if (state.matches.length === 0) {
            container.innerHTML = '<div class="act-empty">No recent matches</div>';
            return;
        }

        container.innerHTML = state.matches.slice(0, 5).map(m => {
            const age = Math.floor((Date.now() - m.ts) / 1000);
            return `
            <div class="act-match-row">
                <div class="act-match-teams">
                    <div class="act-match-winner">
                        <img src="https://flagcdn.com/w40/${m.winner.nation}.png" class="act-flag" alt="">
                        <span>${m.winner.name}</span>
                    </div>
                    <span class="act-match-score">${m.score}</span>
                    <div class="act-match-loser">
                        <span>${m.loser.name}</span>
                        <img src="https://flagcdn.com/w40/${m.loser.nation}.png" class="act-flag" alt="">
                    </div>
                </div>
                <span class="act-feed-time">${timeAgo(age)}</span>
            </div>`;
        }).join('');
    }

    // ── Simulação automática ───────────────────────────────
    function simulate() {
        const r = Math.random();
        if (r < 0.40) pushFeed(genJoinEvent());
        else if (r < 0.65) pushFeed(genRankEvent());
        else pushFeed(genMatchEvent());
    }

    function updateStatuses() {
        PLAYERS.forEach(p => {
            if (Math.random() < 0.2) {
                state.online[p.id] = randomStatus();
            }
        });
        renderOnline();
    }

    // ── Arranque ───────────────────────────────────────────

    // Seed inicial
    for (let i = 0; i < 5; i++) {
        const r = Math.random();
        if (r < 0.4)      state.feed.push({ ...genJoinEvent(),  ts: Date.now() - randInt(30,300)*1000 });
        else if (r < 0.7) state.feed.push({ ...genRankEvent(),  ts: Date.now() - randInt(30,300)*1000 });
        else              state.feed.push({ ...genMatchEvent(),  ts: Date.now() - randInt(30,300)*1000 });
    }

    // Seed partidas
    for (let i = 0; i < 4; i++) genMatchEvent();

    renderFeed();
    renderOnline();
    renderMatches();

    // Timers
    setInterval(simulate,       randInt(4000, 9000));
    setInterval(updateStatuses, randInt(8000, 15000));
    setInterval(renderFeed,     10000); // actualiza timestamps

    // ── Integração com core loop ───────────────────────────
    document.addEventListener('player:joined-tournament', e => {
        const pts     = 50;
        const oldRank = state.youRank;
        state.youPts += pts;

        // Simular subida de rank
        if (state.youPts > 1000 && state.youRank > 15) state.youRank = 15;
        if (state.youPts > 1100 && state.youRank > 12) state.youRank = 12;

        pushFeed(genYouEvent(pts, oldRank, state.youRank));
    });

    // Expor para outros módulos se necessário
    window.MATZON = window.MATZON || {};
    window.MATZON.activity = { pushFeed, genYouEvent };

});
