// Shell — Icon, Nav, Hero
import { useState } from "react";
import { ProofLine } from "./Sections";

export function Icon({ name, size = 15 }) {
  const paths = {
    github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
    orcid: <><circle cx="12" cy="12" r="10" /><path d="M9 10.5v5" /><path d="M9 8.1v.01" /><path d="M11.8 10.5h1.8a2.5 2.5 0 0 1 0 5h-1.8z" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="m10 14 11-11" /></>,
    file: <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    menu: <><path d="M3 7h18" /><path d="M3 12h18" /><path d="M3 17h18" /></>,
    close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const NAV_LINKS = [
  { id: "research", n: "01", label: "Research" },
  { id: "personal-projects", n: "02", label: "Personal projects" },
  { id: "experience", n: "03", label: "Experience" },
  { id: "school", n: "04", label: "School" },
  { id: "school-projects", n: "05", label: "School projects" },
  { id: "contact", n: "06", label: "Contact" },
];

export function Nav({ active, cv }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="nav-brand" href="#top" onClick={() => setOpen(false)}>
          Krishi&nbsp;Attri
        </a>
        <nav className={"nav-links" + (open ? " open" : "")} aria-label="Sections">
          {NAV_LINKS.map(({ id, n, label }) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""} onClick={() => setOpen(false)}>
              <span className="nav-n">{n}</span>{label}
            </a>
          ))}
          <a className="nav-cv" href={cv} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
            CV <Icon name="external" size={11} />
          </a>
        </nav>
        <button className="nav-burger" onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          <Icon name={open ? "close" : "menu"} size={17} />
        </button>
      </div>
    </header>
  );
}

export function Hero({ profile }) {
  const c = profile.contact;
  const links = [
    { label: "GitHub", href: c.github, icon: "github", ext: true },
    { label: "Email", href: `mailto:${c.email}`, icon: "mail" },
    { label: "LinkedIn", href: c.linkedin, icon: "linkedin", ext: true },
    { label: "CV", href: c.cv, icon: "file", ext: true },
  ];
  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-main">
          {/* identity first: name at display scale → role line → one-liner */}
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-role">
            <span className="kicker-dash" aria-hidden="true" />{profile.roleLine}
          </p>
          <p className="hero-tag">
            {profile.headlineLines[0]} <em>{profile.headlineLines[1]}</em>
          </p>
          <p className="hero-sub">{profile.sub}</p>
          <ProofLine proof={profile.proofLine} />
          <ul className="hero-meta">
            {profile.meta.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
          <div className="hero-links">
            {links.map(l => (
              <a key={l.label} href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener" } : {})}>
                <Icon name={l.icon} size={13} /> {l.label}
              </a>
            ))}
          </div>
        </div>
        <figure className="hero-fig">
          <picture>
            <source srcSet={profile.headshotWebp} type="image/webp" />
            <img src={profile.headshot} alt="Krishi Attri" width="320" height="412"
              fetchpriority="high" decoding="async" />
          </picture>
          <figcaption>{profile.figcaption}</figcaption>
        </figure>
      </div>
      <div className="hero-rule" aria-hidden="true" />
    </section>
  );
}
