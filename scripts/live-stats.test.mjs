import test from "node:test";
import assert from "node:assert/strict";
import {
  mergeSnapshot,
  isMcpSoListing,
  personalHuggingFaceExclusions,
  summarizeComfy,
  summarizeGitHub,
  summarizeHuggingFace,
  summarizeMcp,
  summarizePyPI,
  summarizeZenodo,
} from "./lib/live-stats.mjs";

test("GitHub excludes forks and counts only the owner's default-branch contributions", () => {
  const repos = [
    { name: "one", fork: false, stargazers_count: 4, forks_count: 2 },
    { name: "two", fork: false, stargazers_count: 3, forks_count: 1 },
    { name: "upstream", fork: true, stargazers_count: 900, forks_count: 400 },
  ];
  const contributors = {
    one: [{ login: "Archerkattri", contributions: 7 }, { login: "other", contributions: 20 }],
    two: [{ login: "ARCHERKATTRI", contributions: 5 }],
  };
  const releases = {
    one: [{ assets: [{ download_count: 8 }, { download_count: 2 }] }],
    two: [{ assets: [{ download_count: 3 }] }],
  };

  assert.deepEqual(summarizeGitHub(repos, contributors, releases, "Archerkattri"), {
    repositories: 2,
    stars: 7,
    forks: 3,
    commits: 12,
    releaseDownloads: 13,
  });
});

test("package and distribution summaries retain their measurement windows", () => {
  assert.deepEqual(summarizePyPI([
    { name: "one", last_month: 20 },
    { name: "two", last_month: 5 },
  ]), { packages: 2, downloadsLastMonth: 25 });

  assert.deepEqual(summarizeComfy([
    { id: "a", downloads: 100 },
    { id: "b", downloads: 25 },
  ]), { nodes: 2, downloads: 125 });

  assert.deepEqual(summarizeZenodo([
    { id: 1, stats: { downloads: 11, views: 30 } },
    { id: 2, stats: { downloads: 4, views: 12 } },
  ]), { records: 2, downloads: 15, views: 42 });
});

test("Hugging Face includes personal project assets but excludes GaussianFeels school data", () => {
  const models = [{ id: "kattri15/actionshift-baselines", downloads: 2, downloadsAllTime: 4 }];
  const datasets = [
    { id: "kattri15/mathlas-corpus", downloads: 59, downloadsAllTime: 98 },
    { id: "kattri15/actionshift", downloads: 51, downloadsAllTime: 51 },
    { id: "kattri15/gaussianfeels-thesis-data", downloads: 500, downloadsAllTime: 900 },
  ];
  const result = summarizeHuggingFace(
    models,
    datasets,
    personalHuggingFaceExclusions(models, datasets),
  );

  assert.deepEqual(result, {
    assets: 3,
    models: 1,
    datasets: 2,
    downloadsLastMonth: 112,
    downloadsAllTime: 153,
  });
});

test("mcp.so requires a real project page with the exact repository link", () => {
  const valid = '<main><a href="https://github.com/Archerkattri/mathlas">Source</a></main>';
  const echoOnly = "<head>mathlas by Archerkattri</head><main><p>Project not found</p></main>";
  assert.equal(isMcpSoListing(valid, "https://github.com/Archerkattri/mathlas"), true);
  assert.equal(isMcpSoListing(echoOnly, "https://github.com/Archerkattri/mathlas"), false);
});

test("MCP counts verified directories without inventing download numbers", () => {
  assert.deepEqual(summarizeMcp([
    { id: "registry", listed: true },
    { id: "glama", listed: true },
    { id: "mcp-so", listed: false },
  ]), { listings: 2 });
});

test("a failed refresh preserves the prior source value and marks it stale", () => {
  const previous = {
    schemaVersion: 1,
    generatedAt: "2026-07-24T00:00:00.000Z",
    sources: {
      github: { status: "ok", repositories: 20, stars: 10 },
      pypi: {
        status: "ok",
        updatedAt: "2026-07-24T00:00:00.000Z",
        packages: 3,
        downloadsLastMonth: 50,
      },
    },
  };
  const next = {
    schemaVersion: 1,
    generatedAt: "2026-07-25T00:00:00.000Z",
    sources: {
      github: { status: "ok", repositories: 21, stars: 12 },
      pypi: { status: "error", error: "rate limited" },
    },
  };

  assert.deepEqual(mergeSnapshot(previous, next).sources, {
    github: { status: "ok", repositories: 21, stars: 12 },
    pypi: {
      status: "stale",
      updatedAt: "2026-07-24T00:00:00.000Z",
      packages: 3,
      downloadsLastMonth: 50,
      error: "rate limited",
    },
  });
});
