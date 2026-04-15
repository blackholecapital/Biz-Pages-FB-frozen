# Build Verification Results — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S5 (build verification)
dispatched_as: S3 task header
worker: worker_a
overall_result: **FAIL**
failing_step: build (both `build:engage` sub-step and downstream `vite build`)
runbook: /job_site/build_verification_runbook.md
run_timestamp: 2026-04-15 (attached file system)

---

## 1. Summary

| step | command | exit code | result |
|---|---|---|---|
| 1 | `cd /home/user/gateway-fullbody-freeze/apps/product-shell` | 0 | PASS |
| 2 | `npm install --no-audit --no-fund` | 0 | PASS |
| 3a | `npm run build` → `npm run build:engage` → `npm --prefix ../modules/engage install` | non-zero (ENOENT) | FAIL |
| 3b | `npx vite build` (direct, bypassing `build:engage`) | non-zero (Rollup resolve error) | FAIL |
| 4 | verify `apps/product-shell/dist` exists with `index.html` + `_redirects` | n/a | FAIL (no dist produced) |
| 5 | cleanup `node_modules`, `package-lock.json`, stray `apps/modules/` | 0 | PASS |

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

(Files created by S3 deploy app surface pass and S4 runtime support pass.)

---

## 3. Step 2 — npm install

Command:

```
npm install --no-audit --no-fund
```

Result: PASS.

stdout (tail):

```
added 70 packages in 8s
npm notice New major version of npm available! 10.9.7 -> 11.12.1
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
```

Exit code: non-zero. The `&& vite build` suffix is never reached.

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

Result: **FAIL** at module graph resolution.

stderr (verbatim):

```
vite v5.4.21 building for production...
transforming...
✓ 3 modules transformed.
x Build failed in 92ms
error during build:
Could not resolve "./styles/global.css" from "src/main.tsx"
file: /home/user/gateway-fullbody-freeze/apps/product-shell/src/main.tsx
```

Exit code: non-zero.

Root cause: `apps/product-shell/src/main.tsx` imports the following
modules that do NOT yet exist in the tree:

```
import { router } from "./app/router";              # PRESENT (S3)
import { DemoGateProvider } from "./state/demoGateState";  # MISSING
import "./styles/global.css";                        # MISSING
import "./styles/shell.css";                         # MISSING
import "./styles/nav.css";                           # MISSING
import "./styles/cards.css";                         # MISSING
import "./styles/gate.css";                          # MISSING
import "./styles/admin.css";                         # MISSING
import "./styles/marketplace.css";                   # MISSING
import "./styles/published-overlay.css";             # MISSING
import "./mobile/styles/mobile-overlay.css";         # MISSING
```

All 10 missing sibling surfaces under `apps/product-shell/src/` are
declared `missing` in `/job_site/missing_surface_matrix.yaml` but were
deferred by the S3 deploy app surface pass scope lock (see
`/job_site/deploy_surface_change_manifest.md` §6 Out-of-Scope).

The cascade continues through `src/app/router.tsx` → `src/app/routes.ts`
which import from `../pages/*`, `../features/*`, `../components/*` — all
also deferred.

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
rm -f  apps/product-shell/package-lock.json
rm -rf apps/modules
```

Result: PASS. Working tree returned to its pre-install state. `git status`
post-cleanup showed no untracked files from the install or build attempts.

---

## 8. Pass/Fail Classification

Per runbook §4, overall result is **FAIL** because:

- Step 3a exits non-zero at `build:engage` (missing `apps/modules/engage/`).
- Step 3b exits non-zero at Rollup module resolution (missing `src/styles/*`,
  `src/state/*`, `src/mobile/*` in the deploy root).
- Step 4 cannot be satisfied (no `dist/` produced).

---

## 9. Required Remediation (outside this S5 verification step)

The following rebuild work is required before a re-run can succeed. Each
item is already classified `missing` in
`/job_site/missing_surface_matrix.yaml` and was explicitly deferred by the
S3 and S4 scope locks:

### 9.1 Deploy-root-internal deferred work

- `apps/product-shell/src/state/demoGateState.tsx`
- `apps/product-shell/src/styles/admin.css`
- `apps/product-shell/src/styles/cards.css`
- `apps/product-shell/src/styles/gate.css`
- `apps/product-shell/src/styles/global.css`
- `apps/product-shell/src/styles/marketplace.css`
- `apps/product-shell/src/styles/nav.css`
- `apps/product-shell/src/styles/published-overlay.css`
- `apps/product-shell/src/styles/shell.css`
- `apps/product-shell/src/mobile/styles/mobile-overlay.css`
- `apps/product-shell/src/components/` (entire subtree, 23 files)
- `apps/product-shell/src/features/` (entire subtree)
- `apps/product-shell/src/pages/` (11 files)
- `apps/product-shell/src/hooks/`
- `apps/product-shell/src/integrations/spine/`
- `apps/product-shell/src/config/`
- `apps/product-shell/src/contracts/microfrontend.ts`
- `apps/product-shell/src/utils/`
- `apps/product-shell/public/` (full asset tree: ads, apps, demo, wallpapers,
  and root-level `drip.png`)

### 9.2 Sibling module package required by `build:engage`

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

### 9.3 Reference conflict (Factory Control Interface action)

`/job_site/pages_deployment_spec.md` §1 declares
`deploy_root_path = /` (repo root), which directly conflicts with
`/job_site/deploy_root_plan.md` §1 and the S2
`/job_site/full_parity_target_path_manifest.yaml` (both declare
`apps/product-shell`). Must be reconciled before S5 can produce a PASS.

---

## 10. Checksum Pointers for Foreman B

- Every command executed in this run is recorded verbatim in §3–§5.
- Every command exit code is recorded verbatim in §1 and §3–§5.
- Every error message is captured verbatim in §4 and §5.
- Cleanup was performed; `git status` post-run showed no stray artifacts.
- No repo write was performed under `apps/` or `packages/` by this step.
- Writes confined to `/job_site/build_verification_runbook.md` and
  `/job_site/build_verification_results.md` per task dispatch
  `repo_mirror_required: no`, `commit_required: no`, `push_required: no`.
- Overall result: **FAIL**. Remediation scope is documented in §9 and
  matches the already-declared deferred work from S3 and S4.
