# Build Verification Results — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S5 (build verification)
dispatched_as: S3 task header (operator dispatch — re-run after asset reconstruction)
worker: worker_a
overall_result: **FAIL**
failing_step: build (both `build:engage` sub-step and downstream direct `npx vite build` probe)
runbook: /job_site/build_verification_runbook.md
run_timestamp: 2026-04-15 (attached file system)
prior_state: branch claude/create-missing-assets-epdo4 includes the S3 asset reconstruction pass that landed `apps/product-shell/src/styles/`, `apps/product-shell/src/state/demoGateState.tsx`, and `apps/product-shell/src/mobile/` (see `/job_site/deploy_surface_change_manifest.md` §11).

---

## 1. Summary

| step | command | working dir | exit code | result |
|---|---|---|---|---|
| 1 | `cd /home/user/gateway-fullbody-freeze/apps/product-shell` | n/a | 0 | PASS |
| 2 | `npm install --no-audit --no-fund` | `/home/user/gateway-fullbody-freeze/apps/product-shell` | 0 | PASS |
| 3a | `npm run build` → `npm run build:engage` → `npm --prefix ../modules/engage install` | `/home/user/gateway-fullbody-freeze/apps/product-shell` | 254 (ENOENT) | FAIL |
| 3b | `npx vite build` (direct, bypassing `build:engage`) | `/home/user/gateway-fullbody-freeze/apps/product-shell` | 1 (Rollup resolve error) | FAIL |
| 4 | verify `apps/product-shell/dist` exists with `index.html` + `_redirects` | n/a | n/a | FAIL (no dist produced) |
| 5 | cleanup `node_modules`, `dist`, `package-lock.json`, stray `apps/modules/` | repo root | 0 | PASS |

---

## 2. Step 1 — cd to declared deploy root

Command:

```
cd /home/user/gateway-fullbody-freeze/apps/product-shell
```

Result: OK. Directory exists. Contents at entry:

```
functions
index.html
package.json
public
src
tsconfig.json
tsconfig.node.json
vite.config.ts
```

(Files created by the S3 deploy app surface pass, S4 runtime support pass,
and the S3 asset reconstruction pass on branch
`claude/create-missing-assets-epdo4`.)

---

## 3. Step 2 — npm install

Command:

```
npm install --no-audit --no-fund
```

Working directory: `/home/user/gateway-fullbody-freeze/apps/product-shell`

Result: PASS.

stdout (verbatim):

```
added 70 packages in 9s

npm notice
npm notice New major version of npm available! 10.9.7 -> 11.12.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.12.1
npm notice To update run: npm install -g npm@11.12.1
npm notice
```

Exit code: 0.
Packages installed: 70 (react, react-dom, react-router-dom, typescript,
vite, @vitejs/plugin-react, their transitive deps).
Declared `dependencies` and `devDependencies` from
`apps/product-shell/package.json` resolved without conflict.

---

## 4. Step 3a — npm run build (primary path)

Command:

```
npm run build
```

Working directory: `/home/user/gateway-fullbody-freeze/apps/product-shell`

Resolves to:

```
npm run build:engage && vite build
```

Which resolves to:

```
npm --prefix ../modules/engage install --progress=false
  && npm --prefix ../modules/engage run build
  && vite build
```

With working directory `/home/user/gateway-fullbody-freeze/apps/product-shell`,
`../modules/engage` = `/home/user/gateway-fullbody-freeze/apps/modules/engage`.

Result: **FAIL** at the `build:engage` sub-step.

stdout/stderr (verbatim):

```
> gateway-demo-zero@0.0.0 build
> npm run build:engage && vite build


> gateway-demo-zero@0.0.0 build:engage
> npm --prefix ../modules/engage install --progress=false && npm --prefix ../modules/engage run build

npm error code ENOENT
npm error syscall open
npm error path /home/user/gateway-fullbody-freeze/apps/modules/engage/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/user/gateway-fullbody-freeze/apps/modules/engage/package.json'
npm error enoent This is related to npm not being able to find a file.
npm error enoent
npm error A complete log of this run can be found in: /root/.npm/_logs/2026-04-15T21_59_27_535Z-debug-0.log
```

