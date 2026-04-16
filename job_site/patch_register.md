# Patch Register — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S3 (re-evaluation — post payme minimal unblock)
owner: Worker B
authority: non-authoritative — derived from /job_site/pages_readiness_matrix.md, /job_site/parity_verification_matrix.md, and live tree inspection
document_role: Register every unresolved blocker preventing RB-INT-CHASSIS-002 from reaching a PASS at S5 checkpoint S5-CP1. This document overwrites the prior patch register. Existing entries retain their identifiers; only state transitions and new blockers are applied per the S3 re-dispatch instruction to "update patch register with new blockers only".

---

## 0. Register Format

Each entry includes:

- **id**: stable identifier for the blocker (preserved across register revisions)
- **severity**: CRITICAL / HIGH / MEDIUM / LOW
- **state**: OPEN / PARTIAL / RESOLVED (new field to track partial-minimal unblocks)
- **class**: execution / document-consistency / scope-clarification
- **declared by**: authoritative source that requires this surface
- **current state**: live tree evidence at HEAD commit c6d0bd5 on branch `claude/reconstruct-engage-modules-OdQZM`
- **resolution owner**: which foreman + worker dispatch is expected to clear the item
- **unblock condition**: exact test for PASS

---

## 1. RESOLVED — Deploy App Root + Engage Module Surfaces

The following items are RESOLVED at HEAD c6d0bd5. Retained for audit cross-reference and not counted in the open blocker list.

| id | prior state | resolution commit | resolution summary |
|---|---|---|---|
| PATCH-RB002-001 | deploy app root dir missing | d936439 (S3 worker_a) | `apps/product-shell/` created |
| PATCH-RB002-002 | deploy app `package.json` missing | d936439 | file exists; `name: gateway-demo-zero`, all 7 scripts, declared deps and devDeps |
| PATCH-RB002-003 | `vite.config.ts` missing | d936439 | file exists; `plugins: [react()], server: { port: 5173 }` |
| PATCH-RB002-004 | tsconfig files missing | d936439 | `tsconfig.json` + `tsconfig.node.json` both exist |
| PATCH-RB002-005 | HTML entry missing | d936439 | `index.html` exists referencing `/src/main.tsx` |
| PATCH-RB002-006 | script entry missing | d936439 | `src/main.tsx` exists (import graph incomplete — PATCH-RB002-023..025, 026) |
| PATCH-RB002-007 | app root components missing | d936439 | `AppShell.tsx`, `router.tsx`, `routes.ts` exist (AppShell import graph incomplete — PATCH-RB002-023) |
| PATCH-RB002-008 | public assets + redirects missing | d936439 | `public/_redirects` exists with declared rules |
| PATCH-RB002-009 | Pages Functions directories missing | d936439 | `functions/`, `functions/api/`, `functions/_lib/` all exist |
| PATCH-RB002-010 | Pages Functions API handlers missing (5) | d936439 | all 5 handler files exist |
| PATCH-RB002-011 | Pages Functions `_lib` helpers missing (3) | d936439 | all 3 helper files exist |
| PATCH-RB002-012 | `apps/modules/` dir missing | 5e44c61 (S3 worker_b) | `apps/modules/engage/` created, `apps/modules/` now exists |
| PATCH-RB002-013 | modules/engage subtree missing | 5e44c61 (S3 worker_b) | all 11 declared rows PRESENT; 31 files byte-equal to baseline |

---

## 2. Module Packages — DEPLOY-CRITICAL Handling (remaining modules)

### 2.1 PATCH-RB002-014 — modules/payme subtree missing

- **severity:** CRITICAL
- **state:** PARTIAL (minimal unblock applied)
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/payme); `/job_site/full_parity_fragment_allowlist.md` §8
- **current state (updated this re-evaluation):**
  - `apps/modules/payme/` directory PRESENT (commit c6d0bd5)
  - `apps/modules/payme/package.json` PRESENT (verbatim baseline, 492 bytes, commit c6d0bd5)
  - `apps/modules/payme/src/` directory PRESENT (commit c6d0bd5)
  - Out-of-band non-baseline STUB at `apps/modules/payme/src/index.jsx` (1156 bytes) — NOT counted toward parity rows per `parity_verification_matrix.md` §9.a
  - `apps/modules/payme/vite.config.js` — still MISSING
  - `apps/modules/payme/index.html` — still MISSING
  - `apps/modules/payme/src/` full subtree (30 baseline files) — still MISSING
- **resolution owner:** S3 Worker B (next payme full-reconstruction pass against allowlist §8)
- **remaining unblock condition:** every row in `parity_verification_matrix.md` §9 transitions from MISSING to PRESENT. Currently 3 of 6 rows PRESENT (7.12, 7.13, 7.16); 3 rows still MISSING (7.14, 7.15, 7.17).
- **required action during full reconstruction:** delete the out-of-band STUB at `apps/modules/payme/src/index.jsx` before writing the baseline `src/main.jsx` and the remaining subtree files (allowlist §8.4 declares the full subtree as verbatim baseline; the stub is not a baseline path).
- **state transition:** OPEN → PARTIAL as of commit c6d0bd5

### 2.2 PATCH-RB002-015 — modules/referrals subtree missing

- **severity:** LOW
- **state:** DEFERRED
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/referrals); `/job_site/full_parity_fragment_allowlist.md` §9
- **current state:** `apps/modules/referrals/` does not exist; parity rows remain absent.
- **resolution owner:** Future parity pass (Worker B)
- **S5 readiness policy (updated):** NON-BLOCKING for DEPLOY-CRITICAL scope. Presence is NOT required for S5 readiness.

### 2.3 PATCH-RB002-016 — modules/vault subtree missing

- **severity:** LOW
- **state:** DEFERRED
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/vault); `/job_site/full_parity_fragment_allowlist.md` §10
- **current state:** `apps/modules/vault/` does not exist; parity rows remain absent.
- **resolution owner:** Future parity pass (Worker B)
- **S5 readiness policy (updated):** NON-BLOCKING for DEPLOY-CRITICAL scope. Presence is NOT required for S5 readiness.

Note: PATCH-RB002-014 (PARTIAL) does NOT block `build:engage` (which only requires `apps/modules/engage`) and therefore does not block the `apps/product-shell/package.json` `build` script on the `build:engage` axis. PATCH-RB002-015 and PATCH-RB002-016 are now DEFERRED and non-blocking for S5 readiness in DEPLOY-CRITICAL scope.

## 3. HIGH — Document Consistency Divergence

### 3.1 PATCH-RB002-017 — deploy root divergence between S2 deliverables

- **severity:** HIGH
- **state:** OPEN (unchanged)
- **class:** document-consistency
- **current state:** `/job_site/pages_deployment_spec.md` §1 still declares `deploy_root_path = /`; `deploy_root_plan.md` and `full_parity_target_path_manifest.yaml` declare `apps/product-shell`
- **resolution owner:** Factory Control Interface OR Foreman A
- **unblock condition:** `pages_deployment_spec.md` re-anchored at `apps/product-shell`

### 3.2 PATCH-RB002-018 — rebuild order document path references divergent

- **severity:** HIGH
- **state:** OPEN (unchanged)
- **class:** document-consistency
- **current state:** `full_parity_rebuild_order.md` §3–§8 anchored at `/`; `deploy_root_plan.md` anchored at `apps/product-shell/`
- **resolution owner:** Foreman A
- **unblock condition:** `full_parity_rebuild_order.md` re-anchored at `apps/product-shell/`
- **dependency:** resolved together with PATCH-RB002-017

### 3.3 PATCH-RB002-019 — runtime_dependency_inventory chassis-edge scope

- **severity:** MEDIUM
- **state:** OPEN (unchanged)
- **class:** scope-clarification
- **current state:** `/job_site/runtime_dependency_inventory.md` §3.1 declares 10 INT-A edges to chassis packages that baseline `product-shell/package.json` does not import
- **resolution owner:** Factory Control Interface OR Foreman A
- **unblock condition:** §3.1 narrowed to edges actually declared by baseline, or re-labelled as forward-looking
- **impact:** non-blocking for S5-CP1

---

## 4. CRITICAL — Build and Readiness Verification Blockers

### 4.1 PATCH-RB002-020 — install command not yet verified

- **severity:** CRITICAL
- **state:** OPEN (unchanged from prior; additional evidence gained)
- **class:** execution
- **current state:** `npm install` from `apps/product-shell/` statically resolvable; module-axis install-unit resolvability was verified for engage in commit 7ad0199 (`npm --prefix ../modules/engage pkg get name` → `"engagefi-questboard"`, exit 0). No full `npm install` has been executed on this branch.
- **resolution owner:** S5 Worker A (re-run build verification)
- **unblock condition:** `npm install` from `apps/product-shell/` exits 0 and produces `node_modules/`

### 4.2 PATCH-RB002-021 — build command still FAILs (blocked by PATCH-RB002-023..029)

