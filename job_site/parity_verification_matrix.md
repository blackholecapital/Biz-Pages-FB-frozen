# Parity Verification Matrix — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S5 (verification)
owner: Worker B
authority: non-authoritative — derived from /job_site/full_parity_target_path_manifest.yaml and live tree inspection
document_role: Record per-surface PRESENT/MISSING status for every parity surface declared in the target path manifest, against the current tree state.

---

## 0. Evaluation Basis

- **Live tree:** `/home/user/gateway-fullbody-freeze` at HEAD of `claude/deployment-dependency-inventory-XAAp0` (commit 06a69ae).
- **Declared parity surfaces:** `/job_site/full_parity_target_path_manifest.yaml` §SECTION 1 through §SECTION 7 + module_packages_summary.
- **Parity scope lock:** `/job_site/parity_scope_lock.md` (S1 Worker B).

Out of scope for this matrix (covered by other documents):

- resolver-boundary surfaces and production support surfaces (explicitly deferred; see `/job_site/resolver_support_change_manifest.md`)
- app component/feature trees, src/hooks, src/state, src/utils, etc. (explicitly deferred in scope_lock.excluded)
- admin apps (engagefi-admin-minimal, payme-admin-minimal, referral-admin-minimal)

---

## 1. Status Legend

| Status | Meaning |
|---|---|
| PRESENT | declared target path exists on disk with content matching the declared shape |
| MISSING | declared target path does not exist on disk |
| SHAPE_MISMATCH | declared target path exists on disk but content does not match the declared shape |
| DEFERRED | declared as deferred in the manifest; not evaluated in this matrix |

---

## 2. SECTION 1 — Package Manifest (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 1.1 | `apps/product-shell/package.json` | create | MISSING |

## 3. SECTION 2 — HTML Entrypoint (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 2.1 | `apps/product-shell/index.html` | create | MISSING |

## 4. SECTION 3 — Build Configs (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 3.1 | `apps/product-shell/vite.config.ts` | create | MISSING |
| 3.2 | `apps/product-shell/tsconfig.json` | create | MISSING |
| 3.3 | `apps/product-shell/tsconfig.node.json` | create | MISSING |

## 5. SECTION 4 — App Bootstrap (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 4.1 | `apps/product-shell/src/main.tsx` | create | MISSING |
| 4.2 | `apps/product-shell/src/app/` | create_directory | MISSING |
| 4.3 | `apps/product-shell/src/app/AppShell.tsx` | create | MISSING |
| 4.4 | `apps/product-shell/src/app/router.tsx` | create | MISSING |
| 4.5 | `apps/product-shell/src/app/routes.ts` | create | MISSING |

## 6. SECTION 5 — Public Assets (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 5.1 | `apps/product-shell/public/` | create_directory | MISSING |
| 5.2 | `apps/product-shell/public/_redirects` | create | MISSING |

## 7. SECTION 6 — Cloudflare Pages Functions (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 6.1 | `apps/product-shell/functions/` | create_directory | MISSING |
| 6.2 | `apps/product-shell/functions/api/` | create_directory | MISSING |
| 6.3 | `apps/product-shell/functions/_lib/` | create_directory | MISSING |
| 6.4 | `apps/product-shell/functions/api/microfrontend-bootstrap.js` | create | MISSING |
| 6.5 | `apps/product-shell/functions/api/microfrontend-trust-log.js` | create | MISSING |
| 6.6 | `apps/product-shell/functions/api/page.js` | create | MISSING |
| 6.7 | `apps/product-shell/functions/api/published-manifest.js` | create | MISSING |
| 6.8 | `apps/product-shell/functions/api/published-page.js` | create | MISSING |
| 6.9 | `apps/product-shell/functions/_lib/runtime-compiler.js` | create | MISSING |
| 6.10 | `apps/product-shell/functions/_lib/runtime-r2.js` | create | MISSING |
| 6.11 | `apps/product-shell/functions/_lib/runtime-schema.js` | create | MISSING |

## 8. SECTION 7 — Module Packages (modules/engage)

| # | Target path | Action | Status |
|---|---|---|---|
| 7.1 | `apps/modules/engage/` | create_directory | MISSING |
| 7.2 | `apps/modules/engage/package.json` | create | MISSING |
| 7.3 | `apps/modules/engage/package-lock.json` | create | MISSING |
| 7.4 | `apps/modules/engage/vite.config.js` | create | MISSING |
| 7.5 | `apps/modules/engage/index.html` | create | MISSING |
| 7.6 | `apps/modules/engage/src/` | create_directory | MISSING |
| 7.7 | `apps/modules/engage/src/main.jsx` | create | MISSING |
| 7.8 | `apps/modules/engage/src/App.jsx` | create | MISSING |
| 7.9 | `apps/modules/engage/src/` (full subtree — 37 files) | create_subtree | MISSING |
| 7.10 | `apps/modules/engage/public/` | create_directory | MISSING |
| 7.11 | `apps/modules/engage/public/_redirects` | create | MISSING |

## 9. SECTION 7 — Module Packages (modules/payme)

| # | Target path | Action | Status |
|---|---|---|---|
| 7.12 | `apps/modules/payme/` | create_directory | MISSING |
| 7.13 | `apps/modules/payme/package.json` | create | MISSING |
| 7.14 | `apps/modules/payme/vite.config.js` | create | MISSING |
| 7.15 | `apps/modules/payme/index.html` | create | MISSING |
| 7.16 | `apps/modules/payme/src/` | create_directory | MISSING |
| 7.17 | `apps/modules/payme/src/` (full subtree — 30 files) | create_subtree | MISSING |

