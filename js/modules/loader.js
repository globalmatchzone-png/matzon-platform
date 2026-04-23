// MATZON - loader.js
// Responsabilidade: Carregar HTML e disparar app:ready
"use strict";

(function () {
    var SLOTS = [
        ["components/header.html",   "slot-header",    false],
        ["components/nav.html",      "slot-nav",       false],
        ["pages/dashboard.html",     "slot-main",      true],
        ["pages/tournaments.html",   "slot-main",      true],
        ["pages/profile.html",       "slot-main",      true],
        ["components/modal.html",    "slot-main",      true],
        ["components/footer.html",   "slot-footer",    false],
        ["pages/community.html",     "slot-community", false],
    ];

    Promise.all(SLOTS.map(function(s) {
        return fetch(s[0]).then(function(r) { return r.text(); });
    })).then(function(htmls) {
        var mainEl = document.getElementById("slot-main");
        if (mainEl) mainEl.innerHTML = "";

        SLOTS.forEach(function(s, i) {
            var el = document.getElementById(s[1]);
            if (!el) return;
            if (s[2]) {
                el.insertAdjacentHTML("beforeend", htmls[i]);
            } else {
                el.innerHTML = htmls[i];
            }
        });
        document.dispatchEvent(new CustomEvent("app:ready"));
    }).catch(function(err) {
        console.error("Loader error:", err);
        document.dispatchEvent(new CustomEvent("app:ready"));
    });
})();