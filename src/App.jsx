import { useEffect, useMemo } from "react";
import GridSite from "./grid/GridSite";
import Fluid from "./motion/Fluid";
import Cursor from "./motion/Cursor";

// The map (2D page grid, edge-button navigation) is the one and only
// interactive experience. The document view survives solely as the
// build-time prerender (no-JS / SEO fallback, see prerender-entry.jsx).
// Reduced motion: same map, instant page swaps (handled in GridSite +
// the prefers-reduced-motion rules in grid.css).
export default function App() {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    document.documentElement.classList.add("grid-mode");
  }, []);

  return (
    <>
      <Fluid reduced={reduced} />
      <div className="grain" aria-hidden="true" />
      <Cursor reduced={reduced} />
      <GridSite reduced={reduced} />
    </>
  );
}
