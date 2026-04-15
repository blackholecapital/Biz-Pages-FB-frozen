# Pages Readiness Matrix — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S3 (re-evaluation)
owner: Worker B
authority: non-authoritative — derived from /job_site/pages_deployment_spec.md, /job_site/deploy_root_plan.md, /job_site/full_parity_target_path_manifest.yaml, and live tree inspection at `/home/user/gateway-fullbody-freeze`
document_role: Record PASS/FAIL verdict for each Cloudflare Pages deployment readiness criterion against the current tree state. This document overwrites the prior S5 readiness matrix and records current results only.

---

## 0. Evaluation Basis

- **Live tree:** `/home/user/gateway-fullbody-freeze` at HEAD of branch `claude/reconstruct-engage-modules-OdQZM` (commit 5e44c61).
- **Declared deploy root (authoritative per S2 Worker A):** `apps/product-shell` — from `/job_site/deploy_root_plan.md` §1 and `/job_site/full_parity_target_path_manifest.yaml` §scope_lock.
- **Pages deployment spec conflict note:** `/job_site/pages_deployment_spec.md` (S2 Worker B deploy-app pass) declares deploy root as `/` (repo root). This still conflicts with `/job_site/deploy_root_plan.md` and `full_parity_target_path_manifest.yaml` which both declare `apps/product-shell`. Resolution: `deploy_root_plan.md` + `full_parity_target_path_manifest.yaml` are treated as authoritative (two authorities vs one) for verification; the `pages_deployment_spec.md` divergence is retained as an unresolved HIGH item in `/job_site/patch_register.md` §3.

---

## 1. Status Legend

| Verdict | Meaning |
|---|---|
| PASS | declared surface exists at the declared path with content matching the declared shape |
| FAIL | declared surface does not exist at the declared path OR content does not match the declared shape |
| BLOCKED | prerequisite declared surface is itself FAIL, so the dependent criterion cannot be evaluated positively |
| N/A | criterion is not in scope for this run |

---

## 2. Cloudflare Pages Readiness Criteria

