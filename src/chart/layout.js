// ════════════════════════════════════════════════════════════
// The Research Chart — world layout.
// All coordinates are world units (px at zoom ×1.00).
// Stations are plates pinned to the chart; districts are the
// numbered regions of the map; edges are the survey lines.
// ════════════════════════════════════════════════════════════
import { PORTFOLIO_DATA as D } from "../data";

/* ── camera constants ── */
export const SCALE_MIN = 0.11;
export const SCALE_MAX = 1.9;
export const BAND_FAR = 0.34;   // below: district names + station titles only
export const BAND_NEAR = 0.62;  // above: full teaser content + edge labels

/* Origin (0,0) of the chart ≙ Seoul — the lab where the map was drawn. */
export const ORIGIN_LAT = 37.4565;
export const ORIGIN_LON = 126.952;
export const DEG_PER_UNIT = 0.00042;

/* ── districts ── */
export const DISTRICTS = [
  { id: "origin",   n: "00", name: "ORIGIN",     rect: { x: -560, y: -460, w: 1140, h: 950 } },
  { id: "research", n: "01", name: "RESEARCH",   rect: { x: -2720, y: -1660, w: 1690, h: 1640 } },
  { id: "software", n: "02", name: "PERSONAL PROJECTS", rect: { x: 760, y: -1660, w: 2300, h: 1680 } },
  { id: "experience", n: "03", name: "EXPERIENCE", rect: { x: -2860, y: 560, w: 2780, h: 2360 } },
  { id: "fieldlog", n: "04", name: "GALLERY",    rect: { x: 760, y: 660, w: 1880, h: 1240 } },
  { id: "contact",  n: "05", name: "CONTACT",    rect: { x: -460, y: 1560, w: 1180, h: 1300 } },
];

/* aligned to the 500-unit graticule so the grid passes through 0,0 */
export const WORLD = { minX: -3000, minY: -2000, maxX: 3500, maxY: 3000 };

/* ── stations ──
   { id, type, district, x, y (top-left), w, h (estimate for anchors/minimap),
     far (far-band label size), label, data } */
const xp = Object.fromEntries(D.experience.map(e => [e.id, e]));
const res = Object.fromEntries(D.research.map(r => [r.id, r]));
const sw = Object.fromEntries(D.software.map(s => [s.id, s]));

