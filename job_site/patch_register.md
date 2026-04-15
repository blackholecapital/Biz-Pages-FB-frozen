# Patch Register — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S5 (verification)
owner: Worker B
authority: non-authoritative — derived from /job_site/pages_readiness_matrix.md, /job_site/parity_verification_matrix.md, and live tree inspection
document_role: Register every unresolved blocker preventing RB-INT-CHASSIS-002 from reaching a PASS at S5 checkpoint S5-CP1 (build passes from declared deploy root + Pages deployment inputs valid + declared parity surfaces present + no in-scope blocker unresolved).

---

## 0. Register Format

Each entry includes:

- **id**: stable identifier for the blocker
- **severity**: CRITICAL (blocks S5-CP1 pass) / HIGH (in-scope but not immediate checkpoint blocker) / MEDIUM / LOW
- **class**: execution / document-consistency / scope-clarification
- **declared by**: authoritative source that requires this surface
- **current state**: live tree evidence
- **resolution owner**: which foreman + worker dispatch is expected to clear the item
- **unblock condition**: exact test for PASS

---

## 1. CRITICAL — Deploy App Execution Not Performed

### 1.1 PATCH-RB002-001 — deploy app root directory missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/deploy_root_plan.md` §1; `/job_site/full_parity_target_path_manifest.yaml` §scope_lock + §SECTIONs 1–6
- **current state:** `apps/product-shell/` does not exist in the tree; `ls` returns "No such file or directory"
- **resolution owner:** S3 Worker A (per build sheet S3 worker_a task — "Recreate the baseline deploy app surface in the chassis-native app root...")
- **unblock condition:** every row in `/job_site/parity_verification_matrix.md` §2–§7 transitions from MISSING to PRESENT

### 1.2 PATCH-RB002-002 — deploy app `package.json` missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 1
- **current state:** `apps/product-shell/package.json` does not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** file exists at `apps/product-shell/package.json` with baseline-declared `name: gateway-demo-zero`, declared `scripts` block, declared `dependencies`, declared `devDependencies`
- **blocks downstream:** install command resolution (2.3 in readiness matrix), build command resolution (2.4 in readiness matrix)

### 1.3 PATCH-RB002-003 — Vite build config missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 3
- **current state:** `apps/product-shell/vite.config.ts` does not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** file exists at `apps/product-shell/vite.config.ts` with `plugins: [react()], server: { port: 5173 }` per baseline

### 1.4 PATCH-RB002-004 — TypeScript configs missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 3
- **current state:** `apps/product-shell/tsconfig.json` and `apps/product-shell/tsconfig.node.json` do not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** both files exist with baseline-declared content

### 1.5 PATCH-RB002-005 — HTML entry missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 2
- **current state:** `apps/product-shell/index.html` does not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** file exists with `<div id="root"></div>` and `<script type="module" src="/src/main.tsx"></script>`

### 1.6 PATCH-RB002-006 — script entry missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 4
- **current state:** `apps/product-shell/src/main.tsx` does not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** file exists, mounts `AppShell` into `#root`

### 1.7 PATCH-RB002-007 — app root components missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 4
- **current state:** `apps/product-shell/src/app/{AppShell.tsx, router.tsx, routes.ts}` do not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** all three files exist with baseline-declared shape

### 1.8 PATCH-RB002-008 — public assets + redirects missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 5
- **current state:** `apps/product-shell/public/` directory and `apps/product-shell/public/_redirects` do not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** `apps/product-shell/public/_redirects` exists with baseline microfrontend fallthrough rules + SPA fallback `/*  /index.html  200`

### 1.9 PATCH-RB002-009 — Pages Functions directories missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 6
- **current state:** `apps/product-shell/functions/`, `apps/product-shell/functions/api/`, `apps/product-shell/functions/_lib/` do not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** all three directories exist

### 1.10 PATCH-RB002-010 — Pages Functions API handlers missing (5 files)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 6
- **current state:** `apps/product-shell/functions/api/{microfrontend-bootstrap.js, microfrontend-trust-log.js, page.js, published-manifest.js, published-page.js}` do not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** all five handler files exist with baseline handler shape and declared route bindings `/api/microfrontend-bootstrap`, `/api/microfrontend-trust-log`, `/api/page`, `/api/published-manifest`, `/api/published-page`

