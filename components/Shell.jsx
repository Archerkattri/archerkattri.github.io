// Nav + Hero + About — v2 redesign
const { useState, useEffect, useRef } = React;

/* ── Typewriter hook ── */
function useTypewriter(text, speed = 42, startDelay = 500) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    let iv;
    const tid = setTimeout(() => {
      let i = 0;
      iv = setInterval(() => { setDisplay(text.slice(0, ++i)); if (i >= text.length) clearInterval(iv); }, speed);
    }, startDelay);
    return () => { clearTimeout(tid); clearInterval(iv); };
  }, []);
  return display;
}

/* ── Count-up stat ── */
function StatItem({ value, label }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);
  const numMatch = String(value).match(/^(\d+)(\+?)$/);
  const target = numMatch ? parseInt(numMatch[1]) : 0;
  const suffix = numMatch ? numMatch[2] : '';

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.5 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !target) return;
    let cur = 0;
    const step = target / (1300 / 16);
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(Math.floor(cur));
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);

  return (
    <div ref={ref} className="pc-stat">
      <span className="pc-sv">{target ? `${count}${suffix}` : value}</span>
      <span className="pc-sl">{label}</span>
    </div>
  );
}

/* ── Canvas: sensor-network particles ── */
function HeroCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, nodes, W, H;
    const setup = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(55, Math.floor(W * H / 14000));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
        r: Math.random() * 1.4 + .5,
      }));
    };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const c = dark ? '237,234,224' : '14,16,20';
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 145) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${c},${.07 * (1 - d / 145)})`; ctx.lineWidth = .55; ctx.stroke();
          }
        }
        ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},.18)`; ctx.fill();
      }
      animId = requestAnimationFrame(tick);
    };
    setup(); tick();
    const ro = new ResizeObserver(setup); ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}

/* ── Profile Card ── */
function ProfileCard({ data }) {
  const p = data.profile;
  const metrics = [['15+', 'Builds'], ['4', 'Univs'], ['3', 'Countries'], ['6', 'Awards']];
  const tags = ['SLAM', 'Perception', 'Hardware', 'Robotics'];
  return (
    <aside className="pc-wrap">
      {p.headshot && (
        <div className="pc-photo-wrap">
          <img src={p.headshot} alt="Krishi Attri" className="pc-photo" />
        </div>
      )}
      <dl className="pc-meta">
        <dt>M.S.</dt><dd>Seoul National University</dd>
        <dt>Next</dt><dd>Ph.D. UCF — Aug '26</dd>
        <dt>Lab</dt><dd>Soft Robotics & Bionics</dd>
      </dl>
      <div className="pc-divider" />
      <div className="pc-stats">
        {metrics.map(([v, l]) => <StatItem key={l} value={v} label={l} />)}
      </div>
      <div className="pc-divider" />
      <div className="pc-tags">{tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
    </aside>
  );
}

/* ── Nav ── */
function Nav({ active, onSetActive, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const links = [
    ['01', 'Home', 'home'], ['02', 'About', 'about'], ['03', 'Research', 'research'],
    ['04', 'Projects', 'projects'], ['05', 'Experience', 'experience'],
    ['06', 'Awards', 'awards'], ['07', 'Education', 'education'],
    ['08', 'Gallery', 'gallery'], ['09', 'Contact', 'contact'],
  ];
  return (
    <nav className="nav" role="navigation">
      <div className="nav-inner">
        <a href="#home" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="dot" />
          <span className="brand-label">Krishi Attri</span>
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

/* ── Hero ── */
function Hero({ data }) {
  const kicker = useTypewriter('— robotics researcher', 42, 500);
  const showCursor = kicker.length < '— robotics researcher'.length;
  return (
    <section id="home" className="hero-v2" data-screen-label="01 Home">
      <HeroCanvas />
      <div className="container hv2-container">
        <div className="hv2-meta">
          <span>Seoul National University</span>
          <span className="hv2-sep">·</span>
          <span>Robotics / Perception / SLAM</span>
          <span className="hv2-sep">·</span>
          <span>{new Date().getFullYear()}</span>
        </div>
        <div className="hv2-split">
          <div className="hv2-left">
            <p className="hv2-kicker" aria-label="robotics researcher">
              {kicker}{showCursor && <span className="hv2-cursor">|</span>}
            </p>
            <h1 className="hv2-title">Krishi<br /><em>Attri</em></h1>
            <p className="hv2-tagline">{data.profile.tagline}</p>
            <p className="hv2-short">{data.profile.short}</p>
            <div className="hv2-cta">
              <a className="btn primary" href={`mailto:${data.profile.contact.email}`}>
                <Icon name="mail" size={13} /> Get in touch
              </a>
              <a className="btn" href="assets/docs/Krishi_Attri_CV.pdf" target="_blank">
                <Icon name="download" size={13} /> CV.pdf
              </a>
              <a className="btn" href="assets/docs/Krishi_Attri_Resume.pdf" target="_blank">
                <Icon name="download" size={13} /> Resume.pdf
              </a>
            </div>
          </div>
          <div className="hv2-right">
            <ProfileCard data={data} />
          </div>
        </div>
        <div className="hv2-scroll-hint" aria-hidden="true">
          <span>scroll</span>
          <div className="hv2-scroll-line" />
        </div>
      </div>
    </section>
  );
}

/* ── About (separate section, non-duplicate aside) ── */
function AboutSection({ data }) {
  const p = data.profile;
  return (
    <section id="about" data-screen-label="02 About">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 02 / ABOUT</div>
          <div>
            <h2 className="section-title">Research engineer<br /><em style={{ color: 'var(--accent-ink)' }}>who ships.</em></h2>
            <p className="section-sub">The full story — what I build, where I've been, where I'm going.</p>
          </div>
        </div>
        <div className="about-v2">
          <div className="about-v2-prose">
            {p.about.map((t, i) => <p key={i} className="reveal" style={{ '--i': i }}>{t}</p>)}
          </div>
          <aside className="about-v2-aside">
            <div className="ava-head">Research focus</div>
            <ul className="ava-focus">
              <li>3D Gaussian Splatting</li>
              <li>Visuo-Tactile SLAM</li>
              <li>In-hand manipulation</li>
              <li>RGB-D reconstruction</li>
              <li>Neural point cloud SLAM</li>
            </ul>
            <div className="ava-divider" />
            <div className="ava-head">Advisor</div>
            <div className="ava-block">Prof. Yong-Lae Park<br />Soft Robotics & Bionics Lab</div>
            <div className="ava-divider" />
            <div className="ava-head">Incoming</div>
            <div className="ava-block">Ph.D. @ UCF · Aug 2026<br />ORCGS Doctoral Fellow</div>
            <div className="ava-divider" />
            <div className="ava-links">
              <a href={p.contact.linkedin} target="_blank" rel="noopener"><Icon name="linkedin" size={12} /> LinkedIn</a>
              <a href={p.contact.github} target="_blank" rel="noopener"><Icon name="github" size={12} /> GitHub</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const About = AboutSection;
const ProfileMetaPanel = () => null;
const AboutBlock = () => null;

Object.assign(window, { Nav, Hero, About, AboutSection, ProfileCard, ProfileMetaPanel, AboutBlock });
