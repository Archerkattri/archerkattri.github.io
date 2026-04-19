# Krishi Attri — Portfolio

A fully static, React-based personal portfolio website designed for deployment to GitHub Pages. Engineering/blueprint aesthetic, light & dark modes, interactive modal detail views, filterable projects, and media gallery.

## Contents

- `index.html` — entry point. Loads React, Babel, data, and component scripts.
- `styles.css` — all styling (CSS variables; theme-aware).
- `data.js` — **all portfolio content** lives here as a single JS object on `window.PORTFOLIO_DATA`. Edit this file to update any text, project, award, etc.
- `components/` — React components written as inline JSX (transpiled in-browser via Babel standalone).
  - `Modal.jsx` — icons, modal container, lightbox
  - `Shell.jsx` — nav, hero, about
  - `Sections.jsx` — research, projects, experience, awards, education, skills, gallery, contact
  - `Detail.jsx` — the body rendered inside the popout modal
  - `App.jsx` — root, theme state, routing between modals
- `assets/` — all media
  - `assets/docs/` — CV, resume, certificates (PDFs)
  - `assets/images/` — all images
  - `assets/videos/` — demo videos

## Local preview

Because this uses `<script type="text/babel" src="...">`, you must serve over HTTP (opening `index.html` directly via `file://` will fail on CORS):

```bash
# any static server works
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploying to GitHub Pages

1. **Create a repository.** Name it `<your-username>.github.io` for a user site at the root, or any name for a project site at `/<repo-name>/`.
2. **Push the contents of this folder** to the `main` branch.
3. **Enable Pages.** In the repo → Settings → Pages, set:
   - Source: `Deploy from a branch`
   - Branch: `main` / root (`/`)
4. Wait ~30s; your site will be live at the URL shown.

**All paths in this codebase are relative**, so it works both at the root (`username.github.io`) and under a subfolder (`username.github.io/portfolio`). No base-path config needed.

### Custom domain (optional)
Add a `CNAME` file to the repo root with your domain, and configure your DNS `CNAME` record to point at `<username>.github.io`.

## Updating content

Everything is in `data.js`. Each section has an array of objects:

- `profile` — name, about paragraphs, contact info
- `research` — research projects (featured in the Research section)
- `projects` — course/personal/internship projects (with `category: "hardware" | "software"` for the filter)
- `experience` — jobs & research positions (timeline)
- `awards` — fellowships, certifications, awards
- `education` — schools
- `skills` — grouped technical chips
- `gallery` — image tiles shown in the media gallery

Each research/project/award/experience entry supports:

| field | purpose |
|---|---|
| `title`, `subtitle` | headline in card + modal |
| `date` | date or date range |
| `overview: string[]` | paragraphs in modal |
| `contributions: string[]` | bulleted list |
| `tools: string[]` | chips |
| `outcomes: string[]` | results |
| `gallery: [{src, caption}]` | images rendered in modal |
| `video` | path to mp4 rendered as `<video>` |
| `links: [{label, href}]` | buttons |
| `placeholder` | shown as a dashed "pending" note |

## Adding a new project

1. Drop the image(s) into `assets/images/` and any video into `assets/videos/`.
2. In `data.js`, add a new object to the `projects` array:
   ```js
   {
     id: "my-project",
     title: "My Project",
     subtitle: "One-line pitch",
     date: "2026",
     category: "hardware", // or "software"
     summary: "Short card blurb.",
     overview: ["Paragraph 1.", "Paragraph 2."],
     contributions: ["Thing I did.", "Another thing."],
     tools: ["Python", "ROS"],
     outcomes: ["Measurable result."],
     gallery: [{ src: "assets/images/my-project.jpg", caption: "Caption" }],
     video: "assets/videos/my-project.mp4",
     links: [{ label: "GitHub", href: "https://github.com/..." }]
   }
   ```
3. Save & reload — the card, modal, and filter counts update automatically.

## Replacing placeholder assets

Several projects reference media that was not yet uploaded. To add them later:

| Placeholder for | Drop file at |
|---|---|
| Capstone demo video | `assets/videos/capstone.mp4`, then add `video: "assets/videos/capstone.mp4"` to the `capstone` entry in `data.js` |
| Headshot | Add `assets/images/headshot.jpg`, then reference it in the `Hero` component or in `data.js profile.headshot` |
| Additional certificates | Drop PDF in `assets/docs/`, add `pdf: "assets/docs/foo.pdf"` to the matching `awards` entry |

## Privacy

Private data (phone number, home address, date of birth, nationality, passport/GRE score-report IDs) has been deliberately **excluded** from `data.js` and this site. Only public-safe contact info is used.

## Accessibility

- Keyboard-friendly modals: focus ring, Escape to close, click outside to close.
- Lightbox supports Escape close.
- All cards are `tabIndex=0` and activate on Enter.
- Theme preference is persisted to `localStorage`.

## Credits

Design, copy, and engineering by Krishi Attri. Built with React 18, Instrument Serif + Inter + JetBrains Mono (Google Fonts).