export const STATIONS = [
  /* ── ORIGIN ── */
  { id: "hero", type: "hero", district: "origin", x: -380, y: -300, w: 800, h: 716,
    far: 120, label: "Krishi Attri", data: D.profile },

  /* ── 01 RESEARCH ── */
  { id: "gaussianfeels", type: "research", district: "research", x: -2560, y: -1480, w: 620, h: 560,
    far: 84, label: "GaussianFeels", data: res.gaussianfeels },
  { id: "popslam", type: "research", district: "research", x: -1740, y: -1300, w: 500, h: 525,
    far: 64, label: "PoP-SLAM", data: res.popslam },
  { id: "publications", type: "publications", district: "research", x: -1660, y: -420, w: 540, h: 340,
    far: 48, label: "Publications", data: D.publications },
  { id: "gnss-denied", type: "compact", district: "research", x: -2540, y: -480, w: 380, h: 320,
    far: 42, label: "GNSS-denied SLAM", data: res["gnss-denied"] },
  { id: "semg", type: "compact", district: "research", x: -2080, y: -340, w: 380, h: 320,
    far: 42, label: "Stretchable sEMG", data: res.semg },
  { id: "thesis-site", type: "marker", district: "research", x: -1660, y: -1580, w: 200, h: 60,
    far: 0, label: "Thesis site", data: { sub: "krishiattrisnu.github.io", href: "https://krishiattrisnu.github.io" } },

  /* ── 02 PERSONAL PROJECTS ── */
  { id: "splatreg", type: "software", district: "software", x: 900, y: -1520, w: 540, h: 460,
    far: 68, label: "splatreg", data: sw.splatreg },
  { id: "mathlas", type: "software", district: "software", x: 2080, y: -1380, w: 540, h: 460,
    far: 68, label: "mathlas", data: sw.mathlas },
  { id: "hicache-pp", type: "software", district: "software", x: 1160, y: -560, w: 560, h: 505,
    far: 68, label: "HiCache++", data: sw["hicache-pp"] },
  { id: "mcp-node", type: "marker", district: "software", x: 2760, y: -980, w: 220, h: 60,
    far: 0, label: "MCP protocol", data: { sub: "13 tools · no LLM inside" } },
  { id: "lean-node", type: "marker", district: "software", x: 2820, y: -700, w: 220, h: 60,
    far: 0, label: "Lean 4 kernel", data: { sub: "real formal checks" } },

  /* ── 03 EXPERIENCE — the route, oldest → now ── */
  { id: "ampere", type: "xp", district: "experience", x: -2740, y: 2160, w: 400, h: 250,
    far: 40, label: "Ampere", data: xp.ampere },
  { id: "area2farms", type: "xp", district: "experience", x: -2360, y: 1820, w: 400, h: 300,
    far: 40, label: "Area2Farms", data: xp.area2farms },
  { id: "villanova-research", type: "xp", district: "experience", x: -1960, y: 1460, w: 420, h: 280,
    far: 40, label: "Villanova", data: xp["villanova-research"] },
  { id: "snu-intern", type: "xp", district: "experience", x: -1500, y: 1140, w: 400, h: 320,
    far: 40, label: "SNU intern", data: xp["snu-intern"] },
  { id: "snu-grad", type: "xp", district: "experience", x: -1040, y: 760, w: 480, h: 270,
    far: 52, label: "SNU · now", data: xp["snu-grad"] },
  { id: "ucf-next", type: "marker", district: "experience", x: -440, y: 660, w: 240, h: 60,
    far: 0, label: "UCF Ph.D. · Aug 2026", data: { sub: "ORCGS Doctoral Fellow", dashed: true } },

  /* background cluster, east of the route */
  { id: "education", type: "education", district: "experience", x: -660, y: 1320, w: 520, h: 560,
    far: 44, label: "Education", data: D.education },
  { id: "honors", type: "honors", district: "experience", x: -1460, y: 1620, w: 460, h: 590,
    far: 44, label: "Honors", data: D.honors },
  { id: "documents", type: "documents", district: "experience", x: -1380, y: 2310, w: 400, h: 525,
    far: 44, label: "Documents", data: D.documents },
  { id: "skills", type: "skills", district: "experience", x: -840, y: 2080, w: 600, h: 595,
    far: 44, label: "Stack", data: D.skills },
  { id: "archive", type: "archive", district: "experience", x: -2240, y: 2280, w: 640, h: 490,
    far: 44, label: "Earlier builds", data: D.archive },

  /* ── 04 GALLERY — photo plates ── */
  ...D.gallery.map((g, i) => ({
    id: `log-${i}`, type: "photo", district: "fieldlog",
    x: [900, 1340, 1780, 2220, 1020, 1460][i], y: [800, 880, 780, 900, 1340, 1430][i],
    w: 340, h: 330, far: 0, rot: [-1.6, 1.2, -0.8, 1.8, 1.4, -1.2][i],
    label: g.caption, data: g,
  })),
  ...D.galleryVideos.map((v, i) => ({
    id: `logv-${i}`, type: "video", district: "fieldlog",
    x: [1900, 2340][i], y: [1330, 1440][i],
    w: 340, h: 330, far: 0, rot: [-1.4, 1][i],
    label: v.caption, data: v,
  })),

  /* ── 05 CONTACT ── */
  { id: "contact", type: "contact", district: "contact", x: -80, y: 1740, w: 620, h: 640,
    far: 64, label: "Contact", data: { contact: D.profile.contact, openTo: D.openTo } },
  { id: "seoul", type: "geo", district: "contact", x: 380, y: 2480, w: 240, h: 70,
    far: 0, label: "SEOUL", data: { coords: "37.4565° N · 126.9520° E", sub: "2024 — 2026" } },
  { id: "orlando", type: "geo", district: "contact", x: -380, y: 2790, w: 250, h: 70,
    far: 0, label: "ORLANDO", data: { coords: "28.6024° N · 81.2001° W", sub: "from Aug 2026" } },
];

