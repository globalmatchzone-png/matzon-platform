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
        fixEmojiFlags();
    }).catch(err => console.error('Dashboard load error:', err));

    function updateSideMenu(p, me, openCount) {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        const avatar = document.getElementById('menuAvatar');
        if (avatar) {
            avatar.textContent = p.initials;
            avatar.style.background = p.avatarGradient;
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

    function fixEmojiFlags() {
        const emojiMap = {
            '🇻🇳':'vn','🇲🇻':'mv','🇰🇬':'kg','🇳🇵':'np',
            '🇭🇰':'hk','🇱🇦':'la','🇵🇬':'pg','🇵🇰':'pk',
            '🇮🇳':'in','🇧🇹':'bt','🇲🇴':'mo','🇧🇳':'bn'
        };
        document.querySelectorAll('.compact-flags span').forEach(span => {
            const code = emojiMap[span.textContent.trim()];
            if (!code) return;
            const img = document.createElement('img');
            img.src       = `https://flagcdn.com/w40/${code}.png`;
            img.alt       = code.toUpperCase();
            img.className = 'flag';
            img.style.cssText = 'width:20px;height:13px;border-radius:2px;object-fit:cover;';
            span.replaceWith(img);
        });
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
