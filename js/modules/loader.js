// MATZON - loader.js
// Responsabilidade: Carregar fragmentos HTML e disparar app:ready
'use strict';

(function () {
    var files = [
        { url: 'components/header.html',   id: 'slot-header',    append: false },
        { url: 'components/nav.html',      id: 'slot-nav',       append: false },
        { url: 'pages/dashboard.html',     id: 'slot-main',      append: true  },
        { url: 'pages/tournaments.html',   id: 'slot-main',      append: true  },
        { url: 'pages/profile.html',       id: 'slot-main',      append: true  },
        { url: 'pages/ranking.html',       id: 'slot-main',      append: true  },
        { url: 'components/modal.html',    id: 'slot-main',      append: true  },
        { url: 'components/footer.html',   id: 'slot-footer',    append: false },
        { url: 'pages/community.html',     id: 'slot-community', append: false },
    ];

    Promise.all(files.map(function(f) {
        return fetch(f.url).then(function(r) { return r.text(); });
    })).then(function(htmls) {
        var mainEl = document.getElementById('slot-main');
        if (mainEl) mainEl.innerHTML = '';

        files.forEach(function(f, i) {
            var el = document.getElementById(f.id);
            if (!el) return;
            if (f.append) {
                el.insertAdjacentHTML('beforeend', htmls[i]);
            } else {
                el.innerHTML = htmls[i];
            }
        });

        document.dispatchEvent(new CustomEvent('app:ready'));
    }).catch(function(err) {
        console.error('Loader error:', err);
        document.dispatchEvent(new CustomEvent('app:ready'));
    });
})();
