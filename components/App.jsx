// Root App

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

  useEffect(() => {
    const ids = ['home','about','journey','research','projects','experience','awards','education','gallery','contact'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(e => o.observe(e));
    return () => o.disconnect();
  }, []);

  const openDetail = (item, kind) => { setModalItem(item); setModalKind(kind); };
  const closeDetail = () => { setModalItem(null); setModalKind(null); };

  const kickerFor = (k) => ({
    research: 'Research · Detail',
    project: 'Project · Detail',
    experience: 'Experience · Detail',
    award: 'Award · Detail',
  }[k] || 'Detail');

  return (
    <>
      <div className="bp-grid" aria-hidden="true"></div>
      <Nav active={active} onSetActive={setActive} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <Hero data={data} />
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
          <span>Built with HTML · React · ♥ for robots</span>
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
