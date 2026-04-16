# Pages Readiness Matrix — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S3 (re-evaluation — post payme minimal unblock)
owner: Worker B
authority: non-authoritative — derived from /job_site/pages_deployment_spec.md, /job_site/deploy_root_plan.md, /job_site/full_parity_target_path_manifest.yaml, and live tree inspection at `/home/user/gateway-fullbody-freeze`
document_role: Record PASS/FAIL verdict for each Cloudflare Pages deployment readiness criterion against the current tree state. This document overwrites the prior readiness matrix and records current results only.

---

## 0. Evaluation Basis

- **Live tree:** `/home/user/gateway-fullbody-freeze` at HEAD of branch `claude/reconstruct-engage-modules-OdQZM` (commit c6d0bd5).
- **Declared deploy root (authoritative per S2 Worker A):** `apps/product-shell` — from `/job_site/deploy_root_plan.md` §1 and `/job_site/full_parity_target_path_manifest.yaml` §scope_lock.
- **Pages deployment spec conflict note:** `/job_site/pages_deployment_spec.md` (S2 Worker B deploy-app pass) still declares deploy root as `/` (repo root). This still conflicts with `/job_site/deploy_root_plan.md` and `full_parity_target_path_manifest.yaml` which both declare `apps/product-shell`. Resolution: `deploy_root_plan.md` + `full_parity_target_path_manifest.yaml` treated as authoritative; `pages_deployment_spec.md` divergence retained as unresolved HIGH item in `/job_site/patch_register.md` §3.

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
| 2.1 | Deploy root exists as a directory | `apps/product-shell` (deploy_root_plan.md §1) | directory exists | PASS |
| 2.2 | Package manifest at deploy root | `apps/product-shell/package.json` with `name: gateway-demo-zero`, scripts `{dev, build, preview, build:engage, test, test:pass5, typecheck}`, declared deps + devDeps (full_parity_target_path_manifest.yaml §SECTION 1) | file exists; content matches declared shape | PASS |
| 2.3 | Install command resolves | `npm install` from `apps/product-shell/` (deploy_root_plan.md §4) | prerequisites 2.1 + 2.2 PASS; install command statically resolvable (not executed in this re-evaluation) | PASS (static resolvability) |
| 2.4 | Build command resolves | `npm run build` → `npm run build:engage && vite build` from `apps/product-shell/` (deploy_root_plan.md §4) | `build:engage` precondition (`../modules/engage/package.json` = `apps/modules/engage/package.json`) exists (see 2.8) and was verified resolvable via `npm --prefix ../modules/engage pkg get name` returning `"engagefi-questboard"` (see commit 7ad0199 and module_surface_change_manifest.md §12). `vite build` still fails because `apps/product-shell/src/main.tsx` imports from non-existent `./styles/*`, `./mobile/styles/*`, `./state/demoGateState`; `src/app/AppShell.tsx` imports from non-existent `../components/nav/TopNav`. See §4.1 root cause. | FAIL |
| 2.5 | Output directory | `apps/product-shell/dist` (deploy_root_plan.md §4) | cannot exist until build runs; build is FAIL (2.4) | BLOCKED |
| 2.6 | Vite build config | `apps/product-shell/vite.config.ts` declaring `plugins: [react()], server: { port: 5173 }` (full_parity_target_path_manifest.yaml §SECTION 3) | file exists (161 bytes); content matches | PASS |
| 2.7 | TypeScript configs | `apps/product-shell/tsconfig.json` + `apps/product-shell/tsconfig.node.json` (full_parity_target_path_manifest.yaml §SECTION 3) | both files exist | PASS |
| 2.8 | Baseline sibling module graph (DEPLOY-CRITICAL scope) | `apps/modules/{engage,payme}/` required for this readiness pass; `apps/modules/{referrals,vault}` explicitly treated as deferred non-blocking surfaces | **engage:** fully reconstructed (31 files, byte-equal to baseline) per commit 5e44c61. **payme:** minimal unblock only (2 files: verbatim `package.json` + non-baseline stub `src/index.jsx`) per commit c6d0bd5; `vite.config.js`, `index.html`, and baseline src subtree (30 files) still MISSING. **referrals/vault:** DEFERRED (non-blocking for S5 readiness in this DEPLOY-CRITICAL re-evaluation). | PARTIAL PASS (engage full + payme minimal; referrals/vault DEFERRED) |
| 2.9 | Redirects file | `apps/product-shell/public/_redirects` with canonical rules including `/apps/{payme,engage,referrals,vault}/*` fallthrough and SPA fallback `/*  /index.html  200` | file exists (214 bytes) with declared shape | PASS |
| 2.10 | Public assets directory | `apps/product-shell/public/` | directory exists (contains `_redirects`); extended asset tree deferred per scope_lock | PASS (directory shape) |
| 2.11 | Pages Functions directory | `apps/product-shell/functions/` | directory exists with `api/` and `_lib/` subdirectories | PASS |
| 2.12 | Pages Functions `api/` subdir with 5 handlers | 5 handler files (microfrontend-bootstrap, microfrontend-trust-log, page, published-manifest, published-page) | all 5 exist | PASS |
| 2.13 | Pages Functions `_lib/` subdir with 3 helpers | 3 helper files (runtime-compiler, runtime-r2, runtime-schema) | all 3 exist | PASS |
| 2.14 | HTML entry | `apps/product-shell/index.html` referencing `/src/main.tsx` | file exists; references `/src/main.tsx` | PASS |
| 2.15 | Script entry | `apps/product-shell/src/main.tsx` importing from `./app/AppShell` and sibling subtrees | file exists; imports `./app/router`, `./state/demoGateState`, 8 `./styles/*` files, `./mobile/styles/mobile-overlay.css`. File PRESENT; import graph incomplete (see 2.4). | PASS (file) / FAIL (graph) |
| 2.16 | App root composition | `apps/product-shell/src/app/{AppShell.tsx, router.tsx, routes.ts}` | all three exist. `AppShell.tsx` imports `../components/nav/TopNav` which is MISSING. | PASS (files) / FAIL (graph) |
| 2.17 | Cross-document consistency of deploy root | deploy_root_plan.md → `apps/product-shell`; pages_deployment_spec.md → `/` (repo root) | documents still CONFLICT; no S2 reissue has been dispatched | FAIL |
| 2.18 | Deploy app runtime support tree | `apps/product-shell/src/runtime/` with 4 files (missing_surface_matrix.yaml §deploy_app_root) | all 4 files exist per S4 worker_a commit 363c506 | PASS |
| 2.19 | Baseline module install-unit resolvability (build:engage axis) | `apps/modules/engage/package.json` readable from CWD `apps/product-shell/` via `npm --prefix ../modules/engage` | verified PASS in commit 7ad0199 — `npm --prefix ../modules/engage pkg get name` exits 0 returning `"engagefi-questboard"` | PASS |

