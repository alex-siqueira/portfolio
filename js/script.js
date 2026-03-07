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
const menuIcon = menuToggle.querySelector('i');

menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuIcon.className = isOpen ? 'bx bx-x' : 'bx bx-menu';
});

// Close mobile menu when a nav link is clicked
nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuIcon.className = 'bx bx-menu';
    });
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
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
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
const timelineTabs = document.querySelectorAll('.timeline-tab');

timelineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        timelineTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.timeline').forEach(tl => tl.classList.add('hidden'));
        document.getElementById(`timeline-${target}`).classList.remove('hidden');
    });
});


/* =========================================
   PUBLICATIONS FILTER
   ========================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const pubCards = document.querySelectorAll('.pub-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        pubCards.forEach(card => {
            if (filter === 'all') {
                card.classList.remove('hidden');
            } else {
                const categories = card.dataset.categories || '';
                card.classList.toggle('hidden', !categories.includes(filter));
            }
        });
    });
});
