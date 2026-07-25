import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { PORTFOLIO_DATA as data } from "../src/data.js";

const expectedFeatured = [
  "splatreg",
  "cert-flow",
  "hicache-pp",
  "action-interface",
  "mathlas",
];

assert.deepEqual(data.featuredSoftwareIds, expectedFeatured);
assert.equal(JSON.stringify(data.profile).includes("GaussianFeels"), false);
assert.deepEqual(
  data.profile.proofLine.libraries.map((item) => item.label),
  ["splatreg", "CERT-FLOW", "HiCache++", "ActionABI + ActionShift", "mathlas"],
);
assert.equal(data.research.some((item) => item.id === "gaussianfeels"), true);

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
  assert.equal((html.match(/class="sw"/g) ?? []).length, 5);
  assert.equal(html.includes("Forge"), false);
  assert.match(html, /class="school-crossref" href="#gaussianfeels"/);
  assert.match(html, /EOD \/ GNSS-denied robot platform/);
  assert.match(html, /CV object-detection web app/);
  assert.match(html, /class="live-stats"/);
  assert.match(html, /Public repos/);
  assert.match(html, /Authored commits/);
  assert.match(html, /PyPI/);
  assert.match(html, /Hugging Face/);
  assert.match(html, /Comfy Registry/);
  assert.match(html, /Zenodo/);
  assert.match(html, /GitHub Releases/);
  assert.match(html, /MCP directories/);
}

console.log("Project hierarchy checks passed.");
