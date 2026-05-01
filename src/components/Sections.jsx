// Sections — Selected Work, Research, Experience, Credentials, Education, Journey, Gallery, Contact
import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "./Modal";

/* ── Text scramble ── */
function useScramble(text) {
  const [display, setDisplay] = useState(text);
  const ivRef = useRef(null);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const start = useCallback(() => {
    clearInterval(ivRef.current);
    let frame = 0, total = 16;
    ivRef.current = setInterval(() => {
      frame++;
      setDisplay(text.split('').map((c, i) => {
        if (' ./-'.includes(c)) return c;
        if (i < text.length * (frame / total)) return c;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      if (frame >= total) { clearInterval(ivRef.current); setDisplay(text); }
    }, 38);
  }, [text]);
  const stop = useCallback(() => { clearInterval(ivRef.current); setDisplay(text); }, [text]);
  return { display, onMouseEnter: start, onMouseLeave: stop };
}

/* ─────────────────────────────────────────────────────────
   SELECTED WORK — top 6 works, new card format
───────────────────────────────────────────────────────── */

const SELECTED_WORK = [
  {
    id: 'gaussianfeels',
    title: 'GaussianFeels',
    impact: 'Real-time visuo-tactile 3D reconstruction for robotic in-hand manipulation.',
    category: 'robotics',
    date: 'Dec 2024 — Present',
    tag: 'M.S. Thesis · Active',
    problem: 'Robots lose reliable object geometry under occlusion during contact-rich manipulation. Vision alone fails; tactile alone is too sparse.',
    built: 'An online visuo-tactile SLAM system built around an explicit object-centric 3D Gaussian Splatting map — fusing RGB-D, DIGIT tactile sensing, and hand proprioception in real time.',
    tools: ['3D Gaussian Splatting', 'PyTorch', 'CUDA', 'Theseus SE(3)', 'UR5e', 'Allegro Hand', 'DIGIT', 'ROS'],
    proof: [{ label: 'Thesis work', kind: 'thesis' }, { label: 'Reconstruction results', kind: 'results' }],
  },
  {
    id: 'popslam',
    title: 'PoP-SLAM',
    impact: 'Dense visual SLAM achieving 0.75 cm ATE RMSE at ~4 FPS on a consumer GPU.',
    category: 'robotics',
    date: 'Sept — Dec 2024',
    tag: 'Published',
    problem: 'Neural point cloud SLAM is bottlenecked by per-pixel nearest-neighbor queries, making it too slow for consumer hardware.',
    built: 'A projection-first rendering pipeline: project the neural point cloud onto the image plane via vectorised GPU matrix multiplication, mask by depth consistency, and render — no volumetric queries.',
    tools: ['PyTorch', 'CUDA', 'Open3D', 'TUM-RGBD', 'Replica', 'RTX 4070'],
    proof: [{ label: 'PoP-SLAM Paper (PDF)', href: 'assets/docs/PoP_SLAM_Paper.pdf', kind: 'paper' }],
  },
  {
    id: 'gnss-denied',
    title: 'GNSS-Denied SLAM',
    impact: 'Full autonomous navigation stack for a quad-wheel robot — no GPS.',
    category: 'robotics',
    date: 'Aug 2023 — May 2024',
    tag: 'Undergraduate research',
    problem: 'Autonomous navigation in GPS-denied environments (indoors, underground, urban canyons) with a real outdoor robot platform.',
    built: 'ROS navigation stack using VLP-16 LiDAR–camera fusion, CNN feature extraction, 2D histogram localisation filter, and 1D Kalman tracker. Sensors: VectorNav IMU, Emlid RTK GPS, Vicon/OptiTrack ground truth.',
    tools: ['ROS', 'Python', 'C++', 'OpenCV', 'VLP-16 LiDAR', 'VectorNav IMU', 'Emlid RTK GPS', 'Vicon/OptiTrack', 'Arduino', 'Raspberry Pi'],
    proof: [{ label: 'Demo video', kind: 'video' }],
  },
  {
    id: 'cv-app',
    title: 'CV Object Detection App',
    impact: 'Full-stack benchmarking platform comparing 5 detection models on COCO.',
    category: 'ai',
    date: 'Summer 2024',
    tag: 'Software',
    problem: 'No easy way to compare multiple CV detection models side-by-side on real images and video in a single interface.',
    built: 'A React + Flask web app for real-time image and video object detection, benchmarking Faster R-CNN, Mask R-CNN, RetinaNet, Keypoint R-CNN, and SSDlite.',
    tools: ['Python', 'PyTorch', 'TensorFlow', 'React', 'Flask', 'COCO API'],
    proof: [{ label: 'GitHub', href: 'https://github.com/Archerkattri/computervisionproj', kind: 'github' }],
  },
  {
    id: 'capstone',
    title: 'Plant Lifting Device',
    impact: '1st Place, Most Innovative Solution — Villanova Capstone 2024.',
    category: 'hardware',
    date: 'Aug 2023 — May 2024',
    tag: 'Hardware · Award',
    problem: 'An agrochemical company needed a device to lift growing plants repeatably into a 3D imaging rig without damaging them, within strict size constraints.',
    built: 'Led a multidisciplinary team through actuator selection, motion-system design (belts, pulleys, drive gears), wiring, waterproofing, and a stabilising plant platform.',
    tools: ['SOLIDWORKS', 'Actuator design', 'Motion systems', 'Project management'],
    proof: [{ label: 'Award certificate', href: 'assets/docs/Capstone.pdf', kind: 'pdf' }, { label: 'Demo video', kind: 'video' }],
  },
  {
    id: 'silo',
    title: 'SILO — Indoor Farm Automation',
    impact: 'Automation tooling for a vertical farming supply chain at Area2Farms.',
    category: 'hardware',
    date: 'June — Aug 2023',
    tag: 'Internship',
    problem: 'Vertical farming operations lacked automated precision control for drop/lift/grip cycles, requiring manual intervention at scale.',
    built: 'Extruded-aluminium automation tooling with pneumatics and custom control circuits; programmed Arduino and Raspberry Pi systems for precision indoor farm robotics.',
    tools: ['Arduino', 'Raspberry Pi', 'Pneumatics', 'Irrigation systems'],
    proof: [{ label: 'Internship video', kind: 'video' }],
  },
];

const ROLE_FILTERS = [
  { key: 'all',      label: 'All Work' },
  { key: 'robotics', label: 'Robotics' },
  { key: 'ai',       label: 'AI / ML' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'research', label: 'Research' },
];

function WorkCard({ item, onOpen }) {
  const scr = useScramble(item.title);
  return (
    <article className="wk-card" tabIndex="0"
      onClick={(e) => onOpen(item, e.currentTarget.getBoundingClientRect())}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(item)}
      onMouseEnter={scr.onMouseEnter} onMouseLeave={scr.onMouseLeave}>
      <div className="wk-meta">
        <span className="wk-date">{item.date}</span>
        <span className="tag">{item.tag}</span>
      </div>
      <h3 className="wk-title">{scr.display}</h3>
      <p className="wk-impact">{item.impact}</p>
      <div className="wk-divider" />
      <div className="wk-row">
        <span className="wk-field">Problem</span>
        <span className="wk-val">{item.problem}</span>
      </div>
      <div className="wk-row">
        <span className="wk-field">Built</span>
        <span className="wk-val">{item.built}</span>
      </div>
      <div className="wk-tools">
        {item.tools.slice(0, 5).map(t => <span key={t} className="chip">{t}</span>)}
        {item.tools.length > 5 && <span className="chip chip-more">+{item.tools.length - 5}</span>}
      </div>
      <div className="wk-foot">
        <div className="wk-proof">
          {item.proof.map((p, i) => (
            <span key={i} className="wk-proof-item">
              {p.href
                ? <a href={p.href} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>{p.label} ↗</a>
                : <span>{p.label}</span>
              }
            </span>
          ))}
        </div>
        <span className="open">Open →</span>
      </div>
    </article>
  );
}

function SelectedWorkSection({ onOpen }) {
  const [filter, setFilter] = useState('all');
  const gridRef = useRef(null);
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.wk-card');
    cards.forEach((card, i) => {
      card.classList.remove('in');
      setTimeout(() => card.classList.add('in'), i * 60);
    });
  }, [filter]);
  const filtered = filter === 'all'
    ? SELECTED_WORK
    : filter === 'research'
      ? SELECTED_WORK.filter(w => w.tag.toLowerCase().includes('research') || w.tag.toLowerCase().includes('thesis') || w.tag.toLowerCase().includes('published'))
      : SELECTED_WORK.filter(w => w.category === filter);

  return (
    <section id="selected-work" data-screen-label="03 Selected Work">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 02 / SELECTED WORK</div>
          <div>
            <h2 className="section-title">Things I've<br /><em style={{ color: 'var(--accent-ink)' }}>built & shipped.</em></h2>
            <p className="section-sub">Top works across robotics, AI, and hardware. Each one with a real problem, a real build, and real proof.</p>
          </div>
        </div>
        <div className="filter-row">
          {ROLE_FILTERS.map(({ key, label }) => (
            <button key={key} className={"filter-btn" + (filter === key ? ' active' : '')} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="wk-grid" ref={gridRef}>
          {filtered.map(item => (
            <WorkCard key={item.id} item={item} onOpen={(it, rect) => onOpen(it, 'selected-work', rect)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   RESEARCH SECTION (detailed papers/lab work)
───────────────────────────────────────────────────────── */
function ResearchCard({ item, onOpen, featured }) {
  const scr = useScramble(item.title);
  return (
    <article className={"card" + (featured ? " featured" : "")} tabIndex="0"
      onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect())}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      onMouseEnter={scr.onMouseEnter} onMouseLeave={scr.onMouseLeave}>
      <div className="card-meta">
        <span>{item.date}</span>
        <span className="tag">{item.tag}</span>
      </div>
      <h3 className="card-title">{scr.display}</h3>
      <div className="card-sub">{item.subtitle}</div>
      <p className="card-summary">{item.summary}</p>
      {item.programme && (
        <div className="card-programme">
          <span className="cp-dot">◆</span>
          <span>{item.programme.title}</span>
          <span className="cp-tag">{item.programme.tag}</span>
        </div>
      )}
      <div className="card-foot">
        <span>{item.org}</span>
        <span className="open">Read more</span>
      </div>
    </article>
  );
}

function ResearchSection({ data, onOpen }) {
  const visible = data.research.filter(r => !r.hidden);
  return (
    <section id="research" data-screen-label="04 Research">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 03 / RESEARCH</div>
          <div>
            <h2 className="section-title">Lab work &<br /><em style={{ fontStyle: 'italic', color: 'var(--accent-ink)' }}>publications.</em></h2>
            <p className="section-sub">Full write-ups for each research project. Click any card for methodology, contributions, and outcomes.</p>
          </div>
        </div>
        <div className="cards">
          {visible.map((r, i) => (
            <ResearchCard key={r.id} item={r}
              onOpen={(rect) => onOpen(r, 'research', rect)}
              featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   EXPERIENCE
───────────────────────────────────────────────────────── */
function ExperienceSection({ data, onOpen }) {
  return (
    <section id="experience" data-screen-label="05 Experience">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 05 / EXPERIENCE</div>
          <div>
            <h2 className="section-title">Where I've<br /><em style={{ fontStyle: 'italic' }}>worked.</em></h2>
            <p className="section-sub">Research, industry, and campus roles — most recent first.</p>
          </div>
        </div>
        <div className="timeline">
          {data.experience.map(e => (
            <div key={e.id} className="tl-row" tabIndex="0"
              onClick={(ev) => onOpen(e, 'experience', ev.currentTarget.getBoundingClientRect())}
              onKeyDown={(ev) => ev.key === 'Enter' && onOpen(e, 'experience')}>
              <div className="date">{e.date}</div>
              <div className="main">
                <h3>{e.title}</h3>
                <div className="org">{e.org} · <span style={{ color: 'var(--fg-soft)' }}>{e.location}</span></div>
                <div className="sum">{e.summary}</div>
              </div>
              <div className="more">open →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PROOF & CREDENTIALS
───────────────────────────────────────────────────────── */
const CREDENTIAL_GROUPS = [
  {
    group: 'Academic',
    items: [
      { title: 'Curriculum Vitae', href: 'assets/docs/Krishi_Attri_CV.pdf', kind: 'PDF' },
      { title: 'Resume', href: 'assets/docs/Krishi_Attri_Resume.pdf', kind: 'PDF' },
      { title: 'GRE Score Report', href: 'assets/docs/GRE_Report.pdf', kind: 'PDF', note: 'ETS blockchain verified' },
      { title: 'SNU Host Invitation Letter', href: 'assets/docs/SNU_Host_Letter.pdf', kind: 'PDF' },
    ],
  },
  {
    group: 'Research',
    items: [
      { title: 'PoP-SLAM Paper', href: 'assets/docs/PoP_SLAM_Paper.pdf', kind: 'Paper' },
      { title: 'Capstone Award Certificate', href: 'assets/docs/Capstone.pdf', kind: 'PDF', note: '1st Place, Most Innovative Solution' },
      { title: 'CIEE Internship Certificate', href: 'assets/docs/CIEE_Internship_Certificate.pdf', kind: 'PDF' },
    ],
  },
  {
    group: 'Certifications',
    items: [
      { title: 'NVIDIA Computer Vision Nanodegree', kind: 'Udacity × NVIDIA', note: 'Winter 2024' },
      { title: 'UPenn Robotics Specialization', kind: 'Coursera × UPenn', note: 'Summer 2021 · 6 courses' },
      { title: 'K-MOOC Innovative Robot Technologies', href: 'assets/docs/KMOOC_Robotics_Certificate.pdf', kind: 'SNU × K-MOOC', note: 'Aug 2024' },
    ],
  },
  {
    group: 'Fellowships',
    items: [
      { title: 'ORCGS Doctoral Fellowship', kind: 'University of Central Florida', note: 'Incoming, Aug 2026' },
      { title: 'GSFS Government Science Fellowship', kind: 'Seoul National University', note: '2024 — 2026' },
    ],
  },
];

function CredentialsSection() {
  return (
    <section id="credentials" data-screen-label="07 Credentials">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 06 / PROOF & CREDENTIALS</div>
          <div>
            <h2 className="section-title">Receipts &<br /><em style={{ fontStyle: 'italic', color: 'var(--accent-ink)' }}>credentials.</em></h2>
            <p className="section-sub">Academic docs, research output, certifications, and fellowships — all in one place.</p>
          </div>
        </div>
        <div className="cred-grid">
          {CREDENTIAL_GROUPS.map(({ group, items }) => (
            <div key={group} className="cred-group reveal">
              <div className="cred-group-label">{group}</div>
              {items.map((item, i) => (
                <div key={i} className="cred-item">
                  <div className="cred-left">
                    <div className="cred-title">{item.title}</div>
                    <div className="cred-sub">{item.kind}{item.note ? ` · ${item.note}` : ''}</div>
                  </div>
                  {item.href && (
                    <a href={item.href} target="_blank" rel="noopener" className="cred-link" aria-label={`Open ${item.title}`}>
                      <Icon name="external" size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   EDUCATION
───────────────────────────────────────────────────────── */
function EducationSection({ data }) {
  return (
    <section id="education" data-screen-label="Education">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ EDUCATION</div>
          <div>
            <h2 className="section-title">Four schools,<br /><em style={{ fontStyle: 'italic' }}>three continents.</em></h2>
            <p className="section-sub">Villanova · Yonsei (exchange) · Seoul National · UCF (incoming).</p>
          </div>
        </div>
        <div className="edu-grid">
          {data.education.map(e => (
            <div key={e.id} className="edu-card">
              <span className={"status " + e.status}>{e.status}</span>
              <div className="degree">{e.degree}</div>
              <div className="school">{e.school}</div>
              <div className="loc">{e.location}</div>
              <div className="note">{e.note}</div>
              <div className="date">{e.date}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────────────────── */
function SkillsBlock({ data }) {
  return (
    <section id="skills" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ STACK</div>
          <div>
            <h2 className="section-title">Tools, languages,<br /><em style={{ fontStyle: 'italic' }}>hardware.</em></h2>
          </div>
        </div>
        <div className="skills-grid">
          {Object.entries(data.skills).map(([k, items]) => (
            <div key={k} className="skill-group">
              <h4>{k}</h4>
              <div className="skill-chips">
                {items.map(s => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   GALLERY
───────────────────────────────────────────────────────── */
function GallerySection({ data, onLightbox }) {
  const layoutClasses = ['tall', '', 'wide', '', '', 'tall', 'wide', '', '', ''];
  return (
    <section id="gallery" data-screen-label="Gallery">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ MEDIA</div>
          <div>
            <h2 className="section-title">Media &<br /><em style={{ fontStyle: 'italic' }}>gallery.</em></h2>
            <p className="section-sub">Research robots, builds, internship work, and moments along the way.</p>
          </div>
        </div>
        <div className="gallery">
          {data.gallery.map((g, i) => (
            <div key={i} className={"gal-item " + (layoutClasses[i] || '')} onClick={() => onLightbox(g)}>
              <img src={g.src} alt={g.caption} loading="lazy" />
              <div className="cap">{g.caption}</div>
            </div>
          ))}
          <div className="gal-item wide" onClick={() => onLightbox({ src: 'assets/videos/silo-internship.mp4', caption: 'Silo automation · Area2Farms · Summer 2023', video: true })}>
            <video src="assets/videos/silo-internship.mp4" muted loop playsInline preload="metadata" />
            <div className="cap">▶ Silo internship · Area2Farms</div>
          </div>
          <div className="gal-item" onClick={() => onLightbox({ src: 'assets/videos/eod-robot.mp4', caption: 'EOD Robot · undergraduate research', video: true })}>
            <video src="assets/videos/eod-robot.mp4" muted loop playsInline preload="metadata" />
            <div className="cap">▶ EOD Robot · research</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────── */
function ContactSection({ data }) {
  const c = data.profile.contact;
  return (
    <section id="contact" data-screen-label="09 Contact">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ CONTACT</div>
          <div>
            <h2 className="section-title">Let's talk<br /><em style={{ fontStyle: 'italic', color: 'var(--accent-ink)' }}>robots.</em></h2>
            <p className="section-sub">Open to research collaborations, Ph.D.-adjacent discussions, and engineering roles.</p>
          </div>
        </div>
        <div className="contact-wrap">
          <p className="contact-big">
            Write to me at<br /><a href={`mailto:${c.email}`}>{c.email}</a>.
          </p>
          <div className="contact-list">
            <a href={`mailto:${c.email}`}><div><div className="label">Email</div><div className="val">{c.email}</div></div><Icon name="mail" size={15} /></a>
            <a href={c.linkedin} target="_blank" rel="noopener"><div><div className="label">LinkedIn</div><div className="val">linkedin.com/in/krishi-attri15</div></div><Icon name="linkedin" size={15} /></a>
            <a href={c.github} target="_blank" rel="noopener"><div><div className="label">GitHub</div><div className="val">github.com/Archerkattri</div></div><Icon name="github" size={15} /></a>
            <a href="assets/docs/Krishi_Attri_CV.pdf" target="_blank"><div><div className="label">Curriculum Vitae</div><div className="val">Krishi_Attri_CV.pdf</div></div><Icon name="download" size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}



/* ─────────────────────────────────────────────────────────
   EDUCATION — with coursework
───────────────────────────────────────────────────────── */
function EducationWithCoursework({ data }) {
  return (
    <section id="education" data-screen-label="Education">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ EDUCATION</div>
          <div>
            <h2 className="section-title">Four schools,<br /><em style={{ fontStyle: 'italic' }}>three continents.</em></h2>
            <p className="section-sub">Villanova · Yonsei (exchange) · Seoul National · UCF (incoming).</p>
          </div>
        </div>
        <div className="edu-grid">
          {data.education.map(e => (
            <div key={e.id} className="edu-card">
              <span className={"status " + e.status}>{e.status}</span>
              <div className="degree">{e.degree}</div>
              <div className="school">{e.school}</div>
              <div className="loc">{e.location}</div>
              <div className="note">{e.note}</div>
              <div className="date">{e.date}</div>
            </div>
          ))}
        </div>
        {data.coursework && (
          <div style={{ marginTop: 56 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-soft)', textTransform: 'uppercase', marginBottom: 24 }}>
              Relevant Coursework
            </div>
            <div className="cred-grid">
              {Object.entries(data.coursework).map(([group, courses]) => (
                <div key={group} className="cred-group reveal">
                  <div className="cred-group-label">{group}</div>
                  <div className="skill-chips" style={{ marginTop: 10, gap: 6 }}>
                    {courses.map(c => <span key={c} className="chip" style={{ fontSize: 12 }}>{c}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   LEADERSHIP & ACTIVITIES
───────────────────────────────────────────────────────── */
function LeadershipSection({ data }) {
  if (!data.leadership || data.leadership.length === 0) return null;
  return (
    <section id="leadership">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ LEADERSHIP</div>
          <div>
            <h2 className="section-title">Beyond<br /><em style={{ fontStyle: 'italic' }}>the lab.</em></h2>
            <p className="section-sub">Campus leadership and professional organisations at Villanova.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 2 }}>
          {data.leadership.map((item, i) => (
            <div key={i} className="tl-row reveal" style={{ '--i': i, cursor: 'default', gridTemplateColumns: '200px 1fr' }}>
              <div className="date">{item.date}</div>
              <div className="main">
                <h3 style={{ fontSize: 18, marginBottom: 2 }}>{item.role}</h3>
                <div className="org">{item.org}</div>
                {item.note && <div className="sum" style={{ marginTop: 6 }}>{item.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   ADDITIONAL BUILDS / ARCHIVE
───────────────────────────────────────────────────────── */
function ArchiveSection({ data }) {
  if (!data.archive || data.archive.length === 0) return null;
  return (
    <section id="archive">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ ARCHIVE</div>
          <div>
            <h2 className="section-title">Earlier<br /><em style={{ fontStyle: 'italic' }}>builds.</em></h2>
            <p className="section-sub">Smaller projects, coursework builds, and personal experiments — the trail of making things.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1 }}>
          {data.archive.map((item, i) => (
            <div key={i} className="reveal" style={{
              '--i': i,
              padding: '16px 20px',
              borderTop: '1px solid var(--line)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--fg)' }}>{item.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-soft)', whiteSpace: 'nowrap' }}>{item.date}</span>
              </div>
              {item.note && <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{item.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { SelectedWorkSection, ExperienceSection, CredentialsSection, EducationSection, EducationWithCoursework, SkillsBlock, GallerySection, ContactSection, LeadershipSection, ArchiveSection };
