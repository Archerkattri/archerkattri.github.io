# Portfolio Maintenance Guide — Krishi Attri

## Core Principle
- The homepage sells **Krishi Attri** (research identity, direction, proof of work).
- No single project should become the whole brand.
- Design system: dark instrument-panel — one ink, one instrument-teal accent (`--accent: #3ebfc6`), Fraunces / Hanken Grotesk / Spline Sans Mono, film grain. Committed dark theme (no toggle).
- **The site is "The Map"** — a 2D page grid of compass rooms with edge-button navigation (still a map — the thesis is SLAM — but each page is a normal, vertically-scrolling website page; no free pan). The free-pan ZUI **Research Chart** remains one toggle away ("⌖ CHART"), and a classic sectioned **document view** remains as the no-JS / SEO fallback and an explicit "DOC" reading mode.
- **No em dashes in user-visible copy** (data.js strings, JSX copy, aria labels, index.html title/meta). They read as machine-written; use commas, colons, parens, "·". Date ranges use the en dash "–". This file (not user-visible) may use them. Verify with the build check below.
- **Type discipline:** Fraunces is reserved for titles and a few set-piece moments (home headline, section titles, card titles, the contact email, the W1 margin note). Numeric readouts (`.stat-v`, `.sw-stat dd`) are mono: they are instruments, not display type.
- **Rhythm:** the layout is deliberately non-uniform — flagship sheets run the full measure while follow-up sheets indent (`.sheet:not(.flagship)`), software datasheets stagger left/right (`.sw-stack`), gallery plates tilt. Don't "clean up" these offsets back into a uniform grid.

---

## 0) Architecture — The Map (grid) · The Chart (ZUI) · The Document

Three render modes share one data source (`src/data.js`), but they are **not** three copies of the same content. Each mode has a job:

| Mode | Job | Content level | Entry |
|---|---|---|---|
| **Map / grid** (default) | the spatial site — explore room by room | **Full**: every room carries its complete content (same components as doc view) | `src/grid/GridSite.jsx` |
| **Chart** (ZUI) | the relationship/overview layer — what connects to what | **Overview**: station datasheets + survey edges. Deep CV minutiae (the Documents file-cabinet, leadership lines, earlier roles) deliberately do NOT get stations; a marker points to the map/doc views | `src/chart/Chart.jsx` |
| **Document** | the complete linear record — CV-true, everything | **Everything**: if it is on the CV, it is here | `src/DocumentView.jsx` (wraps `Shell.jsx` / `Sections.jsx`) |

Rule of thumb when adding content: data.js → doc view and the owning map room get it automatically (shared components); the chart only gets a station if it earns one as an *overview* object (a project, a stop on the route, a cluster). Proof documents, mirrors, and per-item links never need a chart station.

The chosen view persists for the session (`sessionStorage["ka-view"]`).

### Grid anatomy (`src/grid/`)

The grid (plus-shaped; arms only connect through the center). Room titles
are deliberately self-explanatory — reading the title tells you what's inside:

```
                   [N2 PUBLICATIONS]
                   [N1 RESEARCH    ]
[W2 SCHOOL] [W1 EXPERIENCE] [00 HOME] [E1 PERSONAL PROJECTS] [E2 SCHOOL PROJECTS]
                   [S1 CONTACT     ]
                   [S2 GALLERY     ]
```

