import { useEffect, useMemo, useState } from "react";
import GridSite from "./grid/GridSite";
import Chart from "./chart/Chart";
import DocumentView from "./DocumentView";

// View selection:
//   default              → the map (2D page grid, edge-button navigation)
//   ?view=chart / toggle → the free-pan research chart (ZUI)
//   ?view=doc / toggle   → plain document view (also the no-JS/SEO prerender)
// Reduced motion: the map stays default — it swaps pages instantly
// instead of sliding (the chart remains reachable via its toggle).
export default function App() {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [view, setView] = useState(() => {
    const q = new URLSearchParams(window.location.search).get("view");
    if (q === "doc" || q === "chart" || q === "grid") return q;
    const stored = sessionStorage.getItem("ka-view");
    if (stored === "doc" || stored === "chart" || stored === "grid") return stored;
    return "grid";
  });

  useEffect(() => {
    sessionStorage.setItem("ka-view", view);
    document.documentElement.classList.toggle("chart-mode", view === "chart");
    document.documentElement.classList.toggle("grid-mode", view === "grid");
  }, [view]);

  if (view === "chart") {
    return (
      <>
        <div className="grain" aria-hidden="true" />
        <Chart
          reduced={reduced}
          onDocView={() => setView("doc")}
          onGridView={() => setView("grid")}
        />
      </>
    );
  }
  if (view === "grid") {
    return (
      <>
        <div className="grain" aria-hidden="true" />
        <GridSite
          reduced={reduced}
          onChartView={() => setView("chart")}
          onDocView={() => setView("doc")}
        />
      </>
    );
  }
  return (
    <DocumentView
      onChartView={() => setView("chart")}
      onGridView={() => setView("grid")}
    />
  );
}
