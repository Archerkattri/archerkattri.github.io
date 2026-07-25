import { useEffect, useState } from "react";
import { LIVE_STATS } from "../generated/live-stats";

const number = new Intl.NumberFormat("en-US");

function count(value) {
  return Number.isFinite(value) ? number.format(value) : "—";
}

function itemSummary(source, key) {
  return (source?.items ?? [])
    .map((item) => `${item.id}: ${count(item[key])}`)
    .join(" · ");
}

export function LiveStats() {
  const [snapshot, setSnapshot] = useState(LIVE_STATS);

  useEffect(() => {
    let active = true;
    fetch("/data/live-stats.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Stats request failed: ${response.status}`);
        return response.json();
      })
      .then((next) => {
        if (active && next?.schemaVersion === 1) setSnapshot(next);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const s = snapshot.sources;
  const github = s.github ?? {};
  const primary = [
    { label: "Public repos", value: github.repositories, note: "created, not forks" },
    { label: "GitHub stars", value: github.stars, note: "across owned repos" },
    { label: "Authored commits", value: github.commits, note: "default branches" },
    { label: "Community forks", value: github.forks, note: "across owned repos" },
  ];
  const distributions = [
    {
      id: "pypi",
      label: "PyPI",
      value: s.pypi?.downloadsLastMonth,
      unit: "downloads · 30d",
      href: s.pypi?.href,
      title: itemSummary(s.pypi, "downloadsLastMonth"),
      status: s.pypi?.status,
    },
    {
      id: "hugging-face",
      label: "Hugging Face",
      value: s.huggingFace?.downloadsAllTime,
      unit: `downloads · ${count(s.huggingFace?.downloadsLastMonth)} in 30d`,
      href: s.huggingFace?.href,
      title: itemSummary(s.huggingFace, "downloadsAllTime"),
      status: s.huggingFace?.status,
    },
    {
      id: "comfy",
      label: "Comfy Registry",
      value: s.comfy?.downloads,
      unit: "downloads · all time",
      href: s.comfy?.href,
      title: itemSummary(s.comfy, "downloads"),
      status: s.comfy?.status,
    },
    {
      id: "github-releases",
      label: "GitHub Releases",
      value: github.releaseDownloads,
      unit: "asset downloads",
      href: github.href,
      title: "All public release assets across owned repositories",
      status: github.status,
    },
    {
      id: "zenodo",
      label: "Zenodo",
      value: s.zenodo?.downloads,
      unit: `downloads · ${count(s.zenodo?.views)} views`,
      href: s.zenodo?.href,
      title: itemSummary(s.zenodo, "downloads"),
      status: s.zenodo?.status,
    },
  ];
  const mcpItems = s.mcp?.items ?? [];
  const staleSources = Object.values(s).filter((source) => source?.status === "stale").length;
  const updated = new Date(snapshot.generatedAt);
  const updatedLabel = Number.isNaN(updated.valueOf())
    ? "refresh pending"
    : updated.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });

  return (
    <section className="live-stats" aria-label="Live open-source adoption metrics">
      <div className="live-stats-head">
        <span><i aria-hidden="true" /> Live open-source footprint</span>
        <time dateTime={snapshot.generatedAt}>
          Checked {updatedLabel}{staleSources ? ` · ${staleSources} cached` : ""}
        </time>
      </div>
      <div className="live-primary">
        {primary.map((metric) => (
          <a
            key={metric.label}
            className={github.status === "stale" ? "stale" : ""}
            href={github.href}
            target="_blank"
            rel="noopener"
          >
            <strong>{count(metric.value)}</strong>
            <span>{metric.label}</span>
            <small>{metric.note}</small>
          </a>
        ))}
      </div>
      <div className="live-sources">
        {distributions.map((source) => (
          <a
            key={source.id}
            className={source.status === "stale" ? "stale" : ""}
            href={source.href}
            target="_blank"
            rel="noopener"
            title={source.title}
          >
            <span>{source.label}</span>
            <strong>{count(source.value)}</strong>
            <small>{source.unit}</small>
          </a>
        ))}
        <div className={`live-mcp${s.mcp?.status === "stale" ? " stale" : ""}`}>
          <span>MCP directories</span>
          <strong>{count(s.mcp?.listings)} verified</strong>
          <small>
            {mcpItems.map((item, index) => (
              <span key={item.id}>
                {index > 0 && " · "}
                <a href={item.href} target="_blank" rel="noopener">
                  {item.label}{item.listed ? " ✓" : ""}
                </a>
              </span>
            ))}
          </small>
        </div>
      </div>
      <p className="live-method">
        Public APIs at build time. PyPI is a 30-day count; Hugging Face shows all time plus 30 days; Comfy, release, and Zenodo totals are cumulative.
      </p>
    </section>
  );
}
