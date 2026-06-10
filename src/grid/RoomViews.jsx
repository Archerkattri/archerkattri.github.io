// ════════════════════════════════════════════════════════════
// The Map — room contents. One component per room; everything
// reads from data.js (single source of truth shared with the
// document view and the chart).
// ════════════════════════════════════════════════════════════
import { PORTFOLIO_DATA as D } from "../data";
import { Icon, Crosshairs } from "../components/Shell";
import {
  SectionHead, ResearchCard, SoftwareCard,
  SchoolSection, SchoolProjectsSection, ContactSection,
} from "../components/Sections";
import { ROOMS, ROOM_MAP, DIRS } from "./grid";

/* ── the grid drawn as a map (HUD corner + home centerpiece) ── */
export function GridMap({ cur, navigate, large = false }) {
  return (
    <div
      className={"gv-map" + (large ? " lg" : " sm")}
      role="navigation"
      aria-label="Site map — the page grid"
    >
      <span className="gv-map-axis h" aria-hidden="true" />
      <span className="gv-map-axis v" aria-hidden="true" />
      {ROOMS.map(r => (
        <button
          key={r.id}
          className={"gv-cell" + (r.id === cur ? " on" : "")}
          style={{ gridColumn: r.col + 1, gridRow: r.row + 1 }}
          onClick={() => navigate(r.id)}
          aria-label={r.id === cur ? `${r.name} — you are here` : `Go to ${r.code} ${r.name}`}
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
function HomeRoom({ navigate }) {
  const p = D.profile;
  const c = p.contact;
  const links = [
    { label: "GitHub", href: c.github, icon: "github", ext: true },
    { label: "Email", href: `mailto:${c.email}`, icon: "mail" },
    { label: "LinkedIn", href: c.linkedin, icon: "linkedin", ext: true },
    { label: "Thesis site", href: c.thesisSite, icon: "external", ext: true },
    { label: "CV", href: c.cv, icon: "file", ext: true },
  ];
  return (
    <div className="gv-home">
      <div className="gv-home-id">
        <p className="hero-kicker">
          <span className="kicker-dash" aria-hidden="true" />{p.kicker}
        </p>
        <h1 className="gv-home-title">
          {p.headlineLines[0]}<br /><em>{p.headlineLines[1]}</em>
        </h1>
        <p className="hero-sub">{p.sub}</p>
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

      <div className="gv-home-side">
        <div className="gv-map-plate">
          <Crosshairs />
          <div className="gv-map-cap">THE MAP — PRESS AN EDGE, OR A CELL</div>
          <GridMap cur="home" navigate={navigate} large />
          <div className="gv-map-legend" aria-hidden="true">
            N RESEARCH · E PROJECTS · S CONTACT · W EXPERIENCE
          </div>
        </div>
        <figure className="gv-home-fig">
          <Crosshairs />
          <picture>
            <source srcSet={p.headshotWebp} type="image/webp" />
            <img src={p.headshot} alt="Krishi Attri" width="320" height="412" decoding="async" />
          </picture>
          <figcaption>{p.figcaption}</figcaption>
        </figure>
      </div>
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
          sub="Thesis work and papers on visuo-tactile SLAM — making robots perceive what their own hands hide." />
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
        <RoomXRef to="publications" dir="n" label="The publication record — one room north" navigate={navigate} />
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
          sub="The list grows as the thesis work reaches formal venues." />
        <div className="gv-pubs">
          {D.publications.map((p, i) => (
            <article key={i} className="gv-pub">
              <Crosshairs />
              <h3 className="gv-pub-title">{p.title}</h3>
              <div className="gv-pub-meta">{p.venue} · {p.date}</div>
              {p.href ? (
                <a className="gv-pub-link" href={p.href} target="_blank" rel="noopener">
                  {p.status} <Icon name="external" size={10} />
                </a>
              ) : (
                <span className="gv-pub-status">{p.status}</span>
              )}
            </article>
          ))}
        </div>
        <div className="ext-links gv-pub-extra">
          <a href={D.profile.contact.thesisSite} target="_blank" rel="noopener">
            Thesis site — krishiattrisnu.github.io <Icon name="external" size={10} />
          </a>
        </div>
        <RoomXRef to="research" dir="s" label="Back south — the research itself" navigate={navigate} />
      </div>
    </section>
  );
}

/* ════════════════ E1 · PERSONAL PROJECTS ════════════════ */
const FAMILY_OF = name =>
  name.includes("hunyuan") ? "Hunyuan3D family"
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
          sub="Open-source research libraries — each one pip-installable, benchmarked, and in use." />
        <div className="sw-stack">
          {D.software.map(s => (
            <SoftwareCard
              key={s.id}
              item={s}
              adapters={D.adapters}
              adaptersAction={
                s.adaptersNote ? (
                  <SectionJump target="adapter-constellation"
                    label="The 12 per-model adapters — end of this room" />
                ) : null
              }
            />
          ))}
        </div>

        {/* closing section: the HiCache++ adapter constellation */}
        <div id="adapter-constellation" className="gv-constellation">
          <SectionHead index="E1·b" label="Adapter constellation" title="The HiCache++" em="constellation."
            sub="Twelve per-model adapter repos — each generator paired with HiCache++ (DMD exponential basis) or HiCache (Hermite). Drop-in and training-free." />
          {families.map(f => (
            <div key={f.name} className="gv-family">
              <div className="bg-label">{f.name}</div>
              <div className="gv-adapters">
                {f.items.map(a => (
                  <a key={a.name} className="gv-adapter" href={a.url} target="_blank" rel="noopener">
                    <Crosshairs />
                    <span className="adapter-name"><Icon name="github" size={12} /> {a.name}</span>
                    <span className="adapter-desc">{a.desc}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <RoomXRef to="school-projects" dir="e" label="School projects — one room east" navigate={navigate} />
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
          label="Back west — the released libraries" navigate={navigate} />
      }
    />
  );
}

/* ════════════════ W1 · EXPERIENCE (the route) ════════════════ */
function ExperienceRoom() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead index="W1" label="Experience" title="Lab, field &" em="industry."
          sub="The route so far — newest first. Seoul now, Orlando next." />
        <div className="gv-route">
          <div className="gv-route-next">
            NEXT STOP — UCF PH.D. · ORCGS DOCTORAL FELLOW · AUG 2026
          </div>
          <div className="xp-list gv-route-list">
            {D.experience.map(e => (
              <div key={e.id} className="xp-row gv-stop">
                <div className="xp-date">{e.date}</div>
                <div className="xp-main">
                  <h3>{e.title}</h3>
                  <div className="xp-org">{e.org} · {e.location}</div>
                  <p className="xp-sum">{e.summary}</p>
                  {e.bullets.length > 0 && (
                    <ul className="xp-bullets">
                      {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
      <Crosshairs />
      <svg viewBox="0 0 640 170" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path className="gv-arc-path" d="M 60 122 Q 320 8 580 122" />
        <circle className="gv-arc-dot" cx="60" cy="122" r="4" />
        <circle className="gv-arc-dot hollow" cx="580" cy="122" r="4" />
        <text className="gv-arc-mid" x="320" y="46" textAnchor="middle">≈12,100 KM · AUG 2026</text>
        <text className="gv-arc-city" x="60" y="146" textAnchor="start">SEOUL</text>
        <text className="gv-arc-coord" x="60" y="162" textAnchor="start">37.4565° N · 126.9520° E</text>
        <text className="gv-arc-city" x="580" y="146" textAnchor="end">ORLANDO</text>
        <text className="gv-arc-coord" x="580" y="162" textAnchor="end">28.6024° N · 81.2001° W</text>
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
              <video src={v.src} muted loop playsInline preload="none" controls />
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
