// ════════════════════════════════════════════════════════════
// The Map — 2D page-grid engine.
// Each room is a full-viewport page with native vertical scroll.
// Movement is by edge buttons / arrow keys / mini-map / swipe —
// a full-viewport slide in the pressed direction. No free pan,
// no scroll-hijacking; wheel only ever scrolls inside the room.
//
// Keyboard contract (documented in PORTFOLIO_MAINTENANCE.md):
//   ← / →            always move across the grid (rooms only
//                    scroll vertically, so horizontal arrows are free)
//   ↑ / ↓            scroll the room; AT the top/bottom edge a fresh
//                    press (not key-repeat) steps to the neighbor room
//   H / Esc          return to HOME
// ════════════════════════════════════════════════════════════
import { useCallback, useEffect, useRef, useState } from "react";
import { ROOMS, ROOM_MAP, DIRS, neighborOf, roomFromHash, sectionFromHash } from "./grid";
import { RoomContent, GridMap } from "./RoomViews";

const SLIDE_MS = 520;       // cardinal slide
const SLIDE_DIAG_MS = 640;  // mini-map diagonal jump (single oblique slide)

export default function GridSite({ reduced, onChartView, onDocView }) {
  const [room, setRoom] = useState("home");
  const [trans, setTrans] = useState(null); // { to, dx, dy, dur }
  const roomRef = useRef(room);
  roomRef.current = room;
  const transRef = useRef(null);
  transRef.current = trans;
  const pendingRef = useRef(null);
  const scrollerRef = useRef(null);
  const liveRef = useRef(null);

  const announce = useCallback(id => {
    const r = ROOM_MAP[id];
    if (liveRef.current) liveRef.current.textContent = `${r.code} — ${r.name}`;
  }, []);

  const setHash = useCallback((id, push) => {
    const url = id === "home"
      ? location.pathname + location.search
      : `#${id}`;
    if (push) history.pushState(null, "", url);
    else history.replaceState(null, "", url);
  }, []);

  /* navigate — `push` adds a history entry (false for back/forward/deep-link) */
  const navigate = useCallback((to, { push = true } = {}) => {
    if (!ROOM_MAP[to] || to === roomRef.current) return;
    if (transRef.current) { pendingRef.current = { to, push }; return; }
    const a = ROOM_MAP[roomRef.current];
    const b = ROOM_MAP[to];
    if (push) setHash(to, true);
    announce(to);
    if (reduced) { setRoom(to); return; }
    const dx = Math.sign(b.col - a.col);
    const dy = Math.sign(b.row - a.row);
    const dur = dx && dy ? SLIDE_DIAG_MS : SLIDE_MS;
    setTrans({ to, dx, dy, dur });
    window.setTimeout(() => {
      setRoom(to);
      setTrans(null);
      // give keyboard scrolling (↑/↓/PgDn/space) the new room
      requestAnimationFrame(() => scrollerRef.current?.focus({ preventScroll: true }));
      const p = pendingRef.current;
      pendingRef.current = null;
      if (p && p.to !== to) navigate(p.to, { push: p.push });
    }, dur + 40);
  }, [announce, reduced, setHash]);
  const navRef = useRef(navigate);
  navRef.current = navigate;

  /* section-level deep links (e.g. legacy #adapters → the E1
     constellation): scroll once the target room has landed */
  const pendingSectionRef = useRef(null);
  useEffect(() => {
    const sec = pendingSectionRef.current;
    if (!sec) return;
    pendingSectionRef.current = null;
    requestAnimationFrame(() =>
      document.getElementById(sec)?.scrollIntoView({ block: "start" }));
  }, [room]);

  /* deep link: land on the hashed room — quick orient slide from home */
  useEffect(() => {
    const target = roomFromHash(location.hash);
    if (target && target !== "home") {
      pendingSectionRef.current = sectionFromHash(location.hash);
      if (reduced) { setRoom(target); announce(target); return; }
      const t = setTimeout(() => navRef.current(target, { push: false }), 380);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* hash routing: back/forward + manual edits */
  useEffect(() => {
    const onHash = () => {
      const id = roomFromHash(location.hash);
      if (id && id !== roomRef.current) {
        pendingSectionRef.current = sectionFromHash(location.hash);
        navRef.current(id, { push: false });
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* keyboard */
  useEffect(() => {
    const key = e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.matches?.("input, textarea, select")) return;
      const cur = ROOM_MAP[roomRef.current];
      if (e.key === "Escape" || e.key === "h" || e.key === "H") {
        e.preventDefault();
        navRef.current("home");
        return;
      }
      const go = d => {
        const n = neighborOf(cur, d);
        if (n) navRef.current(n.id);
      };
      const sc = scrollerRef.current;
      switch (e.key) {
        case "ArrowLeft": e.preventDefault(); go("w"); break;
        case "ArrowRight": e.preventDefault(); go("e"); break;
        case "ArrowUp": {
          e.preventDefault();
          if (sc && sc.scrollTop <= 1) { if (!e.repeat) go("n"); }
          else sc?.scrollBy({ top: -90 });
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          if (sc && sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2) {
            if (!e.repeat) go("s");
          } else sc?.scrollBy({ top: 90 });
          break;
        }
        default: break;
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  /* initial focus so PgUp/PgDn/space scroll the room immediately */
  useEffect(() => {
    scrollerRef.current?.focus({ preventScroll: true });
  }, []);

  /* mobile: horizontal swipe = E/W move (vertical stays native scroll) */
  const touchRef = useRef(null);
  const onTouchStart = e => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = e => {
    const s = touchRef.current;
    touchRef.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > 1.6 * Math.abs(dy)) {
      const n = neighborOf(ROOM_MAP[roomRef.current], dx < 0 ? "e" : "w");
      if (n) navRef.current(n.id);
    }
  };

  const cur = ROOM_MAP[room];
  const animStyle = trans
    ? { "--gv-dx": trans.dx, "--gv-dy": trans.dy, "--gv-dur": `${trans.dur}ms` }
    : undefined;

  return (
    <div className="gridview" data-room={room} data-moving={trans ? "" : undefined}>
      <div className="gv-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          key={room}
          className={"gv-roomwrap" + (trans ? " gv-out" : "")}
          style={animStyle}
          aria-hidden={trans ? true : undefined}
        >
          <RoomShell id={room} navigate={navigate} scrollerRef={trans ? undefined : scrollerRef} />
        </div>
        {trans && (
          <div key={trans.to} className="gv-roomwrap gv-in" style={animStyle}>
            <RoomShell id={trans.to} navigate={navigate} />
          </div>
        )}
      </div>

      {/* ── HUD: fixed instruments over the sliding pages ── */}
      <nav className="gv-edges" aria-label="Map navigation — neighboring pages">
        {Object.keys(DIRS).map(d => {
          const n = neighborOf(cur, d);
          if (!n) return null;
          return (
            <button
              key={d}
              className={`gv-edge gv-edge-${d}`}
              onClick={() => navigate(n.id)}
              aria-label={`Go ${DIRS[d].word} — ${n.name}`}
            >
              <span className="gv-edge-arrow" aria-hidden="true">{DIRS[d].arrow}</span>
              <span className="gv-edge-label">{n.name}</span>
              <span className="gv-edge-code" aria-hidden="true">{n.code}</span>
            </button>
          );
        })}
      </nav>

      {room === "home" ? (
        <span className="gv-brand" aria-hidden="true">
          <span className="nav-sig" />KRISHI ATTRI<span className="gv-brand-tail"> — THE MAP</span>
        </span>
      ) : (
        <button className="gv-homebtn" onClick={() => navigate("home")} aria-label="Return home (H)">
          <span aria-hidden="true">⌖</span> HOME
        </button>
      )}

      <div className="gv-corner-map">
        <GridMap cur={room} navigate={navigate} />
      </div>

      <div className="gv-views" role="group" aria-label="Other views">
        <button className="gv-viewbtn" onClick={onChartView} title="Open the free-pan research chart">
          ⌖ CHART
        </button>
        <button className="gv-viewbtn" onClick={onDocView} title="Read as a plain document">
          DOC
        </button>
      </div>

      <div className="gv-caption" aria-hidden="true">
        {cur.code} · {cur.name} — © {new Date().getFullYear()} KRISHI ATTRI
      </div>

      <span className="gv-live" role="status" aria-live="polite" ref={liveRef} />
    </div>
  );
}

/* ── one room = full-viewport page with native vertical scroll ── */
function RoomShell({ id, navigate, scrollerRef }) {
  const def = ROOM_MAP[id];
  return (
    <section className="gv-room" aria-label={`${def.code} — ${def.name}`}>
      <div className="gv-scroll" ref={scrollerRef} tabIndex={-1}>
        <div className="gv-inner">
          <RoomContent id={id} navigate={navigate} />
          {id !== "home" && (
            <footer className="gv-foot">
              <span>{def.code} · {def.name}</span>
              <span className="gv-foot-coords">37.4565° N, 126.9520° E → 28.6024° N, 81.2001° W</span>
            </footer>
          )}
        </div>
      </div>
    </section>
  );
}
