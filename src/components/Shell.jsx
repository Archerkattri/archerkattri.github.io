// Shell — Nav, Hero, WhatIBuild, AboutSection, ResearchDirection, NowSection
import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "./Modal";

/* ── Typewriter ── */
function useTypewriter(text, speed = 42, startDelay = 600) {
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

/* ── Animated canvas ── */
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
  const metrics = [['15+', 'Builds'], ['4', 'Univs'], ['3', 'Countries'], ['6', 'Awards']];
  const tags = ['SLAM', 'Perception', 'Hardware', 'Robotics'];
  return (
    <aside className="pc-wrap">
      {data.profile.headshot && (
        <div className="pc-photo-wrap">
          <img src={data.profile.headshot} alt="Krishi Attri" className="pc-photo" />
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
    ['01', 'Home',        'home'],
    ['02', 'What I Build','what-i-build'],
    ['03', 'Work',        'selected-work'],
    ['04', 'Direction',   'research-direction'],
    ['05', 'Experience',  'experience'],
    ['06', 'Credentials', 'credentials'],
    ['07', 'Contact',     'contact'],
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
  const kicker = useTypewriter('Robotics & AI Researcher', 45, 500);
  const done = kicker.length >= 'Robotics & AI Researcher'.length;
  return (
    <section id="home" className="hero-v2" data-screen-label="01 Home">
      <HeroCanvas />
      <div className="container hv2-container">
        <div className="hv2-meta">
          <span>Seoul National University</span>
          <span className="hv2-sep">·</span>
          <span>M.S. Mechanical Engineering</span>
          <span className="hv2-sep">·</span>
          <span>Incoming Ph.D. UCF · Aug 2026</span>
        </div>
        <div className="hv2-split">
          <div className="hv2-left">
            <p className="hv2-kicker" aria-label="Robotics & AI Researcher">
              {kicker}{!done && <span className="hv2-cursor">|</span>}
            </p>
            <h1 className="hv2-title">Krishi<br /><em>Attri</em></h1>
            <p className="hv2-tagline">Robotics Researcher · 3D Perception · Visuo-Tactile SLAM · Applied AI</p>
            <p className="hv2-short">Building perception systems for real-world robots. I work across visuo-tactile SLAM, 3D reconstruction, Gaussian Splatting, robotic manipulation, and applied AI systems.</p>
            <div className="hv2-cta">
              <a className="btn primary" href="#selected-work">View Selected Work <span className="arrow">→</span></a>
              <a className="btn" href="assets/docs/Krishi_Attri_CV.pdf" target="_blank"><Icon name="download" size={13} /> CV.pdf</a>
              <a className="btn" href="#research-direction">Research Direction</a>
              <a className="btn" href={`mailto:${data.profile.contact.email}`}><Icon name="mail" size={13} /> Contact</a>
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

/* ── What I Build ── */
const BUILD_CARDS = [
  {
    icon: '◈',
    title: 'Robot Perception',
    body: 'Real-time mapping, tracking, reconstruction, and scene understanding for robotic systems — from sensor bring-up to deployable on-robot modules.',
    tags: ['SLAM', 'Sensor Fusion', 'Real-time', 'ROS'],
  },
  {
    icon: '◉',
    title: '3D Reconstruction & SLAM',
    body: 'Gaussian Splatting, neural fields, RGB-D sensing, tactile sensing, pose tracking, and object-level reconstruction in contact-rich environments.',
    tags: ['3D Gaussian Splatting', 'NeRF', 'Tactile', 'Pose Tracking'],
  },
  {
    icon: '◎',
    title: 'Applied AI Systems',
    body: 'Full-stack ML pipelines, CV detection systems, deep-learned gesture recognition, and production-style models benchmarked on real hardware.',
    tags: ['PyTorch', 'CUDA', 'Computer Vision', 'Deep Learning'],
  },
];

function WhatIBuild() {
  return (
    <section id="what-i-build" data-screen-label="02 What I Build">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 01 / WHAT I BUILD</div>
          <div>
            <h2 className="section-title">Three domains,<br /><em style={{ color: 'var(--accent-ink)' }}>one mission.</em></h2>
            <p className="section-sub">I build systems that let robots perceive, reconstruct, and act in the real world.</p>
          </div>
        </div>
        <div className="wib-grid">
          {BUILD_CARDS.map((c, i) => (
            <div key={i} className="wib-card reveal" style={{ '--i': i }}>
              <div className="wib-icon">{c.icon}</div>
              <h3 className="wib-title">{c.title}</h3>
              <p className="wib-body">{c.body}</p>
              <div className="wib-tags">
                {c.tags.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Research Direction ── */
function ResearchDirection() {
  const bullets = [
    { label: 'Current focus', text: 'Visuo-tactile SLAM and 3D Gaussian representations for in-hand manipulation' },
    { label: 'Research interest', text: 'Object-level reconstruction, pose tracking, tactile perception, and robot learning' },
    { label: 'Long-term goal', text: 'Robust robot perception for manipulation in cluttered and occluded environments' },
  ];
  return (
    <section id="research-direction" data-screen-label="Research Direction">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 04 / RESEARCH DIRECTION</div>
          <div>
            <h2 className="section-title">Intentional,<br /><em style={{ color: 'var(--accent-ink)' }}>not random.</em></h2>
            <p className="section-sub">A clear through-line across every project.</p>
          </div>
        </div>
        <div className="rd-wrap">
          <div className="rd-prose reveal">
            <p>My long-term research direction is to build robotic systems that can perceive, reconstruct, and manipulate the physical world with less dependence on clean visual input.</p>
            <p>I am especially interested in combining vision, touch, proprioception, and 3D representations to make robot perception more robust during contact-rich manipulation — where standard vision pipelines fail because the hand occludes exactly what the robot needs to see.</p>
          </div>
          <div className="rd-bullets">
            {bullets.map((b, i) => (
              <div key={i} className="rd-bullet reveal" style={{ '--i': i }}>
                <span className="rd-label">{b.label}</span>
                <span className="rd-text">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Now ── */
function NowSection({ data }) {
  return (
    <section id="now" data-screen-label="Now">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ NOW</div>
          <div>
            <h2 className="section-title">What I'm<br /><em style={{ color: 'var(--accent-ink)' }}>doing now.</em></h2>
          </div>
        </div>
        <div className="now-wrap">
          <div className="now-main reveal">
            <p>Currently working on <strong>visuo-tactile SLAM</strong>, <strong>object-level 3D reconstruction</strong>, and robotic perception systems for manipulation at Seoul National University's Soft Robotics & Bionics Lab.</p>
            <p>Starting a Ph.D. at the University of Central Florida in August 2026 as an ORCGS Doctoral Fellow.</p>
          </div>
          <div className="now-open">
            <div className="now-open-label">Open to</div>
            {[
              'Research collaborations',
              'Robotics / AI internships',
              'Ph.D. research discussions',
              'Roles in robot perception, 3D vision & SLAM',
            ].map((item, i) => (
              <div key={i} className="now-open-item">
                <span className="now-dot">◆</span>{item}
              </div>
            ))}
            <a className="btn primary" href={`mailto:${data.profile.contact.email}`} style={{ marginTop: 20, display: 'inline-flex' }}>
              <Icon name="mail" size={13} /> Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── About (kept for scroll target compatibility) ── */
function AboutSection({ data }) {
  const p = data.profile;
  return (
    <section id="about" data-screen-label="About" style={{ paddingBottom: 40 }}>
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ ABOUT</div>
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



export { Nav, Hero, WhatIBuild, ResearchDirection, NowSection };