- **severity:** CRITICAL
- **state:** OPEN (partially advanced — `build:engage` axis cleared, `vite build` axis still blocked)
- **class:** execution
- **current state:**
  - **`build:engage` half:** RESOLVABLE. Precondition `apps/modules/engage/package.json` exists (commit 5e44c61) and `npm --prefix ../modules/engage pkg get` succeeds from CWD `apps/product-shell/` (verified commit 7ad0199). `build:engage` is expected to run cleanly pending actual execution verification.
  - **`vite build` half:** still FAILS because `apps/product-shell/src/main.tsx` and `src/app/AppShell.tsx` import from non-existent deploy-app subtrees. See PATCH-RB002-023..029.
- **resolution owner:** S3b or S4 Worker A (deploy-app subtree reconstruction) + S5 Worker A (re-run verification)
- **unblock condition:** `npm run build` from `apps/product-shell/` exits 0 and emits `apps/product-shell/dist/` containing `index.html` + bundled JS/CSS + copied `public/` contents
- **dependency order:** PATCH-RB002-023..029 must resolve first

### 4.3 PATCH-RB002-022 — build_verification_results still records FAIL

- **severity:** CRITICAL
- **state:** OPEN (stale — the prior FAIL was recorded at commit 1136e2a before any reconstruction; current state is strictly advanced but the results document has not been refreshed)
- **class:** execution
- **current state:** `/job_site/build_verification_results.md` at HEAD records FAIL from the S5 worker_a run that preceded any of the S3/S4 reconstruction commits. The step 3a ENOENT that caused the prior FAIL is cleared at HEAD c6d0bd5 (the referenced file `apps/modules/engage/package.json` now exists). The step 3b Rollup resolve error (`Could not resolve "./styles/global.css"`) is NOT cleared and remains the expected failure mode for any re-run attempted today.
- **resolution owner:** S5 Worker A (re-run build verification once PATCH-RB002-021 is clearable)
- **unblock condition:** `build_verification_results.md` re-issued with a green build record

---

## 5. CRITICAL — Deploy-App Import Graph Subtrees

These items were opened by the prior re-evaluation (commit ad431a3) to track the deploy-app subtree gaps that surface now that the deploy-app root is PRESENT. They are unchanged by the current re-evaluation because no S3b/S4 reconstruction has been dispatched for these subtrees.

### 5.1 PATCH-RB002-023 — `apps/product-shell/src/components/` missing

- **severity:** CRITICAL
- **state:** OPEN (unchanged)
- **declared by:** `missing_surface_matrix.yaml` §deploy_app_root (`product-shell/src/components/`, 23 files); imported from `src/app/AppShell.tsx` line 2
- **current state:** directory does not exist
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** `apps/product-shell/src/components/nav/TopNav.tsx` and remainder of 23-file subtree exist

### 5.2 PATCH-RB002-024 — `apps/product-shell/src/state/demoGateState.tsx` missing

- **severity:** CRITICAL
- **state:** OPEN (unchanged)
- **declared by:** `missing_surface_matrix.yaml` §deploy_app_root; imported from `src/main.tsx` line 5
- **current state:** file does not exist
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** file exists and exports `DemoGateProvider`

### 5.3 PATCH-RB002-025 — `apps/product-shell/src/styles/` missing (8 CSS files)

- **severity:** CRITICAL
- **state:** OPEN (unchanged)
- **declared by:** `missing_surface_matrix.yaml` §deploy_app_root; imported from `src/main.tsx` lines 7–14
- **current state:** directory does not exist
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** all 8 CSS files exist

### 5.4 PATCH-RB002-026 — `apps/product-shell/src/mobile/` missing

- **severity:** CRITICAL
- **state:** OPEN (unchanged)
- **declared by:** `missing_surface_matrix.yaml` §deploy_app_root (classified `deploy_critical: no` but imported by `main.tsx` line 15, so effectively deploy-critical — matrix reconciliation item)
- **current state:** directory does not exist
- **resolution owner:** S3b or S4 Worker A; Foreman A for matrix reconciliation
- **unblock condition:** `apps/product-shell/src/mobile/styles/mobile-overlay.css` exists

### 5.5 PATCH-RB002-027 — `apps/product-shell/src/pages/` missing (11 files)

- **severity:** CRITICAL
- **state:** OPEN (unchanged)
- **declared by:** `missing_surface_matrix.yaml` §deploy_app_root; presumed imported from `src/app/router.tsx` and `routes.ts`
- **current state:** directory does not exist
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** all 11 page files exist

### 5.6 PATCH-RB002-028 — `apps/product-shell/src/features/` missing

- **severity:** CRITICAL
- **state:** OPEN (unchanged)
- **declared by:** `missing_surface_matrix.yaml` §deploy_app_root (engage, marketplace, payme, referrals)
- **current state:** directory does not exist
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** full feature tree exists

### 5.7 PATCH-RB002-029 — `apps/product-shell/src/hooks/`, `src/integrations/`, `src/config/`, `src/contracts/`, `src/utils/` missing

