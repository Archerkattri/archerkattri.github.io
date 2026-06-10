// ════════════════════════════════════════════════════════════
// HUD — chart-room instruments: top bar, coordinate readout,
// zoom controls, mini-map, station index, mobile bottom sheet.
// All fixed to the screen; the world moves underneath.
// ════════════════════════════════════════════════════════════
import { useRef } from "react";
import { Icon } from "../components/Shell";
import { WORLD, DISTRICTS, STATIONS, STATION_MAP, INDEX_GROUPS, INDEX_LABELS, DISTRICT_MAP } from "./layout";
import { codeOf } from "./Stations";
import { PanelContent } from "./Panel";

export function TopBar({ onIndex, indexOpen, onDocView, onGridView, cv }) {
  return (
    <header className="hud topbar">
      <a className="tb-brand" href="#" onClick={e => { e.preventDefault(); onIndex("home"); }}>
        <span className="nav-sig" aria-hidden="true" />
        <span className="tb-name">Krishi Attri</span>
        <span className="tb-sep" aria-hidden="true">·</span>
        <span className="tb-chart">THE RESEARCH CHART</span>
      </a>
      <nav className="tb-actions" aria-label="Chart controls">
        <button className="tb-btn" onClick={() => onIndex("toggle")} aria-expanded={indexOpen} aria-controls="station-index">
          <span className="tb-key" aria-hidden="true">I</span> INDEX
        </button>
        {onGridView && (
          <button className="tb-btn" onClick={onGridView} title="Back to the map (default view)">
            MAP
          </button>
        )}
        <button className="tb-btn" onClick={onDocView} title="Read as a plain document">
          DOC VIEW
        </button>
        <a className="tb-btn tb-cv" href={cv} target="_blank" rel="noopener">
          CV <Icon name="external" size={10} />
        </a>
      </nav>
    </header>
  );
}

/* live coordinate readout — updated imperatively by the camera */
export function Readout({ readoutRef }) {
  return (
    <div className="hud readout" aria-hidden="true">
      <span className="ro-led" />
      <div className="ro-lines" ref={readoutRef}>
        <span className="ro-geo">ACQUIRING FIX…</span>
        <span className="ro-xy" />
      </div>
    </div>
  );
}

export function ZoomControls({ onZoom, onFit, onHome }) {
  return (
    <div className="hud zoomctl" role="group" aria-label="Zoom controls">
      <button onClick={() => onZoom(1.45)} aria-label="Zoom in">+</button>
      <button onClick={() => onZoom(1 / 1.45)} aria-label="Zoom out">−</button>
      <button onClick={onFit} aria-label="Fit whole chart" className="fit">⤢</button>
      <button onClick={onHome} aria-label="Back to origin" className="home">⌖</button>
    </div>
  );
}

/* ── mini-map ── */
const MM_W = 188;
const MM_H = Math.round(MM_W * (WORLD.maxY - WORLD.minY) / (WORLD.maxX - WORLD.minX));

