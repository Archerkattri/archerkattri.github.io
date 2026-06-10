# Portfolio Maintenance Guide — Krishi Attri

## Core Principle
- The homepage sells **Krishi Attri** (research identity, direction, proof of work).
- No single project should become the whole brand.
- Design system: dark instrument-panel — one ink, one instrument-teal accent (`--accent: #3ebfc6`), Fraunces / Hanken Grotesk / Spline Sans Mono, film grain. Committed dark theme (no toggle).
- **The site is "The Map"** — a 2D page grid of compass rooms with edge-button navigation (still a map — the thesis is SLAM — but each page is a normal, vertically-scrolling website page; no free pan). The map is the **only** interactive experience: the old free-pan ZUI chart and the "DOC VIEW" toggle were removed (2026-06). A classic sectioned **document view** survives strictly as the build-time prerender (no-JS / SEO fallback) — it has no user-facing route or toggle.
- **No em dashes in user-visible copy** (data.js strings, JSX copy, aria labels, index.html title/meta). They read as machine-written; use commas, colons, parens, "·". Date ranges use the en dash "–". This file (not user-visible) may use them. Verify with the build check below.
- **Type discipline:** Fraunces is reserved for titles and a few set-piece moments (home headline, section titles, card titles, the contact email, the W1 margin note). Numeric readouts (`.stat-v`, `.sw-stat dd`) are mono: they are instruments, not display type.
- **Rhythm:** the layout is deliberately non-uniform — flagship sheets run the full measure while follow-up sheets indent (`.sheet:not(.flagship)`), software datasheets stagger left/right (`.sw-stack`), gallery plates tilt. Don't "clean up" these offsets back into a uniform grid.

---

## 0) Architecture — The Map (grid) + the prerendered Document fallback

Two render targets share one data source (`src/data.js`):

| Target | Job | Content level | Entry |
|---|---|---|---|
| **Map / grid** (the site) | the spatial site — explore room by room | **Full**: every room carries its complete content (same components as the prerender) | `src/grid/GridSite.jsx` |
| **Document** (prerender only) | the complete linear record — CV-true, everything; rendered to static HTML at build time as the no-JS / SEO fallback. Never mounted client-side; hidden the instant JS runs | **Everything**: if it is on the CV, it is here | `src/DocumentView.jsx` (wraps `Shell.jsx` / `Sections.jsx`) via `src/prerender-entry.jsx` |

Rule of thumb when adding content: data.js → the owning map room and the prerendered document get it automatically (shared components).

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