## 10. SECTION 7 — Module Packages (modules/referrals)

| # | Target path | Action | Status |
|---|---|---|---|
| 7.18 | `apps/modules/referrals/` | create_directory | MISSING |
| 7.19 | `apps/modules/referrals/package.json` | create | MISSING |
| 7.20 | `apps/modules/referrals/vite.config.js` | create | MISSING |
| 7.21 | `apps/modules/referrals/index.html` | create | MISSING |
| 7.22 | `apps/modules/referrals/src/` | create_directory | MISSING |
| 7.23 | `apps/modules/referrals/src/` (full subtree — 30 files) | create_subtree | MISSING |
| 7.24 | `apps/modules/referrals/public/` | create_directory | MISSING |
| 7.25 | `apps/modules/referrals/public/_redirects` | create | MISSING |

## 11. SECTION 7 — Module Packages (modules/vault)

| # | Target path | Action | Status |
|---|---|---|---|
| 7.26 | `apps/modules/vault/` | create_directory | MISSING |
| 7.27 | `apps/modules/vault/package.json` | create | MISSING |
| 7.28 | `apps/modules/vault/vite.config.js` | create | MISSING |
| 7.29 | `apps/modules/vault/index.html` | create | MISSING |
| 7.30 | `apps/modules/vault/_routes.json` | create | MISSING |
| 7.31 | `apps/modules/vault/functions/` | create_directory | MISSING |
| 7.32 | `apps/modules/vault/functions/api/` | create_directory | MISSING |
| 7.33 | `apps/modules/vault/functions/api/` (full subtree — 14 endpoints) | create_subtree | MISSING |
| 7.34 | `apps/modules/vault/src/` | create_directory | MISSING |
| 7.35 | `apps/modules/vault/src/` (full subtree — 60+ files) | create_subtree | MISSING |

## 12. Deferred (not evaluated in this matrix)

| # | Deferred scope | Deferral source |
|---|---|---|
| 12.1 | `modules/engage/supabase_schema.sql` | deploy_critical: no in missing_surface_matrix.yaml |
| 12.2 | `modules/vault/Vault.MktMaker-main/` | deploy_critical: no in missing_surface_matrix.yaml |
| 12.3 | `modules/blueprint/module-boundary-list.md` | deploy_critical: no in missing_surface_matrix.yaml |
| 12.4 | engagefi-admin-minimal/, payme-admin-minimal/, referral-admin-minimal/ | explicit deferral in scope_lock.excluded |
| 12.5 | app component/feature/page trees under apps/product-shell/src/ | explicit deferral in scope_lock.excluded |
| 12.6 | full public asset trees under apps/product-shell/public/ | explicit deferral in scope_lock.excluded |
| 12.7 | tests/ | explicit deferral in scope_lock.excluded |
| 12.8 | production/, resolver-boundary/, variation-control/, _review-required/ | explicit deferral in scope_lock.excluded |
| 12.9 | docs/, blueprint/, README.md | explicit deferral in scope_lock.excluded |

---

## 13. Summary

| Surface class | Declared rows | PRESENT | MISSING | SHAPE_MISMATCH | DEFERRED |
|---|---|---|---|---|---|
| SECTION 1 — package manifest (deploy app) | 1 | 0 | 1 | 0 | 0 |
| SECTION 2 — HTML entrypoint (deploy app) | 1 | 0 | 1 | 0 | 0 |
| SECTION 3 — build configs (deploy app) | 3 | 0 | 3 | 0 | 0 |
| SECTION 4 — app bootstrap (deploy app) | 5 | 0 | 5 | 0 | 0 |
| SECTION 5 — public assets (deploy app) | 2 | 0 | 2 | 0 | 0 |
| SECTION 6 — Pages Functions (deploy app) | 11 | 0 | 11 | 0 | 0 |
| SECTION 7 — modules/engage | 11 | 0 | 11 | 0 | 0 |
| SECTION 7 — modules/payme | 6 | 0 | 6 | 0 | 0 |
| SECTION 7 — modules/referrals | 8 | 0 | 8 | 0 | 0 |
| SECTION 7 — modules/vault | 10 | 0 | 10 | 0 | 0 |
| **Total evaluated** | **58** | **0** | **58** | **0** | **0** |

**Headline verdict: 58/58 declared parity surfaces MISSING. 0 PRESENT. 0 SHAPE_MISMATCH.**

Note: the row counts above include `create_directory` rows as individual declared surfaces (per the manifest's `action:` field). Counting only flat files and full-subtree copies (the execution-unit rows), the tallies are:

- SECTION 1–6 (deploy app) — 17 flat files + 6 directory ensures = 23 declared rows
- SECTION 7 — modules/engage — 11 rows (7 flat files + 3 dirs + 1 subtree)
- SECTION 7 — modules/payme — 6 rows (3 flat files + 2 dirs + 1 subtree)
- SECTION 7 — modules/referrals — 8 rows (4 flat files + 3 dirs + 1 subtree)
- SECTION 7 — modules/vault — 10 rows (4 flat files + 3 dirs + 2 subtrees)

All 58 rows are MISSING.

---

## 14. Cross-Reference Lock

Every row in §2–§11 corresponds to exactly one declared row in `/job_site/full_parity_target_path_manifest.yaml` SECTIONS 1–7. Every §2–§11 row with status MISSING is also listed in `/job_site/patch_register.md` as an unresolved execution blocker. Every §12 deferred row has an explicit deferral source in the manifest or in `parity_scope_lock.md`.

If any row in §2–§11 is re-verified and changes status from MISSING to PRESENT in a future S5 pass, the corresponding entry in `/job_site/patch_register.md` must be updated to reflect resolution.
