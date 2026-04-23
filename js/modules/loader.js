"use strict";
(function(){
var C=[["components/header.html","slot-header"],["components/nav.html","slot-nav"],["components/footer.html","slot-footer"],["components/modal.html","slot-modal"]];
var P={dashboard:"pages/dashboard.html",tournaments:"pages/tournaments.html",profile:"pages/profile.html",community:"pages/community.html"};
Promise.all(C.map(function(c){return fetch(c[0]).then(function(r){return r.text();}).then(function(h){var e=document.getElementById(c[1]);if(e)e.innerHTML=h;});})).then(function(){var p=window.location.hash.replace("#","")||"dashboard";return window.loadPage(P[p]?p:"dashboard");}).then(function(){document.dispatchEvent(new CustomEvent("app:ready"));}).catch(function(e){console.error(e);document.dispatchEvent(new CustomEvent("app:ready"));});
window.loadPage=function(n){var u=P[n];if(!u)return Promise.resolve();return fetch(u).then(function(r){return r.text();}).then(function(h){var e=document.getElementById("slot-main");if(e)e.innerHTML=h;window.location.hash=n;document.dispatchEvent(new CustomEvent("page:changed",{detail:{page:n}}));});};
window.addEventListener("hashchange",function(){var n=window.location.hash.replace("#","");if(P[n])window.loadPage(n);});
})();