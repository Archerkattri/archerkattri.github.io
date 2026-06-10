// ════════════════════════════════════════════════════════════
// The Map — 2D page grid (compass rooms).
// A plus-shaped grid of full-viewport pages around HOME:
//
//                      [N2 PUBLICATIONS]
//                      [N1 RESEARCH    ]
// [W2 SCHOOL] [W1 EXPERIENCE] [00 HOME] [E1 PERSONAL PROJECTS] [E2 SCHOOL PROJECTS]
//                      [S1 CONTACT     ]
//                      [S2 GALLERY     ]
//
// col/row are cells of a 5×5 lattice; arms only connect through
// the center, so cardinal adjacency fully defines the edges.
// ════════════════════════════════════════════════════════════

export const ROOMS = [
  { id: "home",              code: "00", name: "HOME",              col: 2, row: 2 },
  { id: "research",          code: "N1", name: "RESEARCH",          col: 2, row: 1 },
  { id: "publications",      code: "N2", name: "PUBLICATIONS",      col: 2, row: 0 },
  { id: "personal-projects", code: "E1", name: "PERSONAL PROJECTS", col: 3, row: 2 },
  { id: "school-projects",   code: "E2", name: "SCHOOL PROJECTS",   col: 4, row: 2 },
  { id: "experience",        code: "W1", name: "EXPERIENCE",        col: 1, row: 2 },
  { id: "school",            code: "W2", name: "SCHOOL",            col: 0, row: 2 },
  { id: "contact",           code: "S1", name: "CONTACT",           col: 2, row: 3 },
  { id: "gallery",           code: "S2", name: "GALLERY",           col: 2, row: 4 },
];

export const ROOM_MAP = Object.fromEntries(ROOMS.map(r => [r.id, r]));
const AT = Object.fromEntries(ROOMS.map(r => [`${r.col},${r.row}`, r]));

/* direction metadata (screen-space: north = up = row − 1) */
export const DIRS = {
  n: { dx: 0, dy: -1, arrow: "↑", word: "north" },
  s: { dx: 0, dy: 1, arrow: "↓", word: "south" },
  e: { dx: 1, dy: 0, arrow: "→", word: "east" },
  w: { dx: -1, dy: 0, arrow: "←", word: "west" },
};

export const neighborOf = (room, d) =>
  AT[`${room.col + DIRS[d].dx},${room.row + DIRS[d].dy}`] || null;

/* hash → room; station-level deep links land on the containing room.
   Legacy room slugs (pre-retitle) and retired chart/doc anchors stay
   as redirect aliases: #software → E1, #adapters → E1 (constellation
   section), #background → W2, #fieldlog / #field-log → S2,
   chart station ids (#gaussianfeels, #log-3, #adapter-7, …) → their
   owning rooms. */
const ALIASES = {
  top: "home", hero: "home",
  gaussianfeels: "research", popslam: "research",
  "gnss-denied": "research", semg: "research", "thesis-site": "research",
  software: "personal-projects", adapters: "personal-projects",
  splatreg: "personal-projects", mathlas: "personal-projects",
  "hicache-pp": "personal-projects",
  "mcp-node": "personal-projects", "lean-node": "personal-projects",
  "school-projects": "school-projects", capstone: "school-projects",
  archive: "school-projects",
  "documents-marker": "school",
  "snu-grad": "experience", "snu-intern": "experience",
  "villanova-research": "experience", area2farms: "experience",
  ampere: "experience", "ucf-next": "experience",
  background: "school", education: "school", honors: "school",
  documents: "school", skills: "school", leadership: "school",
  fieldlog: "gallery", "field-log": "gallery", "log-0": "gallery",
  seoul: "contact", orlando: "contact",
};

export function roomFromHash(hash) {
  const id = (hash || "").replace(/^#/, "");
  if (!id) return "home";
  if (ROOM_MAP[id]) return id;
  if (ALIASES[id]) return ALIASES[id];
  /* retired-chart numbered stations: photo/video plates → S2,
     accelerator satellite dots → E1's constellation section */
  if (/^logv?-\d+$/.test(id)) return "gallery";
  if (/^adapter-\d+$/.test(id)) return "personal-projects";
  return null;
}

/* hash → in-room section anchor (scrolled to after the room lands).
   The card ids exist on both render targets (ResearchCard / SoftwareCard
   carry id={item.id}), so the hero proof line can deep-link to them. */
const SECTION_TARGETS = {
  adapters: "adapter-constellation",
  gaussianfeels: "gaussianfeels",
  splatreg: "splatreg",
  mathlas: "mathlas",
  "hicache-pp": "hicache-pp",
};

export function sectionFromHash(hash) {
  const id = (hash || "").replace(/^#/, "");
  if (/^adapter-\d+$/.test(id)) return "adapter-constellation";
  return SECTION_TARGETS[id] || null;
}
