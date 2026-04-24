// MATZON - dashboard.js
'use strict';

document.addEventListener('app:ready', () => {

    // ── Carregar dados do player e injectar no dashboard ──
    Promise.all([
        fetch('data/player.json').then(r => r.json()),
        fetch('data/players.json').then(r => r.json()),
        fetch('data/tournaments.json').then(r => r.json())
    ]).then(([playerData, playersData, tournamentsData]) => {
        const p  = playerData.player;
        const me = playersData.players.find(x => x.isYou);
        const openTournaments = tournamentsData.tournaments.filter(t => t.status === 'open' && t.slotsLeft > 0).length;

        renderPlayerCard(p, me, openTournaments);
        fixEmojiFlags();
    }).catch(err => console.error('Dashboard load error:', err));

    // ── Player Card no topo do dashboard ─────────────────
    function renderPlayerCard(p, me, openCount) {
        const card = document.getElementById('dash-player-card');
        if (!card) return;

        card.innerHTML = `
            <div class="dash-card-inner">
                <div class="dash-player-left">
                    <div class="dash-avatar" style="background:${p.avatarGradient};">${p.initials}</div>
                    <div class="dash-player-data">
                        <div class="dash-gamertag">${p.gamertag}</div>
                        <div class="dash-nation">
                            <img src="https://flagcdn.com/w40/${p.nationCode}.png" alt="${p.nation}" class="st-flag">
                            <span>${p.nation}</span>
                        </div>
                    </div>
                </div>
                <div class="dash-player-right">
                    <div class="dash-rank-block">
                        <div class="dash-rank-num">#${me ? me.rank : p.rank}</div>
                        <div class="dash-rank-label">WORLD</div>
                    </div>
                </div>
            </div>
            <div class="dash-card-stats">
                <div class="dash-stat">
                    <div class="dash-stat-val" style="color:var(--accent-orange);">${me ? me.points.toLocaleString() : '980'}</div>
                    <div class="dash-stat-key">PTS</div>
                </div>
                <div class="dash-stat-sep"></div>
                <div class="dash-stat">
                    <div class="dash-stat-val">${p.stats.matches}</div>
                    <div class="dash-stat-key">MATCHES</div>
                </div>
                <div class="dash-stat-sep"></div>
                <div class="dash-stat">
                    <div class="dash-stat-val">${p.stats.goals}</div>
                    <div class="dash-stat-key">GOALS</div>
                </div>
                <div class="dash-stat-sep"></div>
                <div class="dash-stat">
                    <div class="dash-stat-val dash-open-count">${openCount}</div>
                    <div class="dash-stat-key">OPEN EVENTS</div>
                </div>
            </div>`;

        // Open Events count clicável → navega para torneios
        const openEl = card.querySelector('.dash-open-count');
        if (openEl) {
            openEl.style.cursor = 'pointer';
            openEl.addEventListener('click', () => {
                const menuT = document.getElementById('menuTournaments');
                if (menuT) menuT.dispatchEvent(new Event('click'));
            });
        }
    }

    // ── Fix emoji flags → flagcdn ─────────────────────────
    function fixEmojiFlags() {
        const emojiMap = {
            '🇻🇳': 'vn', '🇲🇻': 'mv', '🇰🇬': 'kg', '🇳🇵': 'np',
            '🇭🇰': 'hk', '🇱🇦': 'la', '🇵🇬': 'pg', '🇵🇰': 'pk',
            '🇮🇳': 'in', '🇧🇹': 'bt', '🇲🇴': 'mo', '🇧🇳': 'bn'
        };

        document.querySelectorAll('.compact-flags').forEach(wrap => {
            const spans = wrap.querySelectorAll('span');
            spans.forEach(span => {
                const code = emojiMap[span.textContent.trim()];
                if (code) {
                    const img = document.createElement('img');
                    img.src    = `https://flagcdn.com/w40/${code}.png`;
                    img.alt    = code.toUpperCase();
                    img.className = 'flag';
                    img.style.cssText = 'width:20px;height:13px;border-radius:2px;object-fit:cover;';
                    span.replaceWith(img);
                }
            });
        });
    }

    // ── Actualizar player card quando join tournament ─────
    document.addEventListener('player:joined-tournament', () => {
        Promise.all([
            fetch('data/player.json').then(r => r.json()),
            fetch('data/players.json').then(r => r.json()),
            fetch('data/tournaments.json').then(r => r.json())
        ]).then(([playerData, playersData, tournamentsData]) => {
            const me = playersData.players.find(x => x.isYou);
            const openCount = tournamentsData.tournaments.filter(t => t.status === 'open' && t.slotsLeft > 0).length;
            renderPlayerCard(playerData.player, me, openCount);
        });
    });

});
