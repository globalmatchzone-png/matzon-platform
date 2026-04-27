// MATZON - competition.js
'use strict';

document.addEventListener('app:ready', () => {

    // ── Navigation Engine ─────────────────────────────────
    const VIEWS = ['compHub','compDomestic','compChampions','compNations','compWorldCup','compOpen'];

    function showView(id) {
        VIEWS.forEach(v => {
            const el = document.getElementById(v);
            if (el) el.style.display = v === id ? 'block' : 'none';
        });
        // Reset league detail when going back to domestic hub
        if (id === 'compDomestic') {
            const detail = document.getElementById('compLeagueDetail');
            if (detail) detail.style.display = 'none';
        }
        window.scrollTo(0, 0);
    }

    // Hub → Competition
    const hubMap = {
        hubCardDomestic:  'compDomestic',
        hubCardChampions: 'compChampions',
        hubCardNations:   'compNations',
        hubCardWorldCup:  'compWorldCup',
        hubCardOpen:      'compOpen',
        myCardLeague:     'compDomestic',
        myCardChamp:      'compChampions',
        myCardWC:         'compWorldCup',
        pyDomestic:       'compDomestic',
        pyChampions:      'compChampions',
        pyNations:        'compNations',
        pyWorldCup:       'compWorldCup',
    };
    Object.entries(hubMap).forEach(([id, view]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => showView(view));
    });

    // Back buttons
    document.querySelectorAll('.comp-back-btn').forEach(btn => {
        btn.addEventListener('click', () => showView('compHub'));
    });

    // ── Tab helpers ───────────────────────────────────────
    function setupTabs(selector, panelClass) {
        document.querySelectorAll(selector).forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll(selector).forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.' + panelClass).forEach(p => p.style.display = 'none');
                tab.classList.add('active');
                const panel = document.getElementById(tab.dataset.target);
                if (panel) panel.style.display = 'block';
            });
        });
    }
    setupTabs('.js-dom-tab',   'dom-panel');
    setupTabs('.js-champ-tab', 'champ-panel');

    // ── Helpers ───────────────────────────────────────────
    function av(src, size) {
        return `<img src="${src}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--border-color);" onerror="this.style.display='none'">`;
    }
    function fl(code, w, h) {
        return `<img src="https://flagcdn.com/w40/${code}.png" style="width:${w}px;height:${h}px;border-radius:2px;object-fit:cover;flex-shrink:0;">`;
    }

    // ── DOMESTIC ──────────────────────────────────────────
    let leaguesData = null;

    // Country card → League detail
    document.querySelectorAll('.js-league-select').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.js-league-select').forEach(b => b.classList.remove('comp-country-active'));
            btn.classList.add('comp-country-active');
            if (leaguesData) {
                loadLeague(btn.dataset.league);
                const detail = document.getElementById('compLeagueDetail');
                if (detail) detail.style.display = 'block';
                // Reset to first tab
                document.querySelectorAll('.js-dom-tab').forEach((t,i) => {
                    t.classList.toggle('active', i === 0);
                });
                document.querySelectorAll('.dom-panel').forEach((p,i) => {
                    p.style.display = i === 0 ? 'block' : 'none';
                });
            }
        });
    });

    function loadLeague(id) {
        const lg = leaguesData.leagues.find(l => l.id === id);
        if (!lg) return;
        renderOverview(lg);
        renderStandings(lg);
        renderFixtures(lg);
        renderResults(lg);
        renderQualification(lg);
        renderJoin(lg);
    }

    function renderOverview(lg) {
        const el = document.getElementById('dom-overview');
        if (!el) return;
        el.innerHTML = `
            <div class="news-item" style="margin:0 0 16px;cursor:default;">
                <div class="news-img" style="background:var(--green-grad);display:flex;align-items:center;justify-content:center;">
                    ${fl(lg.nationCode, 40, 27)}
                </div>
                <div class="news-content">
                    <p><strong>${lg.name}</strong> ${lg.game}</p>
                    <div class="news-meta">${lg.status.toUpperCase()} • SEASON ${leaguesData.season}</div>
                    <div class="news-meta" style="margin-top:4px;color:var(--accent-orange);">${lg.reward}</div>
                </div>
            </div>
            <div class="tournament-card-wrapper" style="margin:0 0 12px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:900;font-family:var(--font-heading);">${lg.standings.length}</div>
                        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Players</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:900;font-family:var(--font-heading);color:var(--accent-orange);">${leaguesData.qualificationSpots}</div>
                        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Qualify</div>
                    </div>
                </div>
            </div>
            <div class="tournament-card-wrapper" style="margin:0;">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Points System</div>
                <div style="display:flex;gap:20px;">
                    <div style="text-align:center;"><div style="font-size:20px;font-weight:900;color:#4ade80;">${leaguesData.pointsSystem.win}</div><div style="font-size:10px;color:var(--text-muted);">WIN</div></div>
                    <div style="text-align:center;"><div style="font-size:20px;font-weight:900;">${leaguesData.pointsSystem.draw}</div><div style="font-size:10px;color:var(--text-muted);">DRAW</div></div>
                    <div style="text-align:center;"><div style="font-size:20px;font-weight:900;color:#f87171;">${leaguesData.pointsSystem.loss}</div><div style="font-size:10px;color:var(--text-muted);">LOSS</div></div>
                </div>
            </div>`;
    }

    function renderStandings(lg) {
        const el = document.getElementById('dom-standings');
        if (!el) return;
        el.innerHTML = `
            <div class="table-header" style="padding:0 0 8px;">
                <div class="th-left"><span>#</span><span>PLAYER</span></div>
                <div class="th-right" style="gap:0;">
                    <span style="width:24px;text-align:center;font-size:9px;">W</span>
                    <span style="width:24px;text-align:center;font-size:9px;">D</span>
                    <span style="width:24px;text-align:center;font-size:9px;">L</span>
                    <span style="width:32px;text-align:center;font-size:9px;">GD</span>
                    <span style="width:32px;text-align:center;font-size:9px;color:var(--accent-orange);">PTS</span>
                </div>
            </div>
            <div class="standings-list">
                ${lg.standings.map(p => `
                <div class="standing-row ${p.qualified ? 'advancing' : ''}">
                    <div class="st-left">
                        <span class="st-rank">${p.pos}</span>
                        ${av(p.avatar, 28)}
                        <span class="st-name">${p.gamertag}${p.qualified ? '<span style="font-size:9px;font-weight:800;color:#22c55e;background:rgba(34,197,94,0.12);padding:1px 5px;border-radius:4px;margin-left:5px;">Q</span>' : ''}</span>
                    </div>
                    <div class="st-right" style="gap:0;">
                        <span style="width:24px;text-align:center;color:#4ade80;">${p.w}</span>
                        <span style="width:24px;text-align:center;">${p.d}</span>
                        <span style="width:24px;text-align:center;color:#f87171;">${p.l}</span>
                        <span style="width:32px;text-align:center;color:var(--text-muted);">${p.gd > 0 ? '+' : ''}${p.gd}</span>
                        <span style="width:32px;text-align:center;" class="st-pts">${p.pts}</span>
                    </div>
                </div>`).join('')}
            </div>
            <div class="legend-box"><div class="legend-color"></div> Qualifies for Champions League</div>`;
    }

    function renderFixtures(lg) {
        const el = document.getElementById('dom-fixtures');
        if (!el) return;
        const upcoming = lg.matches.filter(m => m.status === 'upcoming');
        el.innerHTML = upcoming.length
            ? `<div class="match-cards">${upcoming.map(m => `
                <div class="match-card">
                    <div class="match-row"><div class="match-team">${av(m.av1, 20)} ${m.p1}</div><div class="match-time">${m.date}</div></div>
                    <div class="match-row mt-12"><div class="match-team">${av(m.av2, 20)} ${m.p2}</div><div class="match-date">Upcoming</div></div>
                </div>`).join('')}</div>`
            : '<div style="text-align:center;color:var(--text-muted);padding:40px 0;font-size:13px;">No upcoming fixtures</div>';
    }

    function renderResults(lg) {
        const el = document.getElementById('dom-results');
        if (!el) return;
        const done = lg.matches.filter(m => m.status === 'done');
        el.innerHTML = done.length
            ? `<div class="match-cards">${done.map(m => `
                <div class="match-card">
                    <div class="match-row"><div class="match-team">${av(m.av1, 20)} ${m.p1}</div><div class="match-time" style="font-size:16px;font-weight:900;">${m.s1}</div></div>
                    <div class="match-row mt-12"><div class="match-team">${av(m.av2, 20)} ${m.p2}</div><div class="match-date" style="font-size:16px;font-weight:900;">${m.s2}</div></div>
                </div>`).join('')}</div>`
            : '<div style="text-align:center;color:var(--text-muted);padding:40px 0;font-size:13px;">No results yet</div>';
    }

    function renderQualification(lg) {
        const el = document.getElementById('dom-qualification');
        if (!el) return;
        const q = lg.standings.filter(p => p.qualified);
        el.innerHTML = `
            <div class="slim-banner" style="margin:0 0 16px;height:auto;padding:16px;flex-direction:column;align-items:flex-start;gap:4px;">
                <div style="font-size:12px;font-weight:800;">${leaguesData.qualificationSpots} spots available</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);">Top ${leaguesData.qualificationSpots} advance to Champions League</div>
            </div>
            ${q.map(p => `
            <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-card);border-radius:12px;margin-bottom:8px;border:1px solid var(--border-color);">
                ${av(p.avatar, 40)}
                <div style="flex:1;">
                    <div style="font-size:14px;font-weight:800;">${p.gamertag}</div>
                    <div style="font-size:11px;color:var(--text-muted);">Position ${p.pos} · ${p.pts} pts</div>
                </div>
                <span style="font-size:9px;font-weight:800;color:#22c55e;background:rgba(34,197,94,0.12);padding:4px 8px;border-radius:4px;">QUALIFIED</span>
            </div>`).join('')}
            <div class="tournament-card-wrapper" style="margin:16px 0 0;">
                <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:10px;">Qualifies for</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <div style="display:flex;align-items:center;gap:10px;padding:10px;background:rgba(0,86,227,0.1);border-radius:8px;border:1px solid rgba(0,86,227,0.2);">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-blue)"><path d="M12 2L3 6V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V6L12 2Z"/></svg>
                        <span style="font-size:12px;font-weight:700;color:var(--accent-blue);">Champions League</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;padding:10px;background:rgba(255,122,0,0.08);border-radius:8px;border:1px solid rgba(255,122,0,0.2);">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-orange)"><path d="M12 2L3 6V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V6L12 2Z"/></svg>
                        <span style="font-size:12px;font-weight:700;color:var(--accent-orange);">Nations League call-up</span>
                    </div>
                </div>
            </div>`;
    }

    function renderJoin(lg) {
        const el = document.getElementById('dom-join');
        if (!el) return;
        const spots = lg.standings.length < 16 ? 16 - lg.standings.length : 0;
        el.innerHTML = `
            <div class="tournament-card-wrapper" style="margin:0 0 16px;">
                <div style="font-size:14px;font-weight:800;margin-bottom:4px;">${lg.name}</div>
                <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">${lg.game} · Season ${leaguesData.season}</div>
                ${spots > 0
                    ? `<div style="font-size:12px;color:#4ade80;font-weight:700;margin-bottom:16px;">● ${spots} spots available</div>
                       <button style="width:100%;padding:16px;border-radius:12px;background:linear-gradient(135deg,var(--accent-orange),#ff5e00);color:#000;font-size:15px;font-weight:800;border:none;cursor:pointer;font-family:var(--font-body);">⚔️ JOIN LEAGUE</button>`
                    : `<div style="font-size:12px;color:var(--text-muted);font-weight:700;margin-bottom:16px;">League is full</div>
                       <button disabled style="width:100%;padding:16px;border-radius:12px;background:var(--bg-pill);color:var(--text-muted);font-size:15px;font-weight:800;border:none;font-family:var(--font-body);">FULL</button>`
                }
            </div>
            <div style="font-size:11px;color:var(--text-muted);text-align:center;">Earn ${lg.reward} · Top ${leaguesData.qualificationSpots} qualify for Champions League</div>`;
    }

    // ── CHAMPIONS ─────────────────────────────────────────
    function renderChampions(data) {
        const q = document.getElementById('champ-qualified');
        const g = document.getElementById('champ-groups');
        const k = document.getElementById('champ-knockout');
        if (!q) return;

        q.innerHTML = `
            <div class="news-item" style="margin:0 0 16px;cursor:default;">
                <div class="news-img" style="background:var(--blue-grad);display:flex;align-items:center;justify-content:center;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2L3 6V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V6L12 2Z"/></svg>
                </div>
                <div class="news-content">
                    <p><strong>Champions League ${data.season}</strong> Elite competition for top domestic players.</p>
                    <div class="news-meta">STARTS ${data.startDate} • ${data.status.toUpperCase()}</div>
                </div>
            </div>
            ${data.qualified.map(p => `
            <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-card);border-radius:12px;margin-bottom:8px;border:1px solid var(--border-color);">
                ${av(p.avatar, 40)}
                ${fl(p.nationCode, 20, 14)}
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
                        <div class="st-left"><span class="st-rank">${p.pos}</span>${fl(p.nationCode,18,12)}${av(p.avatar,26)}<span class="st-name">${p.gamertag}</span></div>
                        <div class="st-right"><span>${p.mp}</span><span>${p.gd > 0 ? '+' : ''}${p.gd}</span><span class="st-pts">${p.pts}</span></div>
                    </div>`).join('')}
                </div>
                <div class="legend-box"><div class="legend-color"></div> Advancing to Knockout</div>
            </div>`).join('');

        if (k && data.knockout) k.innerHTML = data.knockout.rounds.map(r => `
            <div style="margin-bottom:20px;">
                <div style="font-size:11px;font-weight:700;color:var(--accent-orange);margin-bottom:10px;">${r.name}</div>
                <div class="match-cards">${r.matches.map(m => `
                <div class="match-card">
                    <div class="match-row"><div class="match-team">${m.p1}</div><div class="match-time">${m.date}</div></div>
                    <div class="match-row mt-12"><div class="match-team">${m.p2}</div><div class="match-date">TBD</div></div>
                </div>`).join('')}</div>
            </div>`).join('');
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
                    scoreB: played ? Math.floor(Math.random() * 5) : null, played
                });
            });
        }

        function calcStandings(grpName) {
            const teams = data.groups[grpName].map(t => ({...t,p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}));
            allMatches.filter(m => m.group === grpName && m.played).forEach(m => {
                const tA = teams.find(t => t.id === m.teamA.id);
                const tB = teams.find(t => t.id === m.teamB.id);
                tA.p++; tB.p++; tA.gf+=m.scoreA; tA.ga+=m.scoreB; tB.gf+=m.scoreB; tB.ga+=m.scoreA;
                if (m.scoreA > m.scoreB) { tA.w++; tA.pts+=3; tB.l++; }
                else if (m.scoreA < m.scoreB) { tB.w++; tB.pts+=3; tA.l++; }
                else { tA.d++; tB.d++; tA.pts++; tB.pts++; }
                tA.gd=tA.gf-tA.ga; tB.gd=tB.gf-tB.ga;
            });
            return teams.sort((a,b) => b.pts-a.pts || b.gd-a.gd || b.gf-a.gf);
        }

        function buildStandings(grp) {
            return calcStandings(grp).map((t,i) => `
            <div class="standing-row ${i<2?'advancing':''}">
                <div class="st-left">
                    <span class="st-rank">${i+1}</span>
                    <img src="https://flagcdn.com/w40/${t.id}.png" style="width:24px;height:16px;border-radius:2px;object-fit:cover;flex-shrink:0;">
                    ${av(t.avatar,26)}
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

        function buildMatches(grp, md) {
            let m = allMatches.filter(x => x.group === grp);
            if (md !== 'all') m = m.filter(x => x.matchday == md);
            return m.map(x => `
            <div class="match-card">
                <div class="match-row"><div class="match-team"><img src="${x.teamA.avatar}" class="m-flag" style="border-radius:50%;object-fit:cover;" onerror="this.src='https://flagcdn.com/w40/${x.teamA.id}.png'"> ${x.teamA.nation}</div><div class="match-time">${x.played ? x.scoreA : '18:00'}</div></div>
                <div class="match-row mt-12"><div class="match-team"><img src="${x.teamB.avatar}" class="m-flag" style="border-radius:50%;object-fit:cover;" onerror="this.src='https://flagcdn.com/w40/${x.teamB.id}.png'"> ${x.teamB.nation}</div><div class="match-date">${x.played ? x.scoreB : 'TBD'}</div></div>
            </div>`).join('');
        }

        container.innerHTML = `
        <div class="news-item" style="margin:0 0 16px;cursor:default;">
            <div class="news-img" style="background:linear-gradient(135deg,#052e16,#064e3b);display:flex;align-items:center;justify-content:center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
            </div>
            <div class="news-content">
                <p><strong>World Cup ${data.season}™</strong> ft. eFootball Mobile</p>
                <div class="news-meta">STARTS ${data.startDate} • ${data.status.toUpperCase()}</div>
            </div>
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
                <div class="table-header"><div class="th-left"><span>#</span><span>NATION</span></div><div class="st-right" style="gap:0;padding-right:16px;display:flex;align-items:center;"><span style="width:22px;text-align:center;font-size:9px;">P</span><span style="width:22px;text-align:center;font-size:9px;color:#4ade80;">W</span><span style="width:22px;text-align:center;font-size:9px;">D</span><span style="width:22px;text-align:center;font-size:9px;color:#f87171;">L</span><span style="width:28px;text-align:center;font-size:9px;">GD</span><span style="width:28px;text-align:center;font-size:9px;color:var(--accent-orange);">PTS</span></div></div>
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
            <div class="match-cards">${data.knockout.rounds.map(r => `
            <div style="margin-bottom:16px;">
                <div style="font-size:11px;font-weight:700;color:var(--accent-orange);margin-bottom:8px;">${r.name}</div>
                ${r.matches.map(m => `
                <div class="match-card">
                    <div class="match-row"><div class="match-team">${m.p1}</div><div class="match-time">${m.date}</div></div>
                    <div class="match-row mt-12"><div class="match-team">${m.p2}</div><div class="match-date">TBD</div></div>
                </div>`).join('')}
            </div>`).join('')}</div>
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

    // ── Load Data ─────────────────────────────────────────
    fetch('data/leagues.json')
        .then(r => r.json())
        .then(data => {
            leaguesData = data;
            loadLeague('lg-ao');
        })
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
