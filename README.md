# Krishi Attri — Portfolio

Personal research portfolio focused on robotics, AI, and 3D perception. Live at [archerkattri.github.io](https://archerkattri.github.io).

---

## What's inside

- **Hero** — typewriter intro, profile card with animated stats, four CTAs
- **What I Build** — three core domains: robot perception, 3D reconstruction & SLAM, applied AI systems
- **Selected Work** — top six works, each with the *Problem · What I Built · Tools · Proof* format and a role filter (Robotics / AI / Hardware / Research)
- **Research Direction** — long-term focus, current research areas, intentional through-line
- **Experience** — timeline of roles
- **Now** — current work + open-to list
- **Proof & Credentials** — academic docs, research output, certifications, fellowships
- **Education · Stack · Journey · Gallery · Contact**

Detail modals expand from the clicked card (clip-path animation), and shrink back on close.

---

## Stack

Vanilla static site — no build step.

| Layer       | Tool                                      |
| ----------- | ----------------------------------------- |
| Components  | React 18 + JSX (transpiled in-browser by Babel) |
| Styling     | Hand-written CSS, design tokens via `:root` |
| Maps / data | d3-geo + topojson for the journey map     |
| Hosting     | GitHub Pages, served straight from `main` |

> The current setup loads React + Babel from a CDN to keep the repo simple. For a production build (minified bundle, no dev React, faster first paint), see [Roadmap](#roadmap) below.

---

## File structure

```
.
├── index.html              # Entry — script tags + meta
├── styles.css              # All styles (design tokens + components)
├── data.js                 # Portfolio content — edit this to update content
├── components/
│   ├── App.jsx             # Root, section order, modal/lightbox state
│   ├── Shell.jsx           # Nav, Hero, ProfileCard, WhatIBuild, ResearchDirection, Now, About
│   ├── Sections.jsx        # SelectedWork, Research, Experience, Credentials, Education, Skills, Gallery, Contact
│   ├── Timeline.jsx        # Journey timeline component
│   ├── WorldMap.jsx        # Synced world-map / journey section
│   ├── Modal.jsx           # Modal + Lightbox + Icon
│   └── Detail.jsx          # Modal body renderer per kind
├── assets/
│   ├── images/             # Headshots, gallery images, logos
│   ├── docs/               # CV, papers, certificates (PDF)
│   └── videos/             # Demo videos
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## Editing content

All copy lives in `data.js` (`window.PORTFOLIO_DATA`). The "Selected Work" cards are defined in `components/Sections.jsx` (`SELECTED_WORK` array) since they use a different schema than the rest. After editing, just refresh.

To add a new selected-work item, add an object to `SELECTED_WORK`:

```js
{
  id: 'my-project',
  title: 'My Project',
  impact: 'One-line outcome.',
  category: 'robotics',          // robotics · ai · hardware
  date: 'Jan 2026 — Present',
  tag: 'Active',
  problem: 'What was broken.',
  built: 'What I built to fix it.',
  tools: ['PyTorch', 'CUDA'],
  proof: [{ label: 'Paper', href: '...', kind: 'pdf' }],
}
```

---

## Local preview

No build needed. Either:

```bash
# Python
python3 -m http.server 8000
```

```bash
# Node
npx serve .
```

Then open `http://localhost:8000`.

---

## Deployment

Pushed to `main` → GitHub Pages serves it at [archerkattri.github.io](https://archerkattri.github.io). Source = root of `main` branch.

---

## Roadmap

- [ ] Migrate to Vite for a real production bundle (minified JS, no in-browser Babel, better LCP)
- [ ] Move components into `src/` and add `vite.config.js` + GitHub Actions deploy workflow
- [ ] Add real diagrams to research modals
- [ ] Per-page Open Graph images

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Contact

[krishi.attri15@gmail.com](mailto:krishi.attri15@gmail.com) · [LinkedIn](https://linkedin.com/in/krishi-attri15) · [GitHub](https://github.com/Archerkattri)
