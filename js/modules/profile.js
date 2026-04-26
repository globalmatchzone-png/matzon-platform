// MATZON - profile.js
// Carrega player.json e renderiza perfil dinamicamente
'use strict';

document.addEventListener('app:ready', () => {

    fetch('data/player.json')
        .then(r => r.json())
        .then(data => renderProfile(data.player))
        .catch(err => console.error('Profile load error:', err));

    function renderProfile(p) {

        // Hero
        setEl('prf-hero-bg', el => el.style.backgroundImage = `url('https://flagcdn.com/w640/${p.nationCode}.png')`);
        setEl('prf-flag-img', el => { el.src = `https://flagcdn.com/w40/${p.nationCode}.png`; el.alt = p.nation; });

        // Avatar real
        const avatarEl = document.getElementById('prf-initials');
        if (avatarEl) {
            avatarEl.innerHTML = '';
            avatarEl.style.background = 'none';
            avatarEl.style.padding = '0';
            avatarEl.style.overflow = 'hidden';
            const img = document.createElement('img');
            img.src = p.avatar || `https://randomuser.me/api/portraits/men/1.jpg`;
            img.alt = p.gamertag;
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
            img.onerror = () => { avatarEl.textContent = p.initials; avatarEl.style.background = p.avatarGradient; };
            avatarEl.appendChild(img);
        }
        setEl('prf-gamertag',   el => el.textContent = p.gamertag);
        setEl('prf-role-pill',  el => el.textContent = p.role);
        setEl('prf-nation-txt', el => el.textContent = p.nation);
        setEl('prf-world-rank-num', el => el.textContent = '#' + p.rank);

        // Stats strip
        setEl('prf-stat-matches',  el => el.textContent = p.stats.matches);
        setEl('prf-stat-goals',    el => el.textContent = p.stats.goals);
        setEl('prf-stat-assists',  el => el.textContent = p.stats.assists);
        setEl('prf-stat-avg',      el => el.textContent = p.stats.avg);

        // Form
        const formRow = document.getElementById('prf-form-row');
        if (formRow) {
            formRow.innerHTML = p.form.map(f => {
                const cls = f === 'W' ? 'prf-form-w' : f === 'L' ? 'prf-form-l' : 'prf-form-d';
                return `<div class="round-btn ${cls}">${f}</div>`;
            }).join('');
        }

        // Performance bars
        const perfCard = document.getElementById('prf-perf-card');
        if (perfCard) {
            perfCard.innerHTML = p.performance.map(item => `
                <div class="prf-bar-row">
                    <div class="prf-bar-label">${item.label}</div>
                    <div class="prf-bar-track">
                        <div class="prf-bar-fill" data-width="${item.value}" style="background:${item.color};"></div>
                    </div>
                    <div class="prf-bar-val">${item.value}</div>
                </div>
            `).join('');
        }

        // Current tournament
        const ct = p.currentTournament;
        setEl('prf-tourney-name', el => el.textContent = ct.name);
        setEl('prf-tourney-desc', el => el.textContent = ct.desc);
        setEl('prf-tourney-pos',  el => el.textContent = ct.position);
        setEl('prf-ct-mp',        el => el.textContent = ct.mp);
        setEl('prf-ct-goals',     el => el.textContent = ct.goals);
        setEl('prf-ct-assists',   el => el.textContent = ct.assists);
        setEl('prf-ct-avg',       el => el.textContent = ct.avg);

        // History
        const historyList = document.getElementById('prf-history-list');
        if (historyList) {
            historyList.innerHTML = p.history.map(m => {
                const cls = m.result === 'W' ? 'prf-form-w' : m.result === 'L' ? 'prf-form-l' : 'prf-form-d';
                return `
                <div class="match-card prf-cursor-default">
                    <div class="match-row">
                        <div class="match-team">
                            <img src="https://flagcdn.com/w40/${p.nationCode}.png" alt="${p.nation}" class="m-flag">
                            ${p.nation} vs ${m.opponent}
                        </div>
                        <div class="prf-history-right">
                            <div class="prf-result-badge ${cls}">${m.result}</div>
                            <div class="match-time prf-text-14">${m.goals}G ${m.assists}A</div>
                        </div>
                    </div>
                    <div class="match-row mt-12">
                        <div class="match-date prf-text-normal">${m.competition}</div>
                        <div class="match-date">${m.date}</div>
                    </div>
                </div>`;
            }).join('');
        }

        // Badges
        const badgesGrid = document.getElementById('prf-badges-grid');
        if (badgesGrid) {
            badgesGrid.innerHTML = p.badges.map(b => `
                <div class="standing-row prf-badge-card ${b.locked ? 'prf-badge-locked' : ''}">
                    <div class="prf-badge-icon">${b.icon}</div>
                    <div class="prf-badge-info">
                        <div class="st-name">${b.name}</div>
                        <div class="prf-badge-desc">${b.desc}</div>
                    </div>
                    ${b.locked
                        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-muted)"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93C9.33 17.79 7 14.5 7 11V7.18L12 5z"/></svg>`
                        : `<div class="legend-color prf-badge-dot"></div>`
                    }
                </div>`
            ).join('');
        }

        animateProfileBars();
    }

    function setEl(id, fn) {
        const el = document.getElementById(id);
        if (el) fn(el);
    }

    function animateProfileBars() {
        document.querySelectorAll('#profileView .prf-panel.active .prf-bar-fill').forEach(fill => {
            const target = fill.dataset.width + '%';
            fill.style.width = '0%';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                fill.style.width = target;
            }));
        });
    }

    // Tabs
    const prfTabs = document.querySelectorAll('.js-prf-tab');
    prfTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            prfTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.prf-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById(tab.getAttribute('data-target'));
            if (panel) {
                panel.classList.add('active');
                panel.querySelectorAll('.prf-bar-fill').forEach(fill => {
                    const target = fill.dataset.width + '%';
                    fill.style.width = '0%';
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        fill.style.width = target;
                    }));
                });
            }
        });
    });

    window.MATZON = window.MATZON || {};
    window.MATZON.animateProfileBars = animateProfileBars;

    // Settings panel
    const settingsBtn   = document.getElementById('prfSettingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsClose = document.getElementById('settingsCloseBtn');

    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.add('open');
            document.body.classList.add('modal-open');
        });
    }
    if (settingsClose) {
        settingsClose.addEventListener('click', () => {
            settingsPanel.classList.remove('open');
            document.body.classList.remove('modal-open');
        });
    }

    // Toggles
    document.querySelectorAll('.settings-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => toggle.classList.toggle('active'));
    });

    // Language picker
    const langSetting = document.getElementById('settingLanguage');
    const currentLang = document.getElementById('currentLang');
    const langs = ['English', 'Português', 'Français', 'Español', 'العربية'];
    let langIndex = 0;
    if (langSetting) {
        langSetting.addEventListener('click', () => {
            langIndex = (langIndex + 1) % langs.length;
            if (currentLang) currentLang.textContent = langs[langIndex];
        });
    }
});
