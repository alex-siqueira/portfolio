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
All icons come from `_includes/icon.html`. There is no icon library and no icon CDN.

```liquid
{% include icon.html name="github" size="18" %}
{% include icon.html name="menu" size="22" class="menu-toggle__open" %}
```

To add an icon, add a `{%- when 'name' -%}` branch to `_includes/icon.html` with the raw `<path>`/`<circle>`/`<rect>` elements — the file supplies the surrounding `<svg>` wrapper, so branches hold shapes only. Keep the 24×24 viewBox and the stroke style; icons are drawn with `currentColor`, so they inherit color and hover states from their container.

The `size` argument is only the pre-CSS starting value. Actual sizes come from the stylesheet (`.nav-icon svg`, `.info-list__item svg`, `.timeline__company svg`, and so on), which sets width/height at every call site.

This replaced Lucide and Boxicons, which together cost ~218KB over the wire to draw 16 icons. It also closes the failure mode that motivated the change: Lucide removed all brand icons in its 1.x line, so `github`, `linkedin` and `youtube` silently rendered nothing. Don't reach for an icon library for brand marks — Simple Icons ships a 1MB font, Boxicons has had no release since 2022.

### Blog (Jekyll)
- **Posts**: `_posts/YYYY-MM-DD-slug.md` — Jekyll convention, rendered via `_layouts/post.html`
- **Listing**: `blog/index.html` and the publications grid on `index.html` both loop `{% for post in site.posts %}` and render `_includes/pub-card.html` for each post — same partial, same data, so the two can't diverge again. `index.html` passes `heading="h3"` (nested under its `<h2>` section heading), `blog/index.html` passes `heading="h2"` (nested under its `<h1>` page heading).
- **Layouts**: `_layouts/default.html` (shared shell with header/footer/SEO), `_layouts/post.html` (extends default, adds post header and author footer)

#### Post front matter fields
All posts require: `title`, `date`, `description`, `excerpt_text`, `tag_label`, `tag_class`, `tag_icon`, `categories`, `card_description`, `schema_type`, `date_display`.

`tag_class` controls the badge color (e.g. `pub-tag--podcast`, `pub-tag--academico`). `tag_icon` is the icon name passed to `_includes/icon.html` inside the badge — `tag_class` alone isn't enough because `pub-tag--academico` covers two different icons (`book-open` for book chapters, `presentation` for conference papers). `categories` is a YAML list used by the JS filter on both `index.html` and `blog/index.html`.

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
