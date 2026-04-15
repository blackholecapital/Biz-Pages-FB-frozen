# Patch Register — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S3 (re-evaluation)
owner: Worker B
authority: non-authoritative — derived from /job_site/pages_readiness_matrix.md, /job_site/parity_verification_matrix.md, and live tree inspection
document_role: Register every unresolved blocker preventing RB-INT-CHASSIS-002 from reaching a PASS at S5 checkpoint S5-CP1 (build passes from declared deploy root + Pages deployment inputs valid + declared parity surfaces present + no in-scope blocker unresolved). This document overwrites the prior S5 register and records current results only.

---

## 0. Register Format

Each entry includes:

- **id**: stable identifier for the blocker
- **severity**: CRITICAL (blocks S5-CP1 pass) / HIGH (in-scope but not immediate checkpoint blocker) / MEDIUM / LOW
- **class**: execution / document-consistency / scope-clarification
- **declared by**: authoritative source that requires this surface
- **current state**: live tree evidence at HEAD commit 5e44c61 on branch `claude/reconstruct-engage-modules-OdQZM`
- **resolution owner**: which foreman + worker dispatch is expected to clear the item
- **unblock condition**: exact test for PASS

---

## 1. RESOLVED — Deploy App Root Surfaces (S3 Worker A)

The following items from the prior patch register are RESOLVED at HEAD 5e44c61. They are retained here for audit cross-reference and moved out of the open blocker list.

| id | prior state | resolution commit | resolution summary |
|---|---|---|---|
| PATCH-RB002-001 | deploy app root dir missing | d936439 (S3 worker_a) | `apps/product-shell/` created |
| PATCH-RB002-002 | deploy app `package.json` missing | d936439 | file exists; `name: gateway-demo-zero`, all 7 scripts, declared deps and devDeps |
| PATCH-RB002-003 | `vite.config.ts` missing | d936439 | file exists; `plugins: [react()], server: { port: 5173 }` |
| PATCH-RB002-004 | tsconfig files missing | d936439 | `tsconfig.json` + `tsconfig.node.json` both exist |
| PATCH-RB002-005 | HTML entry missing | d936439 | `index.html` exists referencing `/src/main.tsx` |
| PATCH-RB002-006 | script entry missing | d936439 | `src/main.tsx` exists (import graph incomplete — see PATCH-RB002-023) |
| PATCH-RB002-007 | app root components missing | d936439 | `AppShell.tsx`, `router.tsx`, `routes.ts` exist (AppShell import graph incomplete — see PATCH-RB002-023) |
| PATCH-RB002-008 | public assets + redirects missing | d936439 | `public/_redirects` exists with declared rules |
| PATCH-RB002-009 | Pages Functions directories missing | d936439 | `functions/`, `functions/api/`, `functions/_lib/` all exist |
| PATCH-RB002-010 | Pages Functions API handlers missing (5) | d936439 | all 5 handler files exist |
| PATCH-RB002-011 | Pages Functions `_lib` helpers missing (3) | d936439 | all 3 helper files exist |
| PATCH-RB002-012 | `apps/modules/` dir missing | 5e44c61 (S3 worker_b — THIS branch) | `apps/modules/engage/` created, `apps/modules/` now exists |
| PATCH-RB002-013 | modules/engage subtree missing | 5e44c61 (S3 worker_b — THIS branch) | all 11 declared rows PRESENT; 31 files byte-equal to baseline |

---

## 2. CRITICAL — Module Packages Execution Not Performed (remaining modules)

### 2.1 PATCH-RB002-014 — modules/payme subtree missing (6 declared rows)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/payme); `/job_site/full_parity_fragment_allowlist.md` §8
- **current state:** `apps/modules/payme/` does not exist; 3 flat files + 2 directories + 1 full src subtree (30 files) MISSING
- **resolution owner:** S3 Worker B (next payme reconstruction pass)
- **unblock condition:** every row in `parity_verification_matrix.md` §9 transitions from MISSING to PRESENT

