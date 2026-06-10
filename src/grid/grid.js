// ════════════════════════════════════════════════════════════
// The Map — 2D page grid (compass rooms).
// A plus-shaped grid of full-viewport pages around HOME:
//
//                      [N2 PUBLICATIONS]
//                      [N1 RESEARCH    ]
// [W2 BACKGROUND] [W1 EXPERIENCE] [00 HOME] [E1 SOFTWARE] [E2 ADAPTERS]
//                      [S1 CONTACT     ]
//                      [S2 FIELD LOG   ]
//
// col/row are cells of a 5×5 lattice; arms only connect through
// the center, so cardinal adjacency fully defines the edges.
// ════════════════════════════════════════════════════════════

export const ROOMS = [
  { id: "home",         code: "00", name: "HOME",         col: 2, row: 2 },
  { id: "research",     code: "N1", name: "RESEARCH",     col: 2, row: 1 },
  { id: "publications", code: "N2", name: "PUBLICATIONS", col: 2, row: 0 },
  { id: "software",     code: "E1", name: "SOFTWARE",     col: 3, row: 2 },
  { id: "adapters",     code: "E2", name: "ADAPTERS",     col: 4, row: 2 },
  { id: "experience",   code: "W1", name: "EXPERIENCE",   col: 1, row: 2 },
  { id: "background",   code: "W2", name: "BACKGROUND",   col: 0, row: 2 },
  { id: "contact",      code: "S1", name: "CONTACT",      col: 2, row: 3 },
  { id: "fieldlog",     code: "S2", name: "FIELD LOG",    col: 2, row: 4 },
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

/* hash → room; station-level deep links land on the containing room */
const ALIASES = {
  top: "home", hero: "home",
  gaussianfeels: "research", popslam: "research",
  "gnss-denied": "research", semg: "research", "thesis-site": "research",
  splatreg: "software", mathlas: "software", "hicache-pp": "software",
  "mcp-node": "software", "lean-node": "software",
  "snu-grad": "experience", "snu-intern": "experience",
  "villanova-research": "experience", area2farms: "experience",
  ampere: "experience", "ucf-next": "experience",
  education: "background", honors: "background", documents: "background",
  skills: "background", archive: "background",
  "log-0": "fieldlog", seoul: "contact", orlando: "contact",
};

export function roomFromHash(hash) {
  const id = (hash || "").replace(/^#/, "");
  if (!id) return "home";
  if (ROOM_MAP[id]) return id;
  return ALIASES[id] || null;
}
