# Portfolio Project Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render exactly five expanded personal projects, move all other personal work into a compact archive, remove Forge, and restore GaussianFeels and EOD to the correct school-project hierarchy.

**Architecture:** Keep `src/data.js` as the source of truth. Add shared compact-project and school-highlight renderers in `src/components/Sections.jsx`, then reuse them from both the document fallback and `src/grid/RoomViews.jsx`. Extend the existing editorial stylesheet without changing the site's room navigation model.

**Tech Stack:** React 18, Vite 8, native HTML `details`, CSS, Node test/build scripts.

---

### Task 1: Encode the project hierarchy

**Files:**
- Modify: `src/data.js`
- Modify: `src/grid/grid.js`

- [ ] **Step 1: Add hierarchy assertions**

Create `scripts/check-project-hierarchy.mjs` to import the portfolio data and assert the featured ID sequence,
the absence of `forge`, the final compact item `cv-object-detection`, and the school cross-reference fields.

- [ ] **Step 2: Run the assertion and verify it fails**

Run: `node scripts/check-project-hierarchy.mjs`

Expected: failure because featured/compact metadata and school highlight data do not exist yet.

- [ ] **Step 3: Update the data**

Add `featuredSoftwareIds`, mark the compact personal entries, append the deprecated CV practice app, remove
the Forge object, add the GaussianFeels school cross-reference and EOD flagship data, and remove CV/EOD from
the earlier-build archive.

- [ ] **Step 4: Remove Forge navigation**

Delete Forge from `ALIASES` and `SECTION_TARGETS` in `src/grid/grid.js`.

- [ ] **Step 5: Run the data assertion**

Run: `node scripts/check-project-hierarchy.mjs`

Expected: `Project hierarchy checks passed.`

### Task 2: Render featured and compact personal projects

**Files:**
- Modify: `src/components/Sections.jsx`
- Modify: `src/grid/RoomViews.jsx`
- Modify: `src/styles.css`
- Modify: `src/grid.css`

- [ ] **Step 1: Add shared selection helpers and compact renderer**

Export helpers that return featured software in `featuredSoftwareIds` order and all remaining items as compact
software. Export a native collapsed `CompactProjects` component with concise name, one-liner, status, and links.

- [ ] **Step 2: Update both render targets**

Render `SoftwareCard` only for the five featured entries in the document and grid rooms. Render the compact
archive after the featured stack. Keep the adapter constellation collapsed and associated with HiCache++.

- [ ] **Step 3: Style the compact archive**

Add focused `details`, row, metadata, and responsive styles matching the existing editorial system.

- [ ] **Step 4: Verify the production HTML**

Run: `npm run build && node scripts/check-project-hierarchy.mjs`

Expected: successful build and exactly five expanded project cards.

### Task 3: Restore the school-project hierarchy

**Files:**
- Modify: `src/components/Sections.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Render the school highlights**

Render the capstone and EOD entries as expanded sheets. Render GaussianFeels as a compact cross-reference
linking to `#gaussianfeels`, followed by the remaining earlier builds.

- [ ] **Step 2: Verify content and links**

Run: `npm run build`

Expected: prerendered HTML includes the EOD research copy and a GaussianFeels `href="#gaussianfeels"`, while
the CV app appears only in the compact personal archive.

### Task 4: Final verification and handoff

**Files:**
- Verify: `dist/index.html`
- Verify: repository status and commit metadata

- [ ] **Step 1: Run all checks**

Run: `npm test && npm run build && npm audit --audit-level=high && node scripts/check-project-hierarchy.mjs`

Expected: every command exits zero.

- [ ] **Step 2: Inspect the rendered page**

Serve `dist/`, capture the personal and school rooms at desktop and mobile widths, and confirm visual hierarchy,
overflow behavior, link targets, and native collapsed states.

- [ ] **Step 3: Commit under the owner identity**

Commit with `Krishi Attri <krishiattriwork@gmail.com>` and no additional attribution.

- [ ] **Step 4: Report before push**

Tell the user exactly what changed and what passed. Push only after that report, then monitor deployment.
