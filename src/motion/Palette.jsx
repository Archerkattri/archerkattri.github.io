// Command palette: jump to any room or card (Ctrl/⌘ K).
// Reuses the grid router (navigate) for room moves, then reveals the
// card (opening enclosing folds) and scrolls it into view.
import { useEffect, useMemo, useRef, useState } from "react";
import { ROOMS } from "../grid/grid";
import { PORTFOLIO_DATA as D } from "../data";

export function buildTargets() {
  const rooms = ROOMS.map(r => ({
    kind: "room", label: `${r.code} · ${r.name}`,
    match: `${r.code} ${r.name} ${r.id}`,
    room: r.id, section: null,
  }));
  const sheets = D.research.map(r => ({
    kind: "card", label: r.title,
    match: `${r.title} research ${r.id}`,
    room: "research", section: r.compact ? null : r.id,
  }));
  const cards = D.software.map(s => ({
    kind: "card", label: s.name,
    match: `${s.name} software project ${s.id}`,
    room: "personal-projects", section: s.id,
  }));
  return [...rooms, ...sheets, ...cards];
}

export function filterTargets(q, targets) {
  const needle = q.trim().toLowerCase();
  if (!needle) return targets;
  return targets.filter(t => t.match.toLowerCase().includes(needle));
}

const optId = t => `gv-pal-${t.kind}-${t.room}-${t.section ?? "room"}`;

export function Palette({ open, onClose, navigate, reduced }) {
  const [q, setQ] = useState("");
  const [hi, setHi] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const targets = useMemo(buildTargets, []);
  const shown = useMemo(() => filterTargets(q, targets), [q, targets]);
  useEffect(() => {
    if (open) {
      setQ("");
      setHi(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open ]);
  useEffect(() => { setHi(0); }, [q]);
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [hi ]);
  if (!open) return null;
  const go = t => {
    onClose();
    navigate(t.room);
    if (!t.section) return;
    window.setTimeout(() => {
      const el = document.getElementById(t.section);
      if (!el) return;
      let p = el.parentElement;
      while (p) {
        if (p instanceof HTMLDetailsElement) p.open = true;
        p = p.parentElement;
      }
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, reduced ? 60 : 750);
  };
  /* handled keys stop here: the grid's window-level arrows/enter/escape
     must not fire while typing in the palette */
  const onKey = e => {
    if (e.key === "ArrowDown") {
      e.preventDefault(); e.stopPropagation();
      setHi(h => Math.min(shown.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); e.stopPropagation();
      setHi(h => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault(); e.stopPropagation();
      if (shown[hi]) go(shown[hi]);
    } else if (e.key === "Escape") {
      e.preventDefault(); e.stopPropagation();
      onClose();
    }
  };
  return (
    <div className="gv-palette-backdrop" onClick={onClose}>
      <div
        className="gv-palette" role="dialog" aria-label="Jump to room or card"
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef} className="gv-palette-input"
          value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={onKey} placeholder="Jump to room or card…"
          aria-label="Jump to room or card"
          role="combobox" aria-expanded="true" aria-controls="gv-palette-list"
          aria-activedescendant={shown[hi] ? optId(shown[hi]) : undefined}
          autoComplete="off" spellCheck="false"
        />
        <div ref={listRef} id="gv-palette-list" className="gv-palette-list" role="listbox" aria-label="Rooms and cards">
          {shown.map((t, i) => (
            <button
              key={optId(t) + t.label} id={optId(t)}
              className={"gv-palette-item" + (i === hi ? " hi" : "")}
              role="option" aria-selected={i === hi}
              onMouseEnter={() => setHi(i)} onClick={() => go(t)}
            >
              <span className="gv-palette-kind">{t.kind === "room" ? "ROOM" : "CARD"}</span>
              <span className="gv-palette-label">{t.label}</span>
            </button>
          ))}
          {shown.length === 0 && <div className="gv-palette-empty">No match on this map.</div>}
        </div>
      </div>
    </div>
  );
}
