# Forge and Brain Portability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Forge's solver-backed release checks reproducible from a clean clone and replace Brain's obsolete pre-restructure tests with automation for its current repository contract.

**Architecture:** Forge will commit the four deterministic CalculiX input artifacts its tests already name and document, while retaining the generator/provenance records. Brain will remove historical `infra/stack` assertions that point at deleted layouts and replace them with current-root layout, manifest, index, and portability checks plus a root CI dependency contract.

**Tech Stack:** Python 3.11–3.12, pytest, CalculiX, NumPy/SciPy/NetworkX, GitHub Actions.

---

### Task 1: Forge fixture regression

**Files:**
- Modify: `forge/.gitignore`
- Add: `forge/tests/fixtures/brake/brake_rotor_structural.inp`
- Add: `forge/tests/fixtures/brake/brake_rotor_overload.inp`
- Add: `forge/tests/fixtures/vehicle/vehicle_structural.inp`
- Add: `forge/tests/fixtures/vehicle/vehicle_structural_overload.inp`
- Verify: `forge/tests/domains/test_brake_binding.py`
- Verify: `forge/tests/domains/test_vehicle_binding.py`

- [ ] Run `uv run --extra test python -m pytest tests -q` with `ccx` on `PATH`.
- [ ] Confirm exactly four failures name the absent fixture decks.
- [ ] Confirm the fixture copies available in the owner's full Forge workspace contain no absolute paths or external `*INCLUDE` directives and match the documented nominal/overload cases.
- [ ] Add `.gitignore` exceptions for only the four named fixtures after the broad `*.inp` rule.
- [ ] Copy the four generated text fixtures into the clean clone and record their SHA-256 hashes.
- [ ] Run the four previously failing bound-domain tests with CalculiX.
- [ ] Run the complete Forge test suite.
- [ ] Commit as `fix: ship solver fixtures required by release tests`.

### Task 2: Brain current-layout regression tests

**Files:**
- Delete: `brain/infra/stack/tests/test_latest_truth.py`
- Delete: `brain/infra/stack/tests/test_brain_compaction.py`
- Modify: `brain/infra/stack/tests/test_portability.py`
- Create: `brain/infra/stack/tests/test_current_layout.py`
- Create: `brain/requirements-ci.txt`
- Create: `brain/.github/workflows/ci.yml`

- [ ] Run `python -m pytest -q` and preserve the eight failures showing references to `workspace/projects`, `infra/vault`, old project names, deleted bulk AURA evidence, and missing historical indexes.
- [ ] Remove the two historical truth/compaction test modules. They test the archived pre-2026-07 restructure rather than the repository described by root `README.md` and `INDEX.md`.
- [ ] Point portability checks at the repository root and scan maintained `tools/*.py` code for checked-in `/home/krishi/` paths.
- [ ] Add current-layout tests that assert:
  - `README.md`, `INDEX.md`, `REPO_SETUP.md`, `projects`, `library/index`, `knowledge/vault`, `tools`, and `infra` exist.
  - Active project directories exist for ActionABI, ActionShift, AURA, biomech, CERT-FLOW, HiCache, MathLAS, splatreg, ToothPrint, Forge notes, and ops.
  - `library/index/paper_manifest.csv`, `doc_manifest.csv`, `paper_registry.json`, `doc_registry.json`, `chunks.jsonl`, and `doc_chunks.jsonl` are present and non-empty.
  - Registry JSON parses and CSV manifests contain identifiers and source/path columns.
  - Root documentation uses `projects/`, `knowledge/`, and `library/`, and does not direct users to the deleted `workspace/projects` layout.
- [ ] Create `requirements-ci.txt` with the dependencies used by the committed research experiment tests:

```text
pytest>=8
numpy>=1.24
scipy>=1.10
networkx>=3.0
```

- [ ] Add CI on `main` for Python 3.11 and 3.12, installing `requirements-ci.txt` and running `python -m pytest -q`.
- [ ] Run the focused new infrastructure tests and observe them pass.
- [ ] Run the complete root test suite and confirm zero failures.
- [ ] Commit as `ci: test the current research brain layout`.

### Task 3: Publish gate

- [ ] Confirm each worktree contains only intended fixture or test/CI changes.
- [ ] Confirm commit authors are `Krishi Attri <krishiattriwork@gmail.com>`.
- [ ] Report Forge's full solver-backed count and Brain's full root count in chat.
- [ ] Push Forge to `master` and Brain to `main`.
- [ ] Monitor both GitHub Actions runs and repair failures.
