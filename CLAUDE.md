# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static personal portfolio website for Alexandre Siqueira — a cybersecurity professional. It is a single-page application built with vanilla HTML, CSS, and JavaScript. No build tools, package managers, or frameworks are used.

## Development

To preview the site, open `index.html` directly in a browser or serve it with any static file server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Architecture

The site is a single HTML page (`index.html`) with five sections that function as "pages":
- **Home** — bio and social links
- **Services** (Atividades) — service cards
- **Resume** (Currículo) — tabbed panel with Experience/Education/Skills/About
- **Portfolio** — image carousel paired with project detail cards
- **Contact** — contact info and form

### Navigation model (`js/script.js`)
Navigation is fully client-side. Sections are stacked absolutely and toggled visible via `.active` class. Clicking a nav link triggers an animated transition: bars animate in/out, the header and target section fade in after a ~1.1s delay. The nav link index directly maps to the section index in the DOM.

### CSS design system (`css/style.css`)
CSS custom properties define the palette:
- `--bg-color`: `#101935` (dark navy)
- `--second-bg-color`: `#564787` (purple)
- `--main-color`: `#9AD4D6` (teal accent)
- `--white-color`: `#F2FDFF`

Font size uses `rem` units with `html { font-size: 62.5% }` (so `1rem = 10px`). Responsive breakpoints: 1200px, 992px, 810px, 768px, 600px, 450px, 400px.

### Portfolio carousel (`js/script.js`)
The carousel uses CSS `translateX` to slide `.img-slide`. The `index` variable (0–5) tracks the current slide and maps to the matching `.portfolio-detail` card shown on the left. Arrow buttons gain/lose `.disabled` at the bounds.

## Content status

Several sections still contain placeholder (lorem ipsum) content from the original template and need to be replaced with Alexandre's actual information:
- Services section (entirely placeholder)
- Resume section — Experience, Education, Skills, About Me tabs
- Portfolio section — project descriptions and links
- Contact section — phone, email, address
