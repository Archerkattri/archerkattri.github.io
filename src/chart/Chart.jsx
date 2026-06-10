// ════════════════════════════════════════════════════════════
// The Research Chart — DOM-based ZUI.
// One world div, translate3d + scale; camera lives in refs and
// writes transforms imperatively (no React re-render on pan).
// ════════════════════════════════════════════════════════════
import { useEffect, useRef, useState, useCallback } from "react";
import {
  WORLD, STATIONS, STATION_MAP, DISTRICT_MAP, anchor,
  SCALE_MIN, SCALE_MAX, BAND_FAR, BAND_NEAR,
  ORIGIN_LAT, ORIGIN_LON, DEG_PER_UNIT,
} from "./layout";
import { Station, AdapterConstellation, PANEL_TYPES } from "./Stations";
import { Graticule, DistrictFrames, Edges } from "./WorldDecor";
import { Panel } from "./Panel";
import { TopBar, Readout, ZoomControls, Minimap, StationIndex, MobileSheet } from "./Hud";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* hash → district (new slugs + legacy aliases kept as redirects;
   district *ids* are stable internals — only display names changed) */
const HASH_DISTRICTS = {
  research: "research",
  "personal-projects": "software", software: "software", adapters: "software",
  experience: "experience",
  school: "experience", background: "experience", "school-projects": "experience",
  gallery: "fieldlog", fieldlog: "fieldlog", "field-log": "fieldlog",
  contact: "contact", top: "origin",
};

