// Document view — the chart flattened into a clean sectioned page.
// Serves as: prefers-reduced-motion default, the no-JS/prerender
// fallback, and an always-available "DOC VIEW" reading mode.
import { useEffect } from "react";
import { PORTFOLIO_DATA } from "./data";
import { Nav, Hero } from "./components/Shell";
import {
  ResearchSection, SoftwareSection, ExperienceSection,
  BackgroundSection, FieldLog, ContactSection, Footer,
} from "./components/Sections";

export default function DocumentView({ onChartView }) {
  const data = PORTFOLIO_DATA;

  useEffect(() => {
    // unified scroll reveal (JS-gated; without JS everything is visible)
    const revealObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, []);

  return (
    <div className="docview">
      <div className="grain" aria-hidden="true" />
      <div className="col-rules" aria-hidden="true" />
      <Nav active="" cv={data.profile.contact.cv} />
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
      {onChartView && (
        <button className="chart-return" onClick={onChartView} title="Open the interactive research chart">
          ⌖ OPEN THE CHART
        </button>
      )}
    </div>
  );
}
