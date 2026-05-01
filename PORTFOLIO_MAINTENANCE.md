# Portfolio Maintenance Guide — Krishi Attri

## Core Principle
- The homepage sells **Krishi Attri** (research identity, direction, proof of work).
- No single project should become the whole brand.
- Keep homepage concise; deep technical details belong in modals or dedicated external pages.

---

## 1) Content Update Checklist

Use when making any content update:

- [ ] Profile headline/tagline reflects current role (SNU M.S. → UCF Ph.D. as timeline evolves).
- [ ] Research direction section matches current thesis/research arc.
- [ ] Selected Work has only high-signal projects with proof.
- [ ] Experience reflects latest academic/professional role changes.
- [ ] Credentials include current awards/fellowships/certifications.
- [ ] Contact links are valid (email, LinkedIn, GitHub).
- [ ] CV/Resume links open and point to latest PDFs in `public/assets/docs/`.
- [ ] OG image exists and represents current profile (`public/assets/images/og-image.png`).
- [ ] `sitemap.xml` and `robots.txt` still present and valid.
- [ ] GitHub Pages deployment workflow succeeds.

---

## 2) Rules for Selected Work Cards

Add to **Selected Work** only if it has clear substance and proof.

Required fields (minimum):
1. **Problem**
2. **What I Built**
3. **Tools**
4. **Proof** (paper, demo, repo, benchmark result, artifact)

Rules:
- Keep card summary to 1–3 short lines.
- Add metrics whenever possible.
- If no meaningful proof exists, do not attach a modal.
- If project is immature, place it in **Archive** instead.

---

## 3) Rules for Documents and Credentials

- Put files in `public/assets/docs/`.
- Use stable, readable filenames (`Krishi_Attri_CV.pdf`, `PoP_SLAM_Paper.pdf`).
- Replace old versions at the same URL for high-traffic docs (CV/Resume) to avoid broken links.
- Remove low-value or redundant credentials to avoid clutter.

---

## 4) Rules for Experience Items

Each item should include:
- Role, Organisation, Date range, Location
- 2–4 impact bullets (results, systems, measurable outcomes — not task lists)

---

## 5) Visual Consistency Rules

- Title: one line when possible.
- Subtitle/summary: short; no long paragraphs.
- Tools: chips/tags, not paragraphs.
- Keep animation behaviour unchanged.
- Keep card density balanced.

---

## 6) Homepage vs Separate Pages

**Keep on homepage:**
- Identity and current research direction.
- 3–8 high-value selected works.
- Top-line metrics and outcomes.
- Concise experience timeline and credentials.
- Contact and CV/Resume access.

**Move to separate project pages (future):**
- GaussianFeels full thesis / ablation tables.
- PoP-SLAM full benchmark results.
- GNSS-Denied SLAM dissertation chapter content.
- Extended galleries and videos.
- Detailed architecture notes better suited for a paper or repo README.

---

## 7) Quarterly Update Workflow

1. Collect source updates (CV, publications, results, awards, role changes).
2. Decide placement: homepage highlight / modal-only / archive.
3. Update `src/data.js` (profile, research, experience, skills, coursework, leadership, archive).
4. Update `src/components/Sections.jsx` if selected-work cards change.
5. Proof pass: every selected-work item needs Problem / Built / Tools / Proof.
6. Design consistency pass: card length, chip style, section balance.
7. Run `npm run build && npm run preview` and check pre-push checklist.
8. Push to `main` → verify GitHub Actions deployment succeeds.

---

## 8) "Do Not Add" List (Anti-Clutter)

Do **not** add to homepage:
- Date of birth, nationality.
- Full GRE breakdown score lines.
- Every single course line item (use grouped coursework chips instead).
- Massive thesis implementation dumps (deep content → separate page).
- Unproven/placeholder projects with no proof.
- Repeated content across multiple sections.

---

## 9) Future Work (not yet done)

- [ ] **GaussianFeels results gallery** — add reconstruction images/video when available.
- [ ] **PoP-SLAM benchmark table** — add comparison table in modal when paper is public.
- [ ] **Dedicated project pages** — `gaussianfeels.html`, `popslam.html` for deep-dives.
- [ ] **Publications section** — add when GaussianFeels or other work is formally published.
- [ ] **UCF lab page link** — add Rehabilitation Engineering & Assistive Device Lab link when available.
- [ ] **Update role to UCF Ph.D.** — update profile headline, meta tags, and experience in Aug 2026.
- [ ] **OG image refresh** — consider updating `og-image.png` after Ph.D. start.

---

## 10) Where to Update What

| Content | File |
|---|---|
| Profile text, tagline | `src/data.js` → `profile` |
| Selected work cards | `src/components/Sections.jsx` → `SELECTED_WORK` |
| Project detail modals | `src/data.js` → `research` / `projects` |
| Experience timeline | `src/data.js` → `experience` |
| Credentials & awards | `src/data.js` → `awards` |
| Education | `src/data.js` → `education` |
| Coursework | `src/data.js` → `coursework` |
| Skills | `src/data.js` → `skills` |
| Leadership | `src/data.js` → `leadership` |
| Archive builds | `src/data.js` → `archive` |
| Documents (CV, papers) | `public/assets/docs/` |
| Images | `public/assets/images/` |
| OG / meta tags | `index.html` |
| SEO | `sitemap.xml`, `robots.txt` |

---

## 11) Pre-Push Checklist

- [ ] Homepage loads and headshot displays.
- [ ] Navigation hash links scroll correctly.
- [ ] Modals open and close correctly.
- [ ] CV/Resume/PDF links open correctly.
- [ ] No console errors.
- [ ] Mobile layout checked (small viewport).
- [ ] Dark mode works.
- [ ] GitHub Pages deployment succeeds.

```bash
npm install
npm run build
npm run preview
```