Exit code: 254. The `&& vite build` suffix is never reached.

Root cause: the baseline `product-shell/package.json` uses
`npm --prefix ../modules/engage ...`, which relative to
`apps/product-shell/` resolves to `apps/modules/engage/`. No such directory
exists in the current tree. The module package rebuild pass is out of scope
per the S3 deploy app surface pass (see `/job_site/deploy_surface_change_manifest.md` §6)
and the S4 runtime support pass (see `/job_site/runtime_support_change_manifest.md` §6.6).

---

## 5. Step 3b — direct vite build (secondary probe)

To determine whether post-engage `vite build` would succeed independently,
a secondary probe was run:

Command:

```
npx vite build
```

Working directory: `/home/user/gateway-fullbody-freeze/apps/product-shell`

Result: **FAIL** at module graph resolution.

stdout/stderr (verbatim):

```
vite v5.4.21 building for production...
transforming...
✓ 13 modules transformed.
x Build failed in 205ms
error during build:
Could not resolve "../pages/HomePage" from "src/app/router.tsx"
file: /home/user/gateway-fullbody-freeze/apps/product-shell/src/app/router.tsx
    at getRollupError (file:///home/user/gateway-fullbody-freeze/apps/product-shell/node_modules/rollup/dist/es/shared/parseAst.js:406:41)
    at error (file:///home/user/gateway-fullbody-freeze/apps/product-shell/node_modules/rollup/dist/es/shared/parseAst.js:402:42)
    at ModuleLoader.handleInvalidResolvedId (file:///home/user/gateway-fullbody-freeze/apps/product-shell/node_modules/rollup/dist/es/shared/node-entry.js:22106:24)
    at file:///home/user/gateway-fullbody-freeze/apps/product-shell/node_modules/rollup/dist/es/shared/node-entry.js:22066:26
```

Exit code: 1.

### 5.1 Comparison to prior run (delta evidence)

The prior S5 run (recorded before the asset reconstruction pass) reported:

```
✓ 3 modules transformed.
error during build:
Could not resolve "./styles/global.css" from "src/main.tsx"
```

This run reports:

```
✓ 13 modules transformed.
error during build:
Could not resolve "../pages/HomePage" from "src/app/router.tsx"
```

Delta:

- modules transformed advanced 3 → 13 (10 additional modules entered the
  Rollup graph: 8 CSS files under `src/styles/`, 1 TSX state file
  `src/state/demoGateState.tsx`, and 1 CSS file
  `src/mobile/styles/mobile-overlay.css`).
- The failing import is no longer in `src/main.tsx` (all 10 of its
  previously-missing imports now resolve). The first unresolved import has
  moved one hop deeper into the module graph, into `src/app/router.tsx`.
- The S3 asset reconstruction pass on branch `claude/create-missing-assets-epdo4`
  is therefore confirmed effective: every direct import out of `src/main.tsx`
  resolves and the `src/styles/`, `src/state/`, `src/mobile/` cascade is
  closed. The remaining cascade is the deferred `src/pages/`, `src/features/`,
  `src/components/`, `src/hooks/`, `src/integrations/`, `src/config/`,
  `src/contracts/`, `src/utils/` subtree still classified `missing` in
  `/job_site/missing_surface_matrix.yaml`.

### 5.2 Root cause

`apps/product-shell/src/app/router.tsx` imports from `../pages/HomePage` (and
sibling page modules), and transitively from `../features/*`, `../components/*`,
`../hooks/*`, `../integrations/*`, `../config/*`, `../contracts/*`, `../utils/*`.
None of these subtrees exist in the current tree. They are declared `missing`
in `/job_site/missing_surface_matrix.yaml` and were deferred by the S3 deploy
app surface pass (see `/job_site/deploy_surface_change_manifest.md` §6 and §11.7).

---

## 6. Step 4 — output directory verification

Expected:

```
apps/product-shell/dist/
  index.html
  _redirects
  assets/...
```

Actual: directory not produced. Both Step 3a and Step 3b failed before any
Rollup output bundling. No `dist/` was written.

Result: FAIL.

---

## 7. Step 5 — cleanup

Commands executed:

