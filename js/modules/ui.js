// MATZON - ui.js
// Active states e scroll horizontal
'use strict';

document.addEventListener('DOMContentLoaded', () => {

function setupActiveState(selector) {
        const items = document.querySelectorAll(selector);
        items.forEach(item => {
            item.addEventListener('click', function () {
                const parent = this.parentElement;
                parent.querySelectorAll(selector).forEach(s => s.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    setupActiveState('.tab-item');
    setupActiveState('.pill');
    setupActiveState('.round-btn');

    function setupHorizontalScroll(containerId, leftBtnClass, rightBtnClass) {
        const container = document.getElementById(containerId);
        const leftBtn   = leftBtnClass  ? document.querySelector(leftBtnClass)  : null;
        const rightBtn  = rightBtnClass ? document.querySelector(rightBtnClass) : null;
        if (!container) return;
        if (leftBtn)  leftBtn.addEventListener('click',  () => container.scrollBy({ left: -150, behavior: 'smooth' }));
        if (rightBtn) rightBtn.addEventListener('click', () => container.scrollBy({ left:  150, behavior: 'smooth' }));
    }

    setupHorizontalScroll('mainTabsScroll2', '.js-main-left2', '.js-main-right2');
    setupHorizontalScroll('zoneScroll', '.js-zone-left', null);

});
