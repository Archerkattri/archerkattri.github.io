// Nav + Hero + About

function Nav({ active, onSetActive, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const links = [
    ['01', 'Home', 'home'],
    ['02', 'About', 'about'],
    ['03', 'Research', 'research'],
    ['04', 'Projects', 'projects'],
    ['05', 'Experience', 'experience'],
    ['06', 'Awards', 'awards'],
    ['07', 'Education', 'education'],
    ['08', 'Gallery', 'gallery'],
    ['09', 'Contact', 'contact'],
  ];
  return (
    <nav className="nav" role="navigation">
      <div className="nav-inner">
        <a href="#home" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="dot"></span>
          <span><span className="brand-label">Krishi Attri</span>&nbsp;&nbsp;<span className="brand-sub">portfolio/v1</span></span>
        </a>
        <div className={"nav-links" + (open ? " open" : "")}>
          {links.map(([n, label, id]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>
              <span style={{ color: 'var(--fg-soft)', marginRight: 6 }}>{n}</span>{label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
          </button>
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
            <Icon name="menu" size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function ProfileMetaPanel({ data }) {
  const p = data.profile;
  const metaRows = [
    ['Current', "M.S. @ SNU (GSFS Scholar)"],
    ['Next', "Ph.D. @ UCF (Aug '26)"],
  ];
  const metrics = [['15+', 'Builds'], ['4', 'Universities'], ['3', 'Countries'], ['6', 'Awards']];
  const tags = ['Robotics', 'Perception', 'SLAM', 'Hardware', 'Research engineering'];

  return (
    <aside className="profile-panel hero">
      {p.headshot && (
        <figure className="profile-panel-photo">
          <img src={p.headshot} alt="Krishi Attri" />
        </figure>
      )}
      <dl className="pp-meta">
        {metaRows.map(([label, value]) => (
          <React.Fragment key={label}>
            <dt>{label}</dt><dd>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <div className="pp-divider" />
      <div className="pp-nums">
        {metrics.map(([v, l]) => (
          <div key={l} className="pp-num">
            <span className="pp-nv">{v}</span>
            <span className="pp-nl">{l}</span>
          </div>
        ))}
      </div>
      <div className="pp-divider" />
      <div className="pp-about-tags">
        {tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
      </div>
      <div className="pp-footer">Soft Robotics & Bionics Lab · Seoul National University</div>
      <div className="pp-footer pp-footer-secondary">Villanova · Yonsei · SNU · UCF</div>
    </aside>
  );
}

function AboutBlock({ data }) {
  const p = data.profile;
  return (
    <div id="about" className="hero-about">
      <div className="section-head hero-about-head">
        <div className="section-num">§ 02 / ABOUT</div>
        <div>
          <h2 className="section-title">A research engineer who<br/>ships on real hardware.</h2>
          <p className="section-sub">Short story. What I work on, where I've been, where I'm going.</p>
        </div>
      </div>
      <div className="about-prose">
        {p.about.map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </div>
  );
}

function Hero({ data }) {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-meta">
          <span>Seoul, KR · 37.45°N</span>
          <span>Robotics / Perception / SLAM</span>
          <span>{new Date().toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</span>
        </div>
        <div className="hero-main hero-main-combined">
          <div className="hero-left hero-left-combined">
            <div className="hero-intro">
              <h1 className="hero-title reveal in">
                Krishi<br/>
                <span className="ital">Attri</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.12em', verticalAlign: 'super', marginLeft: '0.2em' }}>◆</span>
              </h1>
              <p className="hero-sub">{data.profile.tagline}. {data.profile.short}</p>
              <div className="hero-cta">
                <a className="btn primary" href={`mailto:${data.profile.contact.email}`}>
                  <Icon name="mail" size={13} /> Get in touch <span className="arrow">→</span>
                </a>
                <a className="btn" href="assets/docs/Krishi_Attri_CV.pdf" target="_blank">
                  <Icon name="download" size={13} /> CV.pdf
                </a>
                <a className="btn" href="assets/docs/Krishi_Attri_Resume.pdf" target="_blank">
                  <Icon name="download" size={13} /> Resume.pdf
                </a>
              </div>
            </div>
            <AboutBlock data={data} />
          </div>
          <div className="hero-right hero-right-tall">
            <ProfileMetaPanel data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return null;
}

Object.assign(window, { Nav, Hero, About, ProfileMetaPanel, AboutBlock });