| # | Criterion | Declared value (authoritative source) | Current tree state | Verdict |
|---|---|---|---|---|
| 2.1 | Deploy root exists as a directory | `apps/product-shell` (deploy_root_plan.md §1) | `apps/product-shell/` exists on disk | PASS |
| 2.2 | Package manifest at deploy root | `apps/product-shell/package.json` with `name: gateway-demo-zero`, scripts `{dev, build, preview, build:engage, test, test:pass5, typecheck}`, dependencies `{react, react-dom, react-router-dom}`, devDependencies `{@types/react, @types/react-dom, @vitejs/plugin-react, typescript, vite}` (full_parity_target_path_manifest.yaml §SECTION 1) | file exists; `name: gateway-demo-zero`; all 7 scripts present; dependencies and devDependencies match declared shape | PASS |
| 2.3 | Install command resolves | `npm install` from `apps/product-shell/` (deploy_root_plan.md §4) | prerequisites 2.1 + 2.2 PASS; install command is statically resolvable (not actually executed in this S3 re-evaluation — execution is an S5 worker_a concern) | PASS (static resolvability) |
| 2.4 | Build command resolves | `npm run build` → `npm run build:engage && vite build` from `apps/product-shell/` (deploy_root_plan.md §4) | `build:engage` precondition (`../modules/engage/package.json` = `apps/modules/engage/package.json`) now exists (see 2.8). However `vite build` would fail because `apps/product-shell/src/main.tsx` imports from non-existent `./styles/*`, `./mobile/styles/*`, `./state/demoGateState`, and `./components/*` (via `src/app/AppShell.tsx → ../components/nav/TopNav`). See §3 root cause. | FAIL |
| 2.5 | Output directory | `apps/product-shell/dist` (deploy_root_plan.md §4) | cannot exist until build runs; build is FAIL (2.4) | BLOCKED |
| 2.6 | Vite build config | `apps/product-shell/vite.config.ts` declaring `plugins: [react()], server: { port: 5173 }` (full_parity_target_path_manifest.yaml §SECTION 3) | file exists (161 bytes); declares `plugins: [react()]` and `server: { port: 5173 }` exactly as declared | PASS |
| 2.7 | TypeScript configs | `apps/product-shell/tsconfig.json` + `apps/product-shell/tsconfig.node.json` (full_parity_target_path_manifest.yaml §SECTION 3) | both files exist (398 + 213 bytes) with baseline-declared content | PASS |
| 2.8 | Baseline sibling module graph | `apps/modules/engage/` with `package.json`, `vite.config.js`, `index.html`, `src/`, `public/_redirects`, `package-lock.json` (full_parity_target_path_manifest.yaml §SECTION 7) | `apps/modules/engage/` reconstructed by S3 Worker B engage pass (commit 5e44c61): `package.json` (693 B), `package-lock.json` (371258 B), `vite.config.js` (344 B), `index.html` (407 B), `public/_redirects` (19 B), `src/` subtree (26 files). All 31 files byte-equal to baseline. Sibling modules `apps/modules/payme/`, `apps/modules/referrals/`, `apps/modules/vault/` remain MISSING — not dispatched to this worker. | PARTIAL PASS (engage only) |
| 2.9 | Redirects file | `apps/product-shell/public/_redirects` with canonical rules including `/apps/{payme,engage,referrals,vault}/*` fallthrough and SPA fallback `/*  /index.html  200` (full_parity_target_path_manifest.yaml §SECTION 5) | file exists (214 bytes) with the four microfrontend fallthrough rules + SPA fallback, matching declared shape | PASS |
| 2.10 | Public assets directory | `apps/product-shell/public/` (full_parity_target_path_manifest.yaml §SECTION 5) | directory exists (contains `_redirects`); full asset tree (ads/, apps/, demo/, wallpapers/, drip.png) is deferred per scope_lock | PASS (directory shape) / deferred beyond §5.1 |
| 2.11 | Pages Functions directory | `apps/product-shell/functions/` (full_parity_target_path_manifest.yaml §SECTION 6) | directory exists with `api/` and `_lib/` subdirectories | PASS |
| 2.12 | Pages Functions `api/` subdir with 5 handlers | `apps/product-shell/functions/api/{microfrontend-bootstrap, microfrontend-trust-log, page, published-manifest, published-page}.js` (full_parity_target_path_manifest.yaml §SECTION 6) | all 5 files exist | PASS |
| 2.13 | Pages Functions `_lib/` subdir with 3 helpers | `apps/product-shell/functions/_lib/{runtime-compiler, runtime-r2, runtime-schema}.js` (full_parity_target_path_manifest.yaml §SECTION 6) | all 3 files exist | PASS |
| 2.14 | HTML entry | `apps/product-shell/index.html` referencing `/src/main.tsx` (full_parity_target_path_manifest.yaml §SECTION 2) | file exists (459 bytes); references `/src/main.tsx` | PASS |
| 2.15 | Script entry | `apps/product-shell/src/main.tsx` importing from `./app/AppShell` (full_parity_target_path_manifest.yaml §SECTION 4) | file exists (707 bytes); imports `./app/router`, `./state/demoGateState`, and multiple `./styles/*` + `./mobile/styles/*`. Entry file itself is PRESENT at the declared path, but its import graph is incomplete (see 2.4). | PASS (file) / FAIL (import graph) |
| 2.16 | App root composition | `apps/product-shell/src/app/{AppShell.tsx, router.tsx, routes.ts}` (full_parity_target_path_manifest.yaml §SECTION 4) | all three files exist (264 + 6440 + 691 bytes). `AppShell.tsx` imports `../components/nav/TopNav` which does NOT exist → breaks import graph. | PASS (files) / FAIL (import graph) |
| 2.17 | Cross-document consistency of deploy root | deploy_root_plan.md → `apps/product-shell`; pages_deployment_spec.md → `/` (repo root) | documents still CONFLICT; no S2 reissue has been dispatched to converge them | FAIL |
| 2.18 | Deploy app runtime support tree | `apps/product-shell/src/runtime/` with `exclusiveTileHydration.ts`, `publishedClient.ts`, `routeContext.ts`, `types.ts` (missing_surface_matrix.yaml §deploy_app_root runtime_support) | all 4 files exist (added by S4 worker_a commit 363c506). | PASS |

