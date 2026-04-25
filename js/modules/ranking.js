// MATZON - ranking.js
'use strict';

document.addEventListener('app:ready', () => {

    let playersData = [];

    const countriesData = [
        { rank:1,  trend:'up',   val:1,   code:'it', name:'Italy',        fpi:'1406.88' },
        { rank:2,  trend:'up',   val:1,   code:'br', name:'Brazil',       fpi:'1398.93' },
        { rank:3,  trend:'up',   val:1,   code:'id', name:'Indonesia',    fpi:'1374.91' },
        { rank:4,  trend:'down', val:3,   code:'pl', name:'Poland',       fpi:'1326.80' },
        { rank:5,  trend:'up',   val:11,  code:'fr', name:'France',       fpi:'1322.40' },
        { rank:6,  trend:'up',   val:2,   code:'jp', name:'Japan',        fpi:'1313.51' },
        { rank:7,  trend:'down', val:1,   code:'tr', name:'Türkiye',      fpi:'1286.19' },
        { rank:8,  trend:'up',   val:10,  code:'ma', name:'Morocco',      fpi:'1278.15' },
        { rank:9,  trend:'new',  val:null,code:'pa', name:'Panama',       fpi:'1256.48' },
        { rank:10, trend:'down', val:1,   code:'th', name:'Thailand',     fpi:'1228.84' },
        { rank:11, trend:'down', val:6,   code:'mx', name:'Mexico',       fpi:'1217.64' },
        { rank:12, trend:'up',   val:5,   code:'mg', name:'Madagascar',   fpi:'1216.36' },
        { rank:13, trend:'down', val:2,   code:'ar', name:'Argentina',    fpi:'1198.67' },
        { rank:14, trend:'down', val:1,   code:'jo', name:'Jordan',       fpi:'1194.41' },
        { rank:15, trend:'same', val:null,code:'ly', name:'Libya',        fpi:'1176.68' },
        { rank:16, trend:'new',  val:null,code:'sy', name:'Syria',        fpi:'1173.95' },
        { rank:17, trend:'down', val:3,   code:'gr', name:'Greece',       fpi:'1169.35' },
        { rank:18, trend:'up',   val:3,   code:'ge', name:'Georgia',      fpi:'1155.26' },
        { rank:19, trend:'down', val:9,   code:'sn', name:'Senegal',      fpi:'1152.33' },
        { rank:20, trend:'down', val:13,  code:'eg', name:'Egypt',        fpi:'1149.16' },
        { rank:21, trend:'new',  val:null,code:'ke', name:'Kenya',        fpi:'1145.97' },
        { rank:22, trend:'down', val:3,   code:'pe', name:'Peru',         fpi:'1145.20' },
        { rank:23, trend:'up',   val:6,   code:'nl', name:'Netherlands',  fpi:'1133.66' },
        { rank:24, trend:'down', val:4,   code:'cl', name:'Chile',        fpi:'1131.01' },
        { rank:25, trend:'up',   val:8,   code:'vn', name:'Vietnam',      fpi:'1102.45' }
    ];

    fetch('data/players.json')
        .then(r => r.json())
        .then(json => { playersData = json.players; renderPlayers(playersData); })
        .catch(err => console.error('Players load error:', err));

    // Tabs
    const tabPlayers   = document.getElementById('rnkTabPlayers');
    const tabCountries = document.getElementById('rnkTabCountries');
    const panelPlayers   = document.getElementById('rnkPanelPlayers');
    const panelCountries = document.getElementById('rnkPanelCountries');

    if (tabPlayers) {
        tabPlayers.addEventListener('click', () => {
            tabPlayers.classList.add('active');
            tabCountries.classList.remove('active');
            panelPlayers.style.display   = 'block';
            panelCountries.style.display = 'none';
        });
    }

    if (tabCountries) {
        tabCountries.addEventListener('click', () => {
            tabCountries.classList.add('active');
            tabPlayers.classList.remove('active');
            panelCountries.style.display = 'block';
            panelPlayers.style.display   = 'none';
            renderCountries(countriesData);
        });
    }

    function renderPlayers(list) {
        const container = document.getElementById('rnkPlayerList');
        if (!container) return;

        container.innerHTML = list.map(p => {
            const youClass  = p.isYou ? 'rnk-item--you' : '';
            const rankClass = p.rank === 1 ? 'rnk-gold' : '';
            const youTag    = p.isYou ? '<span class="rnk-you-tag">YOU</span>' : '';
            const avatarBorder = p.isYou ? 'rnk-avatar--you' : '';

            return `
            <div class="rnk-item ${youClass}">
                <div class="rnk-num ${rankClass}">${p.rank}</div>
                <img src="${p.avatar}"
                     alt="${p.gamertag}"
                     class="rnk-avatar ${avatarBorder}"
                     onerror="this.src='https://randomuser.me/api/portraits/lego/${p.rank % 8}.jpg'">
                <div class="rnk-nation">
                    <div class="rnk-player-info">
                        <div class="rnk-name-row">
                            <span class="rnk-name">${p.gamertag}</span>
                            ${youTag}
                        </div>
                        <div class="rnk-nation-sub">
                            <img src="https://flagcdn.com/w40/${p.nationCode}.png" class="rnk-mini-flag" alt="${p.nation}">
                            ${p.nation}
                        </div>
                    </div>
                </div>
                <div class="rnk-points">${p.points.toLocaleString()}</div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${p.isYou ? 'var(--accent-orange)' : '#4b5563'}" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>`;
        }).join('');
    }

    function renderCountries(list) {
        const container = document.getElementById('rnkCountryList');
        if (!container) return;

        container.innerHTML = list.map(item => {
            let trend = '';
            if (item.trend === 'up')   trend = `<span class="rnk-trend rnk-up">▲ ${item.val}</span>`;
            if (item.trend === 'down') trend = `<span class="rnk-trend rnk-down">▼ ${item.val}</span>`;
            if (item.trend === 'new')  trend = `<span class="rnk-trend rnk-new">NEW</span>`;
            if (item.trend === 'same') trend = `<span class="rnk-trend rnk-same">—</span>`;

            return `
            <div class="rnk-item">
                <div class="rnk-num ${item.rank === 1 ? 'rnk-gold' : ''}">${item.rank}</div>
                ${trend}
                <div class="rnk-nation">
                    <img src="https://flagcdn.com/w40/${item.code}.png" alt="${item.name}" class="st-flag">
                    <span class="rnk-name">${item.name}</span>
                </div>
                <div class="rnk-fpi">${item.fpi}</div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>`;
        }).join('');
    }

    // Search
    const searchInput = document.getElementById('rankingSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const term = e.target.value.toLowerCase();
            const isPlayers = tabPlayers && tabPlayers.classList.contains('active');
            if (isPlayers) {
                renderPlayers(playersData.filter(p =>
                    p.gamertag.toLowerCase().includes(term) ||
                    p.nation.toLowerCase().includes(term)
                ));
            } else {
                renderCountries(countriesData.filter(c =>
                    c.name.toLowerCase().includes(term)
                ));
            }
        });
    }

    // Core loop
    document.addEventListener('player:joined-tournament', () => {
        const me = playersData.find(p => p.isYou);
        if (!me) return;
        const oldRank = me.rank;
        me.points += 50;
        playersData.sort((a, b) => b.points - a.points);
        playersData.forEach((p, i) => { p.rank = i + 1; });
        renderPlayers(playersData);
        const newRank = me.rank;
        if (newRank < oldRank) showToast(`+50 pts · Rank ${oldRank} → ${newRank}`);
        else showToast(`+50 pts · Ranking updated`);
    });

    function showToast(msg) {
        let toast = document.getElementById('rnk-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'rnk-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.className = 'rnk-toast rnk-toast--visible';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('rnk-toast--visible'), 3000);
    }

});
