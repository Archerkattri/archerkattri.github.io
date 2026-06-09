import { useState, useEffect } from "react";
import { PORTFOLIO_DATA } from "./data";
import { Nav, Hero } from "./components/Shell";
import {
  ResearchSection, SoftwareSection, ExperienceSection,
  BackgroundSection, FieldLog, ContactSection, Footer,
} from "./components/Sections";

export default function App() {
  const data = PORTFOLIO_DATA;
  const [active, setActive] = useState("");

  useEffect(() => {
    // active-section tracking for the nav
    const navIds = new Set(["research", "software", "experience", "background", "contact"]);
    const navObs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting && navIds.has(e.target.id)) setActive(e.target.id); }),
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    document.querySelectorAll("section[id]").forEach(s => navObs.observe(s));

    // unified scroll reveal
    const revealObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

    return () => { navObs.disconnect(); revealObs.disconnect(); };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="col-rules" aria-hidden="true" />
      <Nav active={active} cv={data.profile.contact.cv} />
      <main>
        <Hero profile={data.profile} />
        <ResearchSection data={data} />
        <SoftwareSection data={data} />
        <ExperienceSection data={data} />
        <BackgroundSection data={data} />
        <FieldLog data={data} />
        <ContactSection data={data} />
      </main>
      <Footer />
    </>
  );
}
