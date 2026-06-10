# Portfolio Maintenance Guide — Krishi Attri

## Core Principle
- The homepage sells **Krishi Attri** (research identity, direction, proof of work).
- No single project should become the whole brand.
- Design system: dark instrument-panel — one ink, one instrument-teal accent (`--accent: #3ebfc6`), Fraunces / Hanken Grotesk / Spline Sans Mono, film grain. Committed dark theme (no toggle).
- **The site is "The Map"** — a 2D page grid of compass rooms with edge-button navigation (still a map — the thesis is SLAM — but each page is a normal, vertically-scrolling website page; no free pan). The free-pan ZUI **Research Chart** remains one toggle away ("⌖ CHART"), and a classic sectioned **document view** remains as the no-JS / SEO fallback and an explicit "DOC" reading mode.

---

## 0) Architecture — The Map (grid) · The Chart (ZUI) · The Document

Three complete render modes share one data source (`src/data.js`):

| Mode | When | Entry |
|---|---|---|
| **Map / grid** (default) | always (incl. reduced motion — pages swap instantly instead of sliding) | `src/grid/GridSite.jsx` |
| **Chart** (ZUI) | `?view=chart`, "⌖ CHART" toggle | `src/chart/Chart.jsx` |
| **Document** | `?view=doc`, "DOC" toggle, no-JS (build-time prerender) | `src/DocumentView.jsx` (wraps the classic `Shell.jsx` / `Sections.jsx`) |

The chosen view persists for the session (`sessionStorage["ka-view"]`).

### Grid anatomy (`src/grid/`)

The grid (plus-shaped; arms only connect through the center):

```
                       [N2 PUBLICATIONS]
                       [N1 RESEARCH    ]
[W2 BACKGROUND] [W1 EXPERIENCE] [00 HOME] [E1 SOFTWARE] [E2 ADAPTERS]
                       [S1 CONTACT     ]
                       [S2 FIELD LOG   ]
```

- **`grid.js`** — the room lattice (`ROOMS` with col/row, codes, names), cardinal `neighborOf`, and `roomFromHash` (station-level hashes like `#gaussianfeels` alias to their containing room).
- **`GridSite.jsx`** — the engine: full-viewport slide transitions (~520 ms cardinal, ~640 ms single diagonal slide for mini-map jumps; CSS keyframes driven by `--gv-dx/--gv-dy`), edge buttons (rendered only where a neighbor exists), persistent HOME button (every page except home), corner mini-map (hidden on home — the home centerpiece IS the map), hash routing (`pushState` + `hashchange`, browser back/forward work; deep links land via a quick orient slide from home), CHART/DOC view toggles, aria-live room announcements.
- **`RoomViews.jsx`** — one component per room, reusing `Sections.jsx` pieces (`ResearchCard`, `SoftwareCard`, `BackgroundSection`, `ContactSection`) plus grid-only pieces: the `GridMap` (mini-map + home centerpiece), `RoomXRef` neighbor pointers, the W1 experience route rail, the S1 Seoul→Orlando relocation arc, the S2 photo-plate grid, the E2 adapter constellation grouped by model family.
- **`src/grid.css`** — all grid styling (`gv-` prefix; chart classes are scoped under `.station`/`.panel`/`.hud` — keep it that way).

### Grid input contract (decided & shipped)
- **Wheel/scroll** only ever scrolls *inside* a room (native). No scroll-hijacking, no wheel page-flips.
- **← / →** always move across the grid (rooms only scroll vertically, so horizontal arrows are free).
- **↑ / ↓** scroll the room; AT the top/bottom scroll edge a **fresh** press (key-repeat is ignored, so holding ↓ can't overshoot through the south wall) steps to the neighboring room.
- **H / Esc** return home. Mobile: edge buttons become compact chevron tabs (side tabs at thumb height), horizontal swipe = E/W move.
- Reduced motion: instant page swaps, no slides.

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
- [ ] New content? It must land in **all three views**: `data.js` (single source) → usually automatic for grid + doc; for the chart also place a station in `layout.js` (+ `INDEX_GROUPS`/`INDEX_LABELS`, overlap check below). A brand-new *room* needs `grid.js` (lattice cell on an arm of the plus), `RoomViews.jsx` (content + `VIEWS` entry), and a `roomFromHash` alias for any station-level hashes.
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
| Grid rooms / neighbors / hash aliases | `src/grid/grid.js` |
| Room contents (map view) | `src/grid/RoomViews.jsx` |
| Grid engine (slides, edge buttons, keyboard, routing) | `src/grid/GridSite.jsx` |
| Grid styling (edge buttons, mini-map, home, rooms) | `src/grid.css` |
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

- [ ] Map (default): home shows identity + the “you are here” grid centerpiece; edge buttons slide the viewport (N→Research, E→Software, …); each room scrolls natively.
- [ ] Keyboard: ←/→ move across the grid; ↑/↓ scroll then step rooms at the scroll edge; H/Esc go home. Browser back/forward retrace moves; deep links (`/#publications`, `/#gaussianfeels`) land on the right room.
- [ ] Mini-map (corner / home centerpiece) jumps anywhere, incl. single diagonal slides (e.g. W2 → E1).
- [ ] Mobile (~420 px): compact chevron tabs (side tabs thumb-height), horizontal swipe = E/W, no brand/button overlap at the top.
- [ ] `?view=chart`: chart boots, drag-pan/zoom/index work, "MAP" button returns to the grid; deep link `/#gaussianfeels` opens the docked card there.
- [ ] `?view=doc`: document view renders; pip-copy buttons & expanders work; "BACK TO THE MAP" returns.
- [ ] Key numbers present in `dist/index.html` (grep: GaussianFeels, 0.83, 3.37, 91.5%, 3.7M, HiCache++).
- [ ] Reduced motion: pages swap instantly (no slides) in the map view.
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
