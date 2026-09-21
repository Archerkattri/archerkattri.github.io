import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { PORTFOLIO_DATA as data } from "../src/data.js";
import { isCountable, formatCount } from "../src/motion/reveal.js";

const expectedFeatured = [
  "splatreg",
  "cert-flow",
  "hicache-pp",
  "action-interface",
  "mathlas",
];

assert.deepEqual(data.featuredSoftwareIds, expectedFeatured);

const softwareIds = data.software.map((item) => item.id);
assert.equal(softwareIds.includes("forge"), false);
assert.equal(softwareIds.at(-1), "cv-object-detection");
assert.equal(data.software.at(-1).compact, true);
assert.match(data.software.at(-1).spec, /Deprecated practice project/i);

assert.equal(data.schoolHighlights.gaussianFeels.href, "#gaussianfeels");
assert.match(data.schoolHighlights.gaussianFeels.note, /M\.S\. thesis/i);
assert.match(data.schoolHighlights.eod.note, /LiDAR.camera fusion/i);

const archiveTitles = data.archive.map((item) => item.title);
assert.equal(archiveTitles.includes("CV object-detection web app"), false);
assert.equal(archiveTitles.includes("EOD robot platform"), false);

if (existsSync(new URL("../dist/index.html", import.meta.url))) {
  const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.equal((html.match(/class="sw(\s|")/g) ?? []).length, 5);
  assert.equal(html.includes("Forge"), false);
  assert.match(html, /class="school-crossref" href="#gaussianfeels"/);
  assert.match(html, /EOD \/ GNSS-denied robot platform/);
  assert.match(html, /CV object-detection web app/);
}

// Copy rule (PORTFOLIO_MAINTENANCE.md): no em dashes in user-visible
// strings. Comments may use them; data.js values may not.
const stringsOf = (v, out = []) => {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => stringsOf(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => stringsOf(x, out));
  return out;
};
const emDashed = stringsOf(data).filter((s) => s.includes("—"));
assert.equal(emDashed.length, 0);

// Meta description ships to crawlers verbatim; keep the grammar clean.
const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert.match(indexHtml, /gives robots a sense of touch/);

// One accent: no second-hue atmospheric wash in either stylesheet,
// and no colored accent bar on a rounded card (the kicker carries it).
for (const css of ["../src/styles.css", "../src/grid.css"]) {
  const src = readFileSync(new URL(css, import.meta.url), "utf8");
  assert.equal(src.includes("110, 130, 180"), false);
  assert.equal(src.includes("border-left: 3px"), false);
}

// Motion helpers (src/motion/reveal.js): count-up eligibility + endpoints.
assert.equal(isCountable("1.13"), true);
assert.equal(isCountable("0.997"), true);
assert.equal(isCountable("7.0–12.4×"), false);
assert.equal(isCountable("18/18"), false);
assert.equal(formatCount(1.13, 2, 0), "0.00");
assert.equal(formatCount(1.13, 2, 1), "1.13");
assert.equal(formatCount(0.997, 3, 1), "0.997");

// Reveal CSS: html.js-gated hiding lands with its visible state.
const stylesSrc = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
assert.match(stylesSrc, /html\.js \.reveal \{[^}]*opacity: 0/);
assert.match(stylesSrc, /html\.js \.reveal\.in \{/);

// UI-research upgrades: each ships its marker (behavior verified in browser).
const gridSrc = readFileSync(new URL("../src/grid.css", import.meta.url), "utf8");
for (const [src, marker] of [
  [stylesSrc, "@media print"],
  [stylesSrc, "details::details-content"],
  [stylesSrc, "titleMask"],
  [stylesSrc, ".sw-sys"],
  [stylesSrc, ".hero-avail"],
  [stylesSrc, ".contact-copy"],
  [gridSrc, "gvChar"],
  [gridSrc, "gvLamp"],
  [gridSrc, "gv-palette"],
  [gridSrc, "gv-rail"],
  [gridSrc, "gv-beam"],
  [gridSrc, "view-transition-name"],
]) {
  assert.equal(src.includes(marker), true);
}
// Every local media file referenced in data must exist (no 404 plates/clips/docs).
const mediaRefs = new Set(stringsOf(data).filter(s => /^(assets|figures)\//.test(s)));
for (const ref of mediaRefs) {
  assert.equal(existsSync(new URL(`../public/${ref}`, import.meta.url)), true);
}

// Glow budget (2026-09 audit): no page-wide ambient wash, no neon-radius text glow.
assert.equal(stylesSrc.includes("radial-gradient(1100px"), false);
assert.equal(gridSrc.includes("radial-gradient(1100px"), false);
assert.equal(stylesSrc.includes("text-shadow: 0 0 24px"), false);
const sectionsSrc = readFileSync(new URL("../src/components/Sections.jsx", import.meta.url), "utf8");
assert.equal(sectionsSrc.includes("function LazyClip"), true);
assert.equal(typeof data.profile.availability, "string");
const fourOhFour = readFileSync(new URL("../public/404.html", import.meta.url), "utf8");
assert.equal(fourOhFour.includes('id="tmsg"'), true);
assert.equal(existsSync(new URL("../public/assets/images/og-image.png", import.meta.url)), true);

// Ink-fluid background + custom cursor: each ships its marker, and the
// check-grid ground is gone (no graticule tokens or usages remain).
const fluidSrc = readFileSync(new URL("../src/motion/Fluid.jsx", import.meta.url), "utf8");
// Regression: cleanup must never explicitly lose the GL context —
// StrictMode remounts in dev and a lost context never restores,
// which silently unmounted the whole canvas (no fluid, no error).
assert.equal(fluidSrc.includes("loseContext"), false);
assert.match(fluidSrc, /uCursorOn/);
assert.match(fluidSrc, /lastInput/);
assert.match(stylesSrc, /\.fluid-canvas/);
const cursorSrc = readFileSync(new URL("../src/motion/Cursor.jsx", import.meta.url), "utf8");
assert.match(cursorSrc, /has-custom-cursor/);
assert.match(stylesSrc, /\.cursor-ring/);
assert.equal(stylesSrc.includes("--graticule"), false);
assert.equal(gridSrc.includes("graticule"), false);
assert.match(gridSrc, /\.gv-room \{[^}]*background: transparent/);
// The nav-button magnetic system was removed (2026-09): no fluid event
// bus, no gather/attract passes, no fill layer anywhere.
assert.equal(existsSync(new URL("../src/motion/fluidBus.js", import.meta.url)), false);
assert.equal(fluidSrc.includes("fluid:hover"), false);
assert.equal(fluidSrc.includes("attract"), false);
assert.equal(gridSrc.includes("gv-fill"), false);
const roomViewsSrc = readFileSync(new URL("../src/grid/RoomViews.jsx", import.meta.url), "utf8");
assert.equal(roomViewsSrc.includes("fluidGather"), false);
const gridSiteSrc = readFileSync(new URL("../src/grid/GridSite.jsx", import.meta.url), "utf8");
assert.equal(gridSiteSrc.includes("fluidBurst"), false);
// Device QA: notch/side safe-areas on all HUD anchors, decorative
// corner chips hidden on short (landscape-phone) viewports.
assert.match(gridSrc, /safe-area-inset-top/);
assert.match(gridSrc, /safe-area-inset-left/);
assert.match(gridSrc, /max-height: 500px/);

console.log("Project hierarchy checks passed.");
