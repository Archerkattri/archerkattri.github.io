// Sections — Research, Software, Experience, Background, Field log, Contact, Footer
import { useState } from "react";
import { Icon, Crosshairs } from "./Shell";

/* ── shared section header ── */
function SectionHead({ index, label, title, em, sub }) {
  return (
    <div className="sec-head reveal">
      <div className="sec-index">
        <span className="sec-n">{index}</span>
        <span className="sec-label">{label}</span>
        <span className="sec-rule" aria-hidden="true" />
      </div>
      <h2 className="sec-title">
        {title} {em && <em>{em}</em>}
      </h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
  );
}

function ExtLinks({ links }) {
  return (
    <div className="ext-links">
      {links.map(l => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener">
          {l.label} <Icon name="external" size={10} />
        </a>
      ))}
    </div>
  );
}

function StatRow({ stats }) {
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

/* ──────────────── 01 / RESEARCH ──────────────── */
function ResearchCard({ item }) {
  return (
    <article className={"sheet reveal" + (item.flagship ? " flagship" : "")}>
      <Crosshairs />
      <header className="sheet-head">
        <div>
          <h3 className="sheet-title">{item.title}</h3>
          <p className="sheet-subtitle">{item.subtitle}</p>
        </div>
        <div className="sheet-meta">
          <span className="pill">{item.tag}</span>
          <span className="sheet-date">{item.date}</span>
        </div>
      </header>
      <p className="sheet-role">{item.role}</p>
      <p className="sheet-body">{item.summary}</p>
      {item.stats && <StatRow stats={item.stats} />}
      {item.details && (
        <details className="sheet-details">
          <summary>Method & results<span className="sum-mark" aria-hidden="true">+</span></summary>
          <ul>
            {item.details.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
          {item.tools && (
            <div className="chip-row">
              {item.tools.map(t => <span key={t} className="chip">{t}</span>)}
            </div>
          )}
        </details>
      )}
      <footer className="sheet-foot">
        {item.links && item.links.length > 0 && <ExtLinks links={item.links} />}
        {item.note && <span className="sheet-note">{item.note}</span>}
      </footer>
    </article>
  );
}

export function ResearchSection({ data }) {
  const main = data.research.filter(r => !r.compact);
  const compact = data.research.filter(r => r.compact);
  return (
    <section id="research" className="section">
      <div className="container">
        <SectionHead index="01" label="Research" title="Perception through" em="occlusion."
          sub="Thesis work and papers on visuo-tactile SLAM — making robots perceive what their own hands hide." />
        <div className="sheet-stack">
          {main.map(r => <ResearchCard key={r.id} item={r} />)}
        </div>
        <div className="compact-grid reveal">
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
        <div className="pub-list reveal" aria-label="Publications">
          <div className="pub-label">Publications</div>
          {data.publications.map((p, i) => (
            <div key={i} className="pub-row">
              <span className="pub-title">{p.title}</span>
              <span className="pub-meta">{p.venue} · {p.date}</span>
              {p.href
                ? <a className="pub-link" href={p.href} target="_blank" rel="noopener">{p.status} <Icon name="external" size={10} /></a>
                : <span className="pub-status">{p.status}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── 02 / SOFTWARE ──────────────── */
function InstallLine({ cmd }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
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

function AdapterCluster({ adapters }) {
  // native <details>: works in the no-JS prerender too
  return (
    <details className="adapters">
      <summary className="adapters-toggle">+ The 12 per-model adapters</summary>
      <div className="adapters-grid">
        {adapters.map(a => (
          <a key={a.name} href={a.url} target="_blank" rel="noopener" className="adapter">
            <span className="adapter-name"><Icon name="github" size={11} /> {a.name}</span>
            <span className="adapter-desc">{a.desc}</span>
          </a>
        ))}
      </div>
    </details>
  );
}

function SoftwareCard({ item, adapters }) {
  return (
    <article className="sw reveal" id={item.id}>
      <Crosshairs />
      <div className="sw-grid">
        <div className="sw-id">
          <h3 className="sw-name">{item.name}</h3>
          <p className="sw-oneliner">{item.oneliner}</p>
          <InstallLine cmd={item.install} />
          <p className="sw-spec">{item.spec}</p>
          <ExtLinks links={item.links} />
        </div>
        <div className="sw-body">
          <p>{item.summary}</p>
          <dl className="sw-stats">
            {item.stats.map((s, i) => (
              <div key={i} className="sw-stat">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          {item.adaptersNote && <AdapterCluster adapters={adapters} />}
        </div>
      </div>
    </article>
  );
}

export function SoftwareSection({ data }) {
  return (
    <section id="software" className="section">
      <div className="container">
        <SectionHead index="02" label="Software" title="Released &" em="installable."
          sub="Open-source research libraries — each one pip-installable, benchmarked, and in use." />
        <div className="sw-stack">
          {data.software.map(s => <SoftwareCard key={s.id} item={s} adapters={data.adapters} />)}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── 03 / EXPERIENCE ──────────────── */
export function ExperienceSection({ data }) {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHead index="03" label="Experience" title="Lab, field &" em="industry." />
        <div className="xp-list">
          {data.experience.map(e => (
            <div key={e.id} className="xp-row reveal">
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
    </section>
  );
}

/* ──────────────── 04 / BACKGROUND ──────────────── */
export function BackgroundSection({ data }) {
  return (
    <section id="background" className="section">
      <div className="container">
        <SectionHead index="04" label="Background" title="Four schools," em="three countries." />
        <div className="edu-grid">
          {data.education.map(e => (
            <div key={e.id} className="edu-card reveal">
              <span className={"status " + e.status}>{e.status}</span>
              <div className="edu-degree">{e.degree}</div>
              <div className="edu-school">{e.school}</div>
              <div className="edu-note">{e.note}</div>
              <div className="edu-date">{e.date}</div>
            </div>
          ))}
        </div>

        <div className="bg-cols">
          <div className="bg-col reveal">
            <div className="bg-label">Honors & fellowships</div>
            {data.honors.map((h, i) => (
              <div key={i} className="bg-row">
                <span className="bg-title">{h.title}</span>
                <span className="bg-meta">{h.org} · {h.date}</span>
              </div>
            ))}
          </div>
          <div className="bg-col reveal">
            <div className="bg-label">Documents</div>
            {data.documents.map((d, i) => (
              <a key={i} className="bg-row link" href={d.href} target="_blank" rel="noopener">
                <span className="bg-title">{d.title} <Icon name="external" size={10} /></span>
                <span className="bg-meta">PDF</span>
              </a>
            ))}
          </div>
        </div>

        <div className="skills reveal">
          <div className="bg-label">Stack</div>
          <div className="skills-grid">
            {Object.entries(data.skills).map(([group, items]) => (
              <div key={group} className="skill-group">
                <h4>{group}</h4>
                <div className="chip-row">
                  {items.map(s => <span key={s} className="chip">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="archive reveal">
          <div className="bg-label">Earlier builds</div>
          <div className="archive-grid">
            {data.archive.map((a, i) => (
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
        </div>
      </div>
    </section>
  );
}

/* ── Field log (gallery strip) ── */
function toWebp(src) {
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}

export function FieldLog({ data }) {
  return (
    <section id="fieldlog" className="section fieldlog-sec">
      <div className="container">
        <div className="bg-label reveal">Field log — hardware along the way</div>
      </div>
      <div className="fieldlog reveal" tabIndex="0" aria-label="Photo log, scrolls horizontally">
        {data.gallery.map((g, i) => (
          <figure key={i} className="log-item">
            <picture>
              <source srcSet={toWebp(g.src)} type="image/webp" />
              <img src={g.src} alt={g.caption} loading="lazy" decoding="async" />
            </picture>
            <figcaption>{g.caption}</figcaption>
          </figure>
        ))}
        {data.galleryVideos.map((v, i) => (
          <figure key={"v" + i} className="log-item">
            <video src={v.src} muted loop playsInline preload="none" controls />
            <figcaption>▶ {v.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ──────────────── 05 / CONTACT ──────────────── */
export function ContactSection({ data }) {
  const c = data.profile.contact;
  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHead index="05" label="Contact" title="Write" em="first." />
        <div className="contact-grid">
          <div className="contact-main reveal">
            <a className="contact-email" href={`mailto:${c.email}`}>{c.email}</a>
            <p className="contact-loc">{c.location}</p>
            <div className="contact-open">
              <div className="bg-label">Open to</div>
              {data.openTo.map((o, i) => (
                <div key={i} className="open-item"><span className="open-dash" aria-hidden="true" />{o}</div>
              ))}
            </div>
          </div>
          <div className="contact-links reveal">
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
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Krishi Attri</span>
        <span className="footer-coords">37.4565° N, 126.9520° E → 28.6024° N, 81.2001° W</span>
      </div>
    </footer>
  );
}
