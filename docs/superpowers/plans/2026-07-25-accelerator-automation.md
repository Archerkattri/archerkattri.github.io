# Accelerator Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every accelerator repository an honest clean-checkout automation contract without downloading model weights or requiring a GPU.

**Architecture:** Repair the existing TRELLIS v1 CPU algorithm tests so they import their target files directly instead of executing the heavyweight package initializer. Add a common source-integrity workflow to source overlays, add wheel checks only to repositories that already define package metadata, and serialize splatreg's timing-sensitive CPU suite.

**Tech Stack:** Python 3.11, CPU PyTorch, compileall, pytest, GitHub Actions.

---

### Task 1: Repair TRELLIS v1 CPU tests

**Repositories:**
- `faster-trellis`
- `faster-trellis-plus-plus`

**Files per repository:**
- Modify: `tests/test_hicache.py`
- Modify: `tests/test_adaptive_cfg.py`
- Create: `requirements-ci.txt`
- Create: `.github/workflows/ci.yml`

- [ ] Preserve the current clean failure caused by importing `trellis/__init__.py` and its undeclared model/demo dependencies.
- [ ] Load `trellis/pipelines/samplers/hicache.py` and `adaptive_cfg.py` with `importlib.util.spec_from_file_location`, then bind the tested functions from those modules.
- [ ] Declare `torch>=2.1` in `requirements-ci.txt`.
- [ ] Add CI that installs CPU Torch, runs both test scripts, compiles first-party Python, and rejects unresolved merge markers.
- [ ] Run both scripts and `python -m compileall -q`.
- [ ] Commit each repository as `ci: run standalone CPU accelerator tests`.

### Task 2: Add source-integrity automation

**Compile-only repositories:**
- `fast-trellis2`
- `hermit-trellis2`
- `hermit-trellis2-plus-plus`
- `hunyuan2.1-plus`
- `hunyuan2.1-plus-plus`

**Package-build repositories:**
- `fastsam3d-plus`
- `fastsam3d-plus-plus`
- `hunyuan2-plus`
- `hunyuan2-plus-plus`
- `sam3d-plus`
- `sam3d-plus-plus`

**Files per repository:**
- Create: `.github/workflows/ci.yml`

- [ ] Add a Python 3.11 workflow on the actual default branch.
- [ ] Reject unresolved `<<<<<<<`, `=======`, and `>>>>>>>` markers in tracked Python files.
- [ ] Run `python -m compileall -q` over tracked first-party Python sources.
- [ ] For repositories with `pyproject.toml` or `setup.py`, build a wheel without installing CUDA/model dependencies.
- [ ] Run the exact workflow commands locally.
- [ ] Commit each repository as `ci: add clean source integrity checks`.

### Task 3: Stabilize splatreg performance automation

**Files:**
- Modify: `splatreg/.github/workflows/ci.yml`

- [ ] Preserve evidence that host-wide `-n auto` creates pathological nested CPU oversubscription and false wall-clock failures.
- [ ] Replace `pytest tests/ -q -n auto` with serial `pytest tests/ -q`.
- [ ] Run the timing-sensitive spatial-index and MAC tests serially.
- [ ] Run the full CPU suite serially if feasible.
- [ ] Commit as `ci: run timing-sensitive tests without worker contention`.

### Task 4: Publish gate

- [ ] Report the exact local contract verified for every repository.
- [ ] Confirm every commit uses Krishi Attri's required identity.
- [ ] Push directly to each default branch.
- [ ] Monitor every new Actions run and repair failures.
