import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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

const OWNER = "Archerkattri";
const OUTPUT = new URL("../public/data/live-stats.json", import.meta.url);
const OUTPUT_MODULE = new URL("../src/generated/live-stats.js", import.meta.url);
const PYPI_PACKAGES = [
  "splatreg",
  "certflow",
  "hicache-pp",
  "mathlas-mcp",
  "actionshift",
  "stepback",
];
const ZENODO_RECORDS = [20618389, 20618603, 20631476, 20618824, 21536385];
const USER_AGENT = "Archerkattri-portfolio-live-stats/1.0";

function githubToken() {
  if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
    return process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  }
  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

async function fetchResponse(url, options = {}) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          accept: "application/json",
          "user-agent": USER_AGENT,
          ...options.headers,
        },
      });
      if (response.ok || options.acceptStatuses?.includes(response.status)) return response;
      const message = (await response.text()).slice(0, 180).replace(/\s+/g, " ");
      lastError = new Error(`${response.status} ${response.statusText}: ${message}`);
      if (response.status !== 429 && response.status < 500) break;
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  throw lastError ?? new Error(`Request failed: ${url}`);
}

async function fetchJson(url, options) {
  const response = await fetchResponse(url, options);
  if (response.status === 204 || (options?.acceptStatuses?.includes(response.status) && !response.ok)) {
    return [];
  }
  return response.json();
}

