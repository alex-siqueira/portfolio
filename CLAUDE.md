# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static personal portfolio website for Alexandre Siqueira — a cybersecurity professional. The whole site is built by Jekyll 4.3 and deployed to GitHub Pages. Content is in Brazilian Portuguese; code comments are in English.

## Development

Serve the site locally:

```bash
bundle exec jekyll serve
```

Then visit http://localhost:4000.

Build static output to `_site/`:

```bash
bundle exec jekyll build
```

Every page — including `index.html` — carries YAML front matter and needs Jekyll to render. Serving the repo with a plain static file server will show raw front matter and no layout.

## Architecture

### Main page (`index.html`)
A single scrolling page with anchor sections: `#home`, `#sobre`, `#experiencia`, `#publicacoes`, `#contato`. It has front matter (`layout: default`) and is rendered by Jekyll like any other page.

Its publications grid is currently hardcoded and duplicates the `_posts` data that `blog/index.html` generates from `site.posts`. Keep the two in sync when adding a post.

### JavaScript (`js/script.js`)
Plain script, no build step, loaded on every page via `_layouts/default.html`. Five independent behaviors:
- **Header**: adds `.scrolled` class when `scrollY > 20` (passive scroll listener)
- **Mobile menu**: `setMenu()` toggles `.active` on `#nav` and sets `aria-expanded` / `aria-label` on `#menu-toggle`. `aria-expanded` is the single source of truth — the CSS swaps the hamburger/close icon from it, so JS never touches the icon.
- **Scroll spy**: `IntersectionObserver` with `rootMargin: '-40% 0px -55% 0px'` syncs `.active` on `.nav-link` elements. Only does anything on `index.html`, the one page with `section[id]` elements.
- **Timeline tabs**: `.timeline-tab[data-tab]` shows `#timeline-{target}`, hides others via `.hidden`
- **Publications filter**: `.filter-btn[data-filter]` toggles `.hidden` on `.pub-card` by `card.dataset.categories`. Runs on both `index.html` and `blog/index.html`.

The script assumes `#header`, `#menu-toggle` and `#nav` exist — they come from the shared layout, so every page has them.

### Icons
Three sources, deliberately:
- **Lucide** (`<i data-lucide="name">`, converted to `<svg>` at runtime) for UI icons. Pinned to a version with SRI in `_layouts/default.html` — never use `@latest`, and update the `integrity` hash whenever the version changes.
- **Inline SVG** for the GitHub / LinkedIn / YouTube brand marks. Lucide dropped brand icons in its 1.x line, so `data-lucide="github"` and friends silently render nothing. Do not reintroduce them.
- **Boxicons** (`<i class="bx bxl-*">`) for the three social icons in the contato section only.

Lucide loads *after* `script.js`, so `window.lucide` is undefined while `script.js` runs — don't call `createIcons()` from there.

### Blog (Jekyll)
- **Posts**: `_posts/YYYY-MM-DD-slug.md` — Jekyll convention, rendered via `_layouts/post.html`
- **Listing**: `blog/index.html` — uses `{% for post in site.posts %}` to auto-generate cards
- **Layouts**: `_layouts/default.html` (shared shell with header/footer/SEO), `_layouts/post.html` (extends default, adds post header and author footer)

#### Post front matter fields
All posts require: `title`, `date`, `description`, `excerpt_text`, `tag_label`, `tag_class`, `categories`, `card_description`, `schema_type`, `date_display`.

`tag_class` controls the badge color (e.g. `pub-tag--podcast`, `pub-tag--academico`). `categories` is a YAML list used by the JS filter on `blog/index.html`.

### CSS design system (`css/style.css`)
Single file, no preprocessor, organized in 16 numbered sections (`/* 1. TOKENS */` … `/* 16. RESPONSIVE */`). Design direction is "Builder Terminal" — one dark theme throughout, no light/dark section alternation.

Tokens live in `:root`:
- **Surfaces** (darkest → lightest): `--bg`, `--bg-elevated`, `--surface`, `--surface-2`
- **Borders**: `--border`, `--border-strong`
- **Text**: `--fg`, `--fg-secondary`, `--fg-muted`
- **Accent**: `--accent` (cyan `#4DDDFF`), `--accent-fg` for text on accent
- **Fonts**: `--ff-display` (Space Grotesk), `--ff-body` (Geist), `--ff-mono` (Geist Mono)
- **Radii**: `--r-1` … `--r-4`, `--r-pill`
- **Spacing**: `--s-1` (4px) … `--s-9` (96px)
- **Layout**: `--container` (1200px)

Sizes are plain `px` — there is no `rem` base trick. Body is `16px`.

`.hidden` is not a global utility; it only works where explicitly defined (`.timeline.hidden`, `.pub-card.hidden`).

Breakpoints, all `max-width`: 1024px, 900px (mobile nav takes over here), 768px, 480px.

### Deployment
GitHub Pages, built by `.github/workflows/jekyll.yml` on push to `main` — not by the Pages default Jekyll build. The workflow runs `bundle exec jekyll build` with `JEKYLL_ENV=production` and publishes `_site/`. The custom domain comes from `CNAME`.
