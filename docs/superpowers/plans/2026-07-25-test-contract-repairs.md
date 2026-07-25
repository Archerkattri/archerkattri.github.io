# Test Contract Repairs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make CERT-FLOW, ToothPrint, and MathLAS report and automate their supported test contracts accurately from clean checkouts.

**Architecture:** Keep runtime dependencies unchanged. Correct documentation where the code is already healthy, introduce an explicit ToothPrint test extra and split CI by dependency tier, and make MathLAS development-tool metadata resolvable across every declared Python version.

**Tech Stack:** Python 3.9–3.12, pytest, setuptools/hatchling, GitHub Actions, uv and pip clean-environment verification.

---

### Task 1: CERT-FLOW clean-checkout test truth

**Files:**
- Modify: `CERT-FLOW/README.md`
- Verify: `CERT-FLOW/tests/test_ch.py`
- Verify: `CERT-FLOW/tests/test_movingai.py`
- Verify: `CERT-FLOW/tests/test_movingai_experiment.py`
- Verify: `CERT-FLOW/tests/test_realworld.py`
- Verify: `CERT-FLOW/tests/test_roadnet.py`

- [ ] **Step 1: Reproduce the documented-count mismatch**

Run:

```bash
uv run --extra dev python -m pytest -q -rs
```

Expected current result: `256 passed, 32 skipped`, with skips attributed to 2 DIMACS-NY, 26 MovingAI, and 4 METR-LA tests.

- [ ] **Step 2: Replace the brittle count comment**

Change the development command block to:

```markdown
pytest   # core CPU suite; real-data benchmarks skip when their gitignored datasets are absent
```

Add prose immediately below it stating that `pytest -rs` lists the active dataset skips and naming DIMACS-NY, MovingAI, and METR-LA.

- [ ] **Step 3: Verify documentation against fresh output**

Run:

```bash
uv run --extra dev python -m pytest -q -rs
```

Expected: all collected clean-checkout tests pass; the README names every skip category shown by pytest.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: clarify data-dependent test skips"
```

### Task 2: ToothPrint explicit test tiers

**Files:**
- Modify: `toothprint/pyproject.toml`
- Modify: `toothprint/README.md`
- Create: `toothprint/.github/workflows/ci.yml`
- Test: `toothprint/tests/test_api.py`
- Test: `toothprint/tests/test_embedding.py`
- Test: `toothprint/tests/test_identity.py`
- Test: `toothprint/tests/test_io.py`

- [ ] **Step 1: Reproduce incomplete collection**

Run:

```bash
uv run --extra dev python -m pytest -q -rs
```

Expected current result: `92 passed, 4 skipped`; the four skips are module-level imports for FastAPI, Torch, and Trimesh.

- [ ] **Step 2: Add explicit test extras**

Add these optional dependencies, reusing the existing dependency lists without changing runtime behavior:

```toml
test = [
    "pytest>=8", "pytest-cov",
    "fastapi>=0.110", "httpx>=0.27", "python-multipart>=0.0.9",
    "pydicom>=2.4", "nibabel>=5.1", "trimesh>=4.0", "tifffile>=2023.7",
    "Pillow>=10.0", "lxml>=4.9",
]
test-torch = ["torch>=2.4"]
```

Keep `open3d` and OpenCV in the base dependency set because they are runtime capabilities already declared by the package.

- [ ] **Step 3: Verify the moderate-dependency tier collects API and geometry modules**

Run:

```bash
uv run --extra test python -m pytest -q -rs
```

Expected: FastAPI, IO, identity, and surface tests collect; only the Torch embedding module may skip.

- [ ] **Step 4: Verify the complete CPU tier**

Run:

```bash
uv run --extra test --extra test-torch python -m pytest -q -rs
```

Expected: no module is skipped for a missing declared test dependency. Sonata’s intentional missing-provider-path tests may remain conditionally selected.

- [ ] **Step 5: Add tiered GitHub Actions**

Create a workflow with:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: python -m pip install --upgrade pip
      - run: pip install -e ".[test]"
      - run: python -m pytest -q -rs
  embedding:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: python -m pip install --upgrade pip
      - run: pip install -e ".[test,test-torch]"
      - run: python -m pytest tests/test_embedding.py -q -rs
```

- [ ] **Step 6: Correct the README contract**

Replace the hard-coded 183-test assertion with the two reproducible commands and explain that `-rs` exposes optional-provider skips.

- [ ] **Step 7: Verify wheel and suite**

Run:

```bash
uv build --wheel
uv run --extra test --extra test-torch python -m pytest -q -rs
```

Expected: wheel succeeds and every dependency-backed module collects.

- [ ] **Step 8: Commit**

```bash
git add pyproject.toml README.md .github/workflows/ci.yml
git commit -m "ci: make test dependency tiers explicit"
```

### Task 3: MathLAS Python metadata resolution

**Files:**
- Modify: `mathlas/pyproject.toml`
- Modify: `mathlas/.github/workflows/ci.yml`
- Modify: `mathlas/tests/test_version_metadata.py`

- [ ] **Step 1: Reproduce uv resolution failure**

Run:

```bash
uv run --extra dev python -m pytest -q
```

Expected current result: resolver failure because `black==26.5.1` requires Python 3.10+ while the project declares Python 3.9 support.

- [ ] **Step 2: Preserve Python 3.9 with an environment marker**

Replace the development extra with:

```toml
dev = [
    "pytest>=7",
    "tomli>=2; python_version < '3.11'",
    "black==25.1.0; python_version < '3.10'",
    "black==26.5.1; python_version >= '3.10'",
]
```

Set Black’s targets to the declared runtime versions; do not change runtime dependencies.

- [ ] **Step 3: Extend CI to the lowest supported Python**

Change the matrix to:

```yaml
python-version: ["3.9", "3.10", "3.11", "3.12"]
```

Use `pip install -e ".[test]"` for the runtime regression suite. Add `"tomli>=2; python_version < '3.11'"` to the test extra and change the test import to:

```python
try:
    import tomllib
except ModuleNotFoundError:  # Python 3.9 and 3.10
    import tomli as tomllib
```

- [ ] **Step 4: Verify resolution and runtime suite**

Run:

```bash
uv run --extra dev python -m pytest -q
uv build --wheel
```

Expected: dependency resolution succeeds, all CPU tests pass, and the wheel builds.

- [ ] **Step 5: Verify declared Python 3.9 support**

Run:

```bash
uv run --python 3.9 --extra test python -m pytest -q
```

Expected: collection and tests pass on Python 3.9 through the guarded `tomli` fallback.

- [ ] **Step 6: Commit**

```bash
git add pyproject.toml .github/workflows/ci.yml tests/test_version_metadata.py
git commit -m "fix: keep development metadata Python 3.9 compatible"
```
