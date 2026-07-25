const total = (items, read) => items.reduce((sum, item) => sum + (Number(read(item)) || 0), 0);

export function summarizeGitHub(repositories, contributorsByRepo, releasesByRepo, owner) {
  const owned = repositories.filter((repo) => !repo.fork);
  const ownerKey = owner.toLowerCase();
  return {
    repositories: owned.length,
    stars: total(owned, (repo) => repo.stargazers_count),
    forks: total(owned, (repo) => repo.forks_count),
    commits: total(owned, (repo) => {
      const contributor = (contributorsByRepo[repo.name] ?? [])
        .find((item) => item.login?.toLowerCase() === ownerKey);
      return contributor?.contributions;
    }),
    releaseDownloads: total(owned, (repo) =>
      total(releasesByRepo[repo.name] ?? [], (release) =>
        total(release.assets ?? [], (asset) => asset.download_count))),
  };
}

export function summarizePyPI(packages) {
  return {
    packages: packages.length,
    downloadsLastMonth: total(packages, (item) => item.last_month),
  };
}

export function summarizeHuggingFace(models, datasets, excludedIds = new Set()) {
  const includedModels = models.filter((item) => !excludedIds.has(item.id));
  const includedDatasets = datasets.filter((item) => !excludedIds.has(item.id));
  return {
    assets: includedModels.length + includedDatasets.length,
    models: includedModels.length,
    datasets: includedDatasets.length,
    downloadsLastMonth:
      total(includedModels, (item) => item.downloads) +
      total(includedDatasets, (item) => item.downloads),
    downloadsAllTime:
      total(includedModels, (item) => item.downloadsAllTime) +
      total(includedDatasets, (item) => item.downloadsAllTime),
  };
}

export function personalHuggingFaceExclusions(models, datasets) {
  return new Set(
    [...models, ...datasets]
      .filter((item) => /gaussianfeels/i.test(item.id))
      .map((item) => item.id),
  );
}

export function isMcpSoListing(html, repositoryUrl) {
  return !/Project not found/i.test(html)
    && html.includes(`href="${repositoryUrl}"`);
}

export function summarizeComfy(nodes) {
  return {
    nodes: nodes.length,
    downloads: total(nodes, (item) => item.downloads),
  };
}

export function summarizeZenodo(records) {
  return {
    records: records.length,
    downloads: total(records, (item) => item.stats?.downloads),
    views: total(records, (item) => item.stats?.views),
  };
}

export function summarizeMcp(directories) {
  return { listings: directories.filter((item) => item.listed).length };
}

export function mergeSnapshot(previous, next) {
  const sources = {};
  const sourceIds = new Set([
    ...Object.keys(previous?.sources ?? {}),
    ...Object.keys(next?.sources ?? {}),
  ]);

  for (const id of sourceIds) {
    const fresh = next?.sources?.[id];
    const old = previous?.sources?.[id];
    if (fresh?.status !== "error") {
      sources[id] = fresh;
    } else if (old) {
      const { status: _oldStatus, error: _oldError, ...oldValue } = old;
      sources[id] = {
        status: "stale",
        ...oldValue,
        error: fresh.error,
      };
    } else {
      sources[id] = fresh;
    }
  }

  return { ...next, sources };
}
