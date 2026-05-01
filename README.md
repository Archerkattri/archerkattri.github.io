# Krishi Attri — Portfolio

Live site: **https://archerkattri.github.io**

---

## Stack

| Layer | Details |
|---|---|
| Framework | React 18 (Vite build) |
| Styling | Plain CSS (`src/styles.css`) |
| Data | `src/data.js` — single source of truth for all content |
| Deploy | GitHub Actions → GitHub Pages (`dist/`) |
| Assets | `public/assets/docs/`, `public/assets/images/`, `public/assets/videos/` |

---

## Repo Structure

```
archerkattri.github.io/
├── src/
│   ├── App.jsx              # Root component, layout, modal wiring
│   ├── data.js              # All portfolio content (profile, research, projects, skills…)
│   ├── styles.css           # All styles
│   └── components/
│       ├── Shell.jsx        # Nav, Hero, WhatIBuild, ResearchDirection, NowSection
│       ├── Sections.jsx     # All page sections (SelectedWork, Experience, Education, Skills…)
│       ├── Detail.jsx       # Modal body renderer
│       ├── Modal.jsx        # Modal + Lightbox primitives
│       └── WorldMap.jsx     # Journey / map section
├── public/
│   └── assets/
│       ├── docs/            # CV, Resume, papers, certificates (PDFs)
│       ├── images/          # Headshot, project photos, OG image
│       └── videos/          # Project demo videos
├── index.html               # HTML entry point (meta tags, OG tags here)
├── vite.config.js
├── package.json
└── .github/workflows/deploy.yml
```

---

## Updating Content

**All text content lives in `src/data.js`.** Edit that file to update:
- Profile headline, tagline, about text
- Research projects (`research` array)
- Selected work cards (`components/Sections.jsx` → `SELECTED_WORK`)
- Experience timeline (`experience` array)
- Awards and credentials (`awards` array)
- Education (`education` array)
- Skills (`skills` object)
- Coursework (`coursework` object)
- Leadership (`leadership` array)
- Archive builds (`archive` array)

**Section UI** lives in `src/components/Shell.jsx` and `src/components/Sections.jsx`.

**Documents:** drop new PDFs into `public/assets/docs/`, then reference them as `/assets/docs/filename.pdf`.

**Images:** drop into `public/assets/images/`, reference as `/assets/images/filename.jpg`.

---

## Local Development

```bash
npm install
npm run dev       # local dev server with HMR
npm run build     # production build → dist/
npm run preview   # serve dist/ locally to verify before pushing
```

---

## Deploy

Push to `main` → GitHub Actions runs `npm run build` → deploys `dist/` to GitHub Pages.

Source: **GitHub Actions** (not "Deploy from branch" — this is set in repo Settings → Pages).

---

## OG / Social

OG and Twitter meta tags are in `index.html`. The OG image is at `public/assets/images/og-image.png` (1200×630).

When updating, validate with:
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
