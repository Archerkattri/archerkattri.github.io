// ════════════════════════════════════════════════════════════
// World decor — graticule, axes, district frames, survey edges.
// Static once rendered; all motion is the camera.
// ════════════════════════════════════════════════════════════
import { WORLD, DISTRICTS, EDGES, ROUTE_IDS, STATION_MAP, ADAPTER_DOTS, anchor } from "./layout";

const W = WORLD.maxX - WORLD.minX;
const H = WORLD.maxY - WORLD.minY;

/* graticule + origin axes + tick labels */
export function Graticule() {
  const ticks = [];
  for (let x = Math.ceil(WORLD.minX / 1000) * 1000; x <= WORLD.maxX; x += 1000) {
    if (x !== 0) ticks.push(
      <text key={`tx${x}`} className="g-tick" x={x + 14} y={-14}>{x > 0 ? `+${x}` : x}</text>
    );
  }
  for (let y = Math.ceil(WORLD.minY / 1000) * 1000; y <= WORLD.maxY; y += 1000) {
    if (y !== 0) ticks.push(
      <text key={`ty${y}`} className="g-tick" x={18} y={y - 12}>{y > 0 ? `+${y}` : y}</text>
    );
  }
  return (
    <>
      <div
        className="gratic" aria-hidden="true"
        style={{ left: WORLD.minX, top: WORLD.minY, width: W, height: H }}
      />
      <svg
        className="axes" aria-hidden="true"
        viewBox={`${WORLD.minX} ${WORLD.minY} ${W} ${H}`}
        style={{ left: WORLD.minX, top: WORLD.minY, width: W, height: H }}
      >
        <line className="g-axis" vectorEffect="non-scaling-stroke" x1={WORLD.minX} y1="0" x2={WORLD.maxX} y2="0" />
        <line className="g-axis" vectorEffect="non-scaling-stroke" x1="0" y1={WORLD.minY} x2="0" y2={WORLD.maxY} />
        <circle className="g-origin" cx="0" cy="0" r="7" />
        <text className="g-tick origin" x={20} y={-18}>0,0 · SEOUL DATUM</text>
        {ticks}
      </svg>
    </>
  );
}

export function DistrictFrames() {
  return DISTRICTS.filter(d => d.id !== "origin").map(d => (
    <div
      key={d.id}
      className="district"
      style={{ left: d.rect.x, top: d.rect.y, width: d.rect.w, height: d.rect.h }}
      aria-hidden="true"
    >
      <span className="district-tab">DISTRICT {d.n} · {d.name}</span>
      <span className="district-name">{d.name}</span>
      <i className="dc tl" /><i className="dc tr" /><i className="dc bl" /><i className="dc br" />
    </div>
  ));
}

/* edge geometry helpers */
const pt = id => anchor(STATION_MAP[id]);
const mix = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

function Chevron({ a, b, t = 0.56 }) {
  const p = mix(a, b, t);
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return (
    <path
      className="e-chev"
      d="M -7 -4.5 L 3 0 L -7 4.5"
      transform={`translate(${p.x} ${p.y}) rotate(${ang})`}
    />
  );
}

function EdgeLabel({ a, b, label, dy = -10 }) {
  const m = mix(a, b, 0.5);
  return <text className="e-label" x={m.x} y={m.y + dy} textAnchor="middle">{label}</text>;
}

export function Edges() {
  const hi = pt("hicache-pp");
  const route = ROUTE_IDS.map(pt);
  const routeD = route.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg
      className="edges" aria-hidden="true"
      viewBox={`${WORLD.minX} ${WORLD.minY} ${W} ${H}`}
      style={{ left: WORLD.minX, top: WORLD.minY, width: W, height: H }}
    >
      {/* HiCache++ → adapter satellites: thin spokes */}
      {ADAPTER_DOTS.map(a => (
        <line key={a.id} className="e-spoke draw" pathLength="1" vectorEffect="non-scaling-stroke"
          x1={hi.x} y1={hi.y} x2={a.x} y2={a.y} />
      ))}

      {/* experience route */}
      <path className="e-route draw" pathLength="1" vectorEffect="non-scaling-stroke" d={routeD} />
      {route.map((p, i) => (
        <circle key={i} className="e-stop" cx={p.x} cy={p.y} r="9" />
      ))}

      {/* survey edges */}
      {EDGES.map((e, i) => {
        const a = pt(e.from), b = pt(e.to);
        if (e.type === "arc") {
          // Seoul → Orlando, dashed great-circle flavor
          const m = mix(a, b, 0.5);
          const cx = m.x, cy = m.y - 260;
          return (
            <g key={i}>
              <path className="e-arc" vectorEffect="non-scaling-stroke" d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} />
              <text className="e-label arc" x={m.x} y={m.y - 150} textAnchor="middle">{e.label}</text>
            </g>
          );
        }
        if (e.type === "future") {
          return (
            <g key={i}>
              <line className="e-future" vectorEffect="non-scaling-stroke" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              <EdgeLabel a={a} b={b} label={e.label} />
            </g>
          );
        }
        return (
          <g key={i}>
            <line className="e-flow draw" pathLength="1" vectorEffect="non-scaling-stroke" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            <Chevron a={a} b={b} />
            <EdgeLabel a={a} b={b} label={e.label} />
          </g>
        );
      })}
    </svg>
  );
}