- **severity:** CRITICAL
- **state:** OPEN (unchanged)
- **declared by:** `missing_surface_matrix.yaml` §deploy_app_root rows
- **current state:** all 5 directories absent
- **resolution owner:** S3b or S4 Worker A
- **unblock condition:** all 5 subtrees exist with baseline-declared file counts

---

## 6. Summary

| Class | CRITICAL OPEN | CRITICAL PARTIAL | HIGH | MEDIUM | LOW |
|---|---|---|---|---|---|
| execution — remaining modules (referrals, vault) | 0 | 0 | 0 | 0 | 0 |
| execution — payme (minimal unblock applied) | 0 | 1 | 0 | 0 | 0 |
| execution — deploy-app subtree import graph | 7 | 0 | 0 | 0 | 0 |
| execution — install / build / verification downstream | 3 | 0 | 0 | 0 | 0 |
| document-consistency | 0 | 0 | 2 | 0 | 0 |
| scope-clarification | 0 | 0 | 0 | 1 | 0 |
| **Total open** | **10** | **1** | **2** | **1** | **0** |

**Total open register entries: 14** (11 CRITICAL — of which 1 PARTIAL, 10 OPEN; 2 HIGH; 1 MEDIUM).

**Resolved (moved out of open list): 13 entries (PATCH-RB002-001 through PATCH-RB002-013).**

**State transitions this re-evaluation:** 1 entry (PATCH-RB002-014) transitioned from OPEN to PARTIAL as of commit c6d0bd5 (payme minimal unblock: 3 of 6 §9 rows transitioned MISSING → PRESENT). All other open entries retain their prior state.

**New blockers added this re-evaluation: 0.** Per S3 re-dispatch instruction to "update patch register with new blockers only", no new blockers have been introduced beyond those already tracked in commit ad431a3. The payme minimal unblock produces only state transitions within an existing entry (PATCH-RB002-014), not new register entries.

---

## 7. Patch Return Recommendation

Per build sheet S5 `handoff.on_patch`:

```
on_patch:
  return_stage: S3
  return_owner: Foreman A the Blueprint Foreman
```

Recommended dispatch order from Foreman A, given current state:

1. **First (unblock vite build):** dispatch S3b Worker A OR extend S4 Worker A to execute PATCH-RB002-023 through PATCH-RB002-029. Until this clears, `vite build` cannot go green and PATCH-RB002-021 remains FAIL.
2. **Second (optional parity completion, non-blocking):** dispatch S3 Worker B to execute PATCH-RB002-014 FULL (replace stub + write remainder of allowlist §8). PATCH-RB002-015 (referrals) and PATCH-RB002-016 (vault) are DEFERRED and do not gate S5 readiness.
3. **Third (document consistency):** dispatch Foreman A / Factory Control Interface to clear PATCH-RB002-017 and PATCH-RB002-018. Can run in parallel.
4. **Fourth (verification):** once PATCH-RB002-023..029 clear (and PATCH-RB002-014 as needed for parity), dispatch S5 Worker A to re-run install and build verification (PATCH-RB002-020, -021, -022). PATCH-RB002-015/016 are not prerequisites in DEPLOY-CRITICAL scope.
5. **Fifth:** re-dispatch S5 Worker B to re-verify matrices and close this register.
6. **In parallel (non-gating):** PATCH-RB002-019 runtime dependency inventory scope clarification.

---

## 8. Checksum Pointers for Foreman B

- In §2, PATCH-RB002-014 remains a parity execution item; PATCH-RB002-015/016 are DEFERRED and non-blocking for DEPLOY-CRITICAL S5 readiness.
- Every CRITICAL entry in §5 maps 1:1 to at least one `missing` row in `/job_site/missing_surface_matrix.yaml` §deploy_app_root whose target path is imported by a file already PRESENT under `apps/product-shell/src/`.
- Every CRITICAL entry in §4 is a downstream blocker whose unblock condition depends on upstream CRITICAL entries by ID.
- Every HIGH entry in §3 names the exact divergent documents and the exact resolution.
- The single PARTIAL entry (PATCH-RB002-014) records both (a) the 3 parity rows already PRESENT from the minimal unblock and (b) the 3 parity rows still MISSING plus the required action to delete the out-of-band STUB during the subsequent full-reconstruction pass.
- This register is the authoritative PATCH surface for S5-CP1 at HEAD c6d0bd5. Do not close or revert an entry without evidence that its unblock condition is met (for closure) or that the corresponding tree surface has regressed (for reopen).
- Resolved entries in §1 are retained as audit rows. New blockers: none this re-evaluation.