export const STATION_MAP = Object.fromEntries(STATIONS.map(s => [s.id, s]));

export const anchor = s => ({ x: s.x + s.w / 2, y: s.y + s.h / 2 });

/* ── HiCache++ adapter constellation: 12 satellite dots ── */
const HI = anchor(STATION_MAP["hicache-pp"]);
export const ADAPTER_DOTS = D.adapters.map((a, i) => {
  // a fan east of HiCache++, two interleaved radii for an organic ring
  const t = -78 + i * (164 / 11);                     // degrees, -78° … +86°
  const r = i % 2 === 0 ? 880 : 1060;
  const rad = (t * Math.PI) / 180;
  return {
    ...a, id: `adapter-${i}`,
    x: HI.x + Math.cos(rad) * r * 0.92,
    y: HI.y + Math.sin(rad) * r * 0.62 + 60,
  };
});

/* ── edges ──
   type: flow (drawn line w/ direction mark) · spoke (thin satellite line)
   route (experience journey) · future (dashed) · arc (Seoul→Orlando) */
export const EDGES = [
  { from: "hero", to: "gaussianfeels", label: "M.S. THESIS", type: "flow" },
  { from: "hero", to: "snu-grad", label: "CURRENT POST", type: "flow" },
  { from: "gaussianfeels", to: "splatreg", label: "REGISTRATION", type: "flow" },
  { from: "gaussianfeels", to: "thesis-site", label: "FULL THESIS", type: "flow" },
  { from: "gaussianfeels", to: "hicache-pp", label: "FRAME-0 PRIOR, ACCELERATED", type: "flow" },
  { from: "popslam", to: "gaussianfeels", label: "DENSE-SLAM LINEAGE", type: "flow" },
  { from: "mathlas", to: "mcp-node", label: "SERVED OVER MCP", type: "flow" },
  { from: "mathlas", to: "lean-node", label: "FORMAL VERIFY", type: "flow" },
  { from: "snu-grad", to: "ucf-next", label: "AUG 2026", type: "future" },
  { from: "seoul", to: "orlando", label: "≈12,100 KM · AUG 2026", type: "arc" },
];

export const ROUTE_IDS = ["ampere", "area2farms", "villanova-research", "snu-intern", "snu-grad"];

/* ── station index (also the document order) ── */
export const INDEX_GROUPS = [
  { district: "origin", items: ["hero"] },
  { district: "research", items: ["gaussianfeels", "popslam", "gnss-denied", "semg", "publications"] },
  { district: "software", items: ["splatreg", "mathlas", "hicache-pp"] },
  { district: "experience", items: ["snu-grad", "snu-intern", "villanova-research", "area2farms", "ampere", "education", "honors", "documents", "skills", "archive"] },
  { district: "fieldlog", items: ["log-0"] },
  { district: "contact", items: ["contact"] },
];

/* index display labels (compact) */
export const INDEX_LABELS = {
  hero: "Krishi Attri — identity",
  "gaussianfeels": "GaussianFeels · flagship",
  popslam: "PoP-SLAM",
  "gnss-denied": "GNSS-denied SLAM",
  semg: "Stretchable sEMG",
  publications: "Publications",
  splatreg: "splatreg",
  mathlas: "mathlas",
  "hicache-pp": "HiCache++ · 12 adapters",
  "snu-grad": "SNU · Soft Robotics & Bionics",
  "snu-intern": "SNU · research intern",
  "villanova-research": "Villanova · robotics",
  area2farms: "Area2Farms",
  ampere: "Ampere",
  education: "Education",
  honors: "Honors & fellowships",
  documents: "Documents",
  skills: "Stack",
  archive: "School projects · earlier builds",
  "log-0": "Photo plates",
  contact: "Contact",
};

/* district → camera framing for #research-style links */
export const DISTRICT_MAP = Object.fromEntries(DISTRICTS.map(d => [d.id, d]));
