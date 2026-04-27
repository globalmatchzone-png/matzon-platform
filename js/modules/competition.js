// MATZON - competition.js
// Domestic Leagues, Champions League, World Cup
'use strict';

document.addEventListener('app:ready', () => {

    // ── Helpers ───────────────────────────────────────────
    function avatar(src, size, you) {
        return `<img src="${src}"
            style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;${you ? 'border:2px solid var(--accent-orange);' : 'border:2px solid var(--border-color);'}"
            onerror="this.style.display='none'">`;
    }

    function flag(code, w, h) {
        return `<img src="https://flagcdn.com/w40/${code}.png"
            style="width:${w}px;height:${h}px;border-radius:2px;object-fit:cover;flex-shrink:0;">`;
    }

    function statusBadge(status) {
        const map = {
            ongoing:  ['trn-status-ongoing', 'ONGOING'],
            open:     ['trn-status-open',    'OPEN'],
            upcoming: ['trn-status-full',    'UPCOMING'],
            done:     ['trn-status-full',    'DONE'],
        };
        const [cls, label] = map[status] || map.upcoming;
        return `<div class="trn-league-status ${cls}">${label}</div>`;
    }

    function qualBadge(qualified) {
        if (!qualified) return '';
        return `<span style="font-size:9px;font-weight:800;color:#22c55e;background:rgba(34,197,94,0.12);padding:2px 6px;border-radius:4px;margin-left:6px;letter-spacing:0.3px;">Q</span>`;
    }

    function standingsTable(standings, showNation) {
        return `
        <div class="table-header" style="padding:0;">
            <div class="th-left"><span>#</span><span>PLAYER</span></div>
            <div class="th-right" style="gap:0;">
                <span style="width:28px;text-align:center;">W</span>
                <span style="width:28px;text-align:center;">D</span>
                <span style="width:28px;text-align:center;">L</span>
                <span style="width:36px;text-align:center;">GD</span>
                <span style="width:36px;text-align:center;">PTS</span>
            </div>
        </div>
        <div class="standings-list">
            ${standings.map(p => `
                <div class="standing-row ${p.qualified ? 'advancing' : ''}">
                    <div class="st-left">
                        <span class="st-rank">${p.pos}</span>
                        ${showNation ? flag(p.nationCode, 20, 14) : ''}
                        ${avatar(p.avatar || p.av, 28, false)}
                        <span class="st-name">${p.gamertag || p.player}${qualBadge(p.qualified)}</span>
                    </div>
                    <div class="st-right" style="gap:0;">
                        <span style="width:28px;text-align:center;color:#22c55e;">${p.w}</span>
                        <span style="width:28px;text-align:center;">${p.d}</span>
                        <span style="width:28px;text-align:center;color:#f87171;">${p.l}</span>
                        <span style="width:36px;text-align:center;color:var(--text-muted);">${p.gd > 0 ? '+'+p.gd : p.gd}</span>
                        <span style="width:36px;text-align:center;" class="st-pts">${p.pts}</span>
                    </div>
                </div>`).join('')}
        </div>
        ${standings.some(p => p.qualified) ? '<div class="legend-box"><div class="legend-color"></div> Qualifies for Champions League</div>' : ''}`;
    }

    function matchList(matches) {
        return matches.map(m => `
            <div class="trn-match-row">
                <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
                    ${m.av1 ? avatar(m.av1, 24, false) : '<div style="width:24px;height:24px;border-radius:50%;background:var(--bg-pill);flex-shrink:0;"></div>'}
                    <span style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.p1}</span>
                </div>
                <div style="text-align:center;min-width:56px;flex-shrink:0;">
                    ${m.status === 'done'
                        ? `<span style="font-family:var(--font-heading);font-size:15px;font-weight:900;color:#fff;">${m.s1} - ${m.s2}</span>`
                        : `<span style="font-size:10px;font-weight:700;color:var(--text-muted);">${m.date}</span>`}
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;min-width:0;">
                    <span style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.p2}</span>
                    ${m.av2 ? avatar(m.av2, 24, false) : '<div style="width:24px;height:24px;border-radius:50%;background:var(--bg-pill);flex-shrink:0;"></div>'}
                </div>
            </div>`).join('');
    }

    function knockoutBracket(knockout) {
        if (!knockout) return '';
        return `
        <div style="margin-top:24px;">
            <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">Knockout Stage</div>
            ${knockout.rounds.map(round => `
                <div style="margin-bottom:20px;">
                    <div style="font-size:11px;font-weight:700;color:var(--accent-orange);margin-bottom:10px;">${round.name}</div>
                    ${round.matches.map(m => `
                        <div class="trn-match-row" style="background:var(--bg-pill);border-radius:8px;padding:10px 12px;margin-bottom:6px;">
                            <div style="display:flex;align-items:center;gap:8px;flex:1;">
                                ${m.av1 ? avatar(m.av1, 24, false) : '<div style="width:24px;height:24px;border-radius:50%;background:var(--border-color);flex-shrink:0;display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'}
                                <span style="font-size:12px;font-weight:700;color:${m.p1 === 'TBD' ? 'var(--text-muted)' : '#fff'};">${m.p1}</span>
                            </div>
                            <div style="text-align:center;min-width:60px;flex-shrink:0;">
                                ${m.status === 'done'
                                    ? `<span style="font-family:var(--font-heading);font-size:15px;font-weight:900;">${m.s1} - ${m.s2}</span>`
                                    : `<span style="font-size:10px;font-weight:700;color:var(--text-muted);">${m.date}</span>`}
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;">
                                <span style="font-size:12px;font-weight:700;color:${m.p2 === 'TBD' ? 'var(--text-muted)' : '#fff'};">${m.p2}</span>
                                ${m.av2 ? avatar(m.av2, 24, false) : '<div style="width:24px;height:24px;border-radius:50%;background:var(--border-color);flex-shrink:0;display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'}
                            </div>
                        </div>`).join('')}
                </div>`).join('')}
        </div>`;
    }

    // ── Render Leagues ────────────────────────────────────
    function renderLeagues(data) {
        const container = document.getElementById('leagues-list');
        if (!container) return;

        container.innerHTML = `
        <div style="padding:16px 16px 0;">
            <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Format</div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Round-robin · W=${data.pointsSystem.win}pts · D=${data.pointsSystem.draw}pt · L=${data.pointsSystem.loss}pts · Top ${data.qualificationSpots} qualify for Champions</div>
        </div>
        ${data.leagues.map(lg => `
            <div class="trn-league-card">
                <div class="trn-league-header">
                    ${flag(lg.nationCode, 32, 22)}
                    <div style="flex:1;">
                        <div style="font-size:14px;font-weight:800;color:#fff;">${lg.name}</div>
                        <div style="font-size:10px;font-weight:600;color:var(--text-muted);margin-top:2px;">${lg.game} · Season ${data.season}</div>
                    </div>
                    ${statusBadge(lg.status)}
                </div>
                ${standingsTable(lg.standings, false)}
                <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Matches</div>
                ${matchList(lg.matches)}
                <div class="trn-reward-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-orange)"><path d="M12 2L3 6V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V6L12 2Z"/></svg>
                    <span style="font-size:11px;font-weight:700;color:var(--accent-orange);">${lg.reward}</span>
                    <span style="font-size:10px;color:var(--text-muted);margin-left:4px;">· Top 2 advance to Champions League</span>
                </div>
            </div>`).join('')}`;
    }

    // ── Render Champions ──────────────────────────────────
    function renderChampions(data) {
        const container = document.getElementById('champions-content');
        if (!container) return;

        container.innerHTML = `
            <div style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);border-radius:16px;padding:20px;margin-bottom:16px;position:relative;overflow:hidden;">
                <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
                <div style="font-family:var(--font-heading);font-size:22px;font-weight:900;color:#fff;line-height:1.1;">Champions<br>League ${data.season}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:8px;">Starts ${data.startDate}</div>
                <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;color:#fff;">${data.status.toUpperCase()}</div>
            </div>

            <div style="background:var(--bg-card);border-radius:12px;padding:14px;margin-bottom:16px;border:1px solid var(--border-color);">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Qualified Players</div>
                ${data.qualified.map(p => `
                    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-color);">
                        ${avatar(p.avatar, 32, false)}
                        ${flag(p.nationCode, 18, 12)}
                        <div style="flex:1;">
                            <div style="font-size:13px;font-weight:700;">${p.gamertag}</div>
                            <div style="font-size:10px;color:var(--text-muted);">${p.league} · ${p.leaguePos === 1 ? '🥇 1st' : '🥈 2nd'}</div>
                        </div>
                        <span style="font-size:9px;font-weight:800;color:#22c55e;background:rgba(34,197,94,0.12);padding:2px 8px;border-radius:4px;">QUALIFIED</span>
                    </div>`).join('')}
            </div>

            <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Group Stage</div>
            ${data.groups.map(grp => `
                <div style="margin-bottom:20px;">
                    <div style="font-size:11px;font-weight:700;color:var(--text-primary);margin-bottom:10px;">${grp.name}</div>
                    ${standingsTable(grp.standings, true)}
                </div>`).join('')}

            ${knockoutBracket(data.knockout)}`;
    }

    // ── Render World Cup (official engine) ──────────────
    function renderWorldCup(data) {
        const container = document.getElementById('worldcup-content');
        if (!container) return;

        // Estado do engine
        let currentGroup   = Object.keys(data.groups)[0];
        let currentMatchday = 'all';

        // Gerar partidas com resultados simulados
        const allMatches = [];
        let matchId = 1;
        for (const [grpName, teams] of Object.entries(data.groups)) {
            data.schedule.forEach(sch => {
                const played = Math.random() > 0.35;
                allMatches.push({
                    id: matchId++,
                    group: grpName,
                    matchday: sch.matchday,
                    teamA: teams[sch.slots[0]],
                    teamB: teams[sch.slots[1]],
                    scoreA: played ? Math.floor(Math.random() * 5) : null,
                    scoreB: played ? Math.floor(Math.random() * 5) : null,
                    played: played
                });
            });
        }

        function calcStandings(grpName) {
            const teams = data.groups[grpName].map(t => ({
                ...t, p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0
            }));
            allMatches.filter(m => m.group === grpName && m.played).forEach(m => {
                const tA = teams.find(t => t.id === m.teamA.id);
                const tB = teams.find(t => t.id === m.teamB.id);
                tA.p++; tB.p++;
                tA.gf += m.scoreA; tA.ga += m.scoreB;
                tB.gf += m.scoreB; tB.ga += m.scoreA;
                if (m.scoreA > m.scoreB)      { tA.w++; tA.pts += 3; tB.l++; }
                else if (m.scoreA < m.scoreB) { tB.w++; tB.pts += 3; tA.l++; }
                else                          { tA.d++; tB.d++; tA.pts++; tB.pts++; }
                tA.gd = tA.gf - tA.ga;
                tB.gd = tB.gf - tB.ga;
            });
            return teams.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        }

        function renderStandings(grpName) {
            const standings = calcStandings(grpName);
            return `
            <div class="table-header" style="padding:0;">
                <div class="th-left"><span>#</span><span>NATION / PLAYER</span></div>
                <div class="th-right" style="gap:0;">
                    <span style="width:22px;text-align:center;font-size:9px;">P</span>
                    <span style="width:22px;text-align:center;font-size:9px;color:#22c55e;">W</span>
                    <span style="width:22px;text-align:center;font-size:9px;">D</span>
                    <span style="width:22px;text-align:center;font-size:9px;color:#f87171;">L</span>
                    <span style="width:28px;text-align:center;font-size:9px;">GD</span>
                    <span style="width:28px;text-align:center;font-size:9px;color:var(--accent-orange);">PTS</span>
                </div>
            </div>
            <div class="standings-list" style="margin-bottom:16px;">
                ${standings.map((t,i) => `
                <div class="standing-row ${i < 2 ? 'advancing' : ''}">
                    <div class="st-left">
                        <span class="st-rank">${i+1}</span>
                        <img src="https://flagcdn.com/w40/${t.id}.png"
                             style="width:24px;height:16px;border-radius:2px;object-fit:cover;flex-shrink:0;">
                        <img src="${t.avatar}"
                             style="width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--border-color);"
                             onerror="this.style.display='none'">
                        <div>
                            <div style="font-size:12px;font-weight:700;">${t.nation}</div>
                            <div style="font-size:10px;color:var(--text-muted);">${t.player}</div>
                        </div>
                    </div>
                    <div class="st-right" style="gap:0;">
                        <span style="width:22px;text-align:center;">${t.p}</span>
                        <span style="width:22px;text-align:center;color:#22c55e;">${t.w}</span>
                        <span style="width:22px;text-align:center;">${t.d}</span>
                        <span style="width:22px;text-align:center;color:#f87171;">${t.l}</span>
                        <span style="width:28px;text-align:center;color:var(--text-muted);">${t.gd > 0 ? '+'+t.gd : t.gd}</span>
                        <span style="width:28px;text-align:center;color:var(--accent-orange);font-weight:800;">${t.pts}</span>
                    </div>
                </div>`).join('')}
            </div>
            <div class="legend-box"><div class="legend-color"></div> Advancing to Round of 16</div>`;
        }

        function renderMatches(grpName, matchday) {
            let matches = allMatches.filter(m => m.group === grpName);
            if (matchday !== 'all') matches = matches.filter(m => m.matchday == matchday);
            return matches.map(m => `
            <div class="match-card"
                 data-id="${m.id}" data-group="${m.group}" data-matchday="${m.matchday}"
                 data-teama="${m.teamA.nation}" data-teamb="${m.teamB.nation}"
                 data-playera="${m.teamA.player}" data-playerb="${m.teamB.player}"
                 data-avata="${m.teamA.avatar}" data-avatb="${m.teamB.avatar}"
                 data-flaga="https://flagcdn.com/w40/${m.teamA.id}.png"
                 data-flagb="https://flagcdn.com/w40/${m.teamB.id}.png"
                 data-scorea="${m.scoreA}" data-scoreb="${m.scoreB}"
                 data-played="${m.played}">
                <div class="match-row">
                    <div class="match-team">
                        <img src="${m.teamA.avatar}" class="m-flag"
                             style="border-radius:50%;object-fit:cover;"
                             onerror="this.src='https://flagcdn.com/w40/${m.teamA.id}.png'">
                        ${m.teamA.nation}
                    </div>
                    <div class="match-time">${m.played ? m.scoreA : '18:00'}</div>
                </div>
                <div class="match-row mt-12">
                    <div class="match-team">
                        <img src="${m.teamB.avatar}" class="m-flag"
                             style="border-radius:50%;object-fit:cover;"
                             onerror="this.src='https://flagcdn.com/w40/${m.teamB.id}.png'">
                        ${m.teamB.nation}
                    </div>
                    <div class="match-date">${m.played ? m.scoreB : 'TBD'}</div>
                </div>
            </div>`).join('');
        }

        function knockoutHtml() {
            return data.knockout.rounds.map(round => `
            <div style="margin-bottom:20px;">
                <div style="font-size:11px;font-weight:700;color:var(--accent-orange);margin-bottom:10px;">${round.name}</div>
                ${round.matches.map(m => `
                <div class="trn-match-row" style="background:var(--bg-pill);border-radius:8px;padding:10px 12px;margin-bottom:6px;">
                    <div style="display:flex;align-items:center;gap:8px;flex:1;">
                        <div style="width:24px;height:24px;border-radius:50%;background:var(--border-color);flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <span style="font-size:12px;font-weight:700;color:${m.p1==='TBD'?'var(--text-muted)':'#fff'};">${m.p1}</span>
                    </div>
                    <div style="text-align:center;min-width:60px;flex-shrink:0;">
                        <span style="font-size:10px;font-weight:700;color:var(--text-muted);">${m.date}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;">
                        <span style="font-size:12px;font-weight:700;color:${m.p2==='TBD'?'var(--text-muted)':'#fff'};">${m.p2}</span>
                        <div style="width:24px;height:24px;border-radius:50%;background:var(--border-color);flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                    </div>
                </div>`).join('')}
            </div>`).join('');
        }

        function build() {
            container.innerHTML = `
            <!-- Hero -->
            <div style="background:linear-gradient(135deg,#064e3b,#065f46);border-radius:16px;padding:20px;margin-bottom:16px;position:relative;overflow:hidden;">
                <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
                <div style="font-family:var(--font-heading);font-size:22px;font-weight:900;color:#fff;line-height:1.1;">World Cup<br>${data.season}™</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:8px;">ft. eFootball Mobile</div>
                <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;color:#fff;">${data.status.toUpperCase()}</div>
            </div>

            <!-- Filtro Stage -->
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

            <!-- GRUPO STAGE -->
            <div id="wcGroupStage">
                <section class="filters-section" style="padding-top:0;">
                    <div class="filter-row">
                        <div class="pills-scroll" id="wcGroupFilter">
                            ${Object.keys(data.groups).map((g,i) => `
                            <button class="pill ${i===0?'active':''} w-col-2" data-group="${g}">${g}</button>`).join('')}
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
                    <div id="wcStandingsContainer"></div>
                </section>
                <section class="matchups-section">
                    <h2 class="section-title">Matchups</h2>
                    <div id="wcMatchesContainer" class="match-cards"></div>
                </section>
            </div>

            <!-- KNOCKOUT STAGE -->
            <div id="wcKnockoutStage" style="display:none;padding:16px;">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">Knockout Bracket</div>
                ${knockoutHtml()}
            </div>`;

            // Render inicial
            document.getElementById('wcStandingsContainer').innerHTML = renderStandings(currentGroup);
            document.getElementById('wcMatchesContainer').innerHTML   = renderMatches(currentGroup, currentMatchday);

            // Stage filter
            container.querySelectorAll('#wcStageFilter .pill').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('#wcStageFilter .pill').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const stage = btn.dataset.stage;
                    document.getElementById('wcGroupStage').style.display    = stage === 'groups'   ? 'block' : 'none';
                    document.getElementById('wcKnockoutStage').style.display = stage === 'knockout' ? 'block' : 'none';
                });
            });

            // Group filter
            container.querySelectorAll('#wcGroupFilter .pill').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('#wcGroupFilter .pill').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentGroup = btn.dataset.group;
                    document.getElementById('wcStandingsContainer').innerHTML = renderStandings(currentGroup);
                    document.getElementById('wcMatchesContainer').innerHTML   = renderMatches(currentGroup, currentMatchday);
                });
            });

            // Matchday filter
            container.querySelectorAll('#wcMatchdayFilter .round-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('#wcMatchdayFilter .round-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentMatchday = btn.dataset.matchday;
                    document.getElementById('wcMatchesContainer').innerHTML = renderMatches(currentGroup, currentMatchday);
                });
            });

            // Match card click → modal
            container.querySelector('#wcMatchesContainer').addEventListener('click', e => {
                const card = e.target.closest('.match-card');
                if (!card) return;
                const modal = document.getElementById('matchModalOverlay');
                if (!modal) return;

                const names = modal.querySelectorAll('.matchup-team-name');
                if (names[0]) names[0].textContent = card.dataset.teama + ' · ' + card.dataset.playera;
                if (names[1]) names[1].textContent = card.dataset.teamb + ' · ' + card.dataset.playerb;

                const flags = modal.querySelectorAll('.matchup-flag');
                if (flags[0]) { flags[0].src = card.dataset.avata; flags[0].style.borderRadius='50%'; flags[0].style.objectFit='cover'; }
                if (flags[1]) { flags[1].src = card.dataset.avatb; flags[1].style.borderRadius='50%'; flags[1].style.objectFit='cover'; }

                const boxes = modal.querySelectorAll('.matchup-score-box');
                const played = card.dataset.played === 'true';
                if (boxes[0]) boxes[0].textContent = played ? card.dataset.scorea : '-';
                if (boxes[1]) boxes[1].textContent = played ? card.dataset.scoreb : '-';

                const dt = modal.querySelector('.matchup-datetime');
                if (dt) dt.textContent = played ? 'Full Time' : 'Scheduled · ' + card.dataset.group;

                const rows = modal.querySelectorAll('.matchup-detail-row span:last-child');
                if (rows[0]) rows[0].textContent = played ? 'Completed' : 'Scheduled';
                if (rows[1]) rows[1].textContent = 'MD ' + card.dataset.matchday;
                if (rows[2]) rows[2].textContent = card.dataset.group + ' · World Cup ' + data.season;

                modal.classList.add('open');
                document.body.classList.add('modal-open');
            });
        }

        build();
    }


    // ── Load ──────────────────────────────────────────────
    fetch('data/leagues.json')
        .then(r => r.json())
        .then(renderLeagues)
        .catch(err => console.error('Leagues error:', err));

    fetch('data/champions.json')
        .then(r => r.json())
        .then(renderChampions)
        .catch(err => console.error('Champions error:', err));

    fetch('data/worldcup.json')
        .then(r => r.json())
        .then(renderWorldCup)
        .catch(err => console.error('World Cup error:', err));

});