### 1.11 PATCH-RB002-011 — Pages Functions `_lib` helpers missing (3 files)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 6
- **current state:** `apps/product-shell/functions/_lib/{runtime-compiler.js, runtime-r2.js, runtime-schema.js}` do not exist
- **resolution owner:** S3 Worker A
- **unblock condition:** all three helper files exist; consumed by the five API handlers per declared `consumed_by` rows

---

## 2. CRITICAL — Module Packages Execution Not Performed

### 2.1 PATCH-RB002-012 — `apps/modules/` directory missing

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 + `module_packages_summary.directory_create_list`
- **current state:** `apps/modules/` does not exist
- **resolution owner:** S3 Worker B (per build sheet S3 worker_b task — "Recreate missing admin and module package surfaces...")
- **unblock condition:** `apps/modules/` exists

### 2.2 PATCH-RB002-013 — modules/engage subtree missing (11 declared rows)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/engage); `/job_site/full_parity_fragment_allowlist.md` §3
- **current state:** `apps/modules/engage/` does not exist; 7 flat files + 3 directories + 1 full src subtree (37 files) MISSING
- **resolution owner:** S3 Worker B
- **unblock condition:** every row in `parity_verification_matrix.md` §8 transitions from MISSING to PRESENT
- **dependency:** baseline archive `modules/engage/` subtree must be accessible for verbatim byte-copy per fragment allowlist §3

### 2.3 PATCH-RB002-014 — modules/payme subtree missing (6 declared rows)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/payme); `/job_site/full_parity_fragment_allowlist.md` §8
- **current state:** `apps/modules/payme/` does not exist; 3 flat files + 2 directories + 1 full src subtree (30 files) MISSING
- **resolution owner:** S3 Worker B
- **unblock condition:** every row in `parity_verification_matrix.md` §9 transitions from MISSING to PRESENT

### 2.4 PATCH-RB002-015 — modules/referrals subtree missing (8 declared rows)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/referrals); `/job_site/full_parity_fragment_allowlist.md` §9
- **current state:** `apps/modules/referrals/` does not exist; 4 flat files + 3 directories + 1 full src subtree (30 files) MISSING
- **resolution owner:** S3 Worker B
- **unblock condition:** every row in `parity_verification_matrix.md` §10 transitions from MISSING to PRESENT

### 2.5 PATCH-RB002-016 — modules/vault subtree missing (10 declared rows)

- **severity:** CRITICAL
- **class:** execution
- **declared by:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 7 (modules/vault); `/job_site/full_parity_fragment_allowlist.md` §10
- **current state:** `apps/modules/vault/` does not exist; 4 flat files (package.json, vite.config.js, index.html, _routes.json) + 3 directories (module root, src/, functions/, functions/api/) + 2 subtrees (src/ 60+ files, functions/api/ 14 endpoints) MISSING
- **resolution owner:** S3 Worker B
- **unblock condition:** every row in `parity_verification_matrix.md` §11 transitions from MISSING to PRESENT
- **additional constraint:** `apps/modules/vault/functions/api/` handler set MUST match `apps/modules/vault/_routes.json` include/exclude declarations per fragment allowlist §10.5 route coupling rule

---

## 3. HIGH — Document Consistency Divergence

### 3.1 PATCH-RB002-017 — deploy root divergence between S2 deliverables

- **severity:** HIGH
- **class:** document-consistency
- **declared by:** build sheet `run_control` and `stages.S2` (both Worker A and Worker B deliverables must be consistent)
- **current state:**
  - `/job_site/deploy_root_plan.md` §1 declares `apps/product-shell` as the deploy root
  - `/job_site/pages_deployment_spec.md` §1 declares `/` (repo root) as the deploy root
  - The two S2 deliverables conflict on this critical field