export default function Chart({ onDocView, onGridView, reduced }) {
  const viewportRef = useRef(null);
  const worldRef = useRef(null);
  const readoutRef = useRef(null);
  const viewRectRef = useRef(null);

  const [openId, setOpenId] = useState(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [sheetState, setSheetState] = useState("peek");
  const [phase, setPhase] = useState(reduced ? "live" : "boot");
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 760);
  const [hinted, setHinted] = useState(false);

  /* camera — never in React state */
  const cam = useRef({ x: 0, y: -60, s: 0.2 });
  const vp = useRef({ w: 1440, h: 900 });
  const flight = useRef(null);
  const bandRef = useRef("");
  const openRef = useRef(null);
  openRef.current = openId;
  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;

  const fitScale = useCallback(() => {
    const { w, h } = vp.current;
    return Math.min(w / (WORLD.maxX - WORLD.minX), h / (WORLD.maxY - WORLD.minY)) * 0.96;
  }, []);
  const minScale = useCallback(() => Math.min(SCALE_MIN, fitScale()), [fitScale]);

  /* ── apply camera → DOM ── */
  const apply = useCallback(() => {
    const { x, y, s } = cam.current;
    const { w, h } = vp.current;
    if (worldRef.current) {
      worldRef.current.style.transform =
        `translate3d(${(w / 2 - x * s).toFixed(2)}px, ${(h / 2 - y * s).toFixed(2)}px, 0) scale(${s})`;
    }
    const band = s < BAND_FAR ? "far" : s < BAND_NEAR ? "mid" : "near";
    if (band !== bandRef.current && viewportRef.current) {
      bandRef.current = band;
      viewportRef.current.dataset.band = band;
    }
    if (readoutRef.current) {
      const lat = ORIGIN_LAT - y * DEG_PER_UNIT;
      const lon = ORIGIN_LON + x * DEG_PER_UNIT;
      const geo = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"} · ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
      const xy = `x ${x >= 0 ? "+" : "−"}${String(Math.round(Math.abs(x))).padStart(4, "0")} · y ${y >= 0 ? "+" : "−"}${String(Math.round(Math.abs(y))).padStart(4, "0")} · ×${s.toFixed(2)}`;
      const [g, c] = readoutRef.current.children;
      if (g.textContent !== geo) g.textContent = geo;
      if (c.textContent !== xy) c.textContent = xy;
    }
    if (viewRectRef.current) {
      const r = viewRectRef.current;
      r.setAttribute("x", x - w / (2 * s));
      r.setAttribute("y", y - h / (2 * s));
      r.setAttribute("width", w / s);
      r.setAttribute("height", h / s);
    }
  }, []);

  const clampCam = useCallback(() => {
    const c = cam.current;
    c.s = clamp(c.s, minScale(), SCALE_MAX);
    const m = 160 / c.s;
    c.x = clamp(c.x, WORLD.minX - m, WORLD.maxX + m);
    c.y = clamp(c.y, WORLD.minY - m, WORLD.maxY + m);
  }, [minScale]);

  const cancelFlight = useCallback(() => {
    if (flight.current) { cancelAnimationFrame(flight.current.raf); flight.current = null; }
  }, []);

  const flyTo = useCallback((tx, ty, ts, dur = 650, done) => {
    cancelFlight();
    ts = clamp(ts, minScale(), SCALE_MAX);
    if (reduced || dur === 0) {
      cam.current = { x: tx, y: ty, s: ts };
      clampCam(); apply(); done?.();
      return;
    }
    const from = { ...cam.current };
    const t0 = performance.now();
    const f = { raf: 0 };
    flight.current = f;
    const step = now => {
      const k = ease(clamp((now - t0) / dur, 0, 1));
      cam.current.x = from.x + (tx - from.x) * k;
      cam.current.y = from.y + (ty - from.y) * k;
      cam.current.s = Math.exp(Math.log(from.s) + (Math.log(ts) - Math.log(from.s)) * k);
      clampCam(); apply();
      if (k < 1 && flight.current === f) f.raf = requestAnimationFrame(step);
      else { if (flight.current === f) flight.current = null; if (k >= 1) done?.(); }
    };
    f.raf = requestAnimationFrame(step);
  }, [apply, clampCam, cancelFlight, minScale, reduced]);

  const zoomAt = useCallback((sx, sy, factor) => {
    cancelFlight();
    const c = cam.current;
    const { w, h } = vp.current;
    const ns = clamp(c.s * factor, minScale(), SCALE_MAX);
    if (ns === c.s) return;
    const wx = (sx - w / 2) / c.s + c.x;
    const wy = (sy - h / 2) / c.s + c.y;
    c.s = ns;
    c.x = wx - (sx - w / 2) / ns;
    c.y = wy - (sy - h / 2) / ns;
    clampCam(); apply();
  }, [apply, clampCam, cancelFlight, minScale]);

  const fitAll = useCallback((dur = 700) => {
    flyTo((WORLD.minX + WORLD.maxX) / 2, (WORLD.minY + WORLD.maxY) / 2, fitScale(), dur);
  }, [flyTo, fitScale]);

  const homeView = useCallback((dur = 900) => {
    const s = mobileRef.current ? clamp((vp.current.w - 44) / 840, minScale(), 0.62) : 0.52;
    flyTo(30, -50, s, dur);
  }, [flyTo, minScale]);

  /* ── station navigation ── */
  const closeStation = useCallback(() => {
    setOpenId(null);
    if (mobileRef.current) setSheetState("peek");
    history.replaceState(null, "", location.pathname + location.search);
  }, []);

  const flyToStation = useCallback((id, open, dur = 650) => {
    const st = STATION_MAP[id];
    if (!st) return;
    const a = anchor(st);
    const { w, h } = vp.current;
    let s, x = a.x, y = a.y;
    if (mobileRef.current) {
      s = clamp((w - 36) / st.w, minScale(), 0.95);
      if (open) y = a.y + (h * 0.17) / s;       // sheet covers lower 2/3
    } else {
      s = st.type === "hero" ? clamp((w * 0.62) / st.w, 0.55, 0.9)
        : clamp((w * 0.42) / st.w, 0.6, 1.0);
      if (open) x = a.x + 235 / s;              // dock the panel on the right
    }
    flyTo(x, y, s, dur);
    if (open) {
      setOpenId(id);
      if (mobileRef.current) setSheetState("card");
      history.replaceState(null, "", `#${id}`);
    }
  }, [flyTo, minScale]);

  const activate = useCallback(id => {
    const st = STATION_MAP[id];
    if (!st) return;
    setIndexOpen(false);
    if (PANEL_TYPES.has(st.type)) flyToStation(id, true);
    else flyToStation(id, false);
  }, [flyToStation]);

  const fitDistrict = useCallback(id => {
    const d = DISTRICT_MAP[id];
    if (!d) return;
    const { w, h } = vp.current;
    const pad = 220;
    const s = clamp(Math.min(w / (d.rect.w + pad), h / (d.rect.h + pad)), minScale(), 0.8);
    setOpenId(null);
    flyTo(d.rect.x + d.rect.w / 2, d.rect.y + d.rect.h / 2, s, 750);
    history.replaceState(null, "", `#${id === "origin" ? "top" : id}`);
  }, [flyTo, minScale]);

  const onIndexSelect = useCallback(sel => {
    setIndexOpen(false);
    if (sel.startsWith("district:")) fitDistrict(sel.slice(9));
    else activate(sel);
  }, [activate, fitDistrict]);

  const onFocusStation = useCallback((id, e) => {
    if (!e.target.matches(":focus-visible")) return;
    const st = STATION_MAP[id];
    const a = anchor(st);
    const { x, y, s } = cam.current;
    const { w, h } = vp.current;
    const sx = w / 2 + (a.x - x) * s, sy = h / 2 + (a.y - y) * s;
    const off = sx < 60 || sx > w - 60 || sy < 60 || sy > h - 60;
    if (off || s < 0.3) flyTo(a.x, a.y, Math.max(s, 0.45), 450);
  }, [flyTo]);

  const navHash = useCallback((hash, dur) => {
    const id = hash.replace(/^#/, "");
    if (!id || id === "top") { homeView(dur); return true; }
    if (STATION_MAP[id]) {
      flyToStation(id, PANEL_TYPES.has(STATION_MAP[id].type), dur);
      return true;
    }
    if (HASH_DISTRICTS[id]) { fitDistrict(HASH_DISTRICTS[id]); return true; }
    return false;
  }, [homeView, flyToStation, fitDistrict]);

  /* ── mount: sizing, gestures, keyboard, boot ── */
  useEffect(() => {
    const viewport = viewportRef.current;
    const measure = () => {
      vp.current = { w: window.innerWidth, h: window.innerHeight };
      setMobile(window.innerWidth < 760);
      clampCam(); apply();
    };
    measure();

    /* boot: start at fit-all, then settle on the origin station */
    cam.current = {
      x: (WORLD.minX + WORLD.maxX) / 2,
      y: (WORLD.minY + WORLD.maxY) / 2,
      s: fitScale(),
    };
    clampCam(); apply();
    const timers = [];
    const initialNav = () => { if (!navHash(location.hash, reduced ? 0 : 900)) homeView(); };
    if (reduced) { setPhase("live"); initialNav(); }
    else {
      timers.push(setTimeout(initialNav, 1700));
      timers.push(setTimeout(() => setPhase("live"), 2800));
    }

    /* pointers: pan + pinch, click-guard */
    const pointers = new Map();
    let drag = null, pinch = null, guard = false, captured = false;

    const down = e => {
      if (e.target.closest(".hud, .panel")) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      cancelFlight();
      setHinted(true);
      if (pointers.size === 1) {
        drag = { sx: e.clientX, sy: e.clientY, cx: cam.current.x, cy: cam.current.y, moved: 0 };
      } else if (pointers.size === 2) {
        drag = null;
        const [p1, p2] = [...pointers.values()];
        const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const { w, h } = vp.current;
        pinch = {
          d0: Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1,
          s0: cam.current.s,
          wx: (mid.x - w / 2) / cam.current.s + cam.current.x,
          wy: (mid.y - h / 2) / cam.current.s + cam.current.y,
        };
      }
    };
    const move = e => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      p.x = e.clientX; p.y = e.clientY;
      if (pinch && pointers.size >= 2) {
        e.preventDefault();
        const [p1, p2] = [...pointers.values()];
        const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1;
        const { w, h } = vp.current;
        const ns = clamp(pinch.s0 * (d / pinch.d0), minScale(), SCALE_MAX);
        cam.current.s = ns;
        cam.current.x = pinch.wx - (mid.x - w / 2) / ns;
        cam.current.y = pinch.wy - (mid.y - h / 2) / ns;
        guard = true;
        clampCam(); apply();
      } else if (drag) {
        const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
        drag.moved = Math.max(drag.moved, Math.abs(dx), Math.abs(dy));
        if (drag.moved > 4) {
          if (!captured) {
            captured = true;
            viewport.classList.add("dragging");
            try { viewport.setPointerCapture(e.pointerId); } catch { /* ok */ }
          }
          e.preventDefault();
          guard = true;
          cam.current.x = drag.cx - dx / cam.current.s;
          cam.current.y = drag.cy - dy / cam.current.s;
          clampCam(); apply();
        }
      }
    };
    const up = e => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 0) {
        drag = null;
        if (captured) { captured = false; viewport.classList.remove("dragging"); }
        setTimeout(() => { guard = false; }, 0);
      }
    };
    const clickGuard = e => {
      if (guard) { e.preventDefault(); e.stopPropagation(); }
    };

    const wheel = e => {
      if (e.target.closest(".panel, .sheet, .stindex")) return; // cooperative: panels scroll natively
      e.preventDefault();
      setHinted(true);
      cancelFlight();
      if (e.ctrlKey || e.metaKey) {
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.012));
      } else if (Math.abs(e.deltaX) > 0.5) {
        cam.current.x += e.deltaX / cam.current.s;
        cam.current.y += e.deltaY / cam.current.s;
        clampCam(); apply();
      } else {
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        zoomAt(e.clientX, e.clientY, Math.exp(-dy * 0.0022));
      }
    };

    const key = e => {
      const t = e.target;
      if (t.matches("input, textarea, select")) return;
      const inOverlay = t.closest?.(".panel, .stindex, .sheet");
      if (e.key === "Escape") {
        if (openRef.current) closeStation();
        else setIndexOpen(false);
        return;
      }
      if (inOverlay) return;
      const { w, h } = vp.current;
      const pan = 140 / cam.current.s;
      switch (e.key) {
        case "ArrowLeft": cam.current.x -= pan; break;
        case "ArrowRight": cam.current.x += pan; break;
        case "ArrowUp": cam.current.y -= pan; break;
        case "ArrowDown": cam.current.y += pan; break;
        case "+": case "=": zoomAt(w / 2, h / 2, 1.35); return;
        case "-": case "_": zoomAt(w / 2, h / 2, 1 / 1.35); return;
        case "0": case "f": case "F": fitAll(); e.preventDefault(); return;
        case "Home": case "h": case "H": homeView(650); return;
        case "i": case "I": setIndexOpen(o => !o); return;
        default: return;
      }
      e.preventDefault();
      cancelFlight(); clampCam(); apply();
    };

    const onHash = () => navHash(location.hash, 650);

    viewport.addEventListener("pointerdown", down);
    viewport.addEventListener("pointermove", move, { passive: false });
    viewport.addEventListener("pointerup", up);
    viewport.addEventListener("pointercancel", up);
    viewport.addEventListener("click", clickGuard, true);
    viewport.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key);
    window.addEventListener("resize", measure);
    window.addEventListener("hashchange", onHash);
    return () => {
      timers.forEach(clearTimeout);
      cancelFlight();
      viewport.removeEventListener("pointerdown", down);
      viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerup", up);
      viewport.removeEventListener("pointercancel", up);
      viewport.removeEventListener("click", clickGuard, true);
      viewport.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", measure);
      window.removeEventListener("hashchange", onHash);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openStationObj = openId ? STATION_MAP[openId] : null;

  return (
    <div className={`chart${phase === "boot" ? " booting" : ""}`}>
      <div
        className="viewport"
        ref={viewportRef}
        data-band="far"
        aria-label="The research chart — drag to pan, scroll to zoom, click a station to open it. A station index is available from the top bar."
      >
        <div className="world" ref={worldRef}>
          <Graticule />
          <DistrictFrames />
          <Edges />
          {STATIONS.map((s, i) => (
            <Station
              key={s.id} st={s} bootIndex={i}
              active={openId === s.id}
              onActivate={activate}
              onFocusStation={onFocusStation}
            />
          ))}
          <AdapterConstellation bootBase={8} />
        </div>
      </div>

      <TopBar
        cv={STATION_MAP.hero.data.contact.cv}
        indexOpen={indexOpen}
        onIndex={a => (a === "home" ? (closeStation(), homeView(650)) : setIndexOpen(o => !o))}
        onDocView={onDocView}
        onGridView={onGridView}
      />
      {!mobile && <Minimap viewRectRef={viewRectRef} onJump={(x, y, smooth) => {
        cancelFlight();
        if (smooth) flyTo(x, y, cam.current.s, 350);
        else { cam.current.x = x; cam.current.y = y; clampCam(); apply(); }
      }} />}
      <Readout readoutRef={readoutRef} />
      <ZoomControls
        onZoom={f => zoomAt(vp.current.w / 2, vp.current.h / 2, f)}
        onFit={() => { setHinted(true); fitAll(); }}
        onHome={() => { closeStation(); homeView(650); }}
      />
      {!mobile && (
        <StationIndex open={indexOpen} openId={openId} onSelect={onIndexSelect} onClose={() => setIndexOpen(false)} />
      )}
      {!mobile && openStationObj && PANEL_TYPES.has(openStationObj.type) && (
        <Panel st={openStationObj} onClose={closeStation} />
      )}
      {mobile && (
        <MobileSheet
          state={openId && sheetState === "card" ? "card" : sheetState === "card" ? "peek" : sheetState}
          setState={setSheetState}
          openId={openId}
          onSelect={onIndexSelect}
          onCloseCard={closeStation}
        />
      )}
      <div className={`hud hint${hinted ? " off" : ""}`} aria-hidden="true">
        DRAG TO PAN · SCROLL TO ZOOM · CLICK A STATION
      </div>
      <div className="hud chart-foot" aria-hidden="true">
        © {new Date().getFullYear()} KRISHI ATTRI · CHART DRAWN AT 37.4565° N — BOUND FOR 28.6024° N
      </div>
    </div>
  );
}
