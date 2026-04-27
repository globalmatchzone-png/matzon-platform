// MATZON - competition.js
'use strict';

document.addEventListener('app:ready', () => {

    // ── Navigation ────────────────────────────────────────
    const views = ['compHub','compDomestic','compChampions','compNations','compWorldCup','compOpen','compFormat'];

    function showCompView(id) {
        views.forEach(v => {
            const el = document.getElementById(v);
            if (el) el.style.display = v === id ? 'block' : 'none';
        });
        window.scrollTo(0, 0);
    }

    // Hub card clicks
    const cardMap = {
        hubCardDomestic:  'compDomestic',
        hubCardChampions: 'compChampions',
        hubCardNations:   'compNations',
        hubCardWorldCup:  'compWorldCup',
        hubCardOpen:      'compOpen',
    };
    Object.entries(cardMap).forEach(([cardId, viewId]) => {
        const card = document.getElementById(cardId);
        if (card) card.addEventListener('click', () => showCompView(viewId));
    });

    // Enter buttons (stop propagation from card)
    document.querySelectorAll('.comp-enter-btn').forEach(btn => {
        btn.addEventListener('click', e => e.stopPropagation());
    });

    // Back buttons
    document.querySelectorAll('.comp-back-btn').forEach(btn => {
        btn.addEventListener('click', () => showCompView('compHub'));
    });

    // ── Tab helpers ───────────────────────────────────────
    function setupTabs(selector, panelSelector) {
        document.querySelectorAll(selector).forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll(selector).forEach(t => t.classList.remove('active'));
                document.querySelectorAll(panelSelector).forEach(p => p.style.display = 'none');
                tab.classList.add('active');
                const panel = document.getElementById(tab.dataset.target);
                if (panel) panel.style.display = 'block';
            });
        });
    }

    setupTabs('.js-dom-tab', '.dom-panel');
    setupTabs('.js-champ-tab', '.champ-panel');

    // ── Helpers ───────────────────────────────────────────
    function avatar(src, size) {
        return `<img src="${src}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--border-color);" onerror="this.style.display='none'">`;
    }
    function flag(code, w, h) {
        return `<img src="https://flagcdn.com/w40/${code}.png" style="width:${w}px;height:${h}px;border-radius:2px;object-fit:cover;flex-shrink:0;">`;
    }
    function statusBadge(status) {
        const map = { ongoing:['#60a5fa','ONGOING'], open:['#4ade80','OPEN'], upcoming:['#fbbf24','UPCOMING'], done:['var(--text-muted)','DONE'] };
        const [color, label] = map[status] || map.upcoming;
        return `<span style="font-size:9px;font-weight:800;color:${color};background:rgba(255,255,255,0.06);padding:2px 8px;border-radius:4px;">${label}</span>`;
    }

    // ── DOMESTIC LEAGUES ──────────────────────────────────
    let leaguesData = null;
    let currentLeague = 'lg-ao';

    function renderDomOverview(lg) {
        const el = document.getElementById('dom-overview');
        if (!el) return;
        const filled = lg.standings.reduce((a, p) => a + p.mp, 0) / lg.standings.length;
        el.innerHTML = `
            <div style="background:linear-gradient(135deg,#1a1f2e,#1e2a3a);border-radius:16px;padding:20px;margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                    ${flag(lg.nationCode, 40, 27)}
                    <div>
                        <div style="font-size:18px;font-weight:900;font-family:var(--font-heading);color:#fff;">${lg.name}</div>
                        <div style="font-size:11px;color:var(--text-muted);">${lg.game} · Season ${leaguesData.season}</div>
                    </div>
                    ${statusBadge(lg.status)}
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:12px;">
                        <div style="font-size:20px;font-weight:900;color:#fff;">${lg.standings.length}</div>
                        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Players</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:12px;">
                        <div style="font-size:20px;font-weight:900;color:#fff;">${Math.round(filled)}</div>
                        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Avg Matchday</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:12px;">
                        <div style="font-size:20px;font-weight:900;color:var(--accent-orange);">${leaguesData.qualificationSpots}</div>
                        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Qualify for Champions</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:12px;">
                        <div style="font-size:20px;font-weight:900;color:#fff;">${leaguesData.format}</div>
                        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Format</div>
                    </div>
                </div>
            </div>
            <div style="background:var(--bg-card);border-radius:12px;padding:14px;border:1px solid var(--border-color);">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Points System</div>
                <div style="display:flex;gap:16px;">
                    <div style="text-align:center;"><div style="font-size:18px;font-weight:900;color:#4ade80;">${leaguesData.pointsSystem.win}</div><div style="font-size:10px;color:var(--text-muted);">WIN</div></div>
                    <div style="text-align:center;"><div style="font-size:18px;font-weight:900;color:#fff;">${leaguesData.pointsSystem.draw}</div><div style="font-size:10px;color:var(--text-muted);">DRAW</div></div>
                    <div style="text-align:center;"><div style="font-size:18px;font-weight:900;color:#f87171;">${leaguesData.pointsSystem.loss}</div><div style="font-size:10px;color:var(--text-muted);">LOSS</div></div>
                </div>
            </div>`;
    }

    function renderDomStandings(lg) {
        const el = document.getElementById('dom-standings');
        if (!el) return;
        el.innerHTML = `
            <div class="table-header" style="padding:0 0 8px;">
                <div class="th-left"><span>#</span><span>PLAYER</span></div>
                <div class="th-right" style="gap:0;">
                    <span style="width:24px;text-align:center;font-size:9px;">W</span>
                    <span style="width:24px;text-align:center;font-size:9px;">D</span>
                    <span style="width:24px;text-align:center;font-size:9px;">L</span>
                    <span style="width:30px;text-align:center;font-size:9px;">GD</span>
                    <span style="width:30px;text-align:center;font-size:9px;color:var(--accent-orange);">PTS</span>
                </div>
            </div>
            <div class="standings-list">
                ${lg.standings.map(p => `
                <div class="standing-row ${p.qualified ? 'advancing' : ''}">
                    <div class="st-left">
                        <span class="st-rank">${p.pos}</span>
                        ${avatar(p.avatar, 28)}
                        <span class="st-name">${p.gamertag}${p.qualified ? '<span style="font-size:9px;font-weight:800;color:#22c55e;background:rgba(34,197,94,0.12);padding:1px 5px;border-radius:4px;margin-left:5px;">Q</span>' : ''}</span>
                    </div>
                    <div class="st-right" style="gap:0;">
                        <span style="width:24px;text-align:center;color:#4ade80;">${p.w}</span>
                        <span style="width:24px;text-align:center;">${p.d}</span>
                        <span style="width:24px;text-align:center;color:#f87171;">${p.l}</span>
                        <span style="width:30px;text-align:center;color:var(--text-muted);">${p.gd > 0 ? '+' : ''}${p.gd}</span>
                        <span style="width:30px;text-align:center;" class="st-pts">${p.pts}</span>
                    </div>
                </div>`).join('')}
            </div>
            <div class="legend-box"><div class="legend-color"></div> Qualifies for Champions League</div>`;
    }

    function renderDomFixtures(lg) {
        const el = document.getElementById('dom-fixtures');
        if (!el) return;
        const upcoming = lg.matches.filter(m => m.status === 'upcoming');
        el.innerHTML = upcoming.length ? `
            <div class="match-cards">
                ${upcoming.map(m => `
                <div class="match-card">
                    <div class="match-row">
                        <div class="match-team">${avatar(m.av1, 20)} ${m.p1}</div>
                        <div class="match-time">${m.date}</div>
                    </div>
                    <div class="match-row mt-12">
                        <div class="match-team">${avatar(m.av2, 20)} ${m.p2}</div>
                        <div class="match-date">Upcoming</div>
                    </div>
                </div>`).join('')}
            </div>` : '<div style="text-align:center;color:var(--text-muted);padding:40px 0;">No upcoming fixtures</div>';
    }

    function renderDomResults(lg) {
        const el = document.getElementById('dom-results');
        if (!el) return;
        const done = lg.matches.filter(m => m.status === 'done');
        el.innerHTML = done.length ? `
            <div class="match-cards">
                ${done.map(m => `
                <div class="match-card">
                    <div class="match-row">
                        <div class="match-team">${avatar(m.av1, 20)} ${m.p1}</div>
                        <div class="match-time" style="font-size:16px;font-weight:900;">${m.s1}</div>
                    </div>
                    <div class="match-row mt-12">
                        <div class="match-team">${avatar(m.av2, 20)} ${m.p2}</div>
                        <div class="match-date" style="font-size:16px;font-weight:900;">${m.s2}</div>
                    </div>
                </div>`).join('')}
            </div>` : '<div style="text-align:center;color:var(--text-muted);padding:40px 0;">No results yet</div>';
    }

    function renderDomQualification(lg) {
        const el = document.getElementById('dom-qualification');
        if (!el) return;
        const qualified = lg.standings.filter(p => p.qualified);
        el.innerHTML = `
            <div style="background:linear-gradient(135deg,#0f2a0f,#14532d);border-radius:16px;padding:20px;margin-bottom:16px;">
                <div style="font-size:12px;font-weight:800;color:#4ade80;margin-bottom:4px;">Qualification Spots</div>
                <div style="font-size:28px;font-weight:900;color:#fff;">${leaguesData.qualificationSpots} of ${lg.standings.length}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:4px;">Top ${leaguesData.qualificationSpots} advance to Champions League</div>
            </div>
            <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Qualified Players</div>
            ${qualified.map(p => `
            <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-card);border-radius:12px;margin-bottom:8px;border:1px solid rgba(34,197,94,0.2);">
                ${avatar(p.avatar, 40)}
                <div style="flex:1;">
                    <div style="font-size:14px;font-weight:800;color:#fff;">${p.gamertag}</div>
                    <div style="font-size:11px;color:var(--text-muted);">${lg.name} · Position ${p.pos}</div>
                </div>
                <span style="font-size:9px;font-weight:800;color:#22c55e;background:rgba(34,197,94,0.12);padding:4px 8px;border-radius:4px;">QUALIFIED</span>
            </div>`).join('')}
            <div style="background:var(--bg-card);border-radius:12px;padding:14px;margin-top:16px;border:1px solid var(--border-color);">
                <div style="font-size:11px;font-weight:700;color:var(--text-muted);">Qualifies for</div>
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <span style="font-size:12px;font-weight:700;color:#60a5fa;background:rgba(96,165,250,0.1);padding:6px 12px;border-radius:8px;">⭐ Champions League</span>
                    <span style="font-size:12px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,0.1);padding:6px 12px;border-radius:8px;">🌍 Nations League</span>
                </div>
            </div>`;
    }

    function loadLeague(id) {
        if (!leaguesData) return;
        const lg = leaguesData.leagues.find(l => l.id === id);
        if (!lg) return;
        currentLeague = id;
        renderDomOverview(lg);
        renderDomStandings(lg);
        renderDomFixtures(lg);
        renderDomResults(lg);
        renderDomQualification(lg);
    }

    document.querySelectorAll('.js-league-select').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.js-league-select').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadLeague(btn.dataset.league);
        });
    });

    // ── CHAMPIONS LEAGUE ─────────────────────────────────
    function renderChampions(data) {
        const q = document.getElementById('champ-qualified');
        const g = document.getElementById('champ-groups');
        const k = document.getElementById('champ-knockout');
        const f = document.getElementById('champ-final');
        if (!q) return;

        q.innerHTML = `
            <div style="background:linear-gradient(135deg,#0f1f4a,#1e3a8a);border-radius:16px;padding:20px;margin-bottom:16px;">
                <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
                <div style="font-family:var(--font-heading);font-size:22px;font-weight:900;color:#fff;line-height:1.1;">Champions<br>League ${data.season}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:8px;">Starts ${data.startDate}</div>
            </div>
            <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Qualified Players</div>
            ${data.qualified.map(p => `
            <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-card);border-radius:12px;margin-bottom:8px;border:1px solid var(--border-color);">
                <img src="${p.avatar}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                ${flag(p.nationCode, 20, 14)}
                <div style="flex:1;">
                    <div style="font-size:14px;font-weight:800;">${p.gamertag}</div>
                    <div style="font-size:11px;color:var(--text-muted);">${p.league} · ${p.leaguePos === 1 ? '🥇 1st' : '🥈 2nd'}</div>
                </div>
                <span style="font-size:9px;font-weight:800;color:#22c55e;background:rgba(34,197,94,0.12);padding:3px 8px;border-radius:4px;">QUALIFIED</span>
            </div>`).join('')}`;

        if (g) g.innerHTML = data.groups.map(grp => `
            <div style="margin-bottom:20px;">
                <div style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">${grp.name}</div>
                <div class="table-header" style="padding:0 0 6px;"><div class="th-left"><span>#</span><span>PLAYER</span></div><div class="th-right"><span>MP</span><span>GD</span><span>PTS</span></div></div>
                <div class="standings-list">${grp.standings.map(p => `
                    <div class="standing-row ${p.qualified ? 'advancing' : ''}">
                        <div class="st-left"><span class="st-rank">${p.pos}</span>${flag(p.nationCode,18,12)}<img src="${p.avatar}" style="width:26px;height:26px;border-radius:50%;object-fit:cover;"><span class="st-name">${p.gamertag}</span></div>
                        <div class="st-right"><span>${p.mp}</span><span>${p.gd > 0 ? '+' : ''}${p.gd}</span><span class="st-pts">${p.pts}</span></div>
                    </div>`).join('')}
                </div>
                <div class="legend-box"><div class="legend-color"></div> Advancing to Knockout</div>
            </div>`).join('');

        if (k && data.knockout) k.innerHTML = data.knockout.rounds.map(r => `
            <div style="margin-bottom:20px;">
                <div style="font-size:11px;font-weight:700;color:var(--accent-orange);margin-bottom:10px;">${r.name}</div>
                ${r.matches.map(m => `
                <div class="match-card" style="margin-bottom:8px;">
                    <div class="match-row"><div class="match-team">${m.p1}</div><div class="match-time">${m.date}</div></div>
                    <div class="match-row mt-12"><div class="match-team">${m.p2}</div><div class="match-date">${m.status === 'done' ? 'FT' : 'TBD'}</div></div>
                </div>`).join('')}
            </div>`).join('');

        if (f) f.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);">🏆<br><br>Final details will be announced after the knockout stage.</div>`;
    }

    // ── WORLD CUP ─────────────────────────────────────────
    function renderWorldCup(data) {
        const container = document.getElementById('worldcup-content');
        if (!container) return;

        let currentGroup = Object.keys(data.groups)[0];
        let currentMatchday = 'all';

        const allMatches = [];
        let matchId = 1;
        for (const [grpName, teams] of Object.entries(data.groups)) {
            data.schedule.forEach(sch => {
                const played = Math.random() > 0.4;
                allMatches.push({
                    id: matchId++, group: grpName, matchday: sch.matchday,
                    teamA: teams[sch.slots[0]], teamB: teams[sch.slots[1]],
                    scoreA: played ? Math.floor(Math.random() * 5) : null,
                    scoreB: played ? Math.floor(Math.random() * 5) : null,
                    played
                });
            });
        }

        function calcStandings(grpName) {
            const teams = data.groups[grpName].map(t => ({...t, p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}));
            allMatches.filter(m => m.group === grpName && m.played).forEach(m => {
                const tA = teams.find(t => t.id === m.teamA.id);
                const tB = teams.find(t => t.id === m.teamB.id);
                tA.p++; tB.p++; tA.gf += m.scoreA; tA.ga += m.scoreB; tB.gf += m.scoreB; tB.ga += m.scoreA;
                if (m.scoreA > m.scoreB) { tA.w++; tA.pts+=3; tB.l++; }
                else if (m.scoreA < m.scoreB) { tB.w++; tB.pts+=3; tA.l++; }
                else { tA.d++; tB.d++; tA.pts++; tB.pts++; }
                tA.gd = tA.gf - tA.ga; tB.gd = tB.gf - tB.ga;
            });
            return teams.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        }

        function buildStandings(grpName) {
            return calcStandings(grpName).map((t,i) => `
            <div class="standing-row ${i<2?'advancing':''}">
                <div class="st-left">
                    <span class="st-rank">${i+1}</span>
                    <img src="https://flagcdn.com/w40/${t.id}.png" style="width:24px;height:16px;border-radius:2px;object-fit:cover;flex-shrink:0;">
                    <img src="${t.avatar}" style="width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0;" onerror="this.style.display='none'">
                    <div><div style="font-size:12px;font-weight:700;">${t.nation}</div><div style="font-size:10px;color:var(--text-muted);">${t.player}</div></div>
                </div>
                <div class="st-right" style="gap:0;">
                    <span style="width:22px;text-align:center;">${t.p}</span>
                    <span style="width:22px;text-align:center;color:#4ade80;">${t.w}</span>
                    <span style="width:22px;text-align:center;">${t.d}</span>
                    <span style="width:22px;text-align:center;color:#f87171;">${t.l}</span>
                    <span style="width:28px;text-align:center;color:var(--text-muted);">${t.gd>0?'+':''}${t.gd}</span>
                    <span style="width:28px;text-align:center;color:var(--accent-orange);font-weight:800;">${t.pts}</span>
                </div>
            </div>`).join('');
        }

        function buildMatches(grpName, matchday) {
            let m = allMatches.filter(x => x.group === grpName);
            if (matchday !== 'all') m = m.filter(x => x.matchday == matchday);
            return m.map(x => `
            <div class="match-card">
                <div class="match-row">
                    <div class="match-team"><img src="${x.teamA.avatar}" class="m-flag" style="border-radius:50%;object-fit:cover;" onerror="this.src='https://flagcdn.com/w40/${x.teamA.id}.png'"> ${x.teamA.nation}</div>
                    <div class="match-time">${x.played ? x.scoreA : '18:00'}</div>
                </div>
                <div class="match-row mt-12">
                    <div class="match-team"><img src="${x.teamB.avatar}" class="m-flag" style="border-radius:50%;object-fit:cover;" onerror="this.src='https://flagcdn.com/w40/${x.teamB.id}.png'"> ${x.teamB.nation}</div>
                    <div class="match-date">${x.played ? x.scoreB : 'TBD'}</div>
                </div>
            </div>`).join('');
        }

        container.innerHTML = `
        <div style="background:linear-gradient(135deg,#052e16,#064e3b);border-radius:16px;padding:20px;margin-bottom:16px;">
            <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
            <div style="font-family:var(--font-heading);font-size:22px;font-weight:900;color:#fff;line-height:1.1;">World Cup<br>${data.season}™</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:8px;">ft. eFootball Mobile</div>
        </div>
        <section class="filters-section" style="padding-top:0;">
            <div class="filter-row">
                <div class="pills-scroll" id="wcStageFilter">
                    <button class="pill active" data-stage="groups">Group Stage</button>
                    <button class="pill" data-stage="knockout">Knockout</button>
                </div>
                <div class="filter-line"></div>
                <span class="filter-label">stage</span>
            </div>
        </section>
        <div id="wcGroupStage">
            <section class="filters-section" style="padding-top:0;">
                <div class="filter-row">
                    <div class="pills-scroll" id="wcGroupFilter">
                        ${Object.keys(data.groups).map((g,i) => `<button class="pill ${i===0?'active':''} w-col-2" data-group="${g}">${g}</button>`).join('')}
                    </div>
                    <div class="filter-spacer"></div>
                    <span class="filter-label">group</span>
                </div>
                <div class="filter-row">
                    <div class="pills-scroll rounds-scroll" id="wcMatchdayFilter">
                        <button class="round-btn active" data-matchday="all">ALL</button>
                        <button class="round-btn" data-matchday="1">1</button>
                        <button class="round-btn" data-matchday="2">2</button>
                        <button class="round-btn" data-matchday="3">3</button>
                    </div>
                    <div class="filter-line"></div>
                    <span class="filter-label">Matchday</span>
                </div>
            </section>
            <section class="standings-section" style="padding-top:0;">
                <h2 class="section-title">Standings</h2>
                <div class="table-header"><div class="th-left"><span>#</span><span>NATION / PLAYER</span></div><div class="st-right" style="gap:0;padding-right:16px;display:flex;"><span style="width:22px;text-align:center;font-size:9px;">P</span><span style="width:22px;text-align:center;font-size:9px;color:#4ade80;">W</span><span style="width:22px;text-align:center;font-size:9px;">D</span><span style="width:22px;text-align:center;font-size:9px;color:#f87171;">L</span><span style="width:28px;text-align:center;font-size:9px;">GD</span><span style="width:28px;text-align:center;font-size:9px;color:var(--accent-orange);">PTS</span></div></div>
                <div class="standings-list" id="wcStandingsContainer"></div>
                <div class="legend-box"><div class="legend-color"></div> Advancing to Round of 16</div>
            </section>
            <section class="matchups-section">
                <h2 class="section-title">Matchups</h2>
                <div id="wcMatchesContainer" class="match-cards"></div>
            </section>
        </div>
        <div id="wcKnockoutStage" style="display:none;padding-top:16px;">
            <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">Knockout Bracket</div>
            ${data.knockout.rounds.map(r => `
            <div style="margin-bottom:20px;">
                <div style="font-size:11px;font-weight:700;color:var(--accent-orange);margin-bottom:10px;">${r.name}</div>
                ${r.matches.map(m => `
                <div class="match-card" style="margin-bottom:8px;">
                    <div class="match-row"><div class="match-team">${m.p1}</div><div class="match-time">${m.date}</div></div>
                    <div class="match-row mt-12"><div class="match-team">${m.p2}</div><div class="match-date">TBD</div></div>
                </div>`).join('')}
            </div>`).join('')}
        </div>`;

        document.getElementById('wcStandingsContainer').innerHTML = buildStandings(currentGroup);
        document.getElementById('wcMatchesContainer').innerHTML = buildMatches(currentGroup, currentMatchday);

        container.querySelectorAll('#wcStageFilter .pill').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('#wcStageFilter .pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const s = btn.dataset.stage;
                document.getElementById('wcGroupStage').style.display = s === 'groups' ? 'block' : 'none';
                document.getElementById('wcKnockoutStage').style.display = s === 'knockout' ? 'block' : 'none';
            });
        });

        container.querySelectorAll('#wcGroupFilter .pill').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('#wcGroupFilter .pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentGroup = btn.dataset.group;
                document.getElementById('wcStandingsContainer').innerHTML = buildStandings(currentGroup);
                document.getElementById('wcMatchesContainer').innerHTML = buildMatches(currentGroup, currentMatchday);
            });
        });

        container.querySelectorAll('#wcMatchdayFilter .round-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('#wcMatchdayFilter .round-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMatchday = btn.dataset.matchday;
                document.getElementById('wcMatchesContainer').innerHTML = buildMatches(currentGroup, currentMatchday);
            });
        });
    }

    // ── OPEN EVENTS (existing tournaments.js handles list) ─
    // tournaments.js já popula #tournament-join-list

    // ── Load all data ─────────────────────────────────────
    fetch('data/leagues.json')
        .then(r => r.json())
        .then(data => { leaguesData = data; loadLeague('lg-ao'); })
        .catch(err => console.error('Leagues:', err));

    fetch('data/champions.json')
        .then(r => r.json())
        .then(renderChampions)
        .catch(err => console.error('Champions:', err));

    fetch('data/worldcup.json')
        .then(r => r.json())
        .then(renderWorldCup)
        .catch(err => console.error('WorldCup:', err));

});
