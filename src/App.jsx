import { useEffect, useMemo, useState } from "react";
import Chart from "./chart/Chart";
import DocumentView from "./DocumentView";

// View selection:
//   default            → the research chart (the site IS a map)
//   reduced motion     → document view (chart still reachable via toggle)
//   ?view=doc / toggle → document view, remembered for the session
export default function App() {
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [view, setView] = useState(() => {
    const q = new URLSearchParams(window.location.search).get("view");
    if (q === "doc" || q === "chart") return q;
    const stored = sessionStorage.getItem("ka-view");
    if (stored === "doc" || stored === "chart") return stored;
    return reduced ? "doc" : "chart";
  });

  useEffect(() => {
    sessionStorage.setItem("ka-view", view);
    document.documentElement.classList.toggle("chart-mode", view === "chart");
  }, [view]);

  if (view === "chart") {
    return (
      <>
        <div className="grain" aria-hidden="true" />
        <Chart reduced={reduced} onDocView={() => setView("doc")} />
      </>
    );
  }
  return <DocumentView onChartView={() => setView("chart")} />;
}
