# Krishi Attri Portfolio

This repository is configured to work directly on GitHub Pages **without any build step**.

## Deploy model (important)
- GitHub Pages serves `index.html` from the repository root.
- The site uses browser-loaded React + Babel scripts and root-level files:
  - `index.html`
  - `styles.css`
  - `data.js`
  - `components/*.jsx`
- Public files remain under `/assets/...`, plus `robots.txt` and `sitemap.xml`.

## Updating content safely
- Edit portfolio data in `data.js`.
- Edit section UI in `components/*.jsx`.
- Keep `index.html` script order unchanged unless you know why you are changing it.

## Why this setup
This avoids the GitHub Pages MIME issue for `/src/main.jsx` and works immediately when pushing repo contents to Pages.
