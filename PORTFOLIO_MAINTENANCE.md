# Portfolio Maintenance Guide — Krishi Attri

## Core Principle
- The homepage sells **Krishi Attri** (research identity, direction, proof of work).
- No single project should become the whole brand.
- Design system: dark instrument-panel — one ink, one instrument-teal accent (`--accent: #3ebfc6`), Fraunces / Hanken Grotesk / Spline Sans Mono, film grain. Committed dark theme (no toggle).
- **The site is "The Research Chart"** — a pannable/zoomable map canvas (the thesis is SLAM; the site itself is a map). A classic sectioned **document view** remains as the reduced-motion / no-JS / SEO fallback and as an explicit "DOC VIEW" reading mode.

---

## 0) Architecture — The Research Chart

Two complete render modes share one data source (`src/data.js`):

| Mode | When | Entry |
|---|---|---|
| **Chart** (default) | JS + no reduced-motion preference | `src/chart/Chart.jsx` |
| **Document** | `prefers-reduced-motion`, `?view=doc`, "DOC VIEW" button, no-JS (build-time prerender) | `src/DocumentView.jsx` (wraps the classic `Shell.jsx` / `Sections.jsx`) |

### Chart anatomy (`src/chart/`)
- **`layout.js`** — the world. Station positions/sizes in world units (px at zoom ×1.00), district rects, edges, the adapter constellation, station-index order, camera constants (zoom bands: `far < 0.34 ≤ mid < 0.62 ≤ near`). World origin (0,0) ≙ Seoul; the coordinate readout derives pseudo-lat/lon from it.
- **`Chart.jsx`** — DOM ZUI engine. One `.world` div, `translate3d + scale`, camera lives in refs and writes transforms imperatively (no React re-render on pan → ~60 fps). Drag-pan, wheel-zoom (ctrl/pinch aware, trackpad-pan aware), two-pointer pinch, keyboard (arrows pan, `+/-` zoom, `f` fit, `h` home, `i` index, Esc closes, Tab cycles stations), hash deep links (`#gaussianfeels`, `#research`, …), boot sequence, fly-to tweening.
- **`Stations.jsx`** — in-world card renderers per type (`hero/research/software/xp/education/…/photo/marker/geo`) + the HiCache++ adapter satellite dots.
- **`WorldDecor.jsx`** — graticule, origin axes + tick labels, district frames/watermarks, SVG survey edges (non-scaling strokes, labels appear at near zoom).
- **`Panel.jsx`** — the full card: desktop docked panel; content reused by the mobile bottom sheet.
- **`Hud.jsx`** — top bar, live coordinate readout, zoom controls, mini-map (click/drag to jump), station index (desktop panel), mobile bottom sheet (peek/list/card states).
- **`src/chart.css`** — all chart styling, progressive disclosure via `[data-band]` on `.viewport` (labels FADE when too small — they never shrink illegible), boot animations, reduced-motion + mobile rules.

### Progressive disclosure
- **far** — district watermarks + station far-labels only (cards ghosted).
- **mid** — card chrome, titles, headline stats.
- **near** — full teaser content, edge labels, graticule ticks; in-card links become clickable (the full-card hit overlay turns off).
- **click/tap** — fly-to + full card (panel / bottom sheet). Every fact lives in the full card at screen scale, so nothing depends on zoomed text being readable.

### SEO / no-JS prerender
`vite.config.js` has a `prerenderDocument()` plugin: after build it SSR-renders `src/prerender-entry.jsx` (the document view) into `dist/index.html` inside `<div id="root">`. With JS, `html.js .prerendered { display: none }` hides it and React mounts; without JS the full document renders (reveal/boot animations are `html.js`-gated in `styles.css`). **After any content change, grep `dist/index.html` for the new numbers** — they must appear in the built HTML.

---

## 1) Content Update Checklist

- [ ] Profile headline/tagline reflects current role (SNU M.S. → UCF Ph.D. as timeline evolves).
- [ ] GaussianFeels numbers match the **thesis abstract** (currently: 0.83 mm sim / 3.37 mm real ADD-S, ≈28 / ≈23.5 FPS, 7.6×, 94% F-score retention).
- [ ] Selected Work has only high-signal projects with proof.
- [ ] Experience reflects latest academic/professional role changes.
- [ ] Contact links valid; CV/Resume links point to latest PDFs in `public/assets/docs/`.
- [ ] OG image exists (`public/assets/images/og-image.png`); `sitemap.xml` / `robots.txt` valid.
- [ ] New station? Add data in `data.js`, place it in `layout.js` (position + measured height), add it to `INDEX_GROUPS`/`INDEX_LABELS`, and re-run the overlap check (below).
- [ ] GitHub Pages deployment workflow succeeds.