---

## 3. Summary

| Criterion class | PASS | PARTIAL | FAIL | BLOCKED | N/A |
|---|---|---|---|---|---|
| deploy root + dir shape | 2 | 0 | 0 | 0 | 0 |
| package manifest | 1 | 0 | 0 | 0 | 0 |
| build command chain | 1 | 0 | 1 | 1 | 0 |
| build config | 2 | 0 | 0 | 0 | 0 |
| static routing + assets | 2 | 0 | 0 | 0 | 0 |
| Pages Functions | 3 | 0 | 0 | 0 | 0 |
| app bootstrap (files present; graph broken) | 2 | 0 | 0 | 0 | 0 |
| module graph (sibling modules) | 0 | 1 | 0 | 0 | 0 |
| module install resolvability (engage axis) | 1 | 0 | 0 | 0 | 0 |
| runtime support tree | 1 | 0 | 0 | 0 | 0 |
| document consistency | 0 | 0 | 1 | 0 | 0 |
| **Total** | **15** | **1** | **2** | **1** | **0** |

**Headline verdict: FAIL (Pages deploy not buildable yet).** 15 of 19 Pages readiness criteria PASS (including the new 2.19 install-unit resolvability verification). 1 PARTIAL (2.8 module graph — engage full, payme minimal, referrals/vault DEFERRED as non-blocking). 2 FAIL (2.4 `vite build` import graph incomplete; 2.17 deploy-root document divergence). 1 BLOCKED (2.5 `dist/` dependent on 2.4).

The `build:engage` half of the build chain is now FULLY UNBLOCKED by the current engage reconstruction (see 2.19). The failing point of `npm run build` has moved downstream from `build:engage` to `vite build`, where the deploy-app import graph (src/components, src/state, src/styles, src/mobile, src/pages, src/features, etc.) remains incomplete.