- **resolution owner:** Factory Control Interface OR Foreman A (patch return to S2 Worker B)
- **unblock condition:** `/job_site/pages_deployment_spec.md` is updated to declare deploy root = `apps/product-shell` consistent with `deploy_root_plan.md`, OR both documents converge on a different authoritative deploy root value
- **root cause:** `pages_deployment_spec.md` was written by Worker B in a narrowed S2 dispatch BEFORE Worker A's `deploy_root_plan.md` was available via branch merge from main; the Worker B pass committed to `/` as a safe canonical default. Worker A's subsequent `deploy_root_plan.md` published a different canonical value.
- **impact:** S5 readiness verification (row 2.17 in `/job_site/pages_readiness_matrix.md`) cannot PASS while the two documents disagree
- **recommended resolution:** treat `deploy_root_plan.md` as authoritative (it is the named S2 Worker A deliverable directly referenced by S3 worker_a expected_artifacts and by S5 worker_a build verification); patch `pages_deployment_spec.md` §1 and §1.2 to re-resolve every absolute path under `apps/product-shell/` instead of `/`.

### 3.2 PATCH-RB002-018 — rebuild order document path references divergent from deploy root plan

- **severity:** HIGH
- **class:** document-consistency
- **declared by:** `/job_site/full_parity_rebuild_order.md` (S2 Worker B) vs `/job_site/deploy_root_plan.md` (S2 Worker A)
- **current state:** `full_parity_rebuild_order.md` §3–§8 declares phase files at absolute paths rooted at `/` (e.g., `/vite.config.ts`, `/index.html`, `/src/main.tsx`). `deploy_root_plan.md` roots these at `apps/product-shell/`.
- **resolution owner:** Foreman A (patch return to S2 Worker B)
- **unblock condition:** `full_parity_rebuild_order.md` phase paths re-anchored at `apps/product-shell/` to match `deploy_root_plan.md`
- **impact:** S3 Worker A execution cannot rely on `full_parity_rebuild_order.md` as-is; execution must defer to `deploy_root_plan.md` + `full_parity_target_path_manifest.yaml` as authoritative
- **dependency:** resolved together with PATCH-RB002-017

### 3.3 PATCH-RB002-019 — runtime_dependency_inventory.md declares deploy-app→chassis-package edges that baseline does not use

- **severity:** MEDIUM
- **class:** scope-clarification
- **declared by:** `/job_site/runtime_dependency_inventory.md` §3.1 declares 10 INT-A edges from deploy app to `packages/contracts-core`, `packages/registry-chassis`, `packages/proof-chassis`, `packages/validation-chassis`, `packages/policy-chassis`, `packages/lifecycle-chassis`, `packages/runtime-bridge`, `packages/session-transport`
- **current state:** baseline `product-shell/package.json` declared in `/job_site/full_parity_target_path_manifest.yaml` §SECTION 1 lists only `react`, `react-dom`, `react-router-dom` as dependencies — no chassis package imports
- **resolution owner:** Factory Control Interface (scope clarification) OR Foreman A (patch return to S1 Worker B to narrow §3.1 to edges actually declared by baseline)
- **unblock condition:** `runtime_dependency_inventory.md` §3.1 is either (a) narrowed to edges that appear in the baseline deploy app source tree, or (b) explicitly re-labelled as "forward-looking edges that are NOT required for this run's parity target"
- **impact:** non-blocking for S5-CP1 Pages readiness itself (since Pages build resolves only what the deploy app actually imports), but creates ambiguity for parity-scope reviewers about whether chassis packages are in-scope for deploy-app wiring
- **note:** this divergence is INTERNAL to my own S1 Worker B deliverable and does not block execution

---

## 4. CRITICAL — Build and Readiness Verification Blockers

### 4.1 PATCH-RB002-020 — install command cannot run (blocked by 1.1–1.4)

- **severity:** CRITICAL
- **class:** execution
- **current state:** `npm install` from `apps/product-shell/` fails because neither the directory nor `package.json` exists
- **resolution owner:** S3 Worker A (resolve 1.1–1.4 first)
- **unblock condition:** `npm install` from `apps/product-shell/` exits 0 and produces `node_modules/`