### 2.2 PATCH-RB002-015 — modules/referrals subtree missing (8 declared rows)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/referrals); `/job_site/full_parity_fragment_allowlist.md` §9
- **current state:** `apps/modules/referrals/` does not exist; 4 flat files + 3 directories + 1 full src subtree (30 files) MISSING
- **resolution owner:** S3 Worker B (next referrals reconstruction pass)
- **unblock condition:** every row in `parity_verification_matrix.md` §10 transitions from MISSING to PRESENT

### 2.3 PATCH-RB002-016 — modules/vault subtree missing (10 declared rows)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/vault); `/job_site/full_parity_fragment_allowlist.md` §10
- **current state:** `apps/modules/vault/` does not exist; 4 flat files (package.json, vite.config.js, index.html, _routes.json) + 3 directories (module root, src/, functions/, functions/api/) + 2 subtrees (src/ 60+ files, functions/api/ 14 endpoints) MISSING
- **resolution owner:** S3 Worker B (next vault reconstruction pass)
- **unblock condition:** every row in `parity_verification_matrix.md` §11 transitions from MISSING to PRESENT
- **additional constraint:** `apps/modules/vault/functions/api/` handler set MUST match `apps/modules/vault/_routes.json` include/exclude declarations per fragment allowlist §10.5 route coupling rule

Note: PATCH-RB002-014 through PATCH-RB002-016 do NOT block `build:engage` (which only requires `apps/modules/engage/`) and therefore do not block the `apps/product-shell/package.json` `build` script on the `build:engage` half. They remain CRITICAL for parity (SECTION 7 full completion) but are NOT immediate blockers for Pages readiness row 2.4 on the `build:engage` axis. They are blockers at the parity-matrix level.

---

## 3. HIGH — Document Consistency Divergence

### 3.1 PATCH-RB002-017 — deploy root divergence between S2 deliverables

- **severity:** HIGH
- **class:** document-consistency
- **declared by:** build sheet `run_control` and `stages.S2` (both Worker A and Worker B deliverables must be consistent)
- **current state (unchanged since prior register):**
  - `/job_site/deploy_root_plan.md` §1 declares `apps/product-shell` as the deploy root
  - `/job_site/full_parity_target_path_manifest.yaml` §scope_lock declares `apps/product-shell`
  - `/job_site/pages_deployment_spec.md` §1 declares `/` (repo root) as the deploy root
  - Two authorities agree on `apps/product-shell`; one diverges to `/`
- **resolution owner:** Factory Control Interface OR Foreman A (patch return to S2 Worker B)
- **unblock condition:** `/job_site/pages_deployment_spec.md` is updated to declare deploy root = `apps/product-shell` consistent with `deploy_root_plan.md` + `full_parity_target_path_manifest.yaml`
- **impact:** S5 readiness verification (row 2.17 in `/job_site/pages_readiness_matrix.md`) cannot PASS while the two documents disagree
- **recommended resolution:** treat `deploy_root_plan.md` + `full_parity_target_path_manifest.yaml` as authoritative (they are the named S2 Worker A deliverables directly referenced by S3 worker_a expected_artifacts and by S5 worker_a build verification); patch `pages_deployment_spec.md` §1 and §1.2 to re-resolve every absolute path under `apps/product-shell/` instead of `/`.

### 3.2 PATCH-RB002-018 — rebuild order document path references divergent from deploy root plan

- **severity:** HIGH
- **class:** document-consistency
- **declared by:** `/job_site/full_parity_rebuild_order.md` (S2 Worker B) vs `/job_site/deploy_root_plan.md` (S2 Worker A)
- **current state:** `full_parity_rebuild_order.md` §3–§8 declares phase files at absolute paths rooted at `/`. `deploy_root_plan.md` roots these at `apps/product-shell/`. Unchanged since prior register.
- **resolution owner:** Foreman A (patch return to S2 Worker B)
- **unblock condition:** `full_parity_rebuild_order.md` phase paths re-anchored at `apps/product-shell/` to match `deploy_root_plan.md`
- **impact:** does not block S3 execution (execution has used `deploy_root_plan.md` + `full_parity_target_path_manifest.yaml` as authoritative, and has succeeded for the deploy app root and engage module)
- **dependency:** resolved together with PATCH-RB002-017

