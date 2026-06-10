// ════════════════════════════════════════════════════════════
// Panel — the full card for an open station.
// Desktop: docked panel beside the node. Mobile: bottom sheet body.
// ════════════════════════════════════════════════════════════
import { Icon } from "../components/Shell";
import { PORTFOLIO_DATA as D } from "../data";
import { ExtLinks, StatGrid, SwStats, InstallLine, codeOf } from "./Stations";

function ResearchFull({ data }) {
  return (
    <>
      <p className="pn-subtitle">{data.subtitle}</p>
      <p className="pn-meta">{data.role} · {data.date}</p>
      <p className="pn-body">{data.summary}</p>
      {data.stats && <StatGrid stats={data.stats} />}
      {data.details && (
        <>
          <div className="pn-label">Method & results</div>
          <ul className="pn-list">
            {data.details.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </>
      )}
      {data.tools && (
        <div className="chip-row">
          {data.tools.map(t => <span key={t} className="chip">{t}</span>)}
        </div>
      )}
      <footer className="pn-foot">
        {data.links?.length > 0 && <ExtLinks links={data.links} />}
        {data.note && <span className="pn-note">{data.note}</span>}
      </footer>
    </>
  );
}

function CompactFull({ data }) {
  return (
    <>
      <p className="pn-meta">{data.tag} · {data.date}</p>
      <p className="pn-body">{data.subtitle}</p>
    </>
  );
}

function PublicationsFull({ data }) {
  return data.map((p, i) => (
    <div key={i} className="pub-row pn-pub">
      <span className="pub-title">{p.title}</span>
      <span className="pub-meta">{p.venue} · {p.date}</span>
      {p.href
        ? <a className="pub-link" href={p.href} target="_blank" rel="noopener">{p.status} <Icon name="external" size={10} /></a>
        : <span className="pub-status">{p.status}</span>}
    </div>
  ));
}

function SoftwareFull({ data }) {
  return (
    <>
      <p className="pn-oneliner">{data.oneliner}</p>
      <InstallLine cmd={data.install} />
      <p className="sw-spec">{data.spec}</p>
      <p className="pn-body">{data.summary}</p>
      <SwStats stats={data.stats} />
      {data.links?.length > 0 && <ExtLinks links={data.links} />}
      {data.adaptersNote && (
        <>
          <div className="pn-label">The 12 per-model adapters</div>
          <div className="adapters-grid">
            {D.adapters.map(a => (
              <a key={a.name} href={a.url} target="_blank" rel="noopener" className="adapter">
                <span className="adapter-name"><Icon name="github" size={11} /> {a.name}</span>
                <span className="adapter-desc">{a.desc}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function XpFull({ data }) {
  return (
    <>
      <p className="pn-meta">{data.org} · {data.location} · {data.date}</p>
      <p className="pn-body">{data.summary}</p>
      {data.bullets?.length > 0 && (
        <ul className="pn-list">
          {data.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </>
  );
}

function EducationFull({ data }) {
  return data.map(e => (
    <div key={e.id} className="edu-row pn-edu">
      <div className="edu-row-head">
        <span className="edu-degree">{e.degree}</span>
        <span className={"status " + e.status}>{e.status}</span>
      </div>
      <span className="edu-school">{e.school} · {e.date}</span>
      <span className="edu-note">{e.note}</span>
    </div>
  ));
}

function HonorsFull({ data }) {
  return data.map((h, i) => (
    <div key={i} className="bg-row">
      <span className="bg-title">{h.title}</span>
      <span className="bg-meta">{h.org} · {h.date}</span>
    </div>
  ));
}

function DocumentsFull({ data }) {
  return data.map((d, i) => (
    <a key={i} className="bg-row link" href={d.href} target="_blank" rel="noopener">
      <span className="bg-title">{d.title} <Icon name="external" size={10} /></span>
      <span className="bg-meta">PDF</span>
    </a>
  ));
}

function SkillsFull({ data }) {
  return Object.entries(data).map(([group, items]) => (
    <div key={group} className="skill-group">
      <h4>{group}</h4>
      <div className="chip-row">
        {items.map(s => <span key={s} className="chip">{s}</span>)}
      </div>
    </div>
  ));
}

function ArchiveFull({ data }) {
  return data.map((a, i) => (
    <div key={i} className="archive-row">
      <div className="archive-head">
        {a.href
          ? <a href={a.href} target="_blank" rel="noopener">{a.title} <Icon name="external" size={9} /></a>
          : <span>{a.title}</span>}
        <span className="archive-date">{a.date}</span>
      </div>
      <p>{a.note}</p>
    </div>
  ));
}

function ContactFull({ data }) {
  const c = data.contact;
  return (
    <>
      <a className="contact-email" href={`mailto:${c.email}`}>{c.email}</a>
      <p className="contact-loc">{c.location}</p>
      <div className="pn-label">Open to</div>
      {data.openTo.map((o, i) => (
        <div key={i} className="open-item"><span className="open-dash" aria-hidden="true" />{o}</div>
      ))}
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

const FULL = {
  research: s => <ResearchFull data={s.data} />,
  compact: s => <CompactFull data={s.data} />,
  publications: s => <PublicationsFull data={s.data} />,
  software: s => <SoftwareFull data={s.data} />,
  xp: s => <XpFull data={s.data} />,
  education: s => <EducationFull data={s.data} />,
  honors: s => <HonorsFull data={s.data} />,
  documents: s => <DocumentsFull data={s.data} />,
  skills: s => <SkillsFull data={s.data} />,
  archive: s => <ArchiveFull data={s.data} />,
  contact: s => <ContactFull data={s.data} />,
};

export function PanelContent({ st }) {
  return FULL[st.type] ? FULL[st.type](st) : null;
}

function titleOf(st) {
  return st.data?.title || st.data?.name || st.label;
}

/* desktop docked panel */
export function Panel({ st, onClose }) {
  if (!st) return null;
  return (
    <aside className="panel" role="dialog" aria-modal="false" aria-label={`${titleOf(st)} — full card`}>
      <header className="pn-head">
        <div>
          <span className="st-code">ST {codeOf(st.id)} — FULL CARD</span>
          <h2 className="pn-title">{titleOf(st)}</h2>
        </div>
        <button className="pn-close" onClick={onClose} aria-label="Close card (Esc)">
          <Icon name="close" size={16} />
        </button>
      </header>
      <div className="pn-scroll">
        <PanelContent st={st} />
      </div>
    </aside>
  );
}
