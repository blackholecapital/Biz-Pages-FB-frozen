# Parity Verification Matrix — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S3 (re-evaluation)
owner: Worker B
authority: non-authoritative — derived from /job_site/full_parity_target_path_manifest.yaml and live tree inspection
document_role: Record per-surface PRESENT/MISSING status for every parity surface declared in the target path manifest, against the current tree state. This document overwrites the prior S5 parity matrix and records current results only.

---

## 0. Evaluation Basis

- **Live tree:** `/home/user/gateway-fullbody-freeze` at HEAD of branch `claude/reconstruct-engage-modules-OdQZM` (commit 5e44c61).
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
| 1.1 | `apps/product-shell/package.json` | create | PRESENT |

## 3. SECTION 2 — HTML Entrypoint (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 2.1 | `apps/product-shell/index.html` | create | PRESENT |

## 4. SECTION 3 — Build Configs (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 3.1 | `apps/product-shell/vite.config.ts` | create | PRESENT |
| 3.2 | `apps/product-shell/tsconfig.json` | create | PRESENT |
| 3.3 | `apps/product-shell/tsconfig.node.json` | create | PRESENT |

## 5. SECTION 4 — App Bootstrap (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 4.1 | `apps/product-shell/src/main.tsx` | create | PRESENT (import graph incomplete — see §13) |
| 4.2 | `apps/product-shell/src/app/` | create_directory | PRESENT |
| 4.3 | `apps/product-shell/src/app/AppShell.tsx` | create | PRESENT (imports `../components/nav/TopNav` which is MISSING) |
| 4.4 | `apps/product-shell/src/app/router.tsx` | create | PRESENT |
| 4.5 | `apps/product-shell/src/app/routes.ts` | create | PRESENT |

## 6. SECTION 5 — Public Assets (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 5.1 | `apps/product-shell/public/` | create_directory | PRESENT |
| 5.2 | `apps/product-shell/public/_redirects` | create | PRESENT |

## 7. SECTION 6 — Cloudflare Pages Functions (deploy app)

| # | Target path | Action | Status |
|---|---|---|---|
| 6.1 | `apps/product-shell/functions/` | create_directory | PRESENT |
| 6.2 | `apps/product-shell/functions/api/` | create_directory | PRESENT |
| 6.3 | `apps/product-shell/functions/_lib/` | create_directory | PRESENT |
| 6.4 | `apps/product-shell/functions/api/microfrontend-bootstrap.js` | create | PRESENT |
| 6.5 | `apps/product-shell/functions/api/microfrontend-trust-log.js` | create | PRESENT |
| 6.6 | `apps/product-shell/functions/api/page.js` | create | PRESENT |
| 6.7 | `apps/product-shell/functions/api/published-manifest.js` | create | PRESENT |
| 6.8 | `apps/product-shell/functions/api/published-page.js` | create | PRESENT |
| 6.9 | `apps/product-shell/functions/_lib/runtime-compiler.js` | create | PRESENT |
| 6.10 | `apps/product-shell/functions/_lib/runtime-r2.js` | create | PRESENT |
| 6.11 | `apps/product-shell/functions/_lib/runtime-schema.js` | create | PRESENT |

## 8. SECTION 7 — Module Packages (modules/engage)

| # | Target path | Action | Status |
|---|---|---|---|
| 7.1 | `apps/modules/engage/` | create_directory | PRESENT |
| 7.2 | `apps/modules/engage/package.json` | create | PRESENT |
| 7.3 | `apps/modules/engage/package-lock.json` | create | PRESENT |
| 7.4 | `apps/modules/engage/vite.config.js` | create | PRESENT |
| 7.5 | `apps/modules/engage/index.html` | create | PRESENT |
| 7.6 | `apps/modules/engage/src/` | create_directory | PRESENT |
| 7.7 | `apps/modules/engage/src/main.jsx` | create | PRESENT |
| 7.8 | `apps/modules/engage/src/App.jsx` | create | PRESENT |
| 7.9 | `apps/modules/engage/src/` (full subtree — 26 files; was declared 37, see §14) | create_subtree | PRESENT |
| 7.10 | `apps/modules/engage/public/` | create_directory | PRESENT |
| 7.11 | `apps/modules/engage/public/_redirects` | create | PRESENT |

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

## 12. Runtime Support (deploy app — `apps/product-shell/src/runtime/`)

