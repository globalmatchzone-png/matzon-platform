// MATZON - competition.js
// Domestic Leagues, Champions League, World Cup
'use strict';

document.addEventListener('app:ready', () => {

    // ── Render Leagues ────────────────────────────────────
    function renderLeagues(data) {
        const container = document.getElementById('leagues-list');
        if (!container) return;

        container.innerHTML = data.leagues.map(lg => `
            <div class="trn-league-card" data-id="${lg.id}">
                <div class="trn-league-header">
                    <img src="https://flagcdn.com/w40/${lg.nationCode}.png" alt="${lg.nation}" style="width:32px;height:22px;border-radius:3px;object-fit:cover;">
                    <div>
                        <div style="font-size:14px;font-weight:800;color:#fff;">${lg.name}</div>
                        <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">${lg.game} · Season ${lg.season}</div>
                    </div>
                    <div class="trn-league-status trn-status-${lg.status}">${lg.status.toUpperCase()}</div>
                </div>

                <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin:12px 0 8px;">Standings</div>
                ${lg.standings.map(p => `
                    <div class="trn-standing-row ${p.pos === 1 ? 'trn-standing-top' : ''}">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="font-size:12px;font-weight:700;color:var(--text-muted);width:16px;">${p.pos}</span>
                            <img src="${p.avatar}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">
                            <span style="font-size:13px;font-weight:700;">${p.gamertag}</span>
                        </div>
                        <div style="display:flex;gap:16px;font-size:12px;font-weight:700;">
                            <span style="color:var(--text-muted);">${p.mp}MP</span>
                            <span style="color:var(--text-muted);">${p.gd > 0 ? '+' : ''}${p.gd}GD</span>
                            <span style="color:var(--accent-orange);">${p.pts}pts</span>
                        </div>
                    </div>
                `).join('')}

                <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin:12px 0 8px;">Matches</div>
                ${lg.matches.map(m => `
                    <div class="trn-match-row">
                        <div style="display:flex;align-items:center;gap:8px;flex:1;">
                            <img src="${m.av1}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;">
                            <span style="font-size:12px;font-weight:700;">${m.p1}</span>
                        </div>
                        <div style="text-align:center;min-width:50px;">
                            ${m.status === 'done'
                                ? `<span style="font-size:14px;font-weight:900;color:#fff;">${m.s1} - ${m.s2}</span>`
                                : `<span style="font-size:10px;font-weight:700;color:var(--text-muted);">${m.date}</span>`
                            }
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;">
                            <span style="font-size:12px;font-weight:700;">${m.p2}</span>
                            <img src="${m.av2}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;">
                        </div>
                    </div>
                `).join('')}

                <div style="margin-top:12px;padding:10px;background:rgba(255,122,0,0.08);border-radius:8px;border:1px solid rgba(255,122,0,0.2);">
                    <div style="font-size:10px;font-weight:700;color:var(--accent-orange);">🏆 ${lg.reward}</div>
                    <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">Top 2 qualify for Champions League</div>
                </div>
            </div>
        `).join('');
    }

    // ── Render Champions ──────────────────────────────────
    function renderChampions(data) {
        const container = document.getElementById('champions-content');
        if (!container) return;

        const statusColor = data.status === 'upcoming' ? '#f59e0b' : '#10b981';

        container.innerHTML = `
            <div style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);border-radius:16px;padding:20px;margin-bottom:20px;position:relative;overflow:hidden;">
                <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
                <div style="font-size:22px;font-weight:900;font-family:var(--font-heading);color:#fff;line-height:1.1;">Champions<br>League</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:8px;">Starts ${data.startDate}</div>
                <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;color:#fff;">${data.status.toUpperCase()}</div>
            </div>

            <div style="font-size:11px;color:var(--text-muted);margin-bottom:16px;padding:10px;background:var(--bg-card);border-radius:8px;">
                📋 ${data.qualificationNote}
            </div>

            ${data.groups.map(grp => `
                <div style="margin-bottom:20px;">
                    <div style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">${grp.name}</div>
                    ${grp.standings.map(p => `
                        <div class="trn-standing-row">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-size:12px;font-weight:700;color:var(--text-muted);width:16px;">${p.pos}</span>
                                <img src="${p.avatar}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">
                                <img src="https://flagcdn.com/w20/${p.nationCode}.png" style="width:16px;height:11px;border-radius:2px;object-fit:cover;">
                                <span style="font-size:13px;font-weight:700;">${p.gamertag}</span>
                            </div>
                            <div style="display:flex;gap:16px;font-size:12px;font-weight:700;">
                                <span style="color:var(--text-muted);">${p.mp}MP</span>
                                <span style="color:var(--text-muted);">${p.gd > 0 ? '+' : ''}${p.gd}GD</span>
                                <span style="color:var(--accent-orange);">${p.pts}pts</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        `;
    }

    // ── Render World Cup ──────────────────────────────────
    function renderWorldCup(data) {
        const container = document.getElementById('worldcup-content');
        if (!container) return;

        container.innerHTML = `
            <div style="background:linear-gradient(135deg,#064e3b,#065f46);border-radius:16px;padding:20px;margin-bottom:20px;position:relative;overflow:hidden;">
                <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">MATZON</div>
                <div style="font-size:22px;font-weight:900;font-family:var(--font-heading);color:#fff;line-height:1.1;">World Cup<br>${data.season}™</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:8px;">Starts ${data.startDate}</div>
                <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;color:#fff;">${data.status.toUpperCase()}</div>
            </div>

            <div style="font-size:11px;color:var(--text-muted);margin-bottom:16px;padding:10px;background:var(--bg-card);border-radius:8px;">
                🌍 ${data.qualificationNote}
            </div>

            ${data.groups.map(grp => `
                <div style="margin-bottom:20px;">
                    <div style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">${grp.name}</div>
                    ${grp.standings.map(p => `
                        <div class="trn-standing-row">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-size:12px;font-weight:700;color:var(--text-muted);width:16px;">${p.pos}</span>
                                <img src="https://flagcdn.com/w40/${p.nationCode}.png" style="width:28px;height:19px;border-radius:3px;object-fit:cover;">
                                <div>
                                    <div style="font-size:13px;font-weight:700;">${p.nation}</div>
                                    <div style="font-size:10px;color:var(--text-muted);">${p.player}</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:16px;font-size:12px;font-weight:700;">
                                <span style="color:var(--text-muted);">${p.mp}MP</span>
                                <span style="color:var(--text-muted);">${p.gd > 0 ? '+' : ''}${p.gd}GD</span>
                                <span style="color:var(--accent-orange);">${p.pts}pts</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        `;
    }

    // ── Load Data ─────────────────────────────────────────
    fetch('data/leagues.json')
        .then(r => r.json())
        .then(data => renderLeagues(data))
        .catch(err => console.error('Leagues load error:', err));

    fetch('data/champions.json')
        .then(r => r.json())
        .then(data => renderChampions(data))
        .catch(err => console.error('Champions load error:', err));

    fetch('data/worldcup.json')
        .then(r => r.json())
        .then(data => renderWorldCup(data))
        .catch(err => console.error('World Cup load error:', err));

});
