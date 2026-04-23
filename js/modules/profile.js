// MATZON - profile.js
// Perfil e barras de performance
'use strict';

document.addEventListener("app:ready", () => {

function animateProfileBars() {
        document.querySelectorAll('#profileView .prf-panel.active .prf-bar-fill').forEach(fill => {
            const target = fill.dataset.width + '%';
            fill.style.width = '0%';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                fill.style.width = target;
            }));
        });
    }

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
    window.MATZON.animateProfileBars = typeof animateProfileBars === 'function' ? animateProfileBars : function(){};
});