### 3.3 PATCH-RB002-019 — runtime_dependency_inventory.md declares deploy-app→chassis-package edges that baseline does not use

- **severity:** MEDIUM
- **class:** scope-clarification
- **declared by:** `/job_site/runtime_dependency_inventory.md` §3.1 declares 10 INT-A edges from deploy app to `packages/*` chassis packages
- **current state:** baseline `product-shell/package.json` lists only `react`, `react-dom`, `react-router-dom` as dependencies — no chassis package imports. Unchanged since prior register.
- **resolution owner:** Factory Control Interface (scope clarification) OR Foreman A (patch return to S1 Worker B)
- **unblock condition:** `runtime_dependency_inventory.md` §3.1 is narrowed to edges that actually appear in the baseline deploy app source tree, or explicitly re-labelled as "forward-looking"
- **impact:** non-blocking for S5-CP1 Pages readiness

---

## 4. CRITICAL — Build and Readiness Verification Blockers

### 4.1 PATCH-RB002-020 — install command not yet verified (blocked by PATCH-RB002-023)

- **severity:** CRITICAL
- **class:** execution
- **current state:** `npm install` from `apps/product-shell/` is statically resolvable (package.json exists with declared dependencies) but has not been executed on this branch. No `node_modules/` exists.
- **resolution owner:** S5 Worker A (re-run build verification once PATCH-RB002-023 is cleared)
- **unblock condition:** `npm install` from `apps/product-shell/` exits 0 and produces `node_modules/`
- **note:** PATCH-RB002-020 could in principle be verified in isolation today (since package.json + deploy root now exist), but Cloudflare Pages semantics tie install and build verification together. A green install with a red build still produces a FAIL at S5-CP1.

### 4.2 PATCH-RB002-021 — build command still FAILs (blocked by PATCH-RB002-023)

- **severity:** CRITICAL
- **class:** execution
- **current state:** `apps/product-shell/package.json` `build` script is `npm run build:engage && vite build`.
  - **`build:engage` half:** precondition (`apps/modules/engage/package.json` at sibling path `../modules/engage/package.json` relative to `apps/product-shell/`) is now satisfied (PATCH-RB002-013 RESOLVED). `build:engage` is expected to run cleanly pending actual execution verification.
  - **`vite build` half:** FAILS because `apps/product-shell/src/main.tsx` imports from non-existent `./styles/*`, `./mobile/styles/*`, `./state/demoGateState`, and `apps/product-shell/src/app/AppShell.tsx` imports from non-existent `../components/nav/TopNav`. See PATCH-RB002-023 subentries.
- **resolution owner:** S3b or S4 Worker A (reconstruct deploy-app component/state/style/page/feature/mobile subtrees) + S5 Worker A (re-run verification)
- **unblock condition:** `npm run build` from `apps/product-shell/` exits 0 and emits `apps/product-shell/dist/` containing `index.html` + bundled JS/CSS + copied contents of `apps/product-shell/public/`
- **dependency order:** PATCH-RB002-023 (deploy-app subtree reconstruction) must resolve first

### 4.3 PATCH-RB002-022 — build_verification_results still records FAIL

- **severity:** CRITICAL
- **class:** execution
- **declared by:** build sheet S5 worker_a expected_artifacts
- **current state:** `/job_site/build_verification_runbook.md` exists (commit 1136e2a, S5 worker_a). `/job_site/build_verification_results.md` exists at the same commit and records a FAIL (the build could not be completed because the deploy app and modules were not yet reconstructed at the time of that verification pass). The current tree state has advanced since that verification but the results document has not been refreshed.
- **resolution owner:** S5 Worker A (re-run build verification once PATCH-RB002-021 is clearable)
- **unblock condition:** `build_verification_results.md` is re-issued with a green build record after PATCH-RB002-021 clears

---

## 5. CRITICAL — Deploy-App Import Graph Subtrees (new open items)