The payme minimal unblock does NOT change any readiness criterion verdict because `apps/product-shell/package.json` has no `build:payme` script and Cloudflare Pages build resolvability depends only on `build:engage`. In this DEPLOY-CRITICAL pass, `modules/referrals` and `modules/vault` are explicitly DEFERRED and NON-BLOCKING for S5 readiness.

---

## 4. Root Cause (current FAIL rows)

### 4.1 Row 2.4 — `vite build` import graph incomplete (unchanged from prior evaluation)

`apps/product-shell/src/main.tsx` imports from 10 paths that do not exist on disk:

- `./styles/global.css`, `./styles/shell.css`, `./styles/nav.css`, `./styles/cards.css`, `./styles/gate.css`, `./styles/admin.css`, `./styles/marketplace.css`, `./styles/published-overlay.css` (8 CSS files)
- `./mobile/styles/mobile-overlay.css`
- `./state/demoGateState`

`apps/product-shell/src/app/AppShell.tsx` additionally imports `../components/nav/TopNav` (missing).

`apps/product-shell/src/app/router.tsx` is presumed to import from `../pages/*` and `../features/*` (missing); full audit deferred.

These subtrees are tracked as CRITICAL open items PATCH-RB002-023 through PATCH-RB002-029 in `/job_site/patch_register.md` §5. Resolution requires an S3b or S4 worker_a dispatch.

### 4.2 Row 2.17 — deploy root divergence still unresolved (unchanged)

`/job_site/pages_deployment_spec.md` §1 still declares `deploy_root_path = /` (repo root), unchanged since S2. Tracked as PATCH-RB002-017 in `/job_site/patch_register.md` §3.

---

## 5. Delta vs Prior S3 Worker B Re-Evaluation Matrix (commit ad431a3)

| row | prior verdict | current verdict | reason |
|---|---|---|---|
| 2.1–2.3 | PASS | PASS | unchanged |
| 2.4 build command resolves | FAIL | FAIL | unchanged — `vite build` graph still incomplete |
| 2.5 output dir | BLOCKED | BLOCKED | unchanged |
| 2.6–2.7 | PASS | PASS | unchanged |
| 2.8 sibling module graph | PARTIAL PASS (engage only) | PARTIAL PASS (engage full + payme minimal; referrals/vault DEFERRED) | payme directory + package.json + stub src/index.jsx added by commit c6d0bd5; row remains PARTIAL because payme still has parity gaps (`vite.config.js`, `index.html`, src subtree). Referrals/vault moved to DEFERRED non-blocking status for DEPLOY-CRITICAL scope. |
| 2.9–2.14 | PASS | PASS | unchanged |
| 2.15–2.16 | PASS (file) / FAIL (graph) | PASS (file) / FAIL (graph) | unchanged |
| 2.17 document consistency | FAIL | FAIL | unchanged |
| 2.18 runtime support tree | PASS | PASS | unchanged |
| 2.19 install-unit resolvability (engage axis) | (new row) | PASS | added based on commit 7ad0199 verification |

Net change: +1 new PASS row (2.19 explicit install-unit resolvability for engage via `npm --prefix ../modules/engage pkg get`), and one row (2.8) refined to `engage full + payme minimal` with referrals/vault now DEFERRED (non-blocking) under DEPLOY-CRITICAL scope while remaining PARTIAL. No row changed overall verdict class (no FAIL → PASS transitions; no PASS → FAIL regressions).

---

## 6. Checksum Pointers for Foreman B

- Every row in §2 is verifiable by filesystem check at `/home/user/gateway-fullbody-freeze` against HEAD commit c6d0bd5.
- Every row in §2 names its authoritative source document (`deploy_root_plan.md`, `pages_deployment_spec.md`, `full_parity_target_path_manifest.yaml`, or `missing_surface_matrix.yaml`) by section reference.
- The document-consistency FAIL (row 2.17) is cross-referenced in `/job_site/patch_register.md` §3.
- The build-import-graph FAIL (row 2.4) is cross-referenced in `/job_site/patch_register.md` §5 (PATCH-RB002-023..029).
- The new row 2.19 (install-unit resolvability on the engage axis) is a PASS and cross-references `/job_site/module_surface_change_manifest.md` §12.4 for the verification tests.
- Engage full + payme minimal are the parity deltas contributed by branch `claude/reconstruct-engage-modules-OdQZM`; referrals and vault remain untouched on this branch and are DEFERRED/NON-BLOCKING for this DEPLOY-CRITICAL readiness determination.
