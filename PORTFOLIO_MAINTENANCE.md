# Portfolio Maintenance Guide (Krishi Attri)

This guide is for maintaining `archerkattri.github.io` without breaking content quality or design consistency.

## Core Principle
- The homepage sells **Krishi Attri** (research identity, direction, proof).
- No single project should become the whole brand.
- Keep homepage concise; deep technical details belong in project detail pages/modals or dedicated external project pages.

---

## 1) Content Update Checklist

Use this when making any content update:

- [ ] Profile headline/tagline still reflects current role (SNU M.S. -> UCF Ph.D. as timeline evolves).
- [ ] Research direction section still matches current thesis/research arc.
- [ ] Selected Work has only high-signal projects with proof.
- [ ] Experience reflects latest academic/professional role changes.
- [ ] Credentials include current awards/fellowships/certifications only.
- [ ] Contact links are valid (email, LinkedIn, GitHub).
- [ ] CV/Resume links open and point to latest PDFs in `assets/docs/`.
- [ ] Open Graph image still exists and represents current profile.
- [ ] `sitemap.xml` and `robots.txt` still present and valid.

---

## 2) Rules for Adding a New Selected-Work Card

Add a project to **Selected Work** only if it has clear substance and proof.

Required fields (minimum):
1. **Problem**
2. **What I Built**
3. **Tools**
4. **Proof** (paper, demo, repo, benchmark result, artifact)

Rules:
- Keep card summary to 1–3 short lines.
- Add metrics whenever possible (speed, accuracy, runtime, deployment context).
- If no meaningful proof/detail exists, **do not attach a modal**.
- If project is still immature, place it in **Additional Builds / Archive** instead of Selected Work.

---

## 3) Rules for Adding a New Credential or Document

When adding documents (CV, certificates, papers):

- Put files in `assets/docs/`.
- Use stable, readable filenames (e.g., `Krishi_Attri_CV.pdf`, `PoP_SLAM_Paper.pdf`).
- Prefer replacing old versions at the same URL for high-traffic docs (CV/Resume) to avoid broken links.
- For credentials cards:
  - include issuer/org,
  - date,
  - 1-line significance,
  - proof link (PDF/image).
- Remove low-value or redundant credentials to avoid clutter.

---

## 4) Rules for Adding a New Experience Item

Each experience item should include:
- Role
- Organization
- Date range
- Location (if relevant)
- 2–4 impact bullets (results, systems, scale, measurable outcomes)

Guidelines:
- Prefer impact statements over task lists.
- Keep bullets short and specific.
- If experience generated a substantial project, link it to a Selected Work modal.

---

## 5) Rules for Keeping Cards Visually Consistent

- Title length: keep to one line when possible.
- Subtitle/summary: short; avoid long paragraphs.
- Use consistent field order across cards/modals.
- Tools should be chips/tags, not paragraphs.
- Use similar proof button style and wording.
- Keep card density balanced (avoid one giant card among tiny cards).
- Keep animation behavior unchanged unless improving accessibility/performance.

---

## 6) Homepage vs Separate Project Pages

## Keep on Homepage
- Identity and current research direction.
- 3–8 high-value selected works.
- Top-line metrics and outcomes.
- Concise experience timeline and credentials.
- Contact and CV/Resume access.

## Move to Separate Project Pages (or deeper modal content)
- Long implementation details.
- Full ablations/benchmarks tables.
- Exhaustive architecture notes.
- Large galleries and extended videos.
- Deep thesis internals better suited for a paper/repo page.

---

## 7) Quarterly Update Workflow (Simple)

Run this once per quarter:

1. **Collect source updates**
   - Latest CV changes, publications, results, awards, role updates.
2. **Decide placement**
   - Homepage highlight vs modal-only vs archive.
3. **Update content files**
   - profile text, selected work, experience, credentials, education, assets.
4. **Proof pass**
   - ensure every selected-work item has Problem / Built / Tools / Proof.
5. **Design consistency pass**
   - scan for card length, chip style, section balance.
6. **Technical QA**
   - run pre-push checklist below.
7. **Deploy and verify**
   - ensure GitHub Pages action succeeds.

---

## 8) “Do Not Add” List (Anti-Clutter)

Do **not** add to homepage:
- Date of birth, nationality.
- Full GRE breakdown (unless intentionally public).
- Every single course line item.
- Massive thesis implementation dumps.
- Unproven/placeholder projects with no proof.
- Repeated content across multiple sections.

Keep those in CV or external docs instead.

---

## Required CV-Derived Additions to Keep Visible

Ensure these are represented somewhere on-page (concisely):

1. **Leadership & Activities** block
   - Villanova CubeSat Club — Secretary
   - VISO — Representative & Head of Special Events
   - SASE, ASME — Member

2. **PoP-SLAM metrics** (in modal)
   - ~4 FPS on RTX 4070
   - ~15,000 neural points per frame
   - 0.75 cm best ATE RMSE (TUM-RGBD)
   - 0.38 cm average ATE RMSE (Replica)
   - ~3× faster than Point-SLAM baseline

3. **CV Object Detection modal details**
   - Models: Faster R-CNN, Mask R-CNN, RetinaNet, Keypoint R-CNN, SSDlite
   - Dataset: COCO
   - Findings: Mask R-CNN confidence, SSDlite throughput, Faster R-CNN balance

4. **Additional Builds / Archive** section (compact)
   - Arduino Puzzle Box, Beetle-Bot, Wi-Fi Drone, Swarm Drones, Robotic Arm,
     3D Printer build, Basketball Outcome Prediction, ICE Assistive Device.

5. **Relevant Coursework** (compact/collapsible groups)
   - Robotics/Control, AI/Vision, Mechanical/Design.

6. **Searchable tool/sensor coverage**
   - VectorNav IMU, Emlid RTK GPS, Vicon/OptiTrack, Teensy, COCO API,
     Matplotlib, Scikit-learn, PowerShell, Maple.

---

## Where to Update What in This Repo

- **Profile text**: `src/data.js` (`profile` object)
- **Selected work cards**: `src/components/Sections.jsx` (selected-work list/cards)
- **Project detail modals**: `src/data.js` + modal renderer in `src/components/Detail.jsx`
- **Experience**: `src/data.js` (`experience`) and related section components
- **Credentials**: `src/data.js` credentials/awards + proof links
- **Education**: `src/data.js` education entries
- **Documents**: `assets/docs/`
- **Images**: `assets/images/`
- **Open Graph image**: `index.html` (`og:image`, `twitter:image`) and referenced asset
- **Search/SEO files**: `sitemap.xml`, `robots.txt`

---

## Pre-Push Testing Checklist (Every Push)

- [ ] Homepage loads.
- [ ] Headshot loads.
- [ ] Navigation hash links scroll correctly.
- [ ] Modals open/close correctly (including selected-work details).
- [ ] CV/Resume/PDF links open correctly.
- [ ] No console errors.
- [ ] Mobile layout checked (small viewport sanity check).
- [ ] GitHub Pages deployment workflow succeeds.

Recommended commands:

```bash
npm install
npm run build
npm run preview
```

Then open preview and manually verify checklist items.