These items are newly opened by the current re-evaluation. They are not in the prior patch register because prior evaluations found the deploy-app file surface entirely missing and treated the subtree gaps as implied by the root-level MISSING. Now that the deploy-app root is PRESENT, the subtree gaps surface as independent CRITICAL blockers for `vite build` (PATCH-RB002-021). Each item corresponds to a row in `/job_site/missing_surface_matrix.yaml` §deploy_app_root with `deploy_critical: yes` but NOT yet reconstructed.

### 5.1 PATCH-RB002-023 — `apps/product-shell/src/components/` missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/missing_surface_matrix.yaml` §deploy_app_root (`product-shell/src/components/`, 23 files); imported from `apps/product-shell/src/app/AppShell.tsx` line 2 (`import { TopNav } from "../components/nav/TopNav";`)
- **current state:** directory does not exist; `AppShell.tsx` imports an absent module → `vite build` fails at module resolution
- **resolution owner:** S3b or S4 Worker A (deploy-app component tree reconstruction)
- **unblock condition:** `apps/product-shell/src/components/nav/TopNav.tsx` (and the remainder of the 23-file subtree) exists and resolves all `AppShell.tsx` + `router.tsx` + page imports
- **baseline subtree:** `product-shell/src/components/` (23 files under `admin/`, `cards/`, `gate/`, `integrations/`, `layout/`, `nav/`, `tenant/`)

### 5.2 PATCH-RB002-024 — `apps/product-shell/src/state/demoGateState.tsx` missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/missing_surface_matrix.yaml` §deploy_app_root (`product-shell/src/state/demoGateState.tsx`); imported from `apps/product-shell/src/main.tsx` line 5 (`import { DemoGateProvider } from "./state/demoGateState";`)
- **current state:** file does not exist; `main.tsx` imports an absent module
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** file exists and exports `DemoGateProvider`

### 5.3 PATCH-RB002-025 — `apps/product-shell/src/styles/` missing (8 CSS files)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/missing_surface_matrix.yaml` §deploy_app_root (`product-shell/src/styles/`, 8 files); imported from `apps/product-shell/src/main.tsx` lines 7–14
- **current state:** directory does not exist; `main.tsx` imports 8 CSS files that are absent → Vite CSS resolution fails
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** all 8 files exist: `global.css`, `shell.css`, `nav.css`, `cards.css`, `gate.css`, `admin.css`, `marketplace.css`, `published-overlay.css`

### 5.4 PATCH-RB002-026 — `apps/product-shell/src/mobile/` missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/missing_surface_matrix.yaml` §deploy_app_root (`product-shell/src/mobile/`, classified `deploy_critical: no` in matrix but actually imported by `main.tsx`); imported from `apps/product-shell/src/main.tsx` line 15 (`import "./mobile/styles/mobile-overlay.css";`)
- **current state:** directory does not exist; `main.tsx` imports `./mobile/styles/mobile-overlay.css` which is absent
- **resolution owner:** S3b or S4 Worker A (and Foreman A should reconcile the matrix `deploy_critical` classification — this file is imported by the deploy-app entry and IS effectively deploy-critical for the build)
- **unblock condition:** `apps/product-shell/src/mobile/styles/mobile-overlay.css` exists
- **matrix reconciliation item:** `/job_site/missing_surface_matrix.yaml` §deploy_app_root classifies `product-shell/src/mobile/` as `deploy_critical: no`. Since `main.tsx` imports from this subtree, the classification needs review.

### 5.5 PATCH-RB002-027 — `apps/product-shell/src/pages/` missing (11 page files)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/missing_surface_matrix.yaml` §deploy_app_root (`product-shell/src/pages/`, 11 files); presumed imported from `apps/product-shell/src/app/router.tsx` and `routes.ts`
- **current state:** directory does not exist
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** all 11 page files exist

### 5.6 PATCH-RB002-028 — `apps/product-shell/src/features/` missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/missing_surface_matrix.yaml` §deploy_app_root (`product-shell/src/features/`: engage, marketplace, payme, referrals)
- **current state:** directory does not exist
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** full feature tree exists

