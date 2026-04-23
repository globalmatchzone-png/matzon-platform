#!/usr/bin/env python3
import re, os

with open("index.html", "r") as f:
    html = f.read()

def between(h, start, end):
    si = h.find(start)
    if si < 0: return ""
    si += len(start)
    ei = h.find(end, si)
    if ei < 0: return ""
    return h[si:ei].strip()

header_m = re.search(r"<header[^>]*>.*?</header>", html, re.DOTALL)
header = header_m.group(0) if header_m else ""

nav_m = re.search(r"<nav[^>]*>.*?</nav>", html, re.DOTALL)
nav = nav_m.group(0) if nav_m else ""

footer_m = re.search(r"<footer[^>]*>.*?</footer>", html, re.DOTALL)
footer = footer_m.group(0) if footer_m else ""

modal_m = re.search(r'<section class="matchup-wrapper".*?</section>', html, re.DOTALL)
modal = modal_m.group(0) if modal_m else ""

dashboard = between(html,
    "<!-- ===== VIEW: DASHBOARD ===== -->",
    "<!-- ===== FIM VIEW: DASHBOARD ===== -->")

tournaments = between(html,
    "<!-- ===== VIEW: TOURNAMENTS ===== -->",
    "<!-- ===== FIM VIEW: TOURNAMENTS ===== -->")

profile = between(html,
    "<!-- ===== VIEW: PERFIL ===== -->",
    "<!-- ===== FIM VIEW: PERFIL ===== -->")

comm_s = html.find('<div id="communityWrapper"')
comm_e_marker = "<!-- ===== FIM COMMUNITY WRAPPER ===== -->"
comm_e = html.find(comm_e_marker)
community = html[comm_s:comm_e].strip() if comm_s >= 0 else ""

def write(path, content):
    open(path, "w").write(content)
    print("  " + path + " (" + str(content.count("\n")) + " linhas)")

write("components/header.html", header)
write("components/nav.html", nav)
write("components/footer.html", footer)
write("components/modal.html", modal)
write("pages/dashboard.html", dashboard)
write("pages/tournaments.html", tournaments)
write("pages/profile.html", profile)
write("pages/community.html", community)

loader = """// MATZON - loader.js
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
"""
open("js/modules/loader.js", "w").write(loader)
print("  js/modules/loader.js")

head_m = re.search(r"<head>.*?</head>", html, re.DOTALL)
head = head_m.group(0) if head_m else "<head></head>"

slim = """<!DOCTYPE html>
<html lang="pt-BR">
""" + head + """
<body>
<div class="app-container">
    <div id="slot-header"></div>
    <div id="slot-nav"></div>
    <main class="main-content" id="slot-main"></main>
    <div id="slot-footer"></div>
</div>
<div id="slot-community"></div>
<script src="js/modules/loader.js"></script>
<script src="js/modules/ui.js"></script>
<script src="js/modules/router.js"></script>
<script src="js/modules/carousel.js"></script>
<script src="js/modules/profile.js"></script>
<script src="js/modules/modal.js"></script>
<script src="js/app.js"></script>
</body>
</html>
"""
open("index.html", "w").write(slim)
print("  index.html (slim shell)")

for f in ["js/modules/ui.js","js/modules/router.js",
          "js/modules/carousel.js","js/modules/profile.js",
          "js/modules/modal.js"]:
    c = open(f).read()
    c = c.replace("'DOMContentLoaded'", '"app:ready"')
    open(f, "w").write(c)
    print("  Actualizado: " + f)

print("\nConcluido!")
print("Estrutura:")
os.system("find components pages js/modules -type f | sort")
