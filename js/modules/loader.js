"use strict";
(function(){
  var COMPONENTS=[
    ["components/header.html","slot-header"],
    ["components/nav.html","slot-nav"],
    ["components/footer.html","slot-footer"],
    ["components/modal.html","slot-modal"]
  ];
  var PAGES={
    dashboard:"pages/dashboard.html",
    tournaments:"pages/tournaments.html",
    profile:"pages/profile.html",
    community:"pages/community.html"
  };
  Promise.all(COMPONENTS.map(function(c){
    return fetch(c[0]).then(function(r){return r.text();}).then(function(html){
      var el=document.getElementById(c[1]);
      if(el)el.innerHTML=html;
    });
  })).then(function(){
    var p=window.location.hash.replace("#","")||"dashboard";
    return window.loadPage(PAGES[p]?p:"dashboard");
  }).then(function(){
    document.dispatchEvent(new CustomEvent("app:ready"));
  }).catch(function(err){
    console.error("Loader error:",err);
    document.dispatchEvent(new CustomEvent("app:ready"));
  });
  window.loadPage=function(name){
    var url=PAGES[name];
    if(!url)return Promise.resolve();
    return fetch(url).then(function(r){return r.text();}).then(function(html){
      var el=document.getElementById("slot-main");
      if(el)el.innerHTML=html;
      window.location.hash=name;
      document.dispatchEvent(new CustomEvent("page:changed",{detail:{page:name}}));
    });
  };
  window.addEventListener("hashchange",function(){
    var n=window.location.hash.replace("#","");
    if(PAGES[n])window.loadPage(n);
  });
})();