### 5.7 PATCH-RB002-029 — `apps/product-shell/src/hooks/`, `src/integrations/`, `src/config/`, `src/contracts/`, `src/utils/` missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/missing_surface_matrix.yaml` §deploy_app_root rows for hooks (2 files), integrations/spine (4 files), config (3 files), contracts/microfrontend.ts, utils (5 files)
- **current state:** all 5 directories absent
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** all 5 subtrees exist with baseline-declared file counts

---

## 6. Summary

| Class | CRITICAL | HIGH | MEDIUM | LOW |
|---|---|---|---|---|
| execution — remaining modules (payme, referrals, vault) | 3 | 0 | 0 | 0 |
| execution — deploy-app subtree import graph | 7 | 0 | 0 | 0 |
| execution — install / build / verification downstream | 3 | 0 | 0 | 0 |
| document-consistency | 0 | 2 | 0 | 0 |
| scope-clarification | 0 | 0 | 1 | 0 |
| **Total open** | **13** | **2** | **1** | **0** |

**Total open register entries: 16.** 13 CRITICAL + 2 HIGH + 1 MEDIUM.

**Resolved (moved out of open list): 13 entries (PATCH-RB002-001 through PATCH-RB002-013).**

All CRITICAL items must be cleared before S5-CP1 can PASS. HIGH items must be cleared before S6 final validation. MEDIUM items should be cleared but do not block checkpoint progression.

---

## 7. Patch Return Recommendation

Per build sheet S5 `handoff.on_patch`:

```
on_patch:
  return_stage: S3
  return_owner: Foreman A the Blueprint Foreman
```

Recommended dispatch order from Foreman A, given current state:

1. **First (unblock vite build):** dispatch S3b Worker A OR extend S4 Worker A to execute PATCH-RB002-023 through PATCH-RB002-029 — reconstruct the deploy-app component/state/style/mobile/page/feature/hooks/integrations/config/contracts/utils subtrees. Until this clears, `vite build` cannot go green and PATCH-RB002-021 remains FAIL.
2. **Second (complete SECTION 7 parity):** dispatch S3 Worker B to execute PATCH-RB002-014 (payme), PATCH-RB002-015 (referrals), PATCH-RB002-016 (vault). Order within this step does not matter since the three modules are independent install units. This step can run in PARALLEL with step 1 because it touches disjoint trees.
3. **Third (document consistency):** dispatch Foreman A OR Factory Control Interface to clear PATCH-RB002-017 and PATCH-RB002-018 — re-anchor `pages_deployment_spec.md` and `full_parity_rebuild_order.md` onto `apps/product-shell`. Can run in PARALLEL with steps 1 and 2.
4. **Fourth (verification):** once PATCH-RB002-023–029 and PATCH-RB002-014–016 clear, dispatch S5 Worker A to re-run install and build verification (PATCH-RB002-020, PATCH-RB002-021) and refresh `/job_site/build_verification_results.md` (PATCH-RB002-022).
5. **Fifth:** re-dispatch S5 Worker B (this role) to re-verify `pages_readiness_matrix.md` and `parity_verification_matrix.md` and close `patch_register.md` entries.
6. **In parallel (non-gating):** PATCH-RB002-019 (runtime dependency inventory scope clarification) can be resolved by an S1 Worker B patch pass.

---

## 8. Checksum Pointers for Foreman B

- Every CRITICAL entry in §2 maps 1:1 to at least one MISSING row in `/job_site/parity_verification_matrix.md` §9–§11.
- Every CRITICAL entry in §5 maps 1:1 to at least one `missing` row in `/job_site/missing_surface_matrix.yaml` §deploy_app_root whose target path is imported by a file already PRESENT under `apps/product-shell/src/`.
- Every CRITICAL entry in §4 is a downstream blocker whose unblock condition depends on upstream CRITICAL entries by ID.
- Every HIGH entry in §3 names the exact divergent documents and the exact resolution.
- This register is the authoritative PATCH surface for S5-CP1 at HEAD 5e44c61. Do not close an entry without evidence that the declared unblock condition is met.
- Resolved entries in §1 are retained as audit rows; do not reopen without evidence that the corresponding tree surface has regressed.
