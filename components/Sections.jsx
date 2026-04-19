// Research + Projects + Experience + Awards + Education + Gallery + Contact
const { useState, useEffect, useRef, useCallback } = React;

/* ── Text scramble hook ── */
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
        if (c === ' ' || c === '.' || c === '-' || c === '/') return c;
        if (i < text.length * (frame / total)) return c;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      if (frame >= total) { clearInterval(ivRef.current); setDisplay(text); }
    }, 38);
  }, [text]);

  const stop = useCallback(() => {
    clearInterval(ivRef.current);
    setDisplay(text);
  }, [text]);

  return { display, onMouseEnter: start, onMouseLeave: stop };
}

/* ── Research ── */
function ResearchCard({ item, onOpen, featured }) {
  const scr = useScramble(item.title);
  return (
    <article className={"card" + (featured ? " featured" : "")} tabIndex="0"
      onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen()}
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
    <section id="research" data-screen-label="03 Research">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 03 / RESEARCH</div>
          <div>
            <h2 className="section-title">Perception systems for<br /><span style={{ fontStyle: 'italic', color: 'var(--accent-ink)' }}>dexterous robots.</span></h2>
            <p className="section-sub">Flagship work in 3D reconstruction, visuo-tactile SLAM, and in-hand manipulation. Click any card for the full write-up.</p>
          </div>
        </div>
        <div className="cards">
          {visible.map((r, i) => (
            <ResearchCard key={r.id} item={r} onOpen={() => onOpen(r, 'research')} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Projects (with see-more) ── */
const PROJECTS_INITIAL = 4;

function ProjectCard({ item, onOpen }) {
  const scr = useScramble(item.title);
  return (
    <article className="card" tabIndex="0"
      onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      onMouseEnter={scr.onMouseEnter} onMouseLeave={scr.onMouseLeave}>
      <div className="card-meta">
        <span>{item.date}</span>
        <span className="tag">{item.category}</span>
      </div>
      <h3 className="card-title" style={{ fontSize: 26 }}>{scr.display}</h3>
      <div className="card-sub">{item.subtitle}</div>
      <p className="card-summary">{item.summary}</p>
      <div className="card-foot">
        <span>{item.video ? '▶ video' : (item.gallery?.length ? `${item.gallery.length} image${item.gallery.length > 1 ? 's' : ''}` : 'detail')}</span>
        <span className="open">Open</span>
      </div>
    </article>
  );
}

function ProjectsSection({ data, onOpen }) {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = filter === 'all' ? data.projects : data.projects.filter(p => p.category === filter);
  const visible = showAll ? filtered : filtered.slice(0, PROJECTS_INITIAL);
  const hasMore = filtered.length > PROJECTS_INITIAL;

  // Reset showAll when filter changes
  useEffect(() => { setShowAll(false); }, [filter]);

  return (
    <section id="projects" data-screen-label="04 Projects">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 04 / PROJECTS</div>
          <div>
            <h2 className="section-title">Things I've<br /><span style={{ fontStyle: 'italic' }}>built.</span></h2>
            <p className="section-sub">Capstone, course projects, internship artifacts, and hardware I've built for fun.</p>
          </div>
        </div>
        <div className="filter-row">
          {[['all', 'All'], ['hardware', 'Hardware'], ['software', 'Software']].map(([k, l]) => (
            <button key={k} className={"filter-btn" + (filter === k ? ' active' : '')} onClick={() => setFilter(k)}>
              {l} <span style={{ color: filter === k ? 'var(--bg)' : 'var(--fg-soft)', marginLeft: 4 }}>
                [{k === 'all' ? data.projects.length : data.projects.filter(p => p.category === k).length}]
              </span>
            </button>
          ))}
        </div>
        <div className="cards">
          {visible.map(p => <ProjectCard key={p.id} item={p} onOpen={() => onOpen(p, 'project')} />)}
        </div>
        {!showAll && hasMore && (
          <div className="see-more-wrap">
            <button className="see-more-btn" onClick={() => setShowAll(true)}>
              Show {filtered.length - PROJECTS_INITIAL} more projects
              <span className="see-more-arrow">↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Experience ── */
function ExperienceSection({ data, onOpen }) {
  return (
    <section id="experience" data-screen-label="05 Experience">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 05 / EXPERIENCE</div>
          <div>
            <h2 className="section-title">Where I've<br /><span style={{ fontStyle: 'italic' }}>worked.</span></h2>
            <p className="section-sub">Research, industry, and campus roles — most recent first.</p>
          </div>
        </div>
        <div className="timeline">
          {data.experience.map(e => (
            <div key={e.id} className="tl-row" tabIndex="0"
              onClick={() => onOpen(e, 'experience')}
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

/* ── Awards (with see-more) ── */
const AWARDS_INITIAL = 4;

function AwardsSection({ data, onOpen }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? data.awards : data.awards.slice(0, AWARDS_INITIAL);
  const hasMore = data.awards.length > AWARDS_INITIAL;

  return (
    <section id="awards" data-screen-label="06 Awards">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 06 / AWARDS & CERTS</div>
          <div>
            <h2 className="section-title">Recognition &<br /><span style={{ fontStyle: 'italic' }}>credentials.</span></h2>
            <p className="section-sub">Fellowships, awards, and certifications.</p>
          </div>
        </div>
        <div className="cards">
          {visible.map(a => (
            <article key={a.id} className="card" tabIndex="0"
              onClick={() => onOpen(a, 'award')}
              onKeyDown={(e) => e.key === 'Enter' && onOpen(a, 'award')}
              style={{ minHeight: 200 }}>
              <div className="card-meta">
                <span>{a.date}</span>
                <span className="tag">{a.kind}</span>
              </div>
              <h3 className="card-title" style={{ fontSize: 24 }}>{a.title}</h3>
              <div className="card-sub">{a.org}</div>
              <p className="card-summary" style={{ fontSize: 13 }}>{a.summary}</p>
              <div className="card-foot">
                <span>{a.pdf ? 'PDF attached' : a.image ? 'image' : 'detail'}</span>
                <span className="open">View</span>
              </div>
            </article>
          ))}
        </div>
        {!showAll && hasMore && (
          <div className="see-more-wrap">
            <button className="see-more-btn" onClick={() => setShowAll(true)}>
              Show {data.awards.length - AWARDS_INITIAL} more awards & certs
              <span className="see-more-arrow">↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Education ── */
function EducationSection({ data }) {
  return (
    <section id="education" data-screen-label="07 Education">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 07 / EDUCATION</div>
          <div>
            <h2 className="section-title">Four schools,<br /><span style={{ fontStyle: 'italic' }}>three continents.</span></h2>
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

/* ── Skills ── */
function SkillsBlock({ data }) {
  return (
    <section id="skills" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 07.b / STACK</div>
          <div>
            <h2 className="section-title">Tools, languages,<br /><span style={{ fontStyle: 'italic' }}>hardware.</span></h2>
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

/* ── Gallery ── */
function GallerySection({ data, onLightbox }) {
  const layoutClasses = ['tall', '', 'wide', '', '', 'tall', 'wide', '', '', ''];
  return (
    <section id="gallery" data-screen-label="08 Gallery">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 08 / MEDIA</div>
          <div>
            <h2 className="section-title">Media &<br /><span style={{ fontStyle: 'italic' }}>gallery.</span></h2>
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
            <div className="cap">▶ Silo internship · Area2Farms · Summer 2023</div>
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

/* ── Contact ── */
function ContactSection({ data }) {
  const c = data.profile.contact;
  return (
    <section id="contact" data-screen-label="09 Contact">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 09 / CONTACT</div>
          <div>
            <h2 className="section-title">Let's talk<br /><span style={{ fontStyle: 'italic', color: 'var(--accent-ink)' }}>robots.</span></h2>
            <p className="section-sub">Open to research collaborations, Ph.D.-adjacent discussions, and engineering roles.</p>
          </div>
        </div>
        <div className="contact-wrap">
          <div>
            <p className="contact-big">
              Write to me at<br /><a href={`mailto:${c.email}`}>{c.email}</a>.
            </p>
          </div>
          <div className="contact-list">
            <a href={`mailto:${c.email}`}><div><div className="label">Email</div><div className="val">{c.email}</div></div><Icon name="mail" size={15} /></a>
            <a href={c.linkedin} target="_blank" rel="noopener"><div><div className="label">LinkedIn</div><div className="val">linkedin.com/in/krishi-attri15</div></div><Icon name="linkedin" size={15} /></a>
            <a href={c.github} target="_blank" rel="noopener"><div><div className="label">GitHub</div><div className="val">github.com/Archerkattri</div></div><Icon name="github" size={15} /></a>
            <a href="assets/docs/Krishi_Attri_CV.pdf" target="_blank"><div><div className="label">Curriculum Vitae</div><div className="val">Krishi_Attri_CV.pdf</div></div><Icon name="download" size={15} /></a>
            <a href="assets/docs/Krishi_Attri_Resume.pdf" target="_blank"><div><div className="label">Resume</div><div className="val">Krishi_Attri_Resume.pdf</div></div><Icon name="download" size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ResearchSection, ProjectsSection, ExperienceSection, AwardsSection, EducationSection, SkillsBlock, GallerySection, ContactSection });
