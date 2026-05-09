# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static personal portfolio website for Alexandre Siqueira — a cybersecurity professional. The main page (`index.html`) is plain HTML/CSS/JS. The blog is powered by Jekyll 4.3 and deployed to GitHub Pages.

## Development

Serve the full site (Jekyll + main page) locally:

```bash
bundle exec jekyll serve
# visit http://localhost:4000
```

For main page only (no Jekyll needed):

```bash
python3 -m http.server 8080
```

Build static output to `_site/`:

```bash
bundle exec jekyll build
```

## Architecture

### Main page (`index.html`)
A single scrolling page with anchor sections: `#home`, `#sobre`, `#experiencia`, `#publicacoes`, `#contato`. Not processed by Jekyll — served as-is.

### JavaScript (`js/script.js`)
Four independent behaviors:
- **Header**: adds `.scrolled` class when `scrollY > 20` (passive scroll listener)
- **Mobile menu**: toggles `.active` on `#nav`, swaps hamburger/close icon, sets `aria-expanded`
- **Scroll spy**: `IntersectionObserver` with `rootMargin: '-40% 0px -55% 0px'` syncs `.active` on `.nav-link` elements
- **Timeline tabs**: `.timeline-tab[data-tab]` shows `#timeline-{target}`, hides others via `.hidden`
- **Publications filter**: `.filter-btn[data-filter]` toggles `.hidden` on `.pub-card` by `card.dataset.categories`

### Blog (Jekyll)
- **Posts**: `_posts/YYYY-MM-DD-slug.md` — Jekyll convention, rendered via `_layouts/post.html`
- **Listing**: `blog/index.html` — uses `{% for post in site.posts %}` to auto-generate cards
- **Layouts**: `_layouts/default.html` (shared shell with header/footer/SEO), `_layouts/post.html` (extends default, adds post header and author footer)

#### Post front matter fields
All posts require: `title`, `date`, `description`, `excerpt_text`, `tag_label`, `tag_class`, `categories`, `card_description`, `schema_type`, `date_display`.

`tag_class` controls the badge color (e.g. `pub-tag--podcast`, `pub-tag--academico`). `categories` is a YAML list used by the JS filter on `blog/index.html`.

### CSS design system (`css/style.css`)
Uses CSS custom properties. Key tokens:
- `--dark-bg`, `--light-surface`, `--accent`, `--accent-dark`
- `--font-serif` (Lora), `--font-sans` (Inter), `--font-mono` (Fira Code)
- `html { font-size: 62.5% }` → `1rem = 10px`

Sections alternate between `.section--dark` and `.section--light`.

### Deployment
Targets GitHub Pages. Jekyll builds `_site/` which is what gets published. `firebase.json` and `.firebaserc` have been removed.
