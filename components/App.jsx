// Root App — with reading progress bar + scroll reveal
const { useState, useEffect } = React;

/* ── Reading progress bar ── */
function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const h = document.body.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: '2px', zIndex: 200,
      width: pct + '%', background: 'var(--accent)',
      transition: 'width 0.08s linear',
      pointerEvents: 'none',
      transformOrigin: 'left',
    }} aria-hidden="true" />
  );
}

function App() {
  const data = window.PORTFOLIO_DATA;
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'light');
  const [modalItem, setModalItem] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState('home');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // Active section tracking
  useEffect(() => {
    const ids = ['home','about','journey','research','projects','experience','awards','education','gallery','contact'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Scroll-reveal: .reveal, .section-head, .card, .tl-row, .edu-card
  useEffect(() => {
    const selectors = ['.reveal', '.section-head', '.card', '.tl-row', '.edu-card'];
    const run = () => {
      const els = document.querySelectorAll(selectors.join(', '));
      const obs = new IntersectionObserver(entries => {
        entries.forEach((e, idx) => {
          if (e.isIntersecting) {
            const el = e.target;
            const i = parseInt(el.style.getPropertyValue('--i') || '0');
            setTimeout(() => { el.classList.add('in'); obs.unobserve(el); }, i * 80);
          }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
      els.forEach(el => { if (!el.classList.contains('in')) obs.observe(el); });
      return obs;
    };
    const obs = run();
    const t = setTimeout(run, 900); // catch late-rendered elements
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);

  const openDetail = (item, kind) => { setModalItem(item); setModalKind(kind); };
  const closeDetail = () => { setModalItem(null); setModalKind(null); };
  const kickerFor = k => ({ research: 'Research · Detail', project: 'Project · Detail', experience: 'Experience · Detail', award: 'Award · Detail' }[k] || 'Detail');

  return (
    <>
      <ReadingProgress />
      <div className="bp-grid" aria-hidden="true" />
      <Nav active={active} onSetActive={setActive} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <Hero data={data} />
      <AboutSection data={data} />
      <JourneySection />
      <ResearchSection data={data} onOpen={openDetail} />
      <ProjectsSection data={data} onOpen={openDetail} />
      <ExperienceSection data={data} onOpen={openDetail} />
      <AwardsSection data={data} onOpen={openDetail} />
      <EducationSection data={data} />
      <SkillsBlock data={data} />
      <GallerySection data={data} onLightbox={setLightbox} />
      <ContactSection data={data} />
      <footer className="footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <span>© {new Date().getFullYear()} Krishi Attri · All work shown is authored or co-authored as noted.</span>
          <span>Built with React · ♥ for robots</span>
        </div>
      </footer>
      <Modal open={!!modalItem} onClose={closeDetail} kicker={kickerFor(modalKind)}>
        <DetailBody item={modalItem} kind={modalKind} onLightbox={setLightbox} />
      </Modal>
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