| # | Target path | Action | Status |
|---|---|---|---|
| R.1 | `apps/product-shell/src/runtime/exclusiveTileHydration.ts` | create | PRESENT |
| R.2 | `apps/product-shell/src/runtime/publishedClient.ts` | create | PRESENT |
| R.3 | `apps/product-shell/src/runtime/routeContext.ts` | create | PRESENT |
| R.4 | `apps/product-shell/src/runtime/types.ts` | create | PRESENT |

Source: S4 worker_a runtime support pass (commit 363c506). Not part of SECTIONs 1–7 of the target path manifest but declared as `runtime_support` rows in `/job_site/missing_surface_matrix.yaml` §deploy_app_root.

---

## 13. Declared Surfaces PRESENT But With Broken Import Graph

The following rows are PRESENT at the declared path but reference files that are themselves MISSING. This does NOT change their row status from PRESENT (the target-path declaration is satisfied), but the build-time import graph is flagged here and mirrored in `/job_site/pages_readiness_matrix.md` row 2.4.

| surface | broken import targets (all MISSING) |
|---|---|
| `apps/product-shell/src/main.tsx` | `./styles/global.css`, `./styles/shell.css`, `./styles/nav.css`, `./styles/cards.css`, `./styles/gate.css`, `./styles/admin.css`, `./styles/marketplace.css`, `./styles/published-overlay.css`, `./mobile/styles/mobile-overlay.css`, `./state/demoGateState` |
| `apps/product-shell/src/app/AppShell.tsx` | `../components/nav/TopNav` |
| `apps/product-shell/src/app/router.tsx` | presumed imports into `../pages/*`, `../features/*` — full audit deferred |

The missing import targets correspond to the following deploy-app-root subtrees, all listed `missing` and `deploy_critical: yes` in `/job_site/missing_surface_matrix.yaml`:

- `apps/product-shell/src/components/` (23 component files)
- `apps/product-shell/src/config/` (3 config files)
- `apps/product-shell/src/contracts/microfrontend.ts`
- `apps/product-shell/src/features/` (engage, marketplace, payme, referrals)
- `apps/product-shell/src/hooks/` (2 hook files)
- `apps/product-shell/src/integrations/spine/` (4 files)
- `apps/product-shell/src/pages/` (11 page files)
- `apps/product-shell/src/state/demoGateState.tsx`
- `apps/product-shell/src/styles/` (8 CSS files)
- `apps/product-shell/src/utils/` (5 util files)
- `apps/product-shell/src/mobile/`

None of these subtrees have been reconstructed on this branch. They are tracked as new CRITICAL items in `/job_site/patch_register.md` §1.12–§1.22.

---

## 14. Deferred (not evaluated in this matrix)

| # | Deferred scope | Deferral source |
|---|---|---|
| 14.1 | `modules/engage/supabase_schema.sql` | deploy_critical: no in missing_surface_matrix.yaml |
| 14.2 | `modules/vault/Vault.MktMaker-main/` | deploy_critical: no in missing_surface_matrix.yaml |
| 14.3 | `modules/blueprint/module-boundary-list.md` | deploy_critical: no in missing_surface_matrix.yaml |
| 14.4 | engagefi-admin-minimal/, payme-admin-minimal/, referral-admin-minimal/ | explicit deferral in scope_lock.excluded |
| 14.5 | full public asset trees under apps/product-shell/public/ads/, public/apps/, public/demo/, public/wallpapers/, drip.png | explicit deferral in scope_lock.excluded |
| 14.6 | tests/ | explicit deferral in scope_lock.excluded |
| 14.7 | production/, resolver-boundary/, variation-control/, _review-required/ | explicit deferral in scope_lock.excluded |
| 14.8 | docs/, blueprint/, README.md | explicit deferral in scope_lock.excluded |

Note on §14.5 vs §5.1: `apps/product-shell/public/` exists as a directory (5.1 PRESENT) and `public/_redirects` exists (5.2 PRESENT). The extended public asset tree (ads/, apps/, demo/, wallpapers/, drip.png) is deferred per scope_lock and is NOT counted as MISSING in §6 above.

### 14.a engage allowlist-deferred fragments

The following engage fragments exist in the baseline repo but are outside the S3 worker_b engage reconstruction allowlist (`/job_site/full_parity_fragment_allowlist.md` §3) and are therefore NOT evaluated in row 7.9:

- `modules/engage/README.md`
- `modules/engage/TEMPLATE_REPORT.txt`
- `modules/engage/drop.png` (referenced by `index.html` via `<link rel="icon" href="./drop.png">`; runtime effect = favicon 404 only, non-blocking for build)
- `modules/engage/public/wallpaper333.png`