### Station placement workflow
1. Add/edit content in `src/data.js`.
2. Place the station in `src/chart/layout.js` (pick a spot inside its district; `h` is an estimate used for anchors/minimap).
3. Build + preview, then in the browser console measure real heights / overlaps (or use a headless run): stations must not overlap by more than ~8 px.
4. Update the district rect if the station extends past it.

---

## 2) Rules for Research & Software Cards

Add to **Research** or **Software** only with clear substance and proof:
1. **Problem** 2. **What I Built** 3. **Tools** 4. **Proof** (paper, demo, repo, benchmark, artifact).
- Card summary 1–3 short lines; metrics whenever possible.
- Full-card detail bullets live in `details` (research) / `summary + stats` (software).
- GaussianFeels expanded card is distilled from the **thesis abstract only** — keep it that way.
- Immature projects → **Archive** ("Earlier builds" station).

## 3) Documents & Credentials
- Files in `public/assets/docs/`; stable readable filenames; replace high-traffic docs (CV/Resume) at the same URL.

## 4) Experience Items
- Role, Organisation, Date range, Location; 2–4 impact bullets (results, not task lists).
- Experience renders as the **route** in District 03 (oldest → now, dashed continuation to UCF). Keep chronological order in `ROUTE_IDS`.

## 5) Visual Consistency Rules
- One accent. Mono for instrument copy, Fraunces for titles. No new fonts/colors.
- Labels fade with zoom, never shrink below legibility.
- Keep card density balanced; if a station grows, re-measure its height in `layout.js`.

---

## 6) Where to Update What

| Content | File |
|---|---|
| Profile text, headline, hero meta | `src/data.js` → `profile` |
| Research entries (incl. GaussianFeels stats) | `src/data.js` → `research` |
| Publications | `src/data.js` → `publications` |
| Software libraries (pip lines, stats, links) | `src/data.js` → `software` |
| HiCache++ adapter repo cluster | `src/data.js` → `adapters` (constellation auto-generates) |
| Experience / education / honors / documents / skills / archive | `src/data.js` |
| Field-log gallery | `src/data.js` → `gallery`, `galleryVideos` |
| Station positions, districts, edges, index order | `src/chart/layout.js` |
| Station card rendering | `src/chart/Stations.jsx` · full cards: `src/chart/Panel.jsx` |
| Chart instruments (minimap, readout, sheet) | `src/chart/Hud.jsx` |
| Chart styling / zoom bands / boot | `src/chart.css` |
| Document view (fallback) UI | `src/DocumentView.jsx`, `src/components/*` , `src/styles.css` |
| OG / meta / fonts / JSON-LD | `index.html` |
| SEO | `sitemap.xml`, `robots.txt`, build-time prerender (`vite.config.js`) |

---

## 7) Pre-Push Checklist

```bash
npm install
npm run build      # must log "✓ prerendered document view into dist/index.html"
npm run preview
```

- [ ] Chart boots (graticule → stations plot in → edges draw), then settles on the hero.
- [ ] Drag-pan, wheel zoom, pinch (touch), minimap jump, `i` index, Esc all work; no console errors.
- [ ] Click GaussianFeels → fly-to + docked full card; deep link `/#gaussianfeels` works on fresh load.
- [ ] Key numbers present in `dist/index.html` (grep: GaussianFeels, 0.83, 3.37, 91.5%, 3.7M, HiCache++).
- [ ] Mobile (~420 px): bottom sheet index, tap station → sheet card; pinch zoom.
- [ ] `?view=doc` and reduced-motion render the document view; pip-copy buttons & expanders work there.
- [ ] GitHub Pages deployment succeeds (push to `main` triggers `.github/workflows/deploy.yml`).

---

## 8) "Do Not Add" List (Anti-Clutter)
- Date of birth, nationality, full GRE breakdowns, every course line item.
- Massive thesis dumps (abstract-level only on the GaussianFeels card).
- Unproven/placeholder projects; repeated content across stations.
- New CI workflows (the existing Pages deploy is the only one).

## 9) Future Work (not yet done)
- [ ] **GaussianFeels results gallery** — reconstruction images/video station in District 01 when public.
- [ ] **PoP-SLAM benchmark table** — full-card table when the paper is public.
- [ ] **Publications station growth** — formal venues when published.
- [ ] **Update role to UCF Ph.D.** — profile/meta/experience + flip the route's dashed UCF stop to solid (Aug 2026); consider re-anchoring the chart origin to Orlando.
- [ ] **OG image refresh** — consider a chart-styled OG image.
