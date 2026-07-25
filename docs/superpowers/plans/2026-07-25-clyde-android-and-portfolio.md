# Clyde Android and Portfolio Implementation Plan

> **For Krishi:** Execute each task with verification before committing and pushing directly to the repository's default branch.

**Goal:** Make Clyde's automated checks match its real toolchain and dependency contract, then refresh the portfolio from the verified repository audit.

**Architecture:** Clyde keeps its existing Android/Termux split. JavaScript verification runs independently in `brain/`; Android CI installs JDK 21 and API 36, retrieves the documented Sherpa ONNX AAR, and runs Gradle checks that do not need signing secrets or hardware. The portfolio remains a static Vite site whose project data is updated only from verified repository results.

**Tech Stack:** Android Gradle Plugin, Kotlin, Gradle, Node.js/TypeScript, npm, GitHub Actions, Vite.

---

### Task 1: Repair Clyde's reproducible JavaScript checks

**Files:**
- Modify: `brain/package.json`
- Modify: `brain/package-lock.json`
- Create: `.github/workflows/ci.yml`

**Steps:**
1. Run the existing brain test and typecheck commands to preserve their baseline behavior.
2. Update vulnerable direct/transitive dependencies with the smallest compatible lockfile change.
3. Add a Node CI job using `npm ci`, the complete brain test program, TypeScript checking, and a production dependency audit.
4. Verify the job commands from a clean dependency install.

### Task 2: Align Clyde's Android toolchain and artifact setup

**Files:**
- Modify mode: `gradlew`
- Modify: `scripts/setup-android-toolchain.sh`
- Inspect/modify: `scripts/fetch-sherpa-aar.sh`
- Modify: `.github/workflows/ci.yml`
- Modify documentation only where commands or versions are stale.

**Steps:**
1. Make the Gradle wrapper executable.
2. Update the portable setup script to JDK 21, Android platform 36, and compatible build tools.
3. Ensure the Sherpa AAR retrieval script validates the expected output rather than leaving an opaque missing-file failure.
4. Add an Android CI job with JDK 21, API 36, cached Gradle state, explicit AAR retrieval, and non-secret Gradle verification.
5. Run every locally available Gradle configuration/build check; record any external SDK limitation precisely.

### Task 3: Refresh portfolio dependencies and verified content

**Files:**
- Modify: `package.json`
- Create/modify: `package-lock.json`
- Modify: `src/data.js`
- Modify tests or prerender configuration only if required by the dependency upgrade.

**Steps:**
1. Upgrade vulnerable Vite/build dependencies within the current site architecture.
2. Generate and commit the lockfile so CI can use `npm ci`.
3. Update project status, test counts, and highlighted projects from the completed repository audit.
4. Keep claims bounded to verified CPU/package/build evidence; do not claim GPU/model validation where none ran.
5. Run production audit, tests, build, prerender, and link/content checks.

### Task 4: Publish and confirm

**Steps:**
1. Review diffs and author metadata for only `Krishi Attri <krishiattriwork@gmail.com>`.
2. Report exact Clyde and portfolio changes and verification results in chat.
3. Commit and push each repository directly to its default branch.
4. Monitor the new GitHub Actions runs and correct any repository-caused failures.
