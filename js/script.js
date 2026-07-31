'use strict';

/* =========================================
   HEADER — scroll behavior
   ========================================= */
const header = document.getElementById('header');

// Set initial state in case page is loaded mid-scroll
if (window.scrollY > 20) {
    header.classList.add('scrolled');
}

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* =========================================
   MOBILE MENU
   ========================================= */
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

// aria-expanded is the single source of truth — the CSS swaps the icon from it
function setMenu(isOpen) {
    nav.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}

menuToggle.addEventListener('click', () => {
    setMenu(!nav.classList.contains('active'));
});

// Close mobile menu when a nav link is clicked
nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
});


/* =========================================
   SCROLL SPY — IntersectionObserver
   ========================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                const isCurrent = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isCurrent);
                if (isCurrent) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        }
    });
}, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
});

sections.forEach(section => spyObserver.observe(section));


/* =========================================
   TIMELINE TABS
   ========================================= */
const timelineTabs = [...document.querySelectorAll('.timeline-tab')];

function selectTab(tab, moveFocus) {
    timelineTabs.forEach(t => {
        const isCurrent = t === tab;
        t.classList.toggle('active', isCurrent);
        t.setAttribute('aria-selected', String(isCurrent));
        // roving tabindex: only the selected tab is in the tab order
        t.tabIndex = isCurrent ? 0 : -1;
        document.getElementById(`timeline-${t.dataset.tab}`).classList.toggle('hidden', !isCurrent);
    });
    if (moveFocus) tab.focus();
}

timelineTabs.forEach(tab => {
    tab.addEventListener('click', () => selectTab(tab));

    // arrow keys move between tabs, as expected of a tablist
    tab.addEventListener('keydown', event => {
        const last = timelineTabs.length - 1;
        const i = timelineTabs.indexOf(tab);
        let next;

        if (event.key === 'ArrowRight') next = timelineTabs[i === last ? 0 : i + 1];
        else if (event.key === 'ArrowLeft') next = timelineTabs[i === 0 ? last : i - 1];
        else if (event.key === 'Home') next = timelineTabs[0];
        else if (event.key === 'End') next = timelineTabs[last];
        else return;

        event.preventDefault();
        selectTab(next, true);
    });
});


/* =========================================
   PUBLICATIONS FILTER
   ========================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const pubCards = document.querySelectorAll('.pub-card');
const pubFilterStatus = document.getElementById('pub-filter-status');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => {
            const isCurrent = b === btn;
            b.classList.toggle('active', isCurrent);
            b.setAttribute('aria-pressed', String(isCurrent));
        });

        let visibleCount = 0;
        pubCards.forEach(card => {
            let isVisible;
            if (filter === 'all') {
                isVisible = true;
            } else {
                const categories = card.dataset.categories || '';
                isVisible = categories.split(' ').includes(filter);
            }
            card.classList.toggle('hidden', !isVisible);
            if (isVisible) visibleCount++;
        });

        if (pubFilterStatus) {
            const noun = visibleCount === 1 ? 'publicação encontrada' : 'publicações encontradas';
            pubFilterStatus.textContent = `${visibleCount} ${noun}`;
        }
    });
});

