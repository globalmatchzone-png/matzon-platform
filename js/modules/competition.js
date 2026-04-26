// MATZON - competition.js
'use strict';

document.addEventListener('app:ready', () => {

    // ── Render Leagues ────────────────────────────────────
    function renderLeagues(data) {
        const container = document.getElementById('leagues-list');
        if (!container) return;

        container.innerHTML = data.leagues.map(lg => `
            <div class="trn-league-card">
                <div class="trn-league-header">
                    <img src="https://flagcdn.com/w40/${lg.nationCode}.png"
                         alt="${lg.nation}"
                         style="width:32px;height:22px;border-radius:3px;object-fit:cover;flex-shrink:0;">
                    <div>
                        <div style="font-size:14px;font-weight:800;color:#fff;">${lg.name}</div>
                        <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">${lg.game} · Season ${lg.season}</div>
                    </div>
                    <div class="trn-league-status trn-status-${lg.status}">${lg.status.toUpperCase()}</div>
                </div>

                <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Standings</div>
                ${lg.standings.map(p => `
                    <div class="trn-standing-row ${p.pos === 1 ? 'trn-standing-top' : ''}">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="font-size:12px;font-weight:700;color:var(--text-muted);width:16px;">${p.pos}</span>
                            <img src="${p.avatar}"
                                 style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;"
                                 onerror="this.style.display='none'">
                            <span style="font-size:13px;font-weight:700;">${p.gamertag}</span>
                        </div>
                        <div style="display:flex;gap:16px;font-size:12px;font-weight:700;">
                            <span style="color:var(--text-muted);">${p.mp}MP</span>
                            <span style="color:var(--text-muted);">${p.gd > 0 ? '+' : ''}${p.gd}GD</span>
                            <span style="color:var(--accent-orange);">${p.pts}pts</span>
                        </div>
                    </div>`).join('')}

                <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Matches</div>
                ${lg.matches.map(m => `
                    <div class="trn-match-row">
                        <div style="display:flex;align-items:center;gap:8px;flex:1;">
                            <img src="${m.av1}"
                                 style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;"
                                 onerror="this.style.display='none'">
                            <span style="font-size:12px;font-weight:700;">${m.p1}</span>
                        </div>
                        <div style="text-align:center;min-width:56px;">
                            ${m.status === 'done'
                                ? `<span style="font-size:14px;font-weight:900;color:#fff;">${m.s1} - ${m.s2}</span>`
                                : `<span style="font-size:10px;font-weight:700;color:var(--text-muted);">${m.date}</span>`}
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;">
                            <span style="font-size:12px;font-weight:700;">${m.p2}</span>
                            <img src="${m.av2}"
                                 style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;"
                                 onerror="this.style.display='none'">
                        </div>
                    </div>`).join('')}

                <div class="trn-reward-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-orange)">
                        <path d="M12 2L3 6V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V6L12 2Z"/>
                    </svg>
                    <span style="font-size:11px;font-weight:700;color:var(--accent-orange);">${lg.reward}</span>
                    <span style="font-size:10px;color:var(--text-muted);margin-left:4px;">· Top 2 qualify for Champions</span>
                </div>
            </div>`).join('');
    }

    // ── Render Champions ──────────────────────────────────
    function renderChampions(data) {
        const container = document.getElementById('champions-content');
        if (!container) return;

        container.innerHTML = `
            <div style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);border-radius:16px;padding:20px;margin-bottom:16px;position:relative;overflow:hidden;">
                <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
                <div style="font-size:22px;font-weight:900;font-family:var(--font-heading);color:#fff;line-height:1.1;">Champions<br>League</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:8px;">Starts ${data.startDate}</div>
                <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;color:#fff;">${data.status.toUpperCase()}</div>
            </div>

            <div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:16px;border:1px solid var(--border-color);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                <span style="font-size:11px;color:var(--text-muted);">${data.qualificationNote}</span>
            </div>

            ${data.groups.map(grp => `
                <div style="margin-bottom:20px;">
                    <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">${grp.name}</div>
                    ${grp.standings.map(p => `
                        <div class="trn-standing-row">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-size:12px;font-weight:700;color:var(--text-muted);width:16px;">${p.pos}</span>
                                <img src="${p.avatar}"
                                     style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;"
                                     onerror="this.style.display='none'">
                                <img src="https://flagcdn.com/w20/${p.nationCode}.png"
                                     style="width:16px;height:11px;border-radius:2px;object-fit:cover;flex-shrink:0;">
                                <span style="font-size:13px;font-weight:700;">${p.gamertag}</span>
                            </div>
                            <div style="display:flex;gap:16px;font-size:12px;font-weight:700;">
                                <span style="color:var(--text-muted);">${p.mp}MP</span>
                                <span style="color:var(--text-muted);">${p.gd > 0 ? '+' : ''}${p.gd}GD</span>
                                <span style="color:var(--accent-orange);">${p.pts}pts</span>
                            </div>
                        </div>`).join('')}
                </div>`).join('')}`;
    }

    // ── Render World Cup ──────────────────────────────────
    function renderWorldCup(data) {
        const container = document.getElementById('worldcup-content');
        if (!container) return;

        container.innerHTML = `
            <div style="background:linear-gradient(135deg,#064e3b,#065f46);border-radius:16px;padding:20px;margin-bottom:16px;position:relative;overflow:hidden;">
                <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
                <div style="font-size:22px;font-weight:900;font-family:var(--font-heading);color:#fff;line-height:1.1;">World Cup<br>${data.season}™</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:8px;">Starts ${data.startDate}</div>
                <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;color:#fff;">${data.status.toUpperCase()}</div>
            </div>

            <div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:16px;border:1px solid var(--border-color);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span style="font-size:11px;color:var(--text-muted);">${data.qualificationNote}</span>
            </div>

            ${data.groups.map(grp => `
                <div style="margin-bottom:20px;">
                    <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">${grp.name}</div>
                    ${grp.standings.map(p => `
                        <div class="trn-standing-row">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-size:12px;font-weight:700;color:var(--text-muted);width:16px;">${p.pos}</span>
                                <img src="https://flagcdn.com/w40/${p.nationCode}.png"
                                     style="width:28px;height:19px;border-radius:3px;object-fit:cover;flex-shrink:0;">
                                <div>
                                    <div style="font-size:13px;font-weight:700;">${p.nation}</div>
                                    <div style="font-size:10px;color:var(--text-muted);font-weight:600;">${p.player}</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:16px;font-size:12px;font-weight:700;">
                                <span style="color:var(--text-muted);">${p.mp}MP</span>
                                <span style="color:var(--text-muted);">${p.gd > 0 ? '+' : ''}${p.gd}GD</span>
                                <span style="color:var(--accent-orange);">${p.pts}pts</span>
                            </div>
                        </div>`).join('')}
                </div>`).join('')}`;
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
