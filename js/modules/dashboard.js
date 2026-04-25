// MATZON - dashboard.js
'use strict';

document.addEventListener('app:ready', () => {

    Promise.all([
        fetch('data/player.json').then(r => r.json()),
        fetch('data/players.json').then(r => r.json()),
        fetch('data/tournaments.json').then(r => r.json())
    ]).then(([playerData, playersData, tournamentsData]) => {
        const p         = playerData.player;
        const me        = playersData.players.find(x => x.isYou);
        const openCount = tournamentsData.tournaments.filter(t => t.status === 'open' && t.slotsLeft > 0).length;

        updateSideMenu(p, me, openCount);

    }).catch(err => console.error('Dashboard load error:', err));

    function updateSideMenu(p, me, openCount) {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        const avatar = document.getElementById('menuAvatar');
        if (avatar) {
            avatar.innerHTML = '';
            avatar.style.background = 'none';
            avatar.style.padding = '0';
            avatar.style.overflow = 'hidden';
            const img = document.createElement('img');
            img.src = p.avatar || `https://randomuser.me/api/portraits/men/1.jpg`;
            img.alt = p.gamertag;
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
            img.onerror = () => { avatar.textContent = p.initials; avatar.style.background = p.avatarGradient; };
            avatar.appendChild(img);
        }

        set('menuGamertag',  p.gamertag);
        set('menuNationName', p.nation);
        set('menuRankNum',   '#' + (me ? me.rank : p.rank));
        set('menuPts',       me ? me.points.toLocaleString() : '980');
        set('menuMatches',   p.stats.matches);
        set('menuGoals',     p.stats.goals);
        set('menuOpenEvents', openCount);

        const flag = document.getElementById('menuNationFlag');
        if (flag) {
            flag.src = `https://flagcdn.com/w40/${p.nationCode}.png`;
            flag.alt = p.nation;
        }
    }


    document.addEventListener('player:joined-tournament', () => {
        Promise.all([
            fetch('data/player.json').then(r => r.json()),
            fetch('data/players.json').then(r => r.json()),
            fetch('data/tournaments.json').then(r => r.json())
        ]).then(([playerData, playersData, tournamentsData]) => {
            const p         = playerData.player;
            const me        = playersData.players.find(x => x.isYou);
            const openCount = tournamentsData.tournaments.filter(t => t.status === 'open' && t.slotsLeft > 0).length;
            updateSideMenu(p, me, openCount);
        });
    });

});
