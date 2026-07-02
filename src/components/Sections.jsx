// Sections — Research, Personal projects, Experience, School,
// School projects, Gallery, Contact, Footer
import { useState } from "react";
import { Icon } from "./Shell";

/* ── shared section header ──
   `index` doubles as the grid coordinate in map view (e.g. "N1"). */
export function SectionHead({ index, label, title, em, sub }) {
  return (
    <div className="sec-head">
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

/* ── hero proof line: flagship + numbers + libraries, all deep links ──
   Plain hash anchors so it works in both render targets: the grid's
   hashchange router lands the room (and scrolls the card via
   sectionFromHash), the prerendered document scrolls natively. */
export function ProofLine({ proof }) {
  const f = proof.flagship;
  return (
    <p className="hero-proof">
      <a className="proof-flagship" href={f.href}>
        <strong>{f.pre}</strong>
        <span className="proof-stat">{f.statA}</span>
        {f.mid}
        <span className="proof-stat">{f.statB}</span>
        {f.post}
      </a>{" "}
      <span className="proof-libs">
        {proof.libraries.map((l, i) => (
          <span key={l.label}>
            {i > 0 && ", "}
            <a className="proof-lib" href={l.href}>{l.label}</a>
          </span>
        ))}
        {proof.librariesTail}
      </span>
    </p>
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
export function ResearchCard({ item }) {
  return (
    <article className={"sheet" + (item.flagship ? " flagship" : "")} id={item.id}>
      {item.media && (
        <figure className="sheet-media">
          <video
            src={item.media.video}
            poster={item.media.poster}
            autoPlay muted loop playsInline
            preload="metadata"
            aria-label={item.media.caption}
          />
          <figcaption>{item.media.caption}</figcaption>
        </figure>
      )}
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
        <div className="pub-list" aria-label="Publications">
          <div className="pub-label">Publications</div>
          {data.publications.map((p, i) => (
            <div key={i} className="pub-row">
              <span className="pub-title">{p.title}</span>
              <span className="pub-meta">{p.venue} · {p.date}</span>
              <span className="pub-linkcell">
                {p.href
                  ? <a className="pub-link" href={p.href} target="_blank" rel="noopener">{p.status} <Icon name="external" size={10} /></a>
                  : <span className="pub-status">{p.status}</span>}
                {p.page && <a className="pub-link" href={p.page} target="_blank" rel="noopener">{p.pageLabel} <Icon name="external" size={10} /></a>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── 02 / PERSONAL PROJECTS ──────────────── */
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
      <summary className="adapters-toggle">+ The 16-repo accelerator family</summary>
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

/* `adaptersAction` (map view) replaces the inline cluster with a
   pointer to the Adapters room. */
export function SoftwareCard({ item, adapters, adaptersAction }) {
  return (
    <article className="sw" id={item.id}>
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
          {item.adaptersNote && (adaptersAction ?? <AdapterCluster adapters={adapters} />)}
        </div>
      </div>
    </article>
  );
}

export function PersonalProjectsSection({ data }) {
  return (
    <section id="personal-projects" className="section">
      <div className="container">
        <SectionHead index="02" label="Personal projects" title="Released &" em="installable."
          sub="Open-source research software, versioned and shipping: three libraries on PyPI, a certified-planning research stack, and a 16-repo accelerator family. Every number is measured and reproducible from the repos." />
        <div className="sw-stack">
          {data.software.map(s => <SoftwareCard key={s.id} item={s} adapters={data.adapters} />)}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── 03 / EXPERIENCE ──────────────── */
export function XpRow({ e }) {
  return (
    <div className="xp-row">
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
        {e.links?.length > 0 && (
          <div className="xp-links">
            <ExtLinks links={e.links} />
          </div>
        )}
      </div>
    </div>
  );
}

/* the two non-research university jobs, kept to one quiet line each */
export function EarlierRoles({ data }) {
  return (
    <div className="xp-earlier">
      <div className="bg-label">Also held, Villanova</div>
      {data.earlierRoles.map((r, i) => (
        <div key={i} className="xp-earlier-row">
          <span className="xp-earlier-title">{r.title}</span>
          <span className="xp-earlier-note">{r.note}</span>
          <span className="xp-earlier-date">{r.date}</span>
        </div>
      ))}
    </div>
  );
}

export function ExperienceSection({ data, index = "03", sub }) {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHead index={index} label="Experience" title="Lab, field &" em="industry." sub={sub} />
        <div className="xp-list">
          {data.experience.map(e => <XpRow key={e.id} e={e} />)}
        </div>
        <EarlierRoles data={data} />
      </div>
    </section>
  );
}

/* ──────────────── 04 / SCHOOL ──────────────── */
export function SchoolSection({ data, index = "04" }) {
  return (
    <section id="school" className="section">
      <div className="container">
        <SectionHead index={index} label="School" title="Four schools," em="three countries." />
        <div className="edu-grid">
          {data.education.map(e => (
            <div key={e.id} className="edu-card">
              <span className={"status " + e.status}>{e.status}</span>
              <div className="edu-degree">{e.degree}</div>
              <div className="edu-school">{e.school}</div>
              <div className="edu-note">{e.note}</div>
              <div className="edu-date">
                {e.date}
                {e.links?.map(l => (
                  <a key={l.href} className="edu-link" href={l.href} target="_blank" rel="noopener">
                    {l.label} <Icon name="external" size={9} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-cols">
          <div className="bg-col">
            <div className="bg-label">Honors & fellowships</div>
            {data.honors.map((h, i) => h.href ? (
              <a key={i} className="bg-row link" href={h.href} target="_blank" rel="noopener">
                <span className="bg-title">{h.title} <Icon name="external" size={10} /></span>
                <span className="bg-meta">{h.org} · {h.date}</span>
              </a>
            ) : (
              <div key={i} className="bg-row">
                <span className="bg-title">{h.title}</span>
                <span className="bg-meta">{h.org} · {h.date}</span>
              </div>
            ))}
            <div className="bg-label bg-label-follow">Leadership</div>
            {data.leadership.map((h, i) => h.href ? (
              <a key={i} className="bg-row link" href={h.href} target="_blank" rel="noopener">
                <span className="bg-title">{h.title} <Icon name="external" size={10} /></span>
                <span className="bg-meta">{h.org} · {h.date}</span>
              </a>
            ) : (
              <div key={i} className="bg-row">
                <span className="bg-title">{h.title}</span>
                <span className="bg-meta">{h.org} · {h.date}</span>
              </div>
            ))}
          </div>
          <div className="bg-col">
            {/* the certificate wall, folded behind one expander:
                native <details> so the no-JS prerender still opens it */}
            <details className="docs-fold">
              <summary className="bg-label docs-fold-toggle">
                Documents and certificates ({data.documents.length})
                <span className="sum-mark" aria-hidden="true">+</span>
              </summary>
              {data.documents.map((d, i) => (
                <div key={i} className="bg-row doc-row">
                  <a className="bg-title" href={d.href} target="_blank" rel="noopener">
                    {d.title} <Icon name="external" size={10} />
                  </a>
                  <span className="bg-meta">
                    <a className="doc-kind" href={d.href} target="_blank" rel="noopener">PDF</a>
                    {d.drive && <> · <a className="doc-kind" href={d.drive} target="_blank" rel="noopener">Drive</a></>}
                  </span>
                </div>
              ))}
            </details>
          </div>
        </div>

        <div className="skills">
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

      </div>
    </section>
  );
}

/* ──────────────── 05 / SCHOOL PROJECTS ──────────────── */
export function SchoolProjectsSection({ data, index = "05", footer = null }) {
  const [capstone, ...earlier] = data.archive;
  return (
    <section id="school-projects" className="section">
      <div className="container">
        <SectionHead index={index} label="School projects" title="Built at" em="university."
          sub="The FMC-sponsored capstone and the earlier hands-on builds from the undergraduate years." />
        <div className="sheet-stack">
          <article className="sheet flagship">
            <header className="sheet-head">
              <div>
                <h3 className="sheet-title">{capstone.title}</h3>
                <p className="sheet-subtitle">{capstone.note}</p>
              </div>
              <div className="sheet-meta">
                <span className="pill">Capstone · 1st place</span>
                <span className="sheet-date">{capstone.date}</span>
              </div>
            </header>
            <footer className="sheet-foot">
              <ExtLinks links={data.capstoneLinks} />
            </footer>
          </article>
        </div>
        <div className="archive">
          <div className="bg-label">Earlier builds</div>
          <div className="archive-grid">
            {earlier.map((a, i) => (
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
        {footer}
      </div>
    </section>
  );
}

/* ── Gallery (photo strip) ── */
function toWebp(src) {
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}

export function GallerySection({ data }) {
  return (
    <section id="gallery" className="section fieldlog-sec">
      <div className="container">
        <div className="bg-label">Gallery · hardware along the way</div>
      </div>
      <div className="fieldlog" tabIndex="0" aria-label="Photo log, scrolls horizontally">
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
            <video src={v.src} poster={v.poster} muted loop playsInline preload="none" controls />
            <figcaption>▶ {v.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ──────────────── 06 / CONTACT ──────────────── */
export function ContactSection({ data, index = "06", children }) {
  const c = data.profile.contact;
  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHead index={index} label="Contact" title="Write" em="first." />
        <div className="contact-grid">
          <div className="contact-main">
            <a className="contact-email" href={`mailto:${c.email}`}>{c.email}</a>
            <p className="contact-loc">{c.location}</p>
            <div className="contact-open">
              <div className="bg-label">Open to</div>
              {data.openTo.map((o, i) => (
                <div key={i} className="open-item"><span className="open-dash" aria-hidden="true" />{o}</div>
              ))}
            </div>
          </div>
          <div className="contact-links">
            {[
              { label: "GitHub", val: "github.com/Archerkattri", href: c.github, icon: "github" },
              { label: "LinkedIn", val: "linkedin.com/in/krishi-attri15", href: c.linkedin, icon: "linkedin" },
              { label: "ORCID", val: "0009-0005-4695-6467", href: c.orcid, icon: "orcid" },
              { label: "CV", val: "Krishi_Attri_CV.pdf", href: c.cv, icon: "file" },
              { label: "Resume", val: "Krishi_Attri_Resume.pdf", href: c.resume, icon: "file" },
              { label: "This site", val: "source on GitHub", href: c.siteSource, icon: "github" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener">
                <span className="cl-label">{l.label}</span>
                <span className="cl-val">{l.val}</span>
                <Icon name={l.icon} size={14} />
              </a>
            ))}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Krishi Attri</span>
      </div>
    </footer>
  );
}