- **E1 PERSONAL PROJECTS** — the four released-software datasheets (splatreg / mathlas / CERT-FLOW / HiCache++) with the 14-repo HiCache accelerator constellation as the room's closing section (`#adapter-constellation`): 13 accelerator repos (12 HiCache/HiCache++ adapters + the fast-trellis2 TaylorSeer baseline) + the ComfyUI-HiCache node, grouped by model family with an "Integrations" group.
- **E2 SCHOOL PROJECTS** — the FMC-sponsored capstone (featured, with demo/award/photos links) + the "Earlier builds" archive (CV-complete: includes the robotic arm, SOLIDWORKS scooter, basketball-prediction entries).
- **W2 SCHOOL** — education (with REAL-lab / Diploma links), honors & fellowships (linked proofs), **leadership** (CubeSat / VISO / SASE / ASME), documents (CV/resume/PDFs, with Drive mirrors via the `drive` field), the condensed stack.
- **W1 EXPERIENCE** — the route (per-stop proof links from the CV: EOD robot, drone, Silo demo, certificates, host letter) + the compact "Also held, Villanova" earlier-roles block. The UCF stop renders as a penciled margin note (`.gv-route-next`), not a boxed pill.
- **S2 GALLERY** — the photo/video plates (formerly "Field log").
- Legacy hash slugs stay as **redirect aliases** (don't remove): `#software` → E1, `#adapters` → E1's constellation section, `#background` → W2, `#fieldlog` / `#field-log` → S2, plus every retired chart-station id (`#gaussianfeels`, `#splatreg`, `#log-3`, `#adapter-7`, …) → its owning room. New canonical slugs: `#personal-projects`, `#school-projects`, `#school`, `#gallery`.

- **`grid.js`** — the room lattice (`ROOMS` with col/row, codes, names), cardinal `neighborOf`, `roomFromHash` (station-level hashes like `#gaussianfeels` alias to their containing room; legacy room slugs alias to the renamed rooms; numbered `log-N`/`logv-N`/`adapter-N` handled by pattern), and `sectionFromHash` (hashes that land on an in-room section anchor, e.g. `#adapters`).
- **`GridSite.jsx`** — the engine: full-viewport slide transitions (~520 ms cardinal, ~640 ms single diagonal slide for mini-map jumps; CSS keyframes driven by `--gv-dx/--gv-dy`), edge buttons (rendered only where a neighbor exists), persistent HOME button (every page except home), corner mini-map (hidden on home — the home centerpiece IS the map), hash routing (`pushState` + `hashchange`, browser back/forward work; deep links land via a quick orient slide from home), aria-live room announcements.

### Edge buttons (decided & shipped)
- **Desktop rest state:** a bare arrow chevron (42×42 px plate + a 12 px invisible hit halo via `::after`).
- **Hover / keyboard `:focus-visible`:** the destination name slides out of the arrow (`max-width` + opacity transition on `.gv-edge-label`). The E button is `row-reverse` so its arrow stays pinned to the screen edge and the label opens inward.
- **Touch (<760 px):** no hover, so every edge button carries a small always-on label. N/S sit at the top/bottom screen edges as before; E/W are **docked pill tabs at the bottom corners** (2026-06 audit fix: they used to float unlabeled at mid-screen height over body text), compact wrapped room label, same blurred-plate scrim as the rest of the HUD. Horizontal swipe still moves E/W. Do not add tap-to-reveal.
- Full room names always live in `aria-label`, never truncated.

### Home room (decided & shipped, recomposed 2026-06-10)
HOME is **identity-first**: the left column is the identity stack (name at display scale → role line → one-liner → sub → proof line → meta → links); the right column is a rail (`.gv-home-rail`, max-width 378px, flush right) of two instrument plates — the **headshot plate on top as the primary visual mass** (`.gv-home-fig`, even 14px reveal margin all around, image fills the plate) and the **room-grid map below it as subordinate navigation** (`.gv-home-map`, compact 30px-min cells, still fully clickable, "PRESS AN EDGE, OR A CELL" hint under it). At 1440×900 the whole composition fits the fold (no scroll). Cold-open: the eye lands on Krishi (photo + name) first, the map second. The old `.gv-bench` (photo + map fused in one frame, map dominating at 0.62fr, baselines drifting) was retired for exactly that reason — the map read as the centerpiece; don't fuse them again and don't let the map outgrow the photo. A two-candidate screenshot bake-off (photo-left + map-under-text vs identity-left + photo-dominant rail) picked the rail: the alternative pushed the map fully below the fold at 1440×900. On mobile the column order is identity → photo (max-width 330px) → map (full width).

The decoration that used to dress the site was removed in the 2026-06 declutter passes (read as AI decoration) — don't bring any of it back: the rotated "SURVEYED" SVG stamp, the "FIG. 00 / FIG. 01" caption rail, the corner crosshair registration marks (site-wide), the lat/lon coordinate strings (site-wide, incl. the footers and the contact arc), the squiggle glyph + "· THE MAP" tail next to the name in the header, and the fixed editorial column hairlines (`.col-rules`).

### Name appears once on home (decided 2026-06-10)
The hero name is the **only** name on the HOME screen. The fixed top-left corner brand (`.gv-brand`, "KRISHI ATTRI") was removed — it duplicated the hero name a few hundred pixels apart. Off home, the top-left control is now the identity anchor *and* the home link in one: `.gv-homebtn` reads "⌖ KRISHI ATTRI" (aria-label "Krishi Attri, return home (H)", title "Home (H)") — every room stays signed, and clicking the name returns to the hero, the web-native convention. The bottom-left HUD caption keeps "© YEAR KRISHI ATTRI" in every room *except* home (there it shows just "00 · HOME") so the name truly appears once on home. Don't reintroduce a separate brand element next to the home button.

### W1 route (decided & shipped)
The experience route line is **scroll-linked**: a faint full-length track (`.gv-route-track`) plus a teal line (`.gv-route-line`) drawn downward via `scaleY` from a rAF-throttled scroll handler in `ExperienceRoom`; each `.gv-stop` waits greyed and un-greys (`.lit`: teal node fill + ping) when the line tip (62% down the viewport) reaches its node. Reduced motion, or any setup failure: the `gv-route-anim` class never lands and the CSS default shows the line fully drawn with nothing greyed.

### Numbers are the proof (decided & shipped)
Stat values (`.stat-v` on research sheets, `.sw-stat dd` on software datasheets) get one consistent emphasis treatment: heavier mono, accent teal, faint teal glow. Keep the two selectors in lockstep if either changes.
- **`RoomViews.jsx`** — one component per room, reusing `Sections.jsx` pieces (`ResearchCard`, `SoftwareCard`, `SchoolSection`, `SchoolProjectsSection`, `ContactSection`) plus grid-only pieces: the `GridMap` (mini-map + home centerpiece), `RoomXRef` neighbor pointers (must always show the *current* room names), `SectionJump` in-room pointers, the W1 experience route rail, the S1 Seoul→Orlando relocation arc, the S2 photo-plate grid, the E1 adapter constellation grouped by model family.
- **`src/grid.css`** — all grid styling (`gv-` prefix; document/prerender styling lives in `src/styles.css`).

### Grid input contract (decided & shipped)
- **Wheel/scroll** only ever scrolls *inside* a room (native). No scroll-hijacking, no wheel page-flips.
- **← / →** always move across the grid (rooms only scroll vertically, so horizontal arrows are free).
- **↑ / ↓** scroll the room; AT the top/bottom scroll edge a **fresh** press steps to the neighboring room *immediately* (key-repeat is ignored, so holding ↓ can't overshoot through the south wall). While a held key parks at the edge, the swallowed repeats flash a brief "↓ again · ROOM" cue (`.gv-edgehint`) so the next fresh press is announced. Decision (2026-06 audit): navigate-on-first-fresh-press is the cleaner feel since key-repeat is already filtered; the hint covers the held-key case only.
- **H / Esc** return home. Mobile: N/S edge tabs at the screen's top/bottom edges, E/W docked labeled pills at the bottom corners, horizontal swipe = E/W move.
- Reduced motion: the same map, instant page swaps, no slides, no boot animation.

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
- [ ] New content? `data.js` (single source) → automatic for the map rooms + the prerendered document. A brand-new *room* needs `grid.js` (lattice cell on an arm of the plus), `RoomViews.jsx` (content + `VIEWS` entry), and a `roomFromHash` alias for any item-level hashes.
- [ ] **CV-link audit** (after any CV/resume PDF replacement): extract embedded links (`pikepdf`/`pdfplumber` over `public/assets/docs/*.pdf`) and grep `dist/index.html` for every URL — each must be present and clickable somewhere sensible. Same for the live GitHub repo list (`gh api users/Archerkattri/repos --paginate`, public non-forks): every personal project appears on the site (libraries → E1, adapters → the constellation, early work → E2 archive).
- [ ] **No em dashes**: `python3 -c "import re,pathlib; t=re.sub(r'<[^>]+>',' ',pathlib.Path('dist/index.html').read_text()); print(t.count('—'))"` must print 0.
- [ ] GitHub Pages deployment workflow succeeds.

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
- Experience renders as the **route** in W1 (newest first, penciled UCF margin note). Keep `data.js` order newest-first.

## 5) Visual Consistency Rules
- One accent. Mono for instrument copy, Fraunces for titles. No new fonts/colors.
- **Fonts are self-hosted** (`src/fonts.css` + `public/assets/fonts/*.woff2`, mirrored from Google Fonts with per-subset `unicode-range` and `font-display: swap`; the three latin workhorses are preloaded in `index.html`). No third-party font requests — don't reintroduce the Google Fonts `<link>`s.
- Keep card density balanced within each room.

---

## 6) Where to Update What

| Content | File |
|---|---|
| Profile text, headline, hero meta | `src/data.js` → `profile` |
| Research entries (incl. GaussianFeels stats) | `src/data.js` → `research` |
| Publications | `src/data.js` → `publications` |
| Personal projects — released libraries (pip lines, stats, links) | `src/data.js` → `software` |
| HiCache accelerator repo cluster (E1 closing section) | `src/data.js` → `adapters` (constellation auto-generates) |
| Experience (incl. per-stop `links`) / earlier roles / education / honors / leadership / documents (incl. `drive` mirrors) / skills / archive / capstone links | `src/data.js` |
| Gallery photo/video plates (S2) | `src/data.js` → `gallery`, `galleryVideos` |
| Grid rooms / neighbors / hash aliases | `src/grid/grid.js` |
| Room contents (map view) | `src/grid/RoomViews.jsx` |
| Grid engine (slides, edge buttons, keyboard, routing) | `src/grid/GridSite.jsx` |
| Grid styling (edge buttons, mini-map, home, rooms) | `src/grid.css` |
| Prerendered document (no-JS / SEO fallback) | `src/DocumentView.jsx`, `src/components/*` , `src/styles.css`, `src/prerender-entry.jsx` |
| OG / meta / fonts / JSON-LD | `index.html` |
| SEO | `sitemap.xml`, `robots.txt`, build-time prerender (`vite.config.js`) |

---

## 7) Pre-Push Checklist

```bash
npm install
npm run build      # must log "✓ prerendered document view into dist/index.html"
npm run preview
```

- [ ] Map (default): home shows the identity stack + the right rail (photo plate on top, compact map card under it, hint under the map); the name appears exactly once on home (no corner brand); edge arrows expand on hover/focus to show the destination name and slide the viewport (N→Research, E→Personal projects, …); each room scrolls natively.
- [ ] Off home: top-left reads "⌖ KRISHI ATTRI" and returns home on click/H.
- [ ] Keyboard: ←/→ move across the grid; ↑/↓ scroll then step rooms at the scroll edge; H/Esc go home. Browser back/forward retrace moves; deep links (`/#publications`, `/#gaussianfeels`) land on the right room.
- [ ] Mini-map (corner / home centerpiece) jumps anywhere, incl. single diagonal slides (e.g. W2 → E1).
- [ ] Mobile (~420 px): compact chevron tabs (side tabs thumb-height), horizontal swipe = E/W, no brand/button overlap at the top.
- [ ] Legacy URLs still land on the map: `/?view=chart` and `/?view=doc` show the map; old anchors (`/#gaussianfeels`, `/#software`, `/#adapter-3`, `/#log-2`) land in the right rooms.
- [ ] No-JS fallback: key numbers present in `dist/index.html` (grep: GaussianFeels, 0.83, 3.37, 91.5%, 3.68M, CERT-FLOW, HiCache++); with JS the prerender stays hidden.
- [ ] Reduced motion: the map loads (no document fallback), pages swap instantly (no slides).
- [ ] GitHub Pages deployment succeeds (push to `main` triggers `.github/workflows/deploy.yml`).

---

## 8) "Do Not Add" List (Anti-Clutter)
- Date of birth, nationality, full GRE breakdowns, every course line item.
- Massive thesis dumps (abstract-level only on the GaussianFeels card).
- Unproven/placeholder projects; repeated content across rooms.
- New CI workflows (the existing Pages deploy is the only one).

## 9) Decided in the 2026-06 audit fix wave
- **Thesis-site links removed everywhere** (home hero, N1 card, N2, S1, JSON-LD): krishiattrisnu.github.io is parked until the thesis release and 404s. "Thesis & code release upcoming, 2026." stays as plain text (`note` on the card; `status` on the publication). Re-link only when the site is live.
- **N1 GaussianFeels evidence clip** — `public/assets/videos/gaussianfeels-forming.mp4` (+`-poster.jpg`), the card's `media` field in `data.js`. Re-encoded from `production/readme_assets/forming_demo_can_3x.mp4` in the gaussianfeels repo (720p h264, ~3.8 MB, muted/loop/playsinline/autoplay). The caption deliberately does not claim real hardware: the forming demos render FeelSight *simulation* data.
- **Hero proof line** (`profile.proofLine` in `data.js`, `ProofLine` in `Sections.jsx`, `.hero-proof` in `styles.css`): flagship + two headline numbers + the three libraries, each part deep-linking by plain hash (works in both render targets; card ids + `SECTION_TARGETS` in `grid.js`). Stats reuse the instrument treatment. **Wording rule:** 3.37 mm (ADD-S accuracy) and 7.6× (frame rate) sit on *different axes* — never phrase the line so 7.6× reads as an accuracy multiple. Canonical phrasing: "3.37 mm object tracking during in-hand manipulation, at 7.6× the frame rate of the neural-field baseline."
- **Identity-first hero** (2026-06): both render targets lead with the identity stack — name at display scale (`.gv-home-name` / `.hero-name`, Fraunces), then the role line (`profile.roleLine`: "Robotics and AI researcher. M.S. SNU, incoming Ph.D. UCF."), then the one-liner (`profile.headlineLines` → `.gv-home-tag` / `.hero-tag`). The old kicker ("Robotics & AI · Visuo-Tactile Perception") was retired; `.kicker-dash` survives as the role line's accent tick. (2026-06-10: the map's top-left brand `.gv-brand` was removed outright — see "Name appears once on home" above.) Cold-open test: who/what/why legible inside two seconds at 1440 and 390.
- **HUD caption scrim** (2026-06): `.gv-caption` (bottom-left "CODE · ROOM · © YEAR") is fixed over scrolling room text, so it carries the same blurred-plate scrim (color-mix bg + blur + border) as every other HUD instrument; the room foot's 84px bottom padding (76px mobile) keeps the end of content clear of it. Don't strip the plate back to bare text — it garbles over body copy mid-scroll.
- **Per-room document titles** ("Research · Krishi Attri") set in `GridSite.jsx` on room change.
- **`public/404.html`** — styled minimal, JS + meta-refresh redirect to `/#home`.
- **W2 documents** fold behind one `<details>` expander ("Documents and certificates (N)", count auto-derived); education/honors/leadership stay visible.
- **No home video echo**: judged against — the home rail is photo + map and the proof line already routes to N1 where the clip is the hero.

## 10) Future Work (not yet done)
- [ ] **GaussianFeels results gallery** — reconstruction images/video in N1 when public.
- [ ] **PoP-SLAM benchmark table** — expanded card table when the paper is public.
- [ ] **Publications growth** — formal venues when published.
- [ ] **Update role to UCF Ph.D.** — profile/meta/experience + flip the route's penciled UCF note to a solid stop (Aug 2026).
- [ ] **OG image refresh** — consider a map-styled OG image.
