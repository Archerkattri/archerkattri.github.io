# ComfyUI Packaging and Lazy-Load Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all three HiCache ComfyUI nodes build and test from clean checkouts, and make TRELLIS.2 guard-then-load pipelines preserve their real `None` lazy-load sentinel while still applying HiCache after model assignment.

**Architecture:** Declare the flat root modules explicitly to setuptools, expose one CPU test extra, and add a small CI workflow per repository. In TRELLIS.2, `_LazyPatchDict` stores immutable patch configuration separately from model slots: pending slots remain `None`, real assignments are wrapped, unloads restore `None`, and removal deletes pending configuration.

**Tech Stack:** Python 3.10–3.12, setuptools, pytest, CPU PyTorch, GitHub Actions.

---

### Task 1: Reproduce all packaging failures

**Files:**
- Verify: `ComfyUI-HiCache/pyproject.toml`
- Verify: `ComfyUI-TRELLIS-HiCache/pyproject.toml`
- Verify: `ComfyUI-TRELLIS2-HiCache/pyproject.toml`

- [ ] Run `uv build --wheel` in each repository.
- [ ] Confirm setuptools rejects ambiguous flat-layout modules:
  - `hicache_patch` and `nodes`
  - `trellis_hicache_patch` and `nodes`
- [ ] Preserve the failure output as the red packaging check.

### Task 2: Package and automate ComfyUI-HiCache

**Files:**
- Modify: `ComfyUI-HiCache/pyproject.toml`
- Create: `ComfyUI-HiCache/.github/workflows/ci.yml`
- Verify: `ComfyUI-HiCache/tests/test_patch.py`
- Verify: `ComfyUI-HiCache/tests/test_nodes.py`

- [ ] Add:

```toml
[project.optional-dependencies]
test = ["pytest>=8", "torch>=2.1"]

[tool.setuptools]
py-modules = ["hicache_patch", "nodes"]
```

- [ ] Add a Python 3.10–3.12 workflow that installs `.[test]`, runs `python -m pytest -q`, and runs `python -m build --wheel`.
- [ ] Run `uv run --extra test python -m pytest -q`.
- [ ] Run `uv build --wheel`.
- [ ] Commit as `fix: make clean package builds reproducible`.

### Task 3: Package and automate ComfyUI-TRELLIS-HiCache

**Files:**
- Modify: `ComfyUI-TRELLIS-HiCache/pyproject.toml`
- Create: `ComfyUI-TRELLIS-HiCache/.github/workflows/ci.yml`
- Verify: `ComfyUI-TRELLIS-HiCache/tests/test_patch.py`

- [ ] Add:

```toml
[project.optional-dependencies]
test = ["pytest>=8", "numpy>=1.24", "torch>=2.1"]

[tool.setuptools]
py-modules = ["trellis_hicache_patch", "nodes"]
```

- [ ] Add a Python 3.10–3.12 workflow that installs `.[test]`, runs the CPU tests, and builds the wheel.
- [ ] Run `uv run --extra test python -m pytest -q`.
- [ ] Run `uv build --wheel`.
- [ ] Commit as `fix: make clean package builds reproducible`.

### Task 4: Write TRELLIS.2 guard-then-load regression tests

**Files:**
- Modify: `ComfyUI-TRELLIS2-HiCache/tests/test_patch.py`
- Test: `ComfyUI-TRELLIS2-HiCache/trellis_hicache_patch.py`

- [ ] Replace the eager-placeholder assertion in `test_lazy_pipeline_autobinds_on_assignment` with an assertion that the pending slot remains exactly `None`.
- [ ] Add `test_lazy_pipeline_guard_then_load_still_triggers` using a loader whose model assignment is guarded by `if models[key] is None`.
- [ ] In that test, assert first load wraps a `DummyDiT`, setting the slot to `None` unloads it, and a second guarded load wraps the replacement again.
- [ ] Add `test_remove_hicache_clears_pending_before_any_load`, asserting removal returns a plain models dict with `None` and subsequent assignment remains unwrapped.
- [ ] Run:

```bash
uv run --with pytest --with numpy --with torch python -m pytest tests/test_patch.py -q
```

Expected: the new tests fail because the current implementation replaces `None` with `HiCacheModelPatch(None)`.

### Task 5: Implement pending lazy-patch configuration

**Files:**
- Modify: `ComfyUI-TRELLIS2-HiCache/trellis_hicache_patch.py`

- [ ] Give `_LazyPatchDict` a `_pending` mapping copied safely when constructed from another `_LazyPatchDict`.
- [ ] Add a `set_pending(key, config)` method that records a copy of the wrapper keyword arguments while leaving the slot at `None`.
- [ ] Change `__setitem__`:
  - Assignment of `None` to a pending key stores real `None`.
  - Assignment of a real unwrapped model to a pending key creates a fresh `HiCacheModelPatch(model, **config)`.
  - Existing eager patch behavior remains replacement-safe.
- [ ] In `apply_hicache`, unwrap eager patches normally; for `None`, call `set_pending` instead of inserting a placeholder patch.
- [ ] Keep pending configuration across unload/reload assignments.
- [ ] In `remove_hicache`, return early only when neither wrapped values nor pending keys exist; convert to a plain dict and clear all pending behavior.
- [ ] Run the focused new tests, then all patch tests.

### Task 6: Package and automate ComfyUI-TRELLIS2-HiCache

**Files:**
- Modify: `ComfyUI-TRELLIS2-HiCache/pyproject.toml`
- Create: `ComfyUI-TRELLIS2-HiCache/.github/workflows/ci.yml`

- [ ] Add the same `test` extra as TRELLIS v1 and explicit modules:

```toml
[project.optional-dependencies]
test = ["pytest>=8", "numpy>=1.24", "torch>=2.1"]

[tool.setuptools]
py-modules = ["trellis_hicache_patch", "nodes"]
```

- [ ] Add the Python 3.10–3.12 clean-install/test/wheel workflow.
- [ ] Run `uv run --extra test python -m pytest -q`.
- [ ] Run `uv build --wheel`.
- [ ] Commit behavioral tests, implementation, packaging, and CI as `fix: support guard-then-load lazy pipelines`.

### Task 7: Publish gate

- [ ] Confirm each worktree contains only intended source/config changes.
- [ ] Confirm each commit author is `Krishi Attri <krishiattriwork@gmail.com>`.
- [ ] Report each repository's exact test count and wheel result in chat.
- [ ] Push each repository directly to its default branch.
- [ ] Inspect the new GitHub Actions runs and repair any failures.