See `/job_site/module_surface_change_manifest.md` §7 for blocked-item rationale.

---

## 15. Summary

| Surface class | Declared rows | PRESENT | MISSING | SHAPE_MISMATCH | DEFERRED |
|---|---|---|---|---|---|
| SECTION 1 — package manifest (deploy app) | 1 | 1 | 0 | 0 | 0 |
| SECTION 2 — HTML entrypoint (deploy app) | 1 | 1 | 0 | 0 | 0 |
| SECTION 3 — build configs (deploy app) | 3 | 3 | 0 | 0 | 0 |
| SECTION 4 — app bootstrap (deploy app) | 5 | 5 | 0 | 0 | 0 |
| SECTION 5 — public assets (deploy app) | 2 | 2 | 0 | 0 | 0 |
| SECTION 6 — Pages Functions (deploy app) | 11 | 11 | 0 | 0 | 0 |
| SECTION 7 — modules/engage | 11 | 11 | 0 | 0 | 0 |
| SECTION 7 — modules/payme | 6 | 0 | 6 | 0 | 0 |
| SECTION 7 — modules/referrals | 8 | 0 | 8 | 0 | 0 |
| SECTION 7 — modules/vault | 10 | 0 | 10 | 0 | 0 |
| Runtime support (deploy app) | 4 | 4 | 0 | 0 | 0 |
| **Total evaluated** | **62** | **38** | **24** | **0** | **0** |

**Headline verdict: 38/62 declared parity surfaces PRESENT. 24/62 MISSING. 0 SHAPE_MISMATCH. 0 DEFERRED within matrix scope.**

MISSING rows are all concentrated in SECTION 7 sibling modules (`payme` 6, `referrals` 8, `vault` 10 = 24). The deploy app and `modules/engage` are 100% PRESENT at target-path level.

Note on import-graph incompleteness: rows 4.1, 4.3, and 4.4 are counted PRESENT because the target-path declaration is satisfied. The build-time import graph they anchor is incomplete (see §13) and is tracked separately as a Pages readiness FAIL (row 2.4 in `/job_site/pages_readiness_matrix.md`) and as new patch_register.md entries for the deploy-app component/state/style/page/feature/mobile subtrees.

---

## 16. Delta vs Prior S5 Worker B Matrix (commit 920127d)

| section | prior PRESENT | current PRESENT | delta | source commits |
|---|---|---|---|---|
| SECTION 1 — package manifest | 0/1 | 1/1 | +1 | d936439 (S3 worker_a) |
| SECTION 2 — HTML entrypoint | 0/1 | 1/1 | +1 | d936439 |
| SECTION 3 — build configs | 0/3 | 3/3 | +3 | d936439 |
| SECTION 4 — app bootstrap | 0/5 | 5/5 | +5 | d936439 |
| SECTION 5 — public assets | 0/2 | 2/2 | +2 | d936439 |
| SECTION 6 — Pages Functions | 0/11 | 11/11 | +11 | d936439 |
| SECTION 7 — modules/engage | 0/11 | 11/11 | +11 | 5e44c61 (S3 worker_b — THIS branch) |
| SECTION 7 — modules/payme | 0/6 | 0/6 | 0 | — |
| SECTION 7 — modules/referrals | 0/8 | 0/8 | 0 | — |
| SECTION 7 — modules/vault | 0/10 | 0/10 | 0 | — |
| Runtime support (new row block) | n/a | 4/4 | new | 363c506 (S4 worker_a) |
| **Totals** | **0/58** | **38/62** | **+38** | |

---

## 17. Cross-Reference Lock

Every row in §2–§12 corresponds to exactly one declared row in `/job_site/full_parity_target_path_manifest.yaml` SECTIONs 1–7 or to a runtime_support row in `/job_site/missing_surface_matrix.yaml` §deploy_app_root. Every §9–§11 row with status MISSING is listed in `/job_site/patch_register.md` as an unresolved execution blocker. Every §14 deferred row has an explicit deferral source in the manifest or in `parity_scope_lock.md`.

If any row in §9–§11 is re-verified and changes status from MISSING to PRESENT in a future S3/S5 pass, the corresponding entry in `/job_site/patch_register.md` must be updated to reflect resolution. The deploy-app import-graph subtrees named in §13 are NOT counted as parity-matrix rows (they are covered by deploy_app_root scope_lock.excluded) but are tracked as new patch_register.md entries against the build-time FAIL.