```
rm -rf apps/product-shell/node_modules
rm -rf apps/product-shell/dist
rm -f  apps/product-shell/package-lock.json
rm -rf apps/modules
```

Result: PASS. Working tree returned to its pre-install state. `git status`
post-cleanup showed no untracked files from the install or build attempts:

```
On branch claude/create-missing-assets-epdo4
Your branch is up to date with 'origin/claude/create-missing-assets-epdo4'.

nothing to commit, working tree clean
```

---

## 8. Pass/Fail Classification

Per runbook §4, overall result is **FAIL** because:

- Step 3a exits non-zero (254) at `build:engage` (missing `apps/modules/engage/`).
- Step 3b exits non-zero (1) at Rollup module resolution (missing `src/pages/*`
  reachable from `src/app/router.tsx`).
- Step 4 cannot be satisfied (no `dist/` produced).

The S3 asset reconstruction pass on branch `claude/create-missing-assets-epdo4`
moved the failing edge of the module graph from `src/main.tsx` (10 missing
direct imports) to `src/app/router.tsx` (first missing import: `../pages/HomePage`).
The build is therefore measurably closer to success but still FAIL until the
remaining deferred subtrees are reconstructed.

---

## 9. Required Remediation (outside this S5 verification step)

The following rebuild work is required before a re-run can succeed. Each
item is already classified `missing` in
`/job_site/missing_surface_matrix.yaml` and was explicitly deferred by the
S3 deploy app surface pass and S4 runtime support pass. None of these items
is closed by the current branch.

### 9.1 Deploy-root-internal deferred work (still missing)

- `apps/product-shell/src/pages/` (11 files: AccessPage, AccessTier1/2/3Page, AdminPage, EngagePage, HomePage, MembersPage, PayMePage, ReferralsPage, SkinMarketplacePage)
- `apps/product-shell/src/components/` (entire subtree, 23 files)
- `apps/product-shell/src/features/` (entire subtree: engage, marketplace, payme, referrals)
- `apps/product-shell/src/hooks/` (usePublishedExclusiveTiles.ts, useViewportMode.ts)
- `apps/product-shell/src/integrations/spine/` (bridge.ts, index.ts, registry.ts, types.ts)
- `apps/product-shell/src/config/` (nav.config.ts, pageBackgrounds.ts, staticPageAssets.ts)
- `apps/product-shell/src/contracts/microfrontend.ts`
- `apps/product-shell/src/utils/` (assetCodeResolver.ts, resolveStaticAsset.ts, resolveWallpaper.ts, tenantPageClient.ts, usdc.ts)
- `apps/product-shell/public/` (full asset tree: ads, apps, demo, wallpapers, and root-level `drip.png`)

### 9.2 Deploy-root-internal already-closed work (this branch)

The following items appear in prior remediation lists but ARE present after
the S3 asset reconstruction pass on branch `claude/create-missing-assets-epdo4`:

- `apps/product-shell/src/state/demoGateState.tsx` — present
- `apps/product-shell/src/styles/admin.css` — present
- `apps/product-shell/src/styles/cards.css` — present
- `apps/product-shell/src/styles/gate.css` — present
- `apps/product-shell/src/styles/global.css` — present
- `apps/product-shell/src/styles/marketplace.css` — present
- `apps/product-shell/src/styles/nav.css` — present
- `apps/product-shell/src/styles/published-overlay.css` — present
- `apps/product-shell/src/styles/shell.css` — present
- `apps/product-shell/src/mobile/styles/mobile-overlay.css` — present

### 9.3 Sibling module package required by `build:engage`

- `apps/modules/engage/package.json`
- `apps/modules/engage/index.html`
- `apps/modules/engage/vite.config.js`
- `apps/modules/engage/src/` (full subtree)
- `apps/modules/engage/public/_redirects`

Target path is the sibling of `apps/product-shell/` per the verbatim
baseline `../modules/engage` script reference. Placement under
`apps/modules/engage/` preserves the relative path without a script change.
Alternative: modify the `build:engage` script to point to a different
location, which is a baseline divergence and requires Factory Control
Interface adjudication.

### 9.4 Reference conflict (Factory Control Interface action)

