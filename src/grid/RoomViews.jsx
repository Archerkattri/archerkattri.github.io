// ════════════════════════════════════════════════════════════
// The Map — room contents. One component per room; everything
// reads from data.js (single source of truth shared with the
// document view and the chart).
// ════════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_DATA as D } from "../data";
import { Icon } from "../components/Shell";
import {
  SectionHead, ResearchCard, SoftwareCard, CompactProjects,
  getFeaturedSoftware, getCompactSoftware, XpRow, EarlierRoles,
  SchoolSection, SchoolProjectsSection, ContactSection, ProofLine,
} from "../components/Sections";
import { ROOMS, ROOM_MAP, DIRS } from "./grid";

/* ── the grid drawn as a map (HUD corner + home centerpiece) ── */
export function GridMap({ cur, navigate, large = false }) {
  return (
    <div
      className={"gv-map" + (large ? " lg" : " sm")}
      role="navigation"
      aria-label="Site map, the page grid"
    >
      <span className="gv-map-axis h" aria-hidden="true" />
      <span className="gv-map-axis v" aria-hidden="true" />
      {large && <span className="gv-compass" aria-hidden="true">N</span>}
      {ROOMS.map(r => (
        <button
          key={r.id}
          className={"gv-cell" + (r.id === cur ? " on" : "")}
          style={{ gridColumn: r.col + 1, gridRow: r.row + 1 }}
          onClick={() => navigate(r.id)}
          aria-label={r.id === cur ? `${r.name}, you are here` : `Go to ${r.code} ${r.name}`}
          aria-current={r.id === cur ? "page" : undefined}
          title={`${r.code} · ${r.name}`}
        >
          {large && (
            <>
              <span className="gv-cell-code">{r.code}</span>
              <span className="gv-cell-name">{r.name}</span>
              {r.id === cur && <span className="gv-cell-here">● YOU ARE HERE</span>}
            </>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── in-page pointer to a neighboring room ── */
function RoomXRef({ to, dir, label, navigate }) {
  const r = ROOM_MAP[to];
  return (
    <button className="gv-xref" onClick={() => navigate(to)}>
      <span className="gv-xref-dir">{DIRS[dir].arrow} {r.code}</span>
      <span className="gv-xref-label">{label}</span>
    </button>
  );
}

/* ════════════════ 00 · HOME ════════════════ */
/* Identity-first composition: the photo is the primary visual mass
   (one framed plate beside the identity stack); the room-grid map is a
   subordinate instrument card below the text. The map stays fully
   usable as navigation (clickable cells), it just no longer competes
   with Krishi for the cold-open eye. */
function HomeRoom({ navigate }) {
  const p = D.profile;
  const c = p.contact;
  const links = [
    { label: "GitHub", href: c.github, icon: "github", ext: true },
    { label: "Email", href: `mailto:${c.email}`, icon: "mail" },
    { label: "LinkedIn", href: c.linkedin, icon: "linkedin", ext: true },
    { label: "CV", href: c.cv, icon: "file", ext: true },
  ];
  const identity = (
    <div className="gv-home-id">
      {/* identity first: the name at display scale, then the role line,
          then the one-liner (who / what / why inside two seconds) */}
      <h1 className="gv-home-name" aria-label={p.name}>
        {p.name.split("").map((ch, i) => (
          <span key={i} className="gv-char" style={{ "--ch": i }} aria-hidden="true">
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </h1>
      <p className="gv-home-role">
        <span className="kicker-dash" aria-hidden="true" />{p.roleLine}
      </p>
      <p className="gv-home-tag">
        {p.headlineLines[0]} <em>{p.headlineLines[1]}</em>
      </p>
      <p className="hero-sub">{p.sub}</p>
      <ProofLine proof={p.proofLine} />
      <ul className="hero-meta">
        {p.meta.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <div className="hero-links">
        {links.map(l => (
          <a key={l.label} href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener" } : {})}>
            <Icon name={l.icon} size={13} /> {l.label}
          </a>
        ))}
      </div>
      <p className="hero-avail"><span className="avail-dot" aria-hidden="true" />{p.availability}</p>
    </div>
  );
  const photo = (
    <figure className="gv-home-fig">
      <picture>
        <source srcSet={p.headshotWebp} type="image/webp" />
        <img src={p.headshot} alt="Krishi Attri" width="320" height="412" decoding="async" fetchPriority="high" />
      </picture>
    </figure>
  );
  // GridMap carries role="navigation" itself
  const map = (
    <div className="gv-home-map">
      <GridMap cur="home" navigate={navigate} large />
      <span className="gv-map-hint" aria-hidden="true">Press an edge, or a cell</span>
    </div>
  );
  return (
    <div className="gv-home">
      {identity}
      <aside className="gv-home-rail">
        {photo}
        {map}
      </aside>
    </div>
  );
}

/* ════════════════ N1 · RESEARCH ════════════════ */
function ResearchRoom({ navigate }) {
  const main = D.research.filter(r => !r.compact);
  const compact = D.research.filter(r => r.compact);
  return (
    <section className="section">
      <div className="container">
        <SectionHead index="N1" label="Research" title="Perception through" em="occlusion."
          sub="SLAM when the easy signal is denied: visuo-tactile perception through the robot's own grasp (M.S. thesis), dense visual SLAM, and GNSS-denied navigation (B.S. thesis research)." />
        <div className="sheet-stack">
          {main.map(r => <ResearchCard key={r.id} item={r} />)}
        </div>
        <div className="compact-grid">
          {compact.map(r => (
            <div key={r.id} className="compact-row">
              <div className="compact-head">
                <h4>{r.title}</h4>
                <span className="compact-date">{r.date}</span>
              </div>
              <p>{r.subtitle}</p>
              <span className="pill dim">{r.tag}</span>
            </div>
          ))}
        </div>
        <RoomXRef to="publications" dir="n" label="The publication record, one room north" navigate={navigate} />
      </div>
    </section>
  );
}

/* ════════════════ N2 · PUBLICATIONS ════════════════ */
function PublicationsRoom({ navigate }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHead index="N2" label="Publications" title="On the" em="record."
          sub="The M.S. thesis, a course paper, and the solo-author engrXiv preprints behind the released software (splatreg, HiCache++, CERT-FLOW, ToothPrint). The list grows as the thesis work reaches formal venues." />
        <div className="gv-pubs">
          {D.publications.map((p, i) => (
            <article key={i} className="gv-pub reveal">
              <h3 className="gv-pub-title">{p.title}</h3>
              <div className="gv-pub-meta">{p.venue} · {p.date}</div>
              <div className="gv-pub-links">
                {p.href ? (
                  <a className="gv-pub-link" href={p.href} target="_blank" rel="noopener">
                    {p.status} <Icon name="external" size={10} />
                  </a>
                ) : (
                  <span className="gv-pub-status">{p.status}</span>
                )}
                {p.page && (
                  <a className="gv-pub-link" href={p.page} target="_blank" rel="noopener">
                    {p.pageLabel} <Icon name="external" size={10} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <RoomXRef to="research" dir="s" label="Back south, the research itself" navigate={navigate} />
      </div>
    </section>
  );
}

/* ════════════════ E1 · PERSONAL PROJECTS ════════════════ */
const FAMILY_OF = name =>
  name.toLowerCase().includes("comfyui") ? "Integrations"
    : name.includes("hunyuan") ? "Hunyuan3D family"
      : name.includes("trellis") ? "TRELLIS family"
        : "SAM 3D family";

/* in-room pointer: scrolls to a section further down the same room */
function SectionJump({ target, label }) {
  const reveal = () => {
    const section = document.getElementById(target);
    if (!section) return;
    if (section instanceof HTMLDetailsElement) section.open = true;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <button
      className="gv-xref"
      onClick={reveal}
    >
      <span className="gv-xref-dir">↓ BELOW</span>
      <span className="gv-xref-label">{label}</span>
    </button>
  );
}

function PersonalProjectsRoom({ navigate }) {
  const featured = getFeaturedSoftware(D);
  const compact = getCompactSoftware(D);
  const families = [];
  for (const a of D.adapters) {
    const f = FAMILY_OF(a.name);
    let g = families.find(x => x.name === f);
    if (!g) { g = { name: f, items: [] }; families.push(g); }
    g.items.push(a);
  }
  return (
    <section className="section">
      <div className="container">
        <SectionHead index="E1" label="Personal projects" title="Released &" em="installable."
          sub="Five flagship systems with measured results, followed by a compact archive of earlier and supporting work." />
        <div className="sw-stack">
          {featured.map((s, i) => (
            <SoftwareCard
              key={s.id}
              item={s}
              index={i}
              adapters={D.adapters}
              adaptersAction={
                s.adaptersNote ? (
                  <SectionJump target="adapter-constellation"
                    label="The accelerator family, end of this room" />
                ) : null
              }
            />
          ))}
        </div>
        <CompactProjects items={compact} />

        {/* closing section: the HiCache accelerator constellation */}
        <details id="adapter-constellation" className="gv-constellation project-fold adapter-fold">
          <summary className="project-fold-toggle">
            <span>
              <span className="bg-label">HiCache++ accelerator family</span>
              <span className="project-fold-count">16 compact integrations</span>
            </span>
            <span className="sum-mark" aria-hidden="true">+</span>
          </summary>
          <div className="adapter-fold-body">
            {families.map(f => (
              <div key={f.name} className="gv-family">
                <div className="bg-label">{f.name}</div>
                <div className="gv-adapters">
                  {f.items.map(a => (
                    <div key={a.name} className="gv-adapter">
                      <a className="adapter-main" href={a.url} target="_blank" rel="noopener">
                        <span className="adapter-name"><Icon name="github" size={12} /> {a.name}</span>
                        <span className="adapter-desc">{a.desc}</span>
                      </a>
                      {a.guide && <a className="adapter-guide" href={a.guide} target="_blank" rel="noopener">Docs & guide</a>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
        <RoomXRef to="school-projects" dir="e" label="School projects, one room east" navigate={navigate} />
      </div>
    </section>
  );
}

/* ════════════════ E2 · SCHOOL PROJECTS ════════════════ */
function SchoolProjectsRoom({ navigate }) {
  return (
    <SchoolProjectsSection
      data={D}
      index="E2"
      footer={
        <RoomXRef to="personal-projects" dir="w"
          label="Back west, the released libraries" navigate={navigate} />
      }
    />
  );
}

/* ════════════════ W1 · EXPERIENCE (the route) ════════════════ */
/* The route line draws downward as the room scrolls; each stop stays
   greyed until the drawn line reaches its node, then lights up.
   Reduced motion (and any setup failure): line fully drawn, nothing
   greyed: the `gv-route-anim` class never lands, the CSS fallback
   shows the full line. */
function ExperienceRoom() {
  const routeRef = useRef(null);
  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;
    const track = route.querySelector(".gv-route-track");
    const line = route.querySelector(".gv-route-line");
    const stops = Array.from(route.querySelectorAll(".gv-stop"));
    const scroller = route.closest(".gv-scroll");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !track || !line || !scroller) {
      stops.forEach(s => s.classList.add("lit"));
      return;
    }
    route.classList.add("gv-route-anim");
    let raf = 0;
    const update = () => {
      raf = 0;
      const tr = track.getBoundingClientRect();
      if (tr.height < 1) return;
      // the pen tip rides 62% down the viewport
      const tip = Math.max(tr.top, Math.min(tr.bottom, scroller.getBoundingClientRect().top + scroller.clientHeight * 0.62));
      line.style.transform = `scaleY(${(tip - tr.top) / tr.height})`;
      for (const s of stops) {
        // node center sits ~36px below the stop's top edge (see .gv-stop::before)
        s.classList.toggle("lit", tip >= s.getBoundingClientRect().top + 36);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section className="section">
      <div className="container">
        <SectionHead index="W1" label="Experience" title="Lab, field &" em="industry."
          sub="The route so far, newest first." />
        <div className="gv-route" ref={routeRef}>
          {/* the current stop, inked above the route line (arrived Aug 2026) */}
          <div className="gv-route-now" aria-label="Current stop: UCF Ph.D., ORCGS Doctoral Fellow, from August 2026">
            <span className="gv-now-pill" aria-hidden="true">NOW</span>
            <span>UCF, Ph.D. · ORCGS fellow · from Aug 2026</span>
          </div>
          <div className="xp-list gv-route-list">
            <span className="gv-route-track" aria-hidden="true" />
            <span className="gv-route-line" aria-hidden="true" />
            {D.experience.map(e => (
              <div key={e.id} className="gv-stop">
                <XpRow e={e} />
              </div>
            ))}
          </div>
        </div>
        <EarlierRoles data={D} />
      </div>
    </section>
  );
}

/* ════════════════ W2 · SCHOOL ════════════════ */
function SchoolRoom() {
  return <SchoolSection data={D} index="W2" />;
}

/* ════════════════ S1 · CONTACT ════════════════ */
function ContactRoom() {
  return <ContactSection data={D} index="S1" />;
}

/* ════════════════ S2 · GALLERY ════════════════ */
const toWebp = src => src.replace(/\.(jpe?g|png)$/i, ".webp");

function GalleryRoom() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead index="S2" label="Gallery" title="Hardware along" em="the way." />
        <div className="gv-plates">
          {D.gallery.map((g, i) => (
            <figure key={i} className="gv-plate">
              <picture>
                <source srcSet={toWebp(g.src)} type="image/webp" />
                <img src={g.src} alt={g.caption} loading="lazy" decoding="async" />
              </picture>
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
          {D.galleryVideos.map((v, i) => (
            <figure key={"v" + i} className="gv-plate">
              <video src={v.src} poster={v.poster} muted loop playsInline preload="none" controls />
              <figcaption>▶ {v.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* scroll-linked progress beam: a thin teal line down the room's
   left edge, spring-smoothed (Tracing Beam pattern, vanilla rAF lerp).
   Hidden on home (nothing to scroll) and under reduced motion. */
export function ScrollBeam({ scrollerRef }) {
  const beamRef = useRef(null);
  useEffect(() => {
    const scroller = scrollerRef?.current;
    const beam = beamRef.current;
    if (!scroller || !beam) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let shown = -1;
    const update = () => {
      raf = 0;
      const max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 4) { beam.style.opacity = "0"; return; }
      const target = Math.min(1, Math.max(0, scroller.scrollTop / max));
      shown = shown < 0 ? target : shown + (target - shown) * 0.18;
      beam.style.opacity = "1";
      beam.style.transform = `scaleY(${Math.max(0.02, shown)})`;
      if (Math.abs(target - shown) > 0.0005) {
        raf = requestAnimationFrame(update);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollerRef]);
  return <span className="gv-beam" ref={beamRef} aria-hidden="true" />;
}

/* in-room section rail: dot navigation for the long card rooms.
   Dots for each id-bearing sheet/datasheet + the adapter constellation
   (rooms with fewer than 3 stops get no rail); scrollspy-lit via IO,
   click scrolls (opening folds as needed). Wide desktop only. */
export function SectionRail({ roomId, scrollerRef }) {
  const [stops, setStops] = useState([]);
  const [active, setActive] = useState(null);
  useEffect(() => {
    const scroller = scrollerRef?.current;
    if (!scroller) return;
    const els = Array.from(scroller.querySelectorAll(".sheet[id], .sw[id], #adapter-constellation"));
    if (els.length < 3) { setStops([]); return; }
    setStops(els.map(el => ({
      id: el.id,
      label: el.id === "adapter-constellation"
        ? "Accelerator family"
        : (el.querySelector(".sheet-title, .sw-name")?.textContent?.trim() || el.id),
    })));
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) setActive(e.target.id);
      }
    }, { root: scroller, rootMargin: "-30% 0px -60% 0px", threshold: 0 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [roomId, scrollerRef]);
  if (stops.length < 3) return null;
  const jump = id => {
    const section = document.getElementById(id);
    if (!section) return;
    if (section instanceof HTMLDetailsElement) section.open = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  return (
    <nav className="gv-rail" aria-label="Sections in this room">
      {stops.map(s => (
        <button
          key={s.id}
          className={"gv-rail-dot" + (s.id === active ? " on" : "")}
          onClick={() => jump(s.id)}
          aria-label={`Scroll to ${s.label}`}
          title={s.label}
        >
          <span className="gv-rail-label" aria-hidden="true">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── dispatch ── */
const VIEWS = {
  home: HomeRoom,
  research: ResearchRoom,
  publications: PublicationsRoom,
  "personal-projects": PersonalProjectsRoom,
  "school-projects": SchoolProjectsRoom,
  experience: ExperienceRoom,
  school: SchoolRoom,
  contact: ContactRoom,
  gallery: GalleryRoom,
};

export function RoomContent({ id, navigate }) {
  const View = VIEWS[id];
  return <View navigate={navigate} />;
}
