// MATZON - ranking.js
// Responsabilidade: Tabela de ranking, pesquisa e renderização
'use strict';

document.addEventListener('app:ready', () => {

    const rankings = [
        { rank:1,  trend:'up',   val:1,  code:'it', name:'Italy',        fpi:'1406.88' },
        { rank:2,  trend:'up',   val:1,  code:'br', name:'Brazil',       fpi:'1398.93' },
        { rank:3,  trend:'up',   val:1,  code:'id', name:'Indonesia',    fpi:'1374.91' },
        { rank:4,  trend:'down', val:3,  code:'pl', name:'Poland',       fpi:'1326.80' },
        { rank:5,  trend:'up',   val:11, code:'fr', name:'France',       fpi:'1322.40' },
        { rank:6,  trend:'up',   val:2,  code:'jp', name:'Japan',        fpi:'1313.51' },
        { rank:7,  trend:'down', val:1,  code:'tr', name:'Türkiye',      fpi:'1286.19' },
        { rank:8,  trend:'up',   val:10, code:'ma', name:'Morocco',      fpi:'1278.15' },
        { rank:9,  trend:'new',  val:null,code:'pa',name:'Panama',       fpi:'1256.48' },
        { rank:10, trend:'down', val:1,  code:'th', name:'Thailand',     fpi:'1228.84' },
        { rank:11, trend:'down', val:6,  code:'mx', name:'Mexico',       fpi:'1217.64' },
        { rank:12, trend:'up',   val:5,  code:'mg', name:'Madagascar',   fpi:'1216.36' },
        { rank:13, trend:'down', val:2,  code:'ar', name:'Argentina',    fpi:'1198.67' },
        { rank:14, trend:'down', val:1,  code:'jo', name:'Jordan',       fpi:'1194.41' },
        { rank:15, trend:'same', val:null,code:'ly',name:'Libya',        fpi:'1176.68' },
        { rank:16, trend:'new',  val:null,code:'sy',name:'Syria',        fpi:'1173.95' },
        { rank:17, trend:'down', val:3,  code:'gr', name:'Greece',       fpi:'1169.35' },
        { rank:18, trend:'up',   val:3,  code:'ge', name:'Georgia',      fpi:'1155.26' },
        { rank:19, trend:'down', val:9,  code:'sn', name:'Senegal',      fpi:'1152.33' },
        { rank:20, trend:'down', val:13, code:'eg', name:'Egypt',        fpi:'1149.16' },
        { rank:21, trend:'new',  val:null,code:'ke',name:'Kenya',        fpi:'1145.97' },
        { rank:22, trend:'down', val:3,  code:'pe', name:'Peru',         fpi:'1145.20' },
        { rank:23, trend:'up',   val:6,  code:'nl', name:'Netherlands',  fpi:'1133.66' },
        { rank:24, trend:'down', val:4,  code:'cl', name:'Chile',        fpi:'1131.01' },
        { rank:25, trend:'up',   val:8,  code:'vn', name:'Vietnam',      fpi:'1102.45' },
    ];

    function getTrend(trend, val) {
        if (trend === 'up')   return `<span class="rnk-trend rnk-up">▲ ${val}</span>`;
        if (trend === 'down') return `<span class="rnk-trend rnk-down">▼ ${val}</span>`;
        if (trend === 'new')  return `<span class="rnk-trend rnk-new">NEW</span>`;
        return `<span class="rnk-trend rnk-same">—</span>`;
    }

    function render(data) {
        const list = document.getElementById('rankingList');
        if (!list) return;
        list.innerHTML = data.map(item => `
            <div class="rnk-item">
                <div class="rnk-num ${item.rank === 1 ? 'rnk-gold' : ''}">${item.rank}</div>
                ${getTrend(item.trend, item.val)}
                <div class="rnk-nation">
                    <img src="https://flagcdn.com/w40/${item.code}.png" alt="${item.name}" class="st-flag">
                    <span class="rnk-name">${item.name}</span>
                </div>
                <div class="rnk-fpi">${item.fpi}</div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
        `).join('');
    }

    render(rankings);

    const searchInput = document.getElementById('rankingSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            render(rankings.filter(i => i.name.toLowerCase().includes(term)));
        });
    }

});