`/job_site/pages_deployment_spec.md` §1 declares
`deploy_root_path = /` (repo root), which directly conflicts with
`/job_site/deploy_root_plan.md` §1 and the S2
`/job_site/full_parity_target_path_manifest.yaml` (both declare
`apps/product-shell`). Must be reconciled before S5 can produce a PASS.

---

## 10. Output Directory Declaration

| field | value | source |
|---|---|---|
| working directory | `/home/user/gateway-fullbody-freeze/apps/product-shell` | runbook §3 Step 1 |
| install command | `npm install --no-audit --no-fund` | runbook §3 Step 2 |
| build command | `npm run build` | runbook §3 Step 3 |
| expected output directory | `apps/product-shell/dist` | `/job_site/pages_deployment_spec.md` §3 (parameterized) + deploy_root_plan.md §1 deploy root |
| actual output directory | (not produced) | this run |
| final result | **FAIL** | this run |

---

## 11. Checksum Pointers for Foreman B

- Every command executed in this run is recorded verbatim in §2–§7.
- Every command exit code is recorded verbatim in §1 and §3–§5.
- Every error message is captured verbatim in §4 and §5.
- Working directory is recorded verbatim alongside every command in §1, §3, §4, §5.
- Cleanup was performed; `git status` post-run showed no stray artifacts.
- No repo write was performed under `apps/` or `packages/` by this step.
- Writes confined to `/job_site/build_verification_runbook.md` and
  `/job_site/build_verification_results.md` per task dispatch
  `repo_mirror_required: no`, `commit_required: no`, `push_required: no`.
- Overall result: **FAIL**. The module-graph failing edge has measurably
  advanced from `src/main.tsx` to `src/app/router.tsx → ../pages/*` after
  the S3 asset reconstruction pass; remediation scope in §9 matches the
  remaining deferred work from S3 and S4.

---

## 12. Appended Install-Only Step (operator dispatch — install-only re-run)

Task dispatch: run ONLY dependency installation from `apps/product-shell`.
Build step NOT executed in this sub-run.

| field | value |
|---|---|
| working directory | `/home/user/gateway-fullbody-freeze/apps/product-shell` |
| command | `npm install --no-audit --no-fund` |
| exit code | 0 |
| run branch | `claude/rebuild-product-shell-KIQNp` |
| build executed | no |

---

## 13. Appended build:engage-Only Step (operator dispatch — build:engage-only re-run)

Task dispatch: run ONLY `npm run build:engage` from `apps/product-shell`.
Full build and direct `vite build` of `apps/product-shell` NOT executed in
this sub-run.

| field | value |
|---|---|
| working directory | `/home/user/gateway-fullbody-freeze/apps/product-shell` |
| command | `npm run build:engage` |
| resolved script | `npm --prefix ../modules/engage install --progress=false && npm --prefix ../modules/engage run build` |
| exit code | 0 |
| primary error line | (none — step completed; engage `vite build` produced `../../public/apps/engage/{index.html,assets/index-*.css,assets/index-*.js}` and exited 0 with `✓ 5569 modules transformed`) |
| run branch | `claude/rebuild-product-shell-KIQNp` |
| product-shell vite build executed | no |

---

## 14. Appended vite-build-Only Step (operator dispatch — npx vite build re-run)

Task dispatch: run ONLY `npx vite build` from `apps/product-shell`. No other
commands executed (no `npm install`, no `npm run build:engage`).

| field | value |
|---|---|
| working directory | `/home/user/gateway-fullbody-freeze/apps/product-shell` |
| command | `npx vite build` |
| exit code | 1 |
| first error line | `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite' imported from /home/user/gateway-fullbody-freeze/apps/product-shell/vite.config.ts.timestamp-*.mjs` |
| precursor warnings | `[UNRESOLVED_IMPORT] Could not resolve 'vite' in vite.config.ts`; `[UNRESOLVED_IMPORT] Could not resolve '@vitejs/plugin-react' in vite.config.ts`; `failed to load config from /home/user/gateway-fullbody-freeze/apps/product-shell/vite.config.ts` |
| npx cache note | `npm warn exec The following package was not found and will be installed: vite@8.0.8` — npx auto-fetched `vite@8.0.8` into its cache because `apps/product-shell/node_modules/` was absent at step start; the fetched global-cache vite could not load `vite.config.ts` because `@vitejs/plugin-react` (devDependency of `apps/product-shell`) is not installed and because `vite.config.ts` itself imports `vite` from the local package graph, not the npx cache. |
| reached module graph transform | no — failure occurred at config-load time, before Rollup entered `src/` |
| run branch | `claude/rebuild-product-shell-KIQNp` |
| product-shell install executed | no (prerequisite was intentionally skipped per dispatch "Do not run any other commands") |