---

## 3. Summary

| Criterion class | PASS | FAIL | BLOCKED | N/A |
|---|---|---|---|---|
| deploy root + dir shape | 2 | 0 | 0 | 0 |
| package manifest | 1 | 0 | 0 | 0 |
| build command chain | 1 | 1 | 1 | 0 |
| build config | 2 | 0 | 0 | 0 |
| static routing + assets | 2 | 0 | 0 | 0 |
| Pages Functions | 3 | 0 | 0 | 0 |
| app bootstrap | 0 | 0 | 0 | 0 |
| app bootstrap (files present; import graph broken) | 2 | 0 | 0 | 0 |
| module graph prerequisites (engage only) | 1 | 0 | 0 | 0 |
| runtime support tree | 1 | 0 | 0 | 0 |
| document consistency | 0 | 1 | 0 | 0 |
| **Total** | **15** | **2** | **1** | **0** |

**Headline verdict: FAIL (Pages deploy not buildable yet).** Fifteen of 18 Pages readiness criteria PASS. Two are FAIL: (2.4) build command cannot reach `vite build` green because `src/main.tsx` → `AppShell.tsx` import graph references directories not yet reconstructed (`components/`, `state/`, `mobile/`, `styles/`); and (2.17) the deploy-root divergence between `deploy_root_plan.md` and `pages_deployment_spec.md` is still unresolved. One is BLOCKED: (2.5) `dist/` cannot exist until the build succeeds.

Rows 2.15 and 2.16 are marked PASS at the file-presence level but carry a recorded FAIL on the import graph, which is captured in the build-time FAIL at row 2.4 rather than re-counted.

Sibling module packages `payme`, `referrals`, `vault` remain MISSING at `apps/modules/` but are NOT blockers for `build:engage` — the `apps/product-shell/package.json` `build` script invokes `build:engage` which only requires `apps/modules/engage/`. The missing `payme/referrals/vault` surfaces are still FAIL at parity level but do not block the Pages build command chain.

---

## 4. Root Cause (current FAIL rows)

### 4.1 Row 2.4 — `vite build` import graph incomplete

`apps/product-shell/src/main.tsx` imports from the following paths that do not exist on disk:

- `./styles/global.css`, `./styles/shell.css`, `./styles/nav.css`, `./styles/cards.css`, `./styles/gate.css`, `./styles/admin.css`, `./styles/marketplace.css`, `./styles/published-overlay.css` — 8 CSS files under `apps/product-shell/src/styles/` (missing)
- `./mobile/styles/mobile-overlay.css` — under `apps/product-shell/src/mobile/` (missing)
- `./state/demoGateState` — under `apps/product-shell/src/state/` (missing)

`apps/product-shell/src/app/AppShell.tsx` additionally imports from:

- `../components/nav/TopNav` — under `apps/product-shell/src/components/` (missing)

`apps/product-shell/src/app/router.tsx` is presumed to import from `../pages/*` and `../features/*` (missing). Full import-graph audit is deferred to an S3b pass.

All these import targets are listed as `missing` deploy-critical rows in `/job_site/missing_surface_matrix.yaml` §deploy_app_root and have NOT been reconstructed by any S3/S4 pass on this branch. The S4 worker_a pass (commit 363c506) only reconstructed `src/runtime/` — not the component, state, style, page, feature, or mobile subtrees.

Resolution: requires an S3b or S4 worker_a dispatch to reconstruct the deploy-app component/state/style/page/feature/mobile subtrees from the baseline. Until then `vite build` cannot complete.

