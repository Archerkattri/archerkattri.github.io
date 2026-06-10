// ════════════════════════════════════════════════════════════
// Stations — the plates pinned to the chart.
// Authored at zoom ×1.00; progressive disclosure handled in CSS
// via [data-band] on the viewport (far / mid / near).
// ════════════════════════════════════════════════════════════
import { useState } from "react";
import { Icon } from "../components/Shell";
import { STATIONS, ADAPTER_DOTS } from "./layout";

/* ── shared fragments (also used by the Panel) ── */
export function ExtLinks({ links, size = 10 }) {
  return (
    <div className="ext-links">
      {links.map(l => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener">
          {l.label} <Icon name="external" size={size} />
        </a>
      ))}
    </div>
  );
}

export function StatGrid({ stats }) {
  return (
    <div className="stat-row">
      {stats.map((s, i) => (
        <div key={i} className="stat">
          <span className="stat-v">{s.value}{s.unit ? <small> {s.unit}</small> : null}</span>
          <span className="stat-l">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SwStats({ stats }) {
  return (
    <dl className="sw-stats">
      {stats.map((s, i) => (
        <div key={i} className="sw-stat">
          <dt>{s.label}</dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function InstallLine({ cmd }) {
  const [copied, setCopied] = useState(false);
  const copy = e => {
    e.stopPropagation();
    navigator.clipboard?.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <button className="install" onClick={copy} title="Copy to clipboard">
      <span className="install-ps1" aria-hidden="true">$</span>
      <code>{cmd}</code>
      <span className="install-copy">{copied ? <Icon name="check" size={13} /> : <Icon name="copy" size={13} />}</span>
    </button>
  );
}

const toWebp = src => src.replace(/\.(jpe?g|png)$/i, ".webp");

/* ── per-type bodies ── */
function HeroBody({ data }) {
  const c = data.contact;
  const links = [
    { label: "GitHub", href: c.github, icon: "github" },
    { label: "Email", href: `mailto:${c.email}`, icon: "mail" },
    { label: "LinkedIn", href: c.linkedin, icon: "linkedin" },
    { label: "CV", href: c.cv, icon: "file" },
  ];
  return (
    <div className="hero-plate">
      <div className="hero-main">
        <p className="hero-kicker"><span className="kicker-dash" aria-hidden="true" />{data.kicker}</p>
        <h1 className="hero-title">
          <span>{data.headlineLines[0]}</span>
          <span>a <em>sense of touch.</em></span>
        </h1>
        <p className="hero-sub">{data.sub}</p>
        <ul className="hero-meta">
          {data.meta.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
        <div className="hero-links">
          {links.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener">
              <Icon name={l.icon} size={13} /> {l.label}
            </a>
          ))}
        </div>
      </div>
      <figure className="hero-fig">
        <picture>
          <source srcSet={data.headshotWebp} type="image/webp" />
          <img src={data.headshot} alt="Krishi Attri" width="320" height="412" decoding="async" />
        </picture>
        <figcaption>{data.figcaption}</figcaption>
      </figure>
    </div>
  );
}

function ResearchBody({ data }) {
  return (
    <>
      <div className="st-titlerow">
        <h2 className="st-title">{data.title}</h2>
        <span className="pill">{data.tag}</span>
      </div>
      <p className="st-subtitle">{data.subtitle}</p>
      <p className="st-meta-line">{data.role} · {data.date}</p>
      <p className="st-summary">{data.summary}</p>
      {data.stats && <StatGrid stats={data.stats} />}
    </>
  );
}

function CompactBody({ data }) {
  return (
    <>
      <div className="st-titlerow">
        <h2 className="st-title sm">{data.title}</h2>
        <span className="st-date">{data.date}</span>
      </div>
      <p className="st-summary">{data.subtitle}</p>
      <span className="pill dim">{data.tag}</span>
    </>
  );
}

function PublicationsBody({ data }) {
  return (
    <>
      <h2 className="st-label-title">Publications</h2>
      {data.map((p, i) => (
        <div key={i} className="pub-row">
          <span className="pub-title">{p.title}</span>
          <span className="pub-meta">{p.venue} · {p.date}</span>
          {p.href
            ? <a className="pub-link" href={p.href} target="_blank" rel="noopener">{p.status} <Icon name="external" size={10} /></a>
            : <span className="pub-status">{p.status}</span>}
        </div>
      ))}
    </>
  );
}

function SoftwareBody({ data }) {
  return (
    <>
      <div className="st-titlerow">
        <h2 className="st-title">{data.name}</h2>
      </div>
      <p className="sw-oneliner">{data.oneliner}</p>
      <InstallLine cmd={data.install} />
      <p className="sw-spec">{data.spec}</p>
      <SwStats stats={data.stats} />
      {data.adaptersNote && <p className="st-meta-line sat-note">▸ {data.adaptersNote} · 14 satellites, charted east</p>}
    </>
  );
}

function XpBody({ data }) {
  return (
    <>
      <span className="xp-stamp">{data.date}</span>
      <h2 className="st-title sm">{data.title}</h2>
      <p className="st-meta-line">{data.org} · {data.location}</p>
      <p className="st-summary">{data.summary}</p>
    </>
  );
}

function EducationBody({ data }) {
  return (
    <>
      <h2 className="st-label-title">Education · four schools, three countries</h2>
      {data.map(e => (
        <div key={e.id} className="edu-row">
          <div className="edu-row-head">
            <span className="edu-degree">{e.degree}</span>
            <span className={"status " + e.status}>{e.status}</span>
          </div>
          <span className="edu-school">{e.school} · {e.date}</span>
          <span className="edu-note">{e.note}</span>
        </div>
      ))}
    </>
  );
}

function HonorsBody({ data }) {
  return (
    <>
      <h2 className="st-label-title">Honors & fellowships</h2>
      {data.map((h, i) => (
        <div key={i} className="bg-row">
          <span className="bg-title">{h.title}</span>
          <span className="bg-meta">{h.org} · {h.date}</span>
        </div>
      ))}
    </>
  );
}

function DocumentsBody({ data }) {
  return (
    <>
      <h2 className="st-label-title">Documents</h2>
      {data.map((d, i) => (
        <a key={i} className="bg-row link" href={d.href} target="_blank" rel="noopener">
          <span className="bg-title">{d.title} <Icon name="external" size={10} /></span>
          <span className="bg-meta">PDF</span>
        </a>
      ))}
    </>
  );
}

function SkillsBody({ data }) {
  return (
    <>
      <h2 className="st-label-title">Stack</h2>
      {Object.entries(data).map(([group, items]) => (
        <div key={group} className="skill-group">
          <h4>{group}</h4>
          <div className="chip-row">
            {items.map(s => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
      ))}
    </>
  );
}

function ArchiveBody({ data }) {
  return (
    <>
      <h2 className="st-label-title">Earlier builds</h2>
      <div className="archive-grid">
        {data.map((a, i) => (
          <div key={i} className="archive-row">
            <div className="archive-head">
              {a.href
                ? <a href={a.href} target="_blank" rel="noopener">{a.title} <Icon name="external" size={9} /></a>
                : <span>{a.title}</span>}
              <span className="archive-date">{a.date}</span>
            </div>
            <p>{a.note}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function PhotoBody({ st }) {
  const g = st.data;
  return (
    <figure className="log-plate" style={{ "--rot": `${st.rot}deg` }}>
      {st.type === "video"
        ? <video src={g.src} muted loop playsInline preload="metadata" controls />
        : (
          <picture>
            <source srcSet={toWebp(g.src)} type="image/webp" />
            <img src={g.src} alt={g.caption} loading="lazy" decoding="async" />
          </picture>
        )}
      <figcaption>{st.type === "video" ? "▶ " : ""}{g.caption}</figcaption>
    </figure>
  );
}

function ContactBody({ data }) {
  const c = data.contact;
  return (
    <>
      <h2 className="st-label-title">Write first</h2>
      <a className="contact-email" href={`mailto:${c.email}`}>{c.email}</a>
      <p className="contact-loc">{c.location}</p>
      <div className="contact-open">
        <div className="bg-label">Open to</div>
        {data.openTo.map((o, i) => (
          <div key={i} className="open-item"><span className="open-dash" aria-hidden="true" />{o}</div>
        ))}
      </div>
      <div className="contact-links">
        {[
          { label: "GitHub", val: "github.com/Archerkattri", href: c.github, icon: "github" },
          { label: "LinkedIn", val: "linkedin.com/in/krishi-attri15", href: c.linkedin, icon: "linkedin" },
          { label: "Thesis site", val: "krishiattrisnu.github.io", href: c.thesisSite, icon: "external" },
          { label: "CV", val: "Krishi_Attri_CV.pdf", href: c.cv, icon: "file" },
        ].map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener">
            <span className="cl-label">{l.label}</span>
            <span className="cl-val">{l.val}</span>
            <Icon name={l.icon} size={14} />
          </a>
        ))}
      </div>
    </>
  );
}

function MarkerBody({ st }) {
  const inner = (
    <>
      <span className="marker-dot" aria-hidden="true" />
      <span className="marker-name">{st.label}{st.data.href ? <Icon name="external" size={9} /> : null}</span>
      {st.data.sub && <span className="marker-sub">{st.data.sub}</span>}
    </>
  );
  return st.data.href
    ? <a className="marker-inner" href={st.data.href} target="_blank" rel="noopener">{inner}</a>
    : <span className="marker-inner">{inner}</span>;
}

function GeoBody({ st }) {
  return (
    <span className="geo-inner">
      <span className="geo-ring" aria-hidden="true" />
      <span className="geo-name">{st.label}</span>
      <span className="geo-coords">{st.data.coords}</span>
      <span className="marker-sub">{st.data.sub}</span>
    </span>
  );
}

const BODIES = {
  hero: s => <HeroBody data={s.data} />,
  research: s => <ResearchBody data={s.data} />,
  compact: s => <CompactBody data={s.data} />,
  publications: s => <PublicationsBody data={s.data} />,
  software: s => <SoftwareBody data={s.data} />,
  xp: s => <XpBody data={s.data} />,
  education: s => <EducationBody data={s.data} />,
  honors: s => <HonorsBody data={s.data} />,
  documents: s => <DocumentsBody data={s.data} />,
  skills: s => <SkillsBody data={s.data} />,
  archive: s => <ArchiveBody data={s.data} />,
  photo: s => <PhotoBody st={s} />,
  video: s => <PhotoBody st={s} />,
  contact: s => <ContactBody data={s.data} />,
  marker: s => <MarkerBody st={s} />,
  geo: s => <GeoBody st={s} />,
};

/* stations that open a full card */
export const PANEL_TYPES = new Set([
  "research", "compact", "publications", "software", "xp",
  "education", "honors", "documents", "skills", "archive", "contact",
]);

/* assign survey codes 01·A, 01·B … */
const codeOf = (() => {
  const counters = {};
  const codes = {};
  for (const s of STATIONS) {
    const n = (counters[s.district] = (counters[s.district] || 0) + 1);
    codes[s.id] = `${s.district === "origin" ? "00" : { research: "01", software: "02", experience: "03", fieldlog: "04", contact: "05" }[s.district]}·${String.fromCharCode(64 + n)}`;
  }
  return id => codes[id];
})();
export { codeOf };

export function Station({ st, bootIndex, active, onActivate, onFocusStation }) {
  const isPlain = st.type === "marker" || st.type === "geo" || st.type === "photo" || st.type === "video";
  return (
    <article
      id={`st-${st.id}`}
      className={`station t-${st.type}${active ? " active" : ""}${st.data?.dashed ? " dashed" : ""}`}
      style={{ left: st.x, top: st.y, width: st.w, "--bd": bootIndex }}
      data-station={st.id}
    >
      <span className="st-marker" aria-hidden="true" />
      <span className="ping" aria-hidden="true" />
      {!isPlain && (
        <button
          type="button" className="st-chrome" tabIndex={-1}
          onClick={() => onActivate(st.id)}
          title={PANEL_TYPES.has(st.type) ? `Open ${st.label}: full card` : st.label}
        >
          <span className="st-code">ST {codeOf(st.id)}</span>
          <span className="st-chrome-rule" />
          {PANEL_TYPES.has(st.type) && <span className="st-open-mark">⌕ open</span>}
        </button>
      )}
      <div className="st-body">{BODIES[st.type]?.(st)}</div>
      {st.far > 0 && (
        <span className="far-label" style={{ fontSize: st.far }} aria-hidden="true">{st.label}</span>
      )}
      <button
        type="button"
        className="st-hit"
        aria-label={`${st.label}, open station`}
        onClick={() => onActivate(st.id)}
        onFocus={e => onFocusStation(st.id, e)}
      />
    </article>
  );
}

/* ── HiCache++ adapter satellite constellation ── */
export function AdapterConstellation({ bootBase }) {
  return (
    <>
      {ADAPTER_DOTS.map((a, i) => (
        <a
          key={a.id}
          className="adapter-dot"
          style={{ left: a.x, top: a.y, "--bd": bootBase + i }}
          href={a.url}
          target="_blank"
          rel="noopener"
          title={a.desc}
        >
          <span className="adot" aria-hidden="true" />
          <span className="adot-name">{a.name}</span>
          <span className="adot-desc">{a.desc}</span>
        </a>
      ))}
    </>
  );
}