### 4.2 PATCH-RB002-021 — build command cannot run (blocked by 1.1–1.11 + 2.1–2.2)

- **severity:** CRITICAL
- **class:** execution
- **current state:** `npm run build` fails because (a) `apps/product-shell/package.json` does not exist, (b) even if it did, `build:engage` script would fail because `../modules/engage/package.json` does not exist, (c) `vite build` would fail because `vite.config.ts`, `index.html`, and `src/main.tsx` do not exist
- **resolution owner:** S3 Worker A (deploy app) + S3 Worker B (modules/engage, minimum)
- **unblock condition:** `npm run build` from `apps/product-shell/` exits 0 and emits `apps/product-shell/dist/` containing `index.html` + bundled JS/CSS + copied contents of `apps/product-shell/public/` (including `_redirects`)
- **dependency order:** PATCH-RB002-002, PATCH-RB002-003, PATCH-RB002-013 must all resolve before this patch can be evaluated

### 4.3 PATCH-RB002-022 — build_verification_runbook and build_verification_results not produced

- **severity:** CRITICAL
- **class:** execution
- **declared by:** build sheet S5 worker_a expected_artifacts
- **current state:** `/job_site/build_verification_runbook.md` and `/job_site/build_verification_results.md` do not exist
- **resolution owner:** S5 Worker A (once PATCH-RB002-021 is resolvable)
- **unblock condition:** both documents exist and `build_verification_results.md` records a green build

---

## 5. Summary

| Class | CRITICAL | HIGH | MEDIUM | LOW |
|---|---|---|---|---|
| execution | 14 | 0 | 0 | 0 |
| document-consistency | 0 | 2 | 0 | 0 |
| scope-clarification | 0 | 0 | 1 | 0 |
| **Total unresolved** | **14** | **2** | **1** | **0** |

**Total register entries: 22.** All CRITICAL items must be cleared before S5-CP1 can PASS. HIGH items must be cleared before S6 final validation. MEDIUM items should be cleared but do not block checkpoint progression.

---

## 6. Patch Return Recommendation

Per build sheet S5 `handoff.on_patch`:

```
on_patch:
  return_stage: S3
  return_owner: Foreman A the Blueprint Foreman
```

Recommended dispatch order from Foreman A:

1. **First:** resolve PATCH-RB002-017 and PATCH-RB002-018 (document consistency) by reissuing an S2 Worker B consolidation pass that re-anchors `pages_deployment_spec.md` and `full_parity_rebuild_order.md` onto `apps/product-shell` — this unblocks S3 execution against a single canonical deploy root.
2. **Second:** dispatch S3 Worker A to execute PATCH-RB002-001 through PATCH-RB002-011 (deploy app root + package.json + build configs + app bootstrap + public assets + Pages Functions).
3. **Third:** dispatch S3 Worker B to execute PATCH-RB002-012 through PATCH-RB002-016 (module packages engage + payme + referrals + vault) — order within this step does not matter since the four modules are independent install units.
4. **Fourth:** re-dispatch S5 Worker A to execute PATCH-RB002-020 and PATCH-RB002-021 (install and build verification) followed by PATCH-RB002-022 (produce verification documents).
5. **Fifth:** re-dispatch S5 Worker B (this role) to re-verify `pages_readiness_matrix.md` and `parity_verification_matrix.md` and close `patch_register.md` entries as their unblock conditions are met.
6. **Finally:** PATCH-RB002-019 (runtime dependency inventory scope clarification) can be resolved in parallel with any of the above by an S1 Worker B patch pass and does not gate S5-CP1.

---

## 7. Checksum Pointers for Foreman B

- Every CRITICAL entry in §1 and §2 maps 1:1 to at least one MISSING row in `/job_site/parity_verification_matrix.md` §2–§11.
- Every CRITICAL entry in §4 is a downstream blocker whose unblock condition depends on upstream CRITICAL entries by ID.
- Every HIGH entry in §3 names the exact divergent documents and the exact resolution (re-anchoring or re-labelling).
- This register is the authoritative PATCH surface for S5-CP1. Do not close an entry without evidence that the declared unblock condition is met.
