# Deploy Surface Change Manifest — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S3
pass: deploy app root only
worker: worker_a
authority: record of exact file-system changes made under apps/product-shell/ for the deploy app surface
source_matrix: /job_site/missing_surface_matrix.yaml
source_manifest: /job_site/full_parity_target_path_manifest.yaml (S2 declared_deploy_root: apps/product-shell)
baseline_source: https://github.com/blackholecapital/gatweay-production-FREEZE (shallow clone at /tmp/baseline-freeze)

---

## 1. Scope Lock (enforced)

This pass creates exactly the deploy app root surfaces declared in the S2 target
path manifest scope_lock. All other missing baseline surfaces (modules, admin
apps, full component tree, full public assets, tests, production, resolver,
variation, review, docs) are explicitly deferred and NOT touched by this pass.

---

## 2. Change Set Summary

| metric | value |
|---|---|
| files created | 18 |
| files modified | 0 |
| files deleted | 0 |
| directories created | 7 |
| deploy root | `apps/product-shell` |
| copy method | verbatim byte-for-byte from baseline product-shell/* |
| total bytes written | 34692 |

---

## 3. Directories Created

- `apps/product-shell/`
- `apps/product-shell/src/`
- `apps/product-shell/src/app/`
- `apps/product-shell/public/`
- `apps/product-shell/functions/`
- `apps/product-shell/functions/api/`
- `apps/product-shell/functions/_lib/`

---

## 4. Files Created

### 4.1 Package manifest

| target_path | baseline_path | bytes | action |
|---|---|---|---|
| apps/product-shell/package.json | product-shell/package.json | 755 | create (verbatim) |

Declared name: `gateway-demo-zero`. Scripts: `dev`, `build` (= `npm run build:engage && vite build`), `preview`, `build:engage` (`npm --prefix ../modules/engage install --progress=false && npm --prefix ../modules/engage run build`), `test`, `test:pass5`, `typecheck`. Dependencies: react ^18.3.1, react-dom ^18.3.1, react-router-dom ^6.26.2. DevDependencies: @types/react ^18.3.3, @types/react-dom ^18.3.0, @vitejs/plugin-react ^4.3.1, typescript ^5.5.4, vite ^5.4.2.

### 4.2 HTML entrypoint

| target_path | baseline_path | bytes | action |
|---|---|---|---|
| apps/product-shell/index.html | product-shell/index.html | 459 | create (verbatim) |

Contains `<title>Gateway</title>`, favicon links to `/drip.png`, `<div id="root"></div>`, `<script type="module" src="/src/main.tsx"></script>`.

### 4.3 Build configs

| target_path | baseline_path | bytes | action |
|---|---|---|---|
| apps/product-shell/vite.config.ts | product-shell/vite.config.ts | 161 | create (verbatim) |
| apps/product-shell/tsconfig.json | product-shell/tsconfig.json | 398 | create (verbatim) |
| apps/product-shell/tsconfig.node.json | product-shell/tsconfig.node.json | 213 | create (verbatim) |

### 4.4 App bootstrap (src/main.tsx + src/app/)

| target_path | baseline_path | bytes | action |
|---|---|---|---|
| apps/product-shell/src/main.tsx | product-shell/src/main.tsx | 707 | create (verbatim) |
| apps/product-shell/src/app/AppShell.tsx | product-shell/src/app/AppShell.tsx | 264 | create (verbatim) |
| apps/product-shell/src/app/router.tsx | product-shell/src/app/router.tsx | 6440 | create (verbatim) |
| apps/product-shell/src/app/routes.ts | product-shell/src/app/routes.ts | 691 | create (verbatim) |

### 4.5 Public asset — _redirects

| target_path | baseline_path | bytes | action |
|---|---|---|---|
| apps/product-shell/public/_redirects | product-shell/public/_redirects | 214 | create (verbatim) |

Declared rules:
```
/apps/payme/*    /apps/payme/index.html    200
/apps/engage/*   /apps/engage/index.html   200
/apps/referrals/* /apps/referrals/index.html 200
/apps/vault/*    /apps/vault/index.html    200

/*    /index.html   200
```

### 4.6 Pages Functions — functions/api/ (5 endpoints)

| target_path | baseline_path | bytes | action |
|---|---|---|---|
| apps/product-shell/functions/api/microfrontend-bootstrap.js | product-shell/functions/api/microfrontend-bootstrap.js | 2271 | create (verbatim) |
| apps/product-shell/functions/api/microfrontend-trust-log.js | product-shell/functions/api/microfrontend-trust-log.js | 3022 | create (verbatim) |
| apps/product-shell/functions/api/page.js | product-shell/functions/api/page.js | 3156 | create (verbatim) |
| apps/product-shell/functions/api/published-manifest.js | product-shell/functions/api/published-manifest.js | 1652 | create (verbatim) |
| apps/product-shell/functions/api/published-page.js | product-shell/functions/api/published-page.js | 3027 | create (verbatim) |

Declared route bindings under Pages Functions file-based routing:
- `/api/microfrontend-bootstrap`
- `/api/microfrontend-trust-log`
- `/api/page`
- `/api/published-manifest`
- `/api/published-page`

### 4.7 Pages Functions — functions/_lib/ (3 libs)

| target_path | baseline_path | bytes | action |
|---|---|---|---|
| apps/product-shell/functions/_lib/runtime-compiler.js | product-shell/functions/_lib/runtime-compiler.js | 3978 | create (verbatim) |
| apps/product-shell/functions/_lib/runtime-r2.js | product-shell/functions/_lib/runtime-r2.js | 330 | create (verbatim) |
| apps/product-shell/functions/_lib/runtime-schema.js | product-shell/functions/_lib/runtime-schema.js | 6954 | create (verbatim) |

Not routed (leading-underscore convention). Consumed via relative import by handlers under `apps/product-shell/functions/api/`.

---

## 5. Verification Against Build Sheet S3 worker_a expected_artifacts

| build_sheet_declared | created_path | status |
|---|---|---|
| declared deploy app root from /job_site/deploy_root_plan.md | `apps/product-shell/` | present |
| package.json | apps/product-shell/package.json | present |
| index.html | apps/product-shell/index.html | present |
| vite.config.ts | apps/product-shell/vite.config.ts | present |
| tsconfig.json | apps/product-shell/tsconfig.json | present |
| tsconfig.node.json | apps/product-shell/tsconfig.node.json | present |
| src/main.tsx | apps/product-shell/src/main.tsx | present |
| src/app/ | apps/product-shell/src/app/ (AppShell.tsx, router.tsx, routes.ts) | present |
| public/_redirects | apps/product-shell/public/_redirects | present |
| functions/api/ | apps/product-shell/functions/api/ (5 handlers) | present |
| functions/_lib/ | apps/product-shell/functions/_lib/ (3 libs) | present |
| /job_site/deploy_surface_change_manifest.md | /job_site/deploy_surface_change_manifest.md | present (this file) |

---

## 6. Out-of-Scope (deferred)

The following baseline deploy-app surfaces are NOT created by this pass and
remain classified `missing` in `/job_site/missing_surface_matrix.yaml`:

- `apps/product-shell/src/components/` (23 component files under admin/, cards/, gate/, integrations/, layout/, nav/, tenant/)
- `apps/product-shell/src/config/` (nav.config.ts, pageBackgrounds.ts, staticPageAssets.ts)
- `apps/product-shell/src/contracts/microfrontend.ts`
- `apps/product-shell/src/features/` (engage, marketplace, payme, referrals)
- `apps/product-shell/src/hooks/` (usePublishedExclusiveTiles.ts, useViewportMode.ts)
- `apps/product-shell/src/integrations/spine/` (bridge.ts, index.ts, registry.ts, types.ts)
- `apps/product-shell/src/pages/` (11 pages)
- `apps/product-shell/src/runtime/` (4 runtime files)
- `apps/product-shell/src/state/demoGateState.tsx`
- `apps/product-shell/src/styles/` (8 CSS files)
- `apps/product-shell/src/utils/` (5 util files)
- `apps/product-shell/src/mobile/`
- `apps/product-shell/public/ads/`, `public/apps/`, `public/demo/`, `public/wallpapers/`, `drip.png`
- `apps/product-shell/tests/microfrontend/`
- `apps/product-shell/README.md`, `blueprint/`, `docs/`
- Module packages: `modules/engage`, `modules/payme`, `modules/referrals`, `modules/vault`
- Admin apps: `engagefi-admin-minimal`, `payme-admin-minimal`, `referral-admin-minimal`
- `production/`, `resolver-boundary/`, `variation-control/`, `_review-required/`

A subsequent S3 or S4 pass is required to rebuild these surfaces before
the tree is buildable or Pages-deployable.

---

## 7. Build-Time Dependency Alert

`apps/product-shell/package.json` declares `build` as
`npm run build:engage && vite build`. `build:engage` resolves the sibling
directory `../modules/engage` relative to `apps/product-shell/`, i.e.
`apps/modules/engage`, which does NOT exist in the current tree.

- A `vite build` run from `apps/product-shell` would also fail before
  reaching the engage step because `apps/product-shell/src/main.tsx` imports
  from `./app/AppShell`, which itself imports from `../components/*`,
  `../pages/*`, `../features/*`, and `../runtime/*` — none of which are
  created by this pass.

Build verification is therefore OUT OF SCOPE for this S3 pass and is
deferred to a later S3 / S4 pass and the S5 build verification step.

---

## 8. Conflicts Flagged (non-blocking for this pass)

### 8.1 pages_deployment_spec.md (on main) deploy root mismatch

`/job_site/pages_deployment_spec.md` (as present on origin/main) declares
`deploy_root_path = / (repo root)` with expected artifact paths at `/package.json`,
`/index.html`, `/vite.config.ts`, `/src/main.tsx`, `/public/_redirects`,
`/functions/api/`, `/functions/_lib/`. This directly conflicts with:

- `/job_site/full_parity_target_path_manifest.yaml` (on main and on branch) which
  declares `declared_deploy_root: apps/product-shell` and target paths
  `apps/product-shell/*`.
- The S3 foreman dispatch which names expected artifacts at `apps/product-shell/*`.
- `/job_site/deploy_root_plan.md` (on branch) which declares deploy root
  `apps/product-shell`.

Resolution applied for this pass: Executed per the target path manifest and
foreman dispatch (chassis-native deploy root `apps/product-shell`), because
three authorities agree against one. The pages_deployment_spec.md
divergence requires reconciliation by Factory Control Interface before S5
build verification.

### 8.2 fragment_allowlist.md (on main) is for RB-INT-CHASSIS-001

`/job_site/fragment_allowlist.md` (as present on origin/main) is titled
"Fragment Allowlist — RB-INT-CHASSIS-001 | S2" and declares
"No full-file verbatim copy of any gateway source file". The current run is
RB-INT-CHASSIS-002 whose objective is a "deployable identical working copy"
— which by definition requires verbatim baseline reconstruction of the deploy
app surface.

Resolution applied for this pass: The RB-INT-CHASSIS-001 fragment allowlist
was treated as a reference for a different job (per its own header) and not
applied to this RB-INT-CHASSIS-002 S3 pass. Whole-file verbatim copies were
used because the build-sheet-RB-INT-CHASSIS-002 objective and the S3 expected
artifact list require them. A RB-INT-CHASSIS-002-specific
`full_parity_fragment_allowlist.md` was not present on origin/main; if one is
produced that constrains this run, this pass may require re-evaluation.

Both conflicts are logged here so Foreman B / Factory Control Interface can
adjudicate before S5 begins.

---

## 9. Repo Mirror / Commit / Push Evidence

| field | value |
|---|---|
| repo_mirror | yes — writes made to working tree at `/home/user/gateway-fullbody-freeze/apps/product-shell/` |
| commit_required | yes |
| push_required | yes |
| branch | claude/inventory-app-structure-Ilqh1 |
| commit_hash | (recorded post-commit; see git log) |
| pushed_to | origin/claude/inventory-app-structure-Ilqh1 |

---

## 10. Checksum Pointers for Foreman B

- Every declared target path in `/job_site/full_parity_target_path_manifest.yaml` scope_lock.included exists at the declared path under `apps/product-shell/`.
- Every created file is a byte-for-byte copy of its declared baseline source.
- Scope lock is enforced — no file outside the declared scope was created, modified, or deleted.
- Two inter-reference conflicts (§8.1, §8.2) are flagged but did not block execution because the foreman dispatch, build sheet S3 expected artifacts, and target path manifest all align on `apps/product-shell/*`.
