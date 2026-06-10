// Document view — the site flattened into a clean sectioned page.
// PRERENDER-ONLY: this is rendered to static HTML at build time
// (src/prerender-entry.jsx) and injected into dist/index.html as the
// no-JS / SEO fallback. It is hidden the moment JS mounts the map
// (html.js .prerendered in styles.css) and has no user-facing route.
import { PORTFOLIO_DATA } from "./data";
import { Nav, Hero } from "./components/Shell";
import {
  ResearchSection, PersonalProjectsSection, ExperienceSection,
  SchoolSection, SchoolProjectsSection, GallerySection,
  ContactSection, Footer,
} from "./components/Sections";

export default function DocumentView() {
  const data = PORTFOLIO_DATA;
  return (
    <div className="docview">
      <div className="grain" aria-hidden="true" />
      <Nav active="" cv={data.profile.contact.cv} />
      <main>
        <Hero profile={data.profile} />
        <ResearchSection data={data} />
        <PersonalProjectsSection data={data} />
        <ExperienceSection data={data} />
        <SchoolSection data={data} />
        <SchoolProjectsSection data={data} />
        <GallerySection data={data} />
        <ContactSection data={data} />
      </main>
      <Footer />
    </div>
  );
}