---

## 15. Appended Corrected vite-build Step (operator dispatch — resolve vite, re-run npx vite build)

Task dispatch: ensure vite is resolvable for `apps/product-shell` build
context (install or link deps so `vite.config.ts` can load), then run ONLY
`npx vite build` and record the corrected result.

### 15.1 Dependency resolution step

| field | value |
|---|---|
| working directory | `/home/user/gateway-fullbody-freeze/apps/product-shell` |
| command | `npm install --no-audit --no-fund` |
| purpose | make `vite@^5.4.2` and `@vitejs/plugin-react@^4.3.1` resolvable inside `apps/product-shell/node_modules/` so `vite.config.ts` can load |
| stdout (verbatim) | `added 70 packages in 9s` |
| exit code | 0 |

### 15.2 Corrected vite build step

| field | value |
|---|---|
| working directory | `/home/user/gateway-fullbody-freeze/apps/product-shell` |
| command | `npx vite build` |
| resolved vite | `vite v5.4.21` (from local `apps/product-shell/node_modules/vite/`, not the npx cache vite@8.0.8) |
| config loaded | yes — no `UNRESOLVED_IMPORT` warnings; no `failed to load config` error |
| modules transformed | 32 |
| exit code | 1 |
| first error line | `Could not resolve "../components/nav/TopNav" from "src/app/AppShell.tsx"` |
| failing file | `/home/user/gateway-fullbody-freeze/apps/product-shell/src/app/AppShell.tsx` |
| reached module graph transform | yes — Rollup entered `src/`, transformed 32 modules, then halted at the first unresolved import |
| dist produced | no |
| run branch | `claude/rebuild-product-shell-KIQNp` |

### 15.3 Delta from §5 (prior vite-direct probe on branch `claude/create-missing-assets-epdo4`)

| item | prior run (§5) | this run (§15.2) |
|---|---|---|
| modules transformed | 13 | 32 |
| first unresolved import | `../pages/HomePage` from `src/app/router.tsx` | `../components/nav/TopNav` from `src/app/AppShell.tsx` |

Delta: the 11 page modules under `apps/product-shell/src/pages/` (committed
in `c9c7454` "S3 route reconstruction: product-shell src/pages/") now resolve,
advancing the module graph by 19 modules (11 pages + their CSS/state/mobile
siblings already reached in the prior run). The failing edge has moved one
hop sideways from `src/app/router.tsx → ../pages/*` to
`src/app/AppShell.tsx → ../components/nav/TopNav`. The
`apps/product-shell/src/components/` subtree does not exist and is still
classified `missing` in `/job_site/missing_surface_matrix.yaml`.

### 15.4 Cleanup

| command | working dir | exit code |
|---|---|---|
| `rm -rf apps/product-shell/node_modules apps/product-shell/package-lock.json` | repo root | 0 |

`git status` post-cleanup: clean (only the appended results edit pending).

---

## 16. Appended vite-build-Only Step (S3 dispatch — next-edge probe after payme reconstruction)

Task dispatch: run ONLY `npx vite build` from `apps/product-shell` to identify
next missing import edge after payme subtree reconstruction.

| field | value |
|---|---|
| working directory | `/workspace/gateway-fullbody-freeze/apps/product-shell` |
| command | `npx vite build` |
| exit code | 1 |
| first error line | `npm error 403 403 Forbidden - GET https://registry.npmjs.org/vite` |
| reached vite config load | no |
| reached Rollup module graph | no |
| observed missing-import edge | unavailable in this run (blocked before vite resolution) |
| run branch | `work` |

