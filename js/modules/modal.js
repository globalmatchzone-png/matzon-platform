// MATZON - modal.js
// Modal de detalhes do jogo
'use strict';

document.addEventListener('DOMContentLoaded', () => {

function createEmojiImage(emoji) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="54"><rect width="100%" height="100%" fill="#222a35" rx="4"/><text x="50%" y="50%" font-size="32" font-family="sans-serif" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    const accHeader    = document.getElementById('matchupAccordionHeader');
    const accContainer = document.getElementById('matchupDetailsAccordion');
    if (accHeader && accContainer) {
        accHeader.addEventListener('click', () => accContainer.classList.toggle('matchup-open'));
    }

    const matchModal    = document.getElementById('matchModalOverlay');
    const matchCloseBtn = document.getElementById('closeMatchModal');

    const allMatches = document.querySelectorAll(
        '#dashboardView .match-col, #dashboardView .compact-match-col, #tournamentsView .match-card'
    );

    if (matchModal && matchCloseBtn) {
        allMatches.forEach(match => {
            match.addEventListener('click', (e) => {
                e.preventDefault();

                let team1 = "TBD", team2 = "TBD";
                const defaultShield = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='54'><rect width='100%' height='100%' fill='%23222a35' rx='4'/><path d='M40 12L22 18v12c0 11 8 21 18 24 10-3 18-13 18-24V18L40 12z' fill='none' stroke='%238e9bb0' stroke-width='2'/></svg>";
                let flag1 = defaultShield, flag2 = defaultShield;
                let time = "00:00", date = "TBD";

                try {
                    if (match.classList.contains('match-col')) {
                        const teamNames = match.querySelectorAll('.team-name');
                        if (teamNames[0]) team1 = teamNames[0].textContent.trim();
                        if (teamNames[1]) team2 = teamNames[1].textContent.trim();
                        const imgs = match.querySelectorAll('img.flag, img.team-logo');
                        if (imgs.length >= 2) { flag1 = imgs[0].src; flag2 = imgs[1].src; }
                        else if (imgs.length === 1) { flag2 = imgs[0].src; }
                        const timeEl = match.querySelector('.time');
                        if (timeEl) time = timeEl.textContent.trim();
                        const dayGroup = match.closest('.day-group');
                        if (dayGroup) {
                            const dateEl = dayGroup.querySelector('.day-title');
                            if (dateEl) date = dateEl.textContent.trim();
                        }
                    } else if (match.classList.contains('compact-match-col')) {
                        const timeEl = match.querySelector('.compact-time');
                        if (timeEl) time = timeEl.textContent.trim();
                        date = "TODAY"; team1 = "Player 1"; team2 = "Player 2";
                        const emojiSpans = match.querySelectorAll('.compact-flags span');
                        if (emojiSpans[0]) flag1 = createEmojiImage(emojiSpans[0].textContent);
                        if (emojiSpans[1]) flag2 = createEmojiImage(emojiSpans[1].textContent);
                    } else if (match.classList.contains('match-card')) {
                        const matchTeams = match.querySelectorAll('.match-team');
                        if (matchTeams[0]) { team1 = matchTeams[0].textContent.trim(); const i = matchTeams[0].querySelector('img'); if (i) flag1 = i.src; }
                        if (matchTeams[1]) { team2 = matchTeams[1].textContent.trim(); const i = matchTeams[1].querySelector('img'); if (i) flag2 = i.src; }
                        const timeEl = match.querySelector('.match-time');
                        if (timeEl) time = timeEl.textContent.trim();
                        const dateEl = match.querySelector('.match-date');
                        if (dateEl) date = dateEl.textContent.trim();
                    }

                    const modalTeamNames = matchModal.querySelectorAll('.matchup-team-name');
                    if (modalTeamNames[0]) modalTeamNames[0].textContent = team1;
                    if (modalTeamNames[1]) modalTeamNames[1].textContent = team2;
                    const modalFlags = matchModal.querySelectorAll('.matchup-flag');
                    if (modalFlags[0]) modalFlags[0].src = flag1;
                    if (modalFlags[1]) modalFlags[1].src = flag2;
                    const modalDateTime = matchModal.querySelector('.matchup-datetime');
                    if (modalDateTime) modalDateTime.textContent = `${date} - ${time}`;
                    const detailRows = matchModal.querySelectorAll('.matchup-detail-row span:last-child');
                    if (detailRows[0]) detailRows[0].textContent = date;
                    if (detailRows[1]) detailRows[1].textContent = time;
                    const breadcrumbLink = matchModal.querySelector('.matchup-breadcrumbs a');
                    if (breadcrumbLink) breadcrumbLink.textContent = `${team1} vs ${team2}`;

                    matchModal.classList.add('open');
                    document.body.classList.add('modal-open');
                } catch (err) {
                    console.error('Modal error:', err);
                    matchModal.classList.add('open');
                    document.body.classList.add('modal-open');
                }
            });
        });

        matchCloseBtn.addEventListener('click', () => {
            matchModal.classList.remove('open');
            document.body.classList.remove('modal-open');
        });
    }

});

// Global
// Global — tabs dentro do modal de match
window.switchMatchupTab = function (clickedTab) {
    document.querySelectorAll('.matchup-tab').forEach(tab => tab.classList.remove('matchup-active'));
    clickedTab.classList.add('matchup-active');
};