async function fetchJsonPages(url, options) {
  const pages = [];
  for (let page = 1; page <= 20; page += 1) {
    const separator = url.includes("?") ? "&" : "?";
    const items = await fetchJson(`${url}${separator}per_page=100&page=${page}`, options);
    pages.push(...items);
    if (items.length < 100) break;
  }
  return pages;
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function collectGitHub() {
  const token = githubToken();
  const headers = {
    "x-github-api-version": "2022-11-28",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
  const repositories = await fetchJsonPages(
    `https://api.github.com/users/${OWNER}/repos?type=owner&sort=full_name`,
    { headers },
  );
  const owned = repositories.filter((repo) => !repo.fork);
  const contributorPairs = await mapLimit(owned, 6, async (repo) => [
    repo.name,
    await fetchJsonPages(
      `https://api.github.com/repos/${OWNER}/${repo.name}/contributors?anon=false`,
      { headers, acceptStatuses: [204, 409] },
    ),
  ]);
  const releasePairs = await mapLimit(owned, 6, async (repo) => [
    repo.name,
    await fetchJsonPages(
      `https://api.github.com/repos/${OWNER}/${repo.name}/releases`,
      { headers },
    ),
  ]);
  return {
    status: "ok",
    label: "GitHub",
    href: `https://github.com/${OWNER}?tab=repositories`,
    scope: "Public source repositories, forks excluded",
    ...summarizeGitHub(
      repositories,
      Object.fromEntries(contributorPairs),
      Object.fromEntries(releasePairs),
      OWNER,
    ),
  };
}

async function pypiRecent(name) {
  try {
    const response = await fetchJson(`https://pypistats.org/api/packages/${name}/recent`);
    return { name, ...response.data };
  } catch {
    const page = await (await fetchResponse(`https://pypistats.org/packages/${name}`, {
      headers: { accept: "text/html" },
    })).text();
    const match = page.match(/Downloads last month:\s*([\d,]+)/i);
    if (!match) throw new Error(`No last-month count found for ${name}`);
    return { name, last_month: Number(match[1].replaceAll(",", "")) };
  }
}

async function collectPyPI() {
  const packages = await mapLimit(PYPI_PACKAGES, 3, pypiRecent);
  return {
    status: "ok",
    label: "PyPI",
    href: "https://pypistats.org/",
    scope: "Downloads in the last month",
    ...summarizePyPI(packages),
    items: packages.map(({ name, last_month }) => ({
      id: name,
      downloadsLastMonth: last_month,
      href: `https://pypi.org/project/${name}/`,
    })),
  };
}

async function collectHuggingFace() {
  const [models, datasets] = await Promise.all([
    fetchJson("https://huggingface.co/api/models?author=kattri15&limit=100&expand=downloads&expand=downloadsAllTime"),
    fetchJson("https://huggingface.co/api/datasets?author=kattri15&limit=100&expand=downloads&expand=downloadsAllTime"),
  ]);
  const exclusions = personalHuggingFaceExclusions(models, datasets);
  const personalModels = models.filter((item) => !exclusions.has(item.id));
  const personalDatasets = datasets.filter((item) => !exclusions.has(item.id));
  return {
    status: "ok",
    label: "Hugging Face",
    href: "https://huggingface.co/kattri15",
    scope: "Personal models and datasets, all-time and last-30-day Hub downloads",
    ...summarizeHuggingFace(
      models,
      datasets,
      exclusions,
    ),
    items: [
      ...personalModels.map((item) => ({
        id: item.id,
        type: "model",
        downloads: item.downloads ?? 0,
        downloadsAllTime: item.downloadsAllTime ?? 0,
        href: `https://huggingface.co/${item.id}`,
      })),
      ...personalDatasets.map((item) => ({
        id: item.id,
        type: "dataset",
        downloads: item.downloads ?? 0,
        downloadsAllTime: item.downloadsAllTime ?? 0,
        href: `https://huggingface.co/datasets/${item.id}`,
      })),
    ],
  };
}

async function collectComfy() {
  const nodes = await fetchJson("https://api.comfy.org/publishers/archerkattri/nodes");
  return {
    status: "ok",
    label: "Comfy Registry",
    href: "https://registry.comfy.org/publishers/archerkattri",
    scope: "All-time custom-node downloads",
    ...summarizeComfy(nodes),
    items: nodes.map((item) => ({
      id: item.id,
      downloads: item.downloads ?? 0,
      href: `https://registry.comfy.org/node/${item.id}`,
    })),
  };
}

async function collectZenodo() {
  const records = await mapLimit(ZENODO_RECORDS, 3, (id) =>
    fetchJson(`https://zenodo.org/api/records/${id}`));
  return {
    status: "ok",
    label: "Zenodo",
    href: "https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Attri%2C%20Krishi%22",
    scope: "All-time release views and downloads",
    ...summarizeZenodo(records),
    items: records.map((item) => ({
      id: item.conceptrecid ?? String(item.id),
      downloads: item.stats?.downloads ?? 0,
      views: item.stats?.views ?? 0,
      href: item.doi_url,
    })),
  };
}

async function collectMcp() {
  const [registry, glama, mcpSo] = await Promise.all([
    fetchJson("https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.Archerkattri/mathlas"),
    fetchJson("https://glama.ai/api/mcp/v1/servers/Archerkattri/mathlas"),
    fetchResponse("https://chat.mcp.so/en/server/mathlas/Archerkattri", {
      headers: { accept: "text/html" },
    }).then((response) => response.text()),
  ]);
  const directories = [
    {
      id: "official",
      label: "Official MCP Registry",
      href: "https://registry.modelcontextprotocol.io/",
      listed: (registry.servers ?? []).some(({ server }) =>
        server?.name === "io.github.Archerkattri/mathlas"),
    },
    {
      id: "glama",
      label: "Glama",
      href: "https://glama.ai/mcp/servers/Archerkattri/mathlas",
      listed: glama.repository?.url === "https://github.com/Archerkattri/mathlas",
    },
    {
      id: "mcp-so",
      label: "mcp.so",
      href: "https://chat.mcp.so/en/server/mathlas/Archerkattri",
      listed: isMcpSoListing(mcpSo, "https://github.com/Archerkattri/mathlas"),
    },
  ];
  return {
    status: "ok",
    label: "MCP directories",
    href: "https://registry.modelcontextprotocol.io/",
    scope: "Verified listings, directories expose no numeric install counter",
    ...summarizeMcp(directories),
    items: directories,
  };
}

async function safeSource(id, collector) {
  try {
    return [id, { ...(await collector()), updatedAt: new Date().toISOString() }];
  } catch (error) {
    return [id, {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    }];
  }
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUTPUT, "utf8"));
  } catch {
    return undefined;
  }
}

const previous = await readPrevious();
const entries = await Promise.all([
  safeSource("github", collectGitHub),
  safeSource("pypi", collectPyPI),
  safeSource("huggingFace", collectHuggingFace),
  safeSource("comfy", collectComfy),
  safeSource("zenodo", collectZenodo),
  safeSource("mcp", collectMcp),
]);
const next = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sources: Object.fromEntries(entries),
};
const snapshot = mergeSnapshot(previous, next);

await mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`);
await mkdir(new URL("../src/generated/", import.meta.url), { recursive: true });
await writeFile(
  OUTPUT_MODULE,
  `// Generated by scripts/collect-live-stats.mjs\nexport const LIVE_STATS = ${JSON.stringify(snapshot, null, 2)};\n`,
);

for (const [id, source] of Object.entries(snapshot.sources)) {
  console.log(`${source.status === "ok" ? "✓" : "!"} ${id}: ${source.status}`);
}
