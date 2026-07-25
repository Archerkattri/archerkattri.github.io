# Repository Repair Program Design

**Goal:** Repair the confirmed clean-clone defects across Archerkattri's active personal repositories, add honest automated verification where coverage is missing, refresh the portfolio from verified repository state, and publish each verified repository directly to its default branch.

## Scope

The program covers every owned, non-fork repository audited on 2026-07-24 except:

- `benbi`, which Krishi will delete separately.
- `computervisionproj`, which is intentionally excluded.

No commit may add a tool or additional person as author, co-author, or contributor. Every local commit and direct push must use:

- Author name: `Krishi Attri`
- Author email: `krishiattriwork@gmail.com`
- GitHub account: `Archerkattri`

Before each push, report the repository's changes and fresh verification results in chat. Push only commits that pass the repository's applicable local verification.

## Delivery Units

Each repository is an independent delivery unit. A failure in one repository must not delay safe, verified fixes in another. Work proceeds in four batches:

1. Existing test and packaging defects.
2. Missing or misleading automation.
3. Android and external-runtime verification.
4. Portfolio truth-sync.

Repositories retain their existing default branches and project-specific tooling. The program does not impose a single cross-language build system.

## Existing Defect Repairs

### Forge

Make the four CalculiX fixtures required by the release-portability tests reproducible from a clean clone. Prefer deterministic fixture generation from committed inputs. If the upstream source models cannot be distributed, commit the smallest license-compatible fixture artifacts needed by the tests. CI must exercise the CalculiX path when `ccx` is available and clearly report a missing optional solver otherwise.

### Brain

Update `infra/stack` migration and topology tests to assert the current canonical project names, vault paths, indexes, and documentation layout. Do not recreate obsolete Dental, CalibSplat, DriftCert, or RegimeCache paths solely to satisfy stale tests. Preserve provenance and rebuild the unified document index after documentation changes.

### ComfyUI HiCache repositories

For `ComfyUI-HiCache`, `ComfyUI-TRELLIS-HiCache`, and `ComfyUI-TRELLIS2-HiCache`:

- Declare explicit setuptools module discovery so editable installs and wheels build from a clean clone.
- Add a development/test dependency group containing the actual CPU test dependencies.
- Add CI for clean installation, wheel construction, and runtime unit tests.
- Keep heavyweight ComfyUI and model downloads out of unit CI.

For `ComfyUI-TRELLIS2-HiCache`, preserve `None` in guard-then-load lazy slots, retain pending patch configuration across unload/reload, clear pending configuration on removal, and cover those behaviors with regression tests. Implement the behavior independently against the diagnosed root cause.

### MathLAS

Resolve the declared Python support conflict with the pinned Black version. Preserve Python 3.9 support if the runtime code and other dependencies still support it by applying an environment marker or compatible development pin; otherwise raise the declared minimum only with evidence. CI must exercise the lowest declared Python version.

### CERT-FLOW and ToothPrint

Replace brittle hard-coded test totals in user-facing documentation with either current verified counts plus environment qualifiers or commands that state which datasets/extras are required.

For ToothPrint, provide a documented full-test extra and CI jobs that distinguish:

- Core CPU tests.
- API and geometry tests with moderate optional dependencies.
- Torch/Open3D tests when the runner can install them.

A module-level optional dependency skip must be visible in the CI summary so a small skip number cannot conceal many uncollected tests.

### Website

Commit a lockfile so `npm ci` is reproducible. Upgrade vulnerable build tooling to a compatible release, verify a production build and prerender, and keep production dependency audit clean.

### Clyde Android

Update vulnerable JavaScript dependencies without changing agent safety behavior. Keep the 61 safety tests and TypeScript check green.

Align Android documentation and automation with the app's actual JDK 21 and compile SDK 36 requirements. Make `gradlew` executable. Add Android CI that verifies Gradle configuration and available unit/lint tasks without requiring secrets or a proprietary runtime artifact. If the ignored AAR is necessary for compilation, fail with a precise setup message or provide a documented retrieval/build step rather than silently omitting validation.

## Automation for Accelerator Repositories

The following repositories currently have compile/package evidence but insufficient automated behavioral coverage:

- `fast-trellis2`
- `faster-trellis`
- `faster-trellis-plus-plus`
- `fastsam3d-plus`
- `fastsam3d-plus-plus`
- `hermit-trellis2`
- `hermit-trellis2-plus-plus`
- `hunyuan2-plus`
- `hunyuan2-plus-plus`
- `hunyuan2.1-plus`
- `hunyuan2.1-plus-plus`
- `sam3d-plus`
- `sam3d-plus-plus`

Each repository receives the strongest honest CPU-only verification its architecture permits:

- Syntax compilation and package/import checks.
- Unit tests for interpolation, scheduling, patch binding, configuration, and unload/reload behavior using small real tensors or minimal fakes at model boundaries.
- Dependency declarations sufficient to collect the CPU tests from a clean clone.
- A GitHub Actions workflow pinned to supported Python versions.

CI must not download model weights, require a GPU, start a live API server, or label demo scripts as tests. Repositories that are source overlays rather than standalone packages may use a documented compile-and-contract workflow instead of being forced into artificial wheel packaging.

`splatreg` keeps correctness and wall-clock performance checks separate. Parallel correctness jobs use a bounded worker count. Timing budgets run serially on a controlled runner configuration so nested CPU oversubscription cannot create false regressions.

Repositories whose existing automation already verifies their supported contract (`actionabi`, `actionshift`, `aura`, `hicache-plus-plus`, `stepback`, and the profile repository) receive only evidence-based maintenance required by dependency or workflow inspection; no churn for uniformity.

## Portfolio Truth-Sync

Retain the current compass-map visual system, typography, navigation, and prerender architecture. This is a content and evidence refresh, not a redesign.

Update the shared `src/data.js` source to:

- Feature Forge, Stepback, AURA, ActionABI, and ActionShift at an appropriate evidence level.
- Synchronize CERT-FLOW, ToothPrint, MathLAS, splatreg, and HiCache++ versions, test language, links, and benchmark claims with verified repository state.
- Expand the accelerator constellation to the current supported families without turning every adapter into a full project card.
- Preserve GaussianFeels as the flagship and keep the research-first hierarchy.
- Keep the current July 2026 identity line unless the UCF role has actually begun.

Commit `package-lock.json`, run the production build, inspect the prerendered HTML for updated claims, verify legacy routes, and confirm the production dependency audit remains clean.

## Test-Driven Repair Process

For every behavioral defect:

1. Reproduce the failure from a clean checkout.
2. Add or identify the narrow regression test.
3. Observe the regression test fail for the expected reason.
4. Implement the smallest root-cause fix.
5. Run the focused test.
6. Run the repository's full feasible suite, package build, and static checks.

Configuration-only fixes must first reproduce the failing command, such as `uv build`, `npm ci`, workflow collection, or dependency resolution. The same command must pass after the change.

## Push Gate

Before directly pushing a repository:

- The worktree contains no unrelated changes.
- Commit metadata matches Krishi Attri's required identity.
- Commit messages and metadata contain no tool attribution.
- Fresh tests and builds pass for the supported local contract.
- Known GPU, dataset, SDK, solver, or secret limitations are reported explicitly.
- The exact changes and verification evidence have been reported in chat.

After push, inspect the resulting GitHub Actions run. A failed run reopens that repository's repair unit; it is not reported as complete until fixed or explicitly documented as an external limitation.
