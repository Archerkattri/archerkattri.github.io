# Live Open-Source Metrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add automatically refreshed, source-backed open-source metrics while keeping GaussianFeels out of the personal-profile pitch.

**Architecture:** A dependency-free Node collector aggregates normalized values from GitHub, PyPI, Hugging Face, Comfy Registry, Zenodo, and MCP directories into `public/data/live-stats.json`. React renders the checked-in snapshot during prerender and refreshes it in the browser; GitHub Actions regenerates it for each build and every six hours.

**Tech Stack:** Node.js 24, React 18, Vite 8, GitHub Actions, public REST APIs.

---

### Task 1: Define and test the aggregation contract

**Files:**
- Create: `scripts/live-stats.test.mjs`
- Create: `scripts/lib/live-stats.mjs`

- [ ] Write `node:test` cases proving forks are excluded, owner contribution counts are selected case-insensitively, source totals are summed, unavailable sources retain fallback values, and GaussianFeels Hugging Face data is excluded.
- [ ] Run `node --test scripts/live-stats.test.mjs` and confirm failure because `scripts/lib/live-stats.mjs` does not exist.
- [ ] Implement the pure aggregation and fallback helpers with the minimal exported API exercised by the tests.
- [ ] Re-run the focused test and confirm all cases pass.

### Task 2: Collect the live snapshot

**Files:**
- Create: `scripts/collect-live-stats.mjs`
- Create: `public/data/live-stats.json`
- Modify: `package.json`

- [ ] Add collector tests for response normalization and partial-source fallback.
- [ ] Implement paginated GitHub fetching, bounded retries/timeouts, explicit personal PyPI/Hugging Face/Zenodo inventories, Comfy publisher aggregation, and MCP listing checks.
- [ ] Add `stats:update` and include the new test in `npm test`.
- [ ] Run the collector, validate its schema, and save a real baseline snapshot without exposing credentials.

### Task 3: Render the telemetry rail

**Files:**
- Create: `src/components/LiveStats.jsx`
- Modify: `src/components/Shell.jsx`
- Modify: `src/grid/RoomViews.jsx`
- Modify: `src/styles.css`
- Modify: `src/grid.css`

- [ ] Extend the hierarchy test to require the live-stat labels, source links, fallback content, and accessible freshness text in the prerendered HTML.
- [ ] Run `npm test` and confirm the new assertions fail.
- [ ] Implement a compact component that formats counts, distinguishes time windows, links every source, and refreshes `/data/live-stats.json` after hydration.
- [ ] Add responsive styling consistent with the existing editorial instrument-panel aesthetic.

### Task 4: Remove GaussianFeels from personal-profile framing

**Files:**
- Modify: `src/data.js`
- Modify: `src/components/Sections.jsx`
- Modify: `index.html`
- Modify: `scripts/check-project-hierarchy.mjs`

- [ ] Add assertions that hero/profile and social-description copy omit GaussianFeels while Research and School Projects retain it.
- [ ] Update the headline, profile summary, proof line, and social metadata to feature the five selected personal projects.
- [ ] Make `ProofLine` support a library-only personal proof line.
- [ ] Run the focused checks and confirm the academic GaussianFeels links remain intact.

### Task 5: Schedule refreshes and verify deployment inputs

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] Add a six-hour cron schedule and run `npm run stats:update` before the Pages build with the read-only `GITHUB_TOKEN`.
- [ ] Run `npm test`, `npm run build`, `npm audit`, and inspect `dist/index.html` plus `dist/data/live-stats.json`.
- [ ] Confirm Git author identity is Krishi Attri `<krishiattriwork@gmail.com>`, report the completed changes to the user, then commit and push without co-author trailers.