export function Minimap({ viewRectRef, onJump }) {
  const svgRef = useRef(null);
  const k = MM_W / (WORLD.maxX - WORLD.minX);
  const toWorld = e => {
    const r = svgRef.current.getBoundingClientRect();
    return {
      x: WORLD.minX + (e.clientX - r.left) / r.width * (WORLD.maxX - WORLD.minX),
      y: WORLD.minY + (e.clientY - r.top) / r.height * (WORLD.maxY - WORLD.minY),
    };
  };
  const down = e => {
    e.preventDefault();
    svgRef.current.setPointerCapture(e.pointerId);
    const p = toWorld(e); onJump(p.x, p.y, true);
    const move = ev => { const q = toWorld(ev); onJump(q.x, q.y, false); };
    const up = () => {
      svgRef.current?.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    svgRef.current.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <div className="hud minimap" aria-label="Mini-map — click to jump">
      <svg
        ref={svgRef} width={MM_W} height={MM_H}
        viewBox={`${WORLD.minX} ${WORLD.minY} ${WORLD.maxX - WORLD.minX} ${WORLD.maxY - WORLD.minY}`}
        onPointerDown={down}
      >
        {DISTRICTS.map(d => (
          <rect key={d.id} className="mm-district"
            x={d.rect.x} y={d.rect.y} width={d.rect.w} height={d.rect.h} />
        ))}
        {STATIONS.map(s => (
          <rect key={s.id} className={`mm-node${s.id === "hero" ? " hero" : ""}${s.data?.flagship ? " flag" : ""}`}
            x={s.x} y={s.y} width={s.w} height={s.h} />
        ))}
        <rect ref={viewRectRef} className="mm-view" x="0" y="0" width="100" height="100" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="mm-label">PLAN — 1:{Math.round(1 / k / 10) * 10}</span>
    </div>
  );
}

/* ── station index (desktop panel; also keyboard/SR navigation) ── */
export function StationIndex({ open, openId, onSelect, onClose }) {
  return (
    <nav id="station-index" className={`hud stindex${open ? " open" : ""}`} aria-label="Station index" aria-hidden={!open}>
      <header className="si-head">
        <span>STATION INDEX</span>
        <button className="pn-close" onClick={onClose} aria-label="Close index"><Icon name="close" size={14} /></button>
      </header>
      <div className="si-scroll">
        {INDEX_GROUPS.map(g => {
          const d = DISTRICT_MAP[g.district];
          return (
            <div key={g.district} className="si-group">
              <button className="si-district" onClick={() => onSelect(`district:${g.district}`)} tabIndex={open ? 0 : -1}>
                <span className="si-n">{d.n}</span> {d.id === "origin" ? "ORIGIN" : d.name}
              </button>
              {g.items.map(id => (
                <button
                  key={id}
                  className={`si-item${openId === id ? " on" : ""}`}
                  onClick={() => onSelect(id)}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="si-code">{codeOf(id)}</span>
                  {INDEX_LABELS[id] || STATION_MAP[id].label}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

/* ── mobile bottom sheet: index + full card ── */
export function MobileSheet({ state, setState, openId, onSelect, onCloseCard }) {
  const st = openId ? STATION_MAP[openId] : null;
  const startY = useRef(null);
  const onDown = e => { startY.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); };
  const onUp = e => {
    if (startY.current == null) return;
    const dy = e.clientY - startY.current;
    startY.current = null;
    if (dy > 48) {
      if (state === "card") { onCloseCard(); setState("peek"); }
      else setState("peek");
    } else if (dy < -48) {
      setState(state === "peek" ? "list" : state);
    } else if (Math.abs(dy) < 8) {
      // tap
      if (state === "peek") setState("list");
      else if (state === "list") setState("peek");
    }
  };
  const title = st ? (st.data?.title || st.data?.name || st.label) : null;
  return (
    <div className={`hud sheet s-${state}`} role={state === "card" ? "dialog" : undefined}
      aria-label={state === "card" && title ? `${title} — full card` : "Station index"}>
      <button className="sheet-handle" onPointerDown={onDown} onPointerUp={onUp}
        aria-label={state === "peek" ? "Open station index" : "Collapse sheet"}>
        <i aria-hidden="true" />
        <span>{state === "card" && title ? title : "STATION INDEX"}</span>
        {state === "card" && (
          <span className="sheet-x" onClick={e => { e.stopPropagation(); onCloseCard(); setState("peek"); }}>
            <Icon name="close" size={15} />
          </span>
        )}
      </button>
      <div className="sheet-body">
        {state === "card" && st ? (
          <div className="sheet-card">
            <span className="st-code">ST {codeOf(st.id)} — FULL CARD</span>
            <h2 className="pn-title">{title}</h2>
            <PanelContent st={st} />
          </div>
        ) : (
          <div className="sheet-index">
            {INDEX_GROUPS.map(g => {
              const d = DISTRICT_MAP[g.district];
              return (
                <div key={g.district} className="si-group">
                  <button className="si-district" onClick={() => onSelect(`district:${g.district}`)}>
                    <span className="si-n">{d.n}</span> {d.id === "origin" ? "ORIGIN" : d.name}
                  </button>
                  {g.items.map(id => (
                    <button key={id} className="si-item" onClick={() => onSelect(id)}>
                      <span className="si-code">{codeOf(id)}</span>
                      {INDEX_LABELS[id] || STATION_MAP[id].label}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