Notes:
- Environment policy blocked npm registry fetch for `vite`, so this probe
  could not advance to import-resolution diagnostics in `src/**`.
- Because module-graph diagnostics were unavailable, feature-subtree selection
  for reconstruction was anchored to the last recorded in-repo failing feature
  edge documented in `job_site/deploy_surface_change_manifest.md` §15.3:
  `src/pages/SkinMarketplacePage.tsx -> ../features/marketplace/pages/MarketplacePage`.

---

## 17. Appended static import-edge detection (S3.2 fallback dispatch)

Task dispatch: perform STATIC import scan only across `src/app/`, `src/pages/`,
and `src/features/` to identify the first unresolved relative import path.

| field | value |
|---|---|
| method | static source scan (no npm, no vite) |
| scanned roots | `apps/product-shell/src/app/`, `apps/product-shell/src/pages/`, `apps/product-shell/src/features/` |
| file traversal order | lexical (`app/` then `pages/` then `features/`; files sorted) |
| import traversal order | top-to-bottom line order per file |
| first unresolved import | `../components/gate/RequireGate` |
| source file | `apps/product-shell/src/app/router.tsx` |
| source line | 17 |
| resolved target path attempted | `apps/product-shell/src/components/gate/RequireGate.{ts,tsx,js,jsx}` and `apps/product-shell/src/components/gate/RequireGate/index.{ts,tsx,js,jsx}` |
| detection result | missing target file (first unresolved static edge) |

Notes:
- This fallback run intentionally did not execute any build/install command.
- Result is suitable for next controlled subtree reconstruction dispatch.

---

## 18. Appended static import-edge detection (S3.4 fallback dispatch)

Task dispatch: perform STATIC import scan across `src/app/`, `src/pages/`,
`src/features/`, and `src/components/` to identify the next unresolved relative
import path after gate subtree reconstruction.

| field | value |
|---|---|
| method | static source scan (no npm, no vite) |
| scanned roots | `apps/product-shell/src/app/`, `apps/product-shell/src/pages/`, `apps/product-shell/src/features/`, `apps/product-shell/src/components/` |
| file traversal order | lexical (`app/` → `pages/` → `features/` → `components/`; files sorted) |
| import traversal order | top-to-bottom line order per file (commented lines ignored) |
| first unresolved import | `../utils/usdc` |
| source file | `apps/product-shell/src/pages/AccessTier2Page.tsx` |
| source line | 6 |
| resolved target path attempted | `apps/product-shell/src/utils/usdc.{ts,tsx,js,jsx}` and `apps/product-shell/src/utils/usdc/index.{ts,tsx,js,jsx}` |
| detection result | missing target file (next unresolved static edge) |

Notes:
- This fallback run intentionally did not execute any build/install command.
- Result is suitable for the next controlled reconstruction dispatch.

---

## 19. Appended static import-edge detection (S3.6 fallback dispatch)

Task dispatch: perform STATIC import scan across `src/app/`, `src/pages/`,
`src/features/`, `src/components/`, and `src/utils/` to identify the next
unresolved relative import path after utils subtree reconstruction.

| field | value |
|---|---|
| method | static source scan (no npm, no vite) |
| scanned roots | `apps/product-shell/src/app/`, `apps/product-shell/src/pages/`, `apps/product-shell/src/features/`, `apps/product-shell/src/components/`, `apps/product-shell/src/utils/` |
| file traversal order | lexical (`app/` → `pages/` → `features/` → `components/` → `utils/`; files sorted) |
| import traversal order | top-to-bottom line order per file (commented lines ignored) |
| first unresolved import | `../hooks/usePublishedExclusiveTiles` |
| source file | `apps/product-shell/src/pages/AccessTier2Page.tsx` |
| source line | 7 |
| resolved target path attempted | `apps/product-shell/src/hooks/usePublishedExclusiveTiles.{ts,tsx,js,jsx}` and `apps/product-shell/src/hooks/usePublishedExclusiveTiles/index.{ts,tsx,js,jsx}` |
| detection result | missing target file (next unresolved static edge) |

Notes:
- This fallback run intentionally did not execute any build/install command.
- Result is suitable for the next controlled reconstruction dispatch.
