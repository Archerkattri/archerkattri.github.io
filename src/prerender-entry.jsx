// Build-time prerender entry: renders the document view to static
// HTML injected into dist/index.html — the no-JS / SEO fallback.
import { renderToStaticMarkup } from "react-dom/server";
import DocumentView from "./DocumentView";

export function render() {
  return renderToStaticMarkup(
    <div className="prerendered">
      <DocumentView />
    </div>
  );
}
