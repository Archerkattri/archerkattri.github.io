// Research + Projects + Experience + Awards + Education + Gallery + Contact sections

function ResearchCard({ item, onOpen, featured }) {
  return (
    <article className={"card" + (featured ? " featured" : "")} tabIndex="0" onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <div className="card-meta">
        <span>{item.date}</span>
        <span className="tag">{item.tag}</span>
      </div>
      <h3 className="card-title">{item.title}</h3>
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
    <section id="research">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 03 / RESEARCH</div>
          <div>
            <h2 className="section-title">Perception systems for<br/><span style={{ fontStyle: 'italic', color: 'var(--accent-ink)' }}>dexterous robots.</span></h2>
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

function ProjectsSection({ data, onOpen }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? data.projects : data.projects.filter(p => p.category === filter);
  return (
    <section id="projects">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 04 / PROJECTS</div>
          <div>
            <h2 className="section-title">Things I've<br/><span style={{ fontStyle: 'italic' }}>built.</span></h2>
            <p className="section-sub">Capstone, course projects, internship artifacts, and hardware I've built for fun. Filter by type.</p>
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
          {filtered.map(p => (
            <article key={p.id} className="card" tabIndex="0" onClick={() => onOpen(p, 'project')} onKeyDown={(e) => e.key === 'Enter' && onOpen(p, 'project')}>
              <div className="card-meta">
                <span>{p.date}</span>
                <span className="tag">{p.category}</span>
              </div>
              <h3 className="card-title" style={{ fontSize: 26 }}>{p.title}</h3>
              <div className="card-sub">{p.subtitle}</div>
              <p className="card-summary">{p.summary}</p>
              <div className="card-foot">
                <span>{p.video ? '▶ video' : (p.gallery && p.gallery.length ? `${p.gallery.length} image${p.gallery.length>1?'s':''}` : 'detail')}</span>
                <span className="open">Open</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ data, onOpen }) {
  return (
    <section id="experience">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 05 / EXPERIENCE</div>
          <div>
            <h2 className="section-title">Where I've<br/><span style={{ fontStyle: 'italic' }}>worked.</span></h2>
            <p className="section-sub">Research, industry, and campus roles — most recent first.</p>
          </div>
        </div>
        <div className="timeline">
          {data.experience.map(e => (
            <div key={e.id} className="tl-row" tabIndex="0" onClick={() => onOpen(e, 'experience')} onKeyDown={(ev) => ev.key === 'Enter' && onOpen(e, 'experience')}>
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

function AwardsSection({ data, onOpen }) {
  return (
    <section id="awards">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 06 / AWARDS & CERTS</div>
          <div>
            <h2 className="section-title">Recognition &<br/><span style={{ fontStyle: 'italic' }}>credentials.</span></h2>
            <p className="section-sub">Fellowships, awards, and certifications. Click any card to view the details or open the attached document.</p>
          </div>
        </div>
        <div className="cards">
          {data.awards.map(a => (
            <article key={a.id} className="card" tabIndex="0" onClick={() => onOpen(a, 'award')} onKeyDown={(e) => e.key === 'Enter' && onOpen(a, 'award')} style={{ minHeight: 200 }}>
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
      </div>
    </section>
  );
}

function EducationSection({ data }) {
  return (
    <section id="education">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 07 / EDUCATION</div>
          <div>
            <h2 className="section-title">Four schools,<br/><span style={{ fontStyle: 'italic' }}>three continents.</span></h2>
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

function SkillsBlock({ data }) {
  return (
    <section id="skills" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 07.b / STACK</div>
          <div>
            <h2 className="section-title">Tools, languages,<br/><span style={{ fontStyle: 'italic' }}>hardware.</span></h2>
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

function GallerySection({ data, onLightbox }) {
  const layoutClasses = ['tall', '', 'wide', '', '', 'tall', 'wide', '', '', ''];
  return (
    <section id="gallery">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 08 / MEDIA</div>
          <div>
            <h2 className="section-title">Media &<br/><span style={{ fontStyle: 'italic' }}>gallery.</span></h2>
            <p className="section-sub">A visual tour: research robots, builds, internship work, and moments along the way.</p>
          </div>
        </div>
        <div className="gallery">
          {data.gallery.map((g, i) => (
            <div key={i} className={"gal-item " + (layoutClasses[i] || '')} onClick={() => onLightbox(g)}>
              <img src={g.src} alt={g.caption} loading="lazy" />
              <div className="cap">{g.caption}</div>
            </div>
          ))}
          <div className="gal-item wide" onClick={() => onLightbox({ src: 'assets/videos/silo-internship.mp4', caption: 'Summer 2023 · Silo automation · Area2Farms', video: true })}>
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

function ContactSection({ data }) {
  const c = data.profile.contact;
  return (
    <section id="contact">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 09 / CONTACT</div>
          <div>
            <h2 className="section-title">Let's talk<br/><span style={{ fontStyle: 'italic', color: 'var(--accent-ink)' }}>robots.</span></h2>
            <p className="section-sub">Open to research collaborations, Ph.D.-adjacent discussions, and engineering roles. I respond to email.</p>
          </div>
        </div>
        <div className="contact-wrap">
          <div>
            <p className="contact-big">
              Write to me at<br/><a href={`mailto:${c.email}`}>{c.email}</a>.
            </p>
          </div>
          <div className="contact-list">
            <a href={`mailto:${c.email}`}>
              <div><div className="label">Email</div><div className="val">{c.email}</div></div>
              <Icon name="mail" size={15} />
            </a>
            <a href={c.linkedin} target="_blank" rel="noopener">
              <div><div className="label">LinkedIn</div><div className="val">linkedin.com/in/krishi-attri15</div></div>
              <Icon name="linkedin" size={15} />
            </a>
            <a href={c.github} target="_blank" rel="noopener">
              <div><div className="label">GitHub</div><div className="val">github.com/Archerkattri</div></div>
              <Icon name="github" size={15} />
            </a>
            <a href="assets/docs/Krishi_Attri_CV.pdf" target="_blank">
              <div><div className="label">Curriculum Vitae</div><div className="val">Krishi_Attri_CV.pdf</div></div>
              <Icon name="download" size={15} />
            </a>
            <a href="assets/docs/Krishi_Attri_Resume.pdf" target="_blank">
              <div><div className="label">Resume</div><div className="val">Krishi_Attri_Resume.pdf</div></div>
              <Icon name="download" size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ResearchSection, ProjectsSection, ExperienceSection, AwardsSection, EducationSection, SkillsBlock, GallerySection, ContactSection });