### 4.2 Row 2.17 — deploy root divergence still unresolved

`/job_site/pages_deployment_spec.md` §1 still declares `deploy_root_path = /` (repo root), unchanged since S2. No patch-return pass has been dispatched to reconcile it with `deploy_root_plan.md` + `full_parity_target_path_manifest.yaml`, both of which declare `apps/product-shell`.

Resolution: requires Factory Control Interface or a re-issued S2 Worker B consolidation pass.

---

## 5. Delta vs Prior S5 Worker B Matrix (commit 920127d)

| row | prior verdict | current verdict | reason |
|---|---|---|---|
| 2.1 deploy root dir | FAIL | PASS | `apps/product-shell/` created by S3 worker_a commit d936439 |
| 2.2 package manifest | FAIL | PASS | `apps/product-shell/package.json` created by S3 worker_a |
| 2.3 install command resolves | BLOCKED | PASS (static) | prerequisites 2.1 + 2.2 now PASS |
| 2.4 build command resolves | BLOCKED | FAIL | `build:engage` precondition is now satisfied, but `vite build` still fails on missing import-graph files |
| 2.5 output dir | BLOCKED | BLOCKED | still cannot exist — build remains FAIL |
| 2.6 vite config | FAIL | PASS | `vite.config.ts` created by S3 worker_a |
| 2.7 tsconfigs | FAIL | PASS | both tsconfigs created by S3 worker_a |
| 2.8 sibling module graph (engage) | FAIL | PARTIAL PASS | `apps/modules/engage/` reconstructed by S3 worker_b commit 5e44c61 (THIS branch) |
| 2.9 redirects file | FAIL | PASS | `public/_redirects` created by S3 worker_a |
| 2.10 public assets dir | FAIL | PASS (dir shape) | `public/` created by S3 worker_a |
| 2.11 functions dir | FAIL | PASS | `functions/` created by S3 worker_a |
| 2.12 api handlers x5 | FAIL | PASS | all 5 handlers created by S3 worker_a |
| 2.13 _lib helpers x3 | FAIL | PASS | all 3 helpers created by S3 worker_a |
| 2.14 HTML entry | FAIL | PASS | `index.html` created by S3 worker_a |
| 2.15 script entry (file) | FAIL | PASS (file) / FAIL (graph) | `src/main.tsx` created by S3 worker_a; import graph broken at styles/state/mobile |
| 2.16 app root components (files) | FAIL | PASS (files) / FAIL (graph) | 3 app/* files created by S3 worker_a; AppShell imports components/nav/TopNav which is MISSING |
| 2.17 document consistency | FAIL | FAIL | pages_deployment_spec.md not yet reconciled with deploy_root_plan.md |
| 2.18 runtime support tree | (not in prior matrix) | PASS | `src/runtime/` created by S4 worker_a commit 363c506 |

---

## 6. Checksum Pointers for Foreman B

- Every row in §2 is verifiable by filesystem check at `/home/user/gateway-fullbody-freeze` against the declared path under HEAD commit 5e44c61.
- Every row in §2 names its authoritative source document (`deploy_root_plan.md`, `pages_deployment_spec.md`, `full_parity_target_path_manifest.yaml`, or `missing_surface_matrix.yaml`) by section reference.
- The document-consistency FAIL (row 2.17) is cross-referenced in `/job_site/patch_register.md` §3.
- The build-import-graph FAIL (row 2.4) is cross-referenced in `/job_site/patch_register.md` §1 (new subtree patches).
- Every FAIL, BLOCKED, or PARTIAL PASS row is mirrored in `/job_site/parity_verification_matrix.md` as an individual parity-surface row and in `/job_site/patch_register.md` as an open item.
- Engage-only partial PASS at 2.8 is the sole parity delta contributed by the current branch `claude/reconstruct-engage-modules-OdQZM`; no other chassis-tree write has been performed by this worker.