- **E1 PERSONAL PROJECTS** — the three released library datasheets (splatreg / mathlas / HiCache++) with the 14-repo HiCache accelerator constellation as the room's closing section (`#adapter-constellation`): 13 accelerator repos (12 HiCache/HiCache++ adapters + the fast-trellis2 TaylorSeer baseline) + the ComfyUI-HiCache node, grouped by model family with an "Integrations" group.
- **E2 SCHOOL PROJECTS** — the FMC-sponsored capstone (featured, with demo/award/photos links) + the "Earlier builds" archive (CV-complete: includes the robotic arm, SOLIDWORKS scooter, basketball-prediction entries).
- **W2 SCHOOL** — education (with REAL-lab / Diploma links), honors & fellowships (linked proofs), **leadership** (CubeSat / VISO / SASE / ASME), documents (CV/resume/PDFs, with Drive mirrors via the `drive` field), the condensed stack.
- **W1 EXPERIENCE** — the route (per-stop proof links from the CV: EOD robot, drone, Silo demo, certificates, host letter) + the compact "Also held, Villanova" earlier-roles block. The UCF stop renders as a penciled margin note (`.gv-route-next`), not a boxed pill.
- **S2 GALLERY** — the photo/video plates (formerly "Field log").
- Legacy hash slugs stay as **redirect aliases** (don't remove): `#software` → E1, `#adapters` → E1's constellation section, `#background` → W2, `#fieldlog` / `#field-log` → S2. New canonical slugs: `#personal-projects`, `#school-projects`, `#school`, `#gallery`.

- **`grid.js`** — the room lattice (`ROOMS` with col/row, codes, names), cardinal `neighborOf`, `roomFromHash` (station-level hashes like `#gaussianfeels` alias to their containing room; legacy room slugs alias to the renamed rooms), and `sectionFromHash` (hashes that land on an in-room section anchor, e.g. `#adapters`).
- **`GridSite.jsx`** — the engine: full-viewport slide transitions (~520 ms cardinal, ~640 ms single diagonal slide for mini-map jumps; CSS keyframes driven by `--gv-dx/--gv-dy`), edge buttons (rendered only where a neighbor exists), persistent HOME button (every page except home), corner mini-map (hidden on home — the home centerpiece IS the map), hash routing (`pushState` + `hashchange`, browser back/forward work; deep links land via a quick orient slide from home), CHART/DOC view toggles, aria-live room announcements.

### Edge buttons (decided & shipped)
- **Desktop rest state:** a bare arrow chevron (42×42 px plate + a 12 px invisible hit halo via `::after`).
- **Hover / keyboard `:focus-visible`:** the destination name slides out of the arrow (`max-width` + opacity transition on `.gv-edge-label`). The E button is `row-reverse` so its arrow stays pinned to the screen edge and the label opens inward.
- **Touch (<760 px):** no hover, so N/S keep a small always-on label (there's room at the top/bottom screen edges); E/W are chevron-only thumb tabs at 58% height (horizontal swipe also moves E/W). This is the documented touch decision — do not add tap-to-reveal.
- Full room names always live in `aria-label`, never truncated.

### Home room (decided & shipped)
The right column of HOME is **one composed plate** (`.gv-bench`): the headshot (Fig. 00, with surveyor coordinates in the air above it and the SVG survey stamp inked over its corner) and the room-grid map (Fig. 01) sit side by side inside a single frame, bottom-aligned, separated by a dashed internal divider, with one shared caption rail underneath ("FIG. 00 · THE SURVEYOR" / "FIG. 01 · THE MAP · PRESS AN EDGE, OR A CELL"). On mobile the bench keeps the two-plate row at a narrower ratio. Don't split it back into separate stacked cards.
- **`RoomViews.jsx`** — one component per room, reusing `Sections.jsx` pieces (`ResearchCard`, `SoftwareCard`, `SchoolSection`, `SchoolProjectsSection`, `ContactSection`) plus grid-only pieces: the `GridMap` (mini-map + home centerpiece), `RoomXRef` neighbor pointers (must always show the *current* room names), `SectionJump` in-room pointers, the W1 experience route rail, the S1 Seoul→Orlando relocation arc, the S2 photo-plate grid, the E1 adapter constellation grouped by model family.
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
- [ ] New content? `data.js` (single source) → automatic for grid + doc; for the chart, only add a station if it earns one as an overview object (see §0 mode jobs; + `INDEX_GROUPS`/`INDEX_LABELS`, overlap check below). A brand-new *room* needs `grid.js` (lattice cell on an arm of the plus), `RoomViews.jsx` (content + `VIEWS` entry), and a `roomFromHash` alias for any station-level hashes.
- [ ] **CV-link audit** (after any CV/resume PDF replacement): extract embedded links (`pikepdf`/`pdfplumber` over `public/assets/docs/*.pdf`) and grep `dist/index.html` for every URL — each must be present and clickable somewhere sensible. Same for the live GitHub repo list (`gh api users/Archerkattri/repos --paginate`, public non-forks): every personal project appears on the site (libraries → E1, adapters → the constellation, early work → E2 archive).
- [ ] **No em dashes**: `python3 -c "import re,pathlib; t=re.sub(r'<[^>]+>',' ',pathlib.Path('dist/index.html').read_text()); print(t.count('—'))"` must print 0.
- [ ] GitHub Pages deployment workflow succeeds.

### Station placement workflow
1. Add/edit content in `src/data.js`.
2. Place the station in `src/chart/layout.js` (pick a spot inside its district; `h` is an estimate used for anchors/minimap).
3. Build + preview, then in the browser console measure real heights / overlaps (or use a headless run): stations must not overlap by more than ~8 px.
4. Update the district rect if the station extends past it.

---

## 2) Rules for Research & Personal-Projects Cards

Add to **Research** or **Personal projects** (software datasheets) only with clear substance and proof:
1. **Problem** 2. **What I Built** 3. **Tools** 4. **Proof** (paper, demo, repo, benchmark, artifact).
- Card summary 1–3 short lines; metrics whenever possible.
- Full-card detail bullets live in `details` (research) / `summary + stats` (software).
- GaussianFeels expanded card is distilled from the **thesis abstract only** — keep it that way.
- Immature projects → the **School projects / Earlier builds** archive (E2; `archive` in `data.js`).

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
| Personal projects — released libraries (pip lines, stats, links) | `src/data.js` → `software` |
| HiCache accelerator repo cluster (E1 closing section) | `src/data.js` → `adapters` (constellation + chart satellite dots auto-generate) |
| Experience (incl. per-stop `links`) / earlier roles / education / honors / leadership / documents (incl. `drive` mirrors) / skills / archive / capstone links | `src/data.js` |
| Gallery photo/video plates (S2) | `src/data.js` → `gallery`, `galleryVideos` |
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

- [ ] Map (default): home shows identity + the composed bench (photo + map, one caption rail); edge arrows expand on hover/focus to show the destination name and slide the viewport (N→Research, E→Personal projects, …); each room scrolls natively.
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
