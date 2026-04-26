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

    // ── Render World Cup ──────────────────────────────────
    function renderWorldCup(data) {
        const container = document.getElementById('worldcup-content');
        if (!container) return;

        container.innerHTML = `
            <div style="background:linear-gradient(135deg,#064e3b,#065f46);border-radius:16px;padding:20px;margin-bottom:16px;position:relative;overflow:hidden;">
                <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
                <div style="font-family:var(--font-heading);font-size:22px;font-weight:900;color:#fff;line-height:1.1;">World Cup<br>${data.season}™</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:8px;">Starts ${data.startDate}</div>
                <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;color:#fff;">${data.status.toUpperCase()}</div>
            </div>

            <div style="background:var(--bg-card);border-radius:8px;padding:12px;margin-bottom:16px;border:1px solid var(--border-color);display:flex;align-items:center;gap:10px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span style="font-size:11px;color:var(--text-muted);">${data.qualificationNote}</span>
            </div>

            <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Group Stage</div>
            ${data.groups.map(grp => `
                <div style="margin-bottom:20px;">
                    <div style="font-size:11px;font-weight:700;color:var(--text-primary);margin-bottom:10px;">${grp.name}</div>
                    <div class="standings-list">
                        ${grp.standings.map(p => `
                            <div class="standing-row">
                                <div class="st-left">
                                    <span class="st-rank">${p.pos}</span>
                                    ${flag(p.nationCode, 24, 16)}
                                    <div>
                                        <div style="font-size:13px;font-weight:700;">${p.nation}</div>
                                        <div style="font-size:10px;color:var(--text-muted);">${p.player}</div>
                                    </div>
                                </div>
                                <div class="st-right">
                                    <span>${p.mp}</span>
                                    <span>${p.gd > 0 ? '+'+p.gd : p.gd}</span>
                                    <span class="st-pts">${p.pts}</span>
                                </div>
                            </div>`).join('')}
                    </div>
                </div>`).join('')}

            ${knockoutBracket(data.knockout)}`;
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
