// ════════════════════════════════════════════════════════════
// The Map — room contents. One component per room; everything
// reads from data.js (single source of truth shared with the
// document view and the chart).
// ════════════════════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { PORTFOLIO_DATA as D } from "../data";
import { Icon } from "../components/Shell";
import {
  SectionHead, ResearchCard, SoftwareCard, XpRow, EarlierRoles,
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
      <h1 className="gv-home-name">{p.name}</h1>
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
    </div>
  );
  const photo = (
    <figure className="gv-home-fig">
      <picture>
        <source srcSet={p.headshotWebp} type="image/webp" />
        <img src={p.headshot} alt="Krishi Attri" width="320" height="412" decoding="async" />
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
          sub="The M.S. thesis, a course paper, and the solo-author engrXiv preprints behind the released libraries (splatreg, HiCache++, CERT-FLOW). The list grows as the thesis work reaches formal venues." />
        <div className="gv-pubs">
          {D.publications.map((p, i) => (
            <article key={i} className="gv-pub">
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
  return (
    <button
      className="gv-xref"
      onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" })}
    >
      <span className="gv-xref-dir">↓ BELOW</span>
      <span className="gv-xref-label">{label}</span>
    </button>
  );
}

function PersonalProjectsRoom({ navigate }) {
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
          sub="Open-source research software, versioned and shipping: three libraries on PyPI, a certified-planning research stack, and a 16-repo accelerator family. Every number on this page is measured and reproducible from the repos." />
        <div className="sw-stack">
          {D.software.map(s => (
            <SoftwareCard
              key={s.id}
              item={s}
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

        {/* closing section: the HiCache accelerator constellation */}
        <div id="adapter-constellation" className="gv-constellation">
          <SectionHead index="E1·b" label="Accelerator family" title="The HiCache++" em="constellation."
            sub="Sixteen repos around one idea: thirteen accelerators (each generator paired with HiCache++ DMD or HiCache Hermite, plus the TaylorSeer baseline) and three ComfyUI nodes (Hunyuan3D, TRELLIS, TRELLIS.2; beta, registry submission awaiting GPU validation). Drop-in and training-free." />
          {families.map(f => (
            <div key={f.name} className="gv-family">
              <div className="bg-label">{f.name}</div>
              <div className="gv-adapters">
                {f.items.map(a => (
                  <a key={a.name} className="gv-adapter" href={a.url} target="_blank" rel="noopener">
                    <span className="adapter-name"><Icon name="github" size={12} /> {a.name}</span>
                    <span className="adapter-desc">{a.desc}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
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
          sub="The route so far, newest first. Seoul now, Orlando next." />
        <div className="gv-route" ref={routeRef}>
          {/* penciled-in margin note: the stop that isn't on the route yet */}
          <div className="gv-route-next" aria-label="Next stop: UCF Ph.D., ORCGS Doctoral Fellow, August 2026">
            <span className="gv-note-caret" aria-hidden="true">^</span>
            <span className="gv-note-text">next stop UCF, Ph.D. · ORCGS fellow · Aug 2026</span>
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

/* ════════════════ S1 · CONTACT (+ relocation arc) ════════════════ */
function RelocationArc() {
  return (
    <div className="gv-arc" aria-label="Relocation: Seoul to Orlando, August 2026">
      <svg viewBox="0 0 640 158" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path className="gv-arc-path" d="M 60 122 Q 320 8 580 122" />
        <circle className="gv-arc-dot" cx="60" cy="122" r="4" />
        <circle className="gv-arc-dot hollow" cx="580" cy="122" r="4" />
        <text className="gv-arc-mid" x="320" y="46" textAnchor="middle">≈12,100 KM · AUG 2026</text>
        <text className="gv-arc-city" x="60" y="146" textAnchor="start">SEOUL</text>
        <text className="gv-arc-city" x="580" y="146" textAnchor="end">ORLANDO</text>
      </svg>
    </div>
  );
}

function ContactRoom() {
  return (
    <ContactSection data={D} index="S1">
      <RelocationArc />
    </ContactSection>
  );
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
