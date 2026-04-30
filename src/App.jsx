import { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from './data';
import { Modal, Lightbox } from './components/Modal';
import { DetailBody } from './components/Detail';
import { Nav, Hero, WhatIBuild, ResearchDirection, NowSection } from './components/Shell';
import { SelectedWorkSection, ExperienceSection, CredentialsSection, EducationSection, SkillsBlock, GallerySection, ContactSection } from './components/Sections';
import { JourneySection } from './components/WorldMap';

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
  return <div style={{ position:'fixed',top:0,left:0,height:'2px',zIndex:200,width:pct+'%',background:'var(--accent)',transition:'width 0.08s linear',pointerEvents:'none' }} aria-hidden="true" />;
}

export default function App() {
  const data = PORTFOLIO_DATA;
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'light');
  const [modalItem, setModalItem] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const [sourceRect, setSourceRect] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState('home');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('portfolio-theme', theme); }, [theme]);
  useEffect(() => {
    const ids = ['home','what-i-build','selected-work','research-direction','experience','credentials','contact'];
    const obs = new IntersectionObserver((entries) => entries.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);
  const openDetail = (item, kind, rect) => { setModalItem(item); setModalKind(kind); setSourceRect(rect || null); };
  const closeDetail = () => { setModalItem(null); setModalKind(null); setSourceRect(null); };
  const kickerFor = k => ({ research:'Research · Detail','selected-work':'Selected Work · Detail',project:'Project · Detail',experience:'Experience · Detail',award:'Award · Detail' }[k] || 'Detail');
  return <>
    <ReadingProgress /><div className="bp-grid" aria-hidden="true" />
    <Nav active={active} onSetActive={setActive} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
    <Hero data={data} /><WhatIBuild /><SelectedWorkSection onOpen={openDetail} /><ResearchDirection />
    <ExperienceSection data={data} onOpen={openDetail} /><NowSection data={data} /><CredentialsSection />
    <EducationSection data={data} /><SkillsBlock data={data} /><JourneySection /><GallerySection data={data} onLightbox={setLightbox} /><ContactSection data={data} />
    <footer className="footer"><div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}><span>© {new Date().getFullYear()} Krishi Attri · All work shown is authored or co-authored as noted.</span><span>Built with React · ♥ for robots</span></div></footer>
    <Modal open={!!modalItem} onClose={closeDetail} kicker={kickerFor(modalKind)} sourceRect={sourceRect}><DetailBody item={modalItem} kind={modalKind} onLightbox={setLightbox} /></Modal>
    <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
  </>;
}
