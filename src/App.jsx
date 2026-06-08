import { useState, useEffect, lazy, Suspense } from 'react';
import { PORTFOLIO_DATA } from './data';
import { Modal, Lightbox } from './components/Modal';
import { DetailBody } from './components/Detail';
import { Nav, Hero, AboutSection } from './components/Shell';
import { ResearchSection, PersonalProjectsSection, ExperienceSection, CredentialsSection, EducationWithCoursework, SkillsBlock, GallerySection, ContactSection, LeadershipSection } from './components/Sections';

const JourneySection = lazy(() => import('./components/WorldMap').then(m => ({ default: m.JourneySection })));

function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const h = document.body.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    const onScroll = () => { if (!rafId) rafId = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); if (rafId) cancelAnimationFrame(rafId); };
  }, []);
  return <div style={{ position:'fixed',top:0,left:0,height:'2px',zIndex:200,width:pct+'%',background:'var(--accent)',transition:'width 0.08s linear',pointerEvents:'none',willChange:'width' }} aria-hidden="true" />;
}

export default function App() {
  const data = PORTFOLIO_DATA;
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'light');
  const [modalItem, setModalItem] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const [sourceRect, setSourceRect] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState('home');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // Single consolidated observer for nav-active section tracking + section .in-view + element reveal
  useEffect(() => {
    const navIds = new Set(['home','about','research','projects','experience','education','skills','credentials','leadership','journey','gallery','contact']);

    const navObs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    document.querySelectorAll('section[id]').forEach(s => { if (navIds.has(s.id)) navObs.observe(s); });

    const sectionInViewObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          sectionInViewObs.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('section').forEach(s => sectionInViewObs.observe(s));

    const revealObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const i = parseInt(el.style.getPropertyValue('--i') || '0', 10);
          if (i > 0) {
            setTimeout(() => el.classList.add('in'), i * 80);
          } else {
            el.classList.add('in');
          }
          revealObs.unobserve(el);
        }
      }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 }
    );

    const revealSel = '.reveal, .section-head, .card, .tl-row, .edu-card, .wib-card, .wk-card, .cred-group';
    const observeReveals = () => {
      document.querySelectorAll(revealSel).forEach(el => {
        if (!el.classList.contains('in')) revealObs.observe(el);
      });
    };
    observeReveals();
    // Catch any late-mounted nodes (lazy-loaded JourneySection)
    const mo = new MutationObserver(() => observeReveals());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { navObs.disconnect(); sectionInViewObs.disconnect(); revealObs.disconnect(); mo.disconnect(); };
  }, []);

  const openDetail = (item, kind, rect) => { setModalItem(item); setModalKind(kind); setSourceRect(rect || null); };
  const closeDetail = () => { setModalItem(null); setModalKind(null); setSourceRect(null); };
  const kickerFor = k => ({ research:'Research · Detail','selected-work':'Selected Work · Detail',project:'Project · Detail',experience:'Experience · Detail',award:'Award · Detail' }[k] || 'Detail');

  return <>
    <ReadingProgress /><div className="bp-grid" aria-hidden="true" />
    <Nav active={active} onSetActive={setActive} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
    <Hero data={data} /><AboutSection data={data} />
    <ResearchSection data={data} onOpen={openDetail} />
    <PersonalProjectsSection data={data} onOpen={openDetail} />
    <ExperienceSection data={data} onOpen={openDetail} />
    <EducationWithCoursework data={data} /><SkillsBlock data={data} /><CredentialsSection /><LeadershipSection data={data} />
    <Suspense fallback={<section style={{ minHeight: 400 }} aria-hidden="true" />}>
      <JourneySection />
    </Suspense>
    <GallerySection data={data} onLightbox={setLightbox} /><ContactSection data={data} />
    <footer className="footer"><div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}><span>© {new Date().getFullYear()} Krishi Attri · All work shown is authored or co-authored as noted.</span><span>Built with React · ♥ for robots</span></div></footer>
    <Modal open={!!modalItem} onClose={closeDetail} kicker={kickerFor(modalKind)} sourceRect={sourceRect}><DetailBody item={modalItem} kind={modalKind} onLightbox={setLightbox} /></Modal>
    <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
  </>;
}
