# Krishi Attri Portfolio

Static portfolio site for [https://archerkattri.github.io](https://archerkattri.github.io).

The site is built as a simple GitHub Pages-friendly frontend:

- `index.html` loads React, Babel, `data.js`, and the component files
- `styles.css` contains all layout, theme, and section styling
- `data.js` stores the portfolio content on `window.PORTFOLIO_DATA`
- `components/` contains the JSX components
- `assets/` contains PDFs, images, and videos

## Project structure

```text
.
|-- index.html
|-- styles.css
|-- data.js
|-- components/
|   |-- App.jsx
|   |-- Detail.jsx
|   |-- Modal.jsx
|   |-- Sections.jsx
|   |-- Shell.jsx
|   |-- Timeline.jsx
|   `-- WorldMap.jsx
`-- assets/
    |-- docs/
    |-- images/
    `-- videos/
```

## Deploying

This repo is meant to be deployed directly with GitHub Pages from the repository root on the `main` branch.

Because the site uses relative paths, it works without editing links when pushed to GitHub Pages.

## Editing content

Most content changes happen in `data.js`.

Update `data.js` when you want to change:

- profile text
- research entries
- project entries
- experience
- awards and certifications
- education
- skills
- gallery items

Use `assets/` for any supporting media files referenced from `data.js`.

## Notes

- No build step is required.
- No special GitHub Pages config is required for the current file structure.
- A `.nojekyll` file is not needed for the current site.
