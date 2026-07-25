# Live Open-Source Metrics Design

## Goal

Keep GaussianFeels in the academic research and school-project sections, remove it from the personal-profile pitch, and replace frozen vanity numbers with a source-backed open-source footprint that refreshes automatically.

## Data contract

`public/data/live-stats.json` is the single browser-facing snapshot. It contains:

- GitHub totals across repositories owned by `Archerkattri` where `fork === false`: repository count, stars, forks, release-asset downloads, and the owner's default-branch contributor count.
- PyPI downloads for the last month across the explicitly maintained personal packages.
- Hugging Face downloads across the `kattri15` personal models and datasets, excluding GaussianFeels school data.
- Comfy Registry downloads across every node published by `archerkattri`.
- Zenodo lifetime views and downloads across the personal-project concept records.
- MCP distribution presence on the official registry, Glama, and mcp.so. Directories without a numeric public counter are reported as verified listings, never as invented downloads.

Every source carries a URL, label, availability state, and timestamp. A source failure preserves the last valid checked-in value and marks it stale instead of replacing it with zero.

## Refresh architecture

GitHub Actions runs the collector before every Pages build and on a six-hour schedule. The collector uses the workflow's read-only GitHub token and public APIs, writes the snapshot into the deployment artifact, and does not create automated commits. The React view loads that file at runtime and ships the checked-in snapshot as its no-JavaScript and outage fallback.

## Presentation

The existing editorial/technical visual language stays intact. A compact telemetry rail sits below the personal proof line: large aggregate measures first, followed by small source chips for PyPI, Hugging Face, Comfy Registry, Zenodo, GitHub Releases, and MCP directories. Labels state the measurement window, especially PyPI's last-month figure and GitHub's default-branch commit scope.

The personal headline and metadata describe the five highlighted open-source projects. GaussianFeels remains fully represented under Research and School Projects, but is absent from the hero/profile and social-description copy.

## Hugging Face diagnosis

The `kattri15/actionshift-baselines` model repository contains nested `.pt` checkpoints but no Hub download-count query file such as a root `config.json`. Hugging Face counts model downloads through recognized query files, not every arbitrary checkpoint request, so the displayed model count can remain zero. The portfolio reports the Hub API value honestly; fixing future model tracking is a separate repository metadata change.
