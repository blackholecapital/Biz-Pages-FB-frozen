# Pages Readiness Matrix — RB-INT-CHASSIS-002

job_id: RB-INT-CHASSIS-002
stage: S5 (verification; dispatched under S3 label but task-content matches S5 Worker B per build sheet)
owner: Worker B
authority: non-authoritative — derived from /job_site/pages_deployment_spec.md, /job_site/deploy_root_plan.md, /job_site/full_parity_target_path_manifest.yaml, and live tree inspection at `/home/user/gateway-fullbody-freeze`
document_role: Record PASS/FAIL verdict for each Cloudflare Pages deployment readiness criterion against the current tree state.

---

## 0. Evaluation Basis

- **Live tree:** `/home/user/gateway-fullbody-freeze` at HEAD of branch `claude/deployment-dependency-inventory-XAAp0` (commit 06a69ae).
- **Declared deploy root (authoritative per S2 Worker A):** `apps/product-shell` — from `/job_site/deploy_root_plan.md` §1.
- **Pages deployment spec conflict note:** `/job_site/pages_deployment_spec.md` (S2 Worker B deploy-app pass) declares deploy root as `/` (repo root). This conflicts with `/job_site/deploy_root_plan.md` which declares `apps/product-shell`. Resolution: `deploy_root_plan.md` is the named S2 Worker A deliverable and is treated as authoritative for verification; the `pages_deployment_spec.md` divergence is logged as a blocker in `/job_site/patch_register.md` §3.

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
| 2.1 | Deploy root exists as a directory | `apps/product-shell` (deploy_root_plan.md §1) | directory does not exist — `ls apps/product-shell` returns "No such file or directory" | FAIL |
| 2.2 | Package manifest at deploy root | `apps/product-shell/package.json` with `name: gateway-demo-zero`, scripts `{dev, build, preview, build:engage, test, test:pass5, typecheck}`, dependencies `{react, react-dom, react-router-dom}`, devDependencies `{@types/react, @types/react-dom, @vitejs/plugin-react, typescript, vite}` (full_parity_target_path_manifest.yaml §SECTION 1) | file does not exist | FAIL |
| 2.3 | Install command resolves | `npm install` from `apps/product-shell/` (deploy_root_plan.md §4) | unable to resolve — deploy root missing (2.1), manifest missing (2.2) | BLOCKED |
| 2.4 | Build command resolves | `npm run build` → `npm run build:engage && vite build` from `apps/product-shell/` (deploy_root_plan.md §4) | unable to resolve — manifest missing (2.2); `build:engage` also depends on `../modules/engage/package.json` which is missing (see 2.8) | BLOCKED |
| 2.5 | Output directory | `apps/product-shell/dist` (deploy_root_plan.md §4) | cannot exist until build runs; build is BLOCKED (2.4) | BLOCKED |
| 2.6 | Vite build config | `apps/product-shell/vite.config.ts` declaring `plugins: [react()], server: { port: 5173 }` (full_parity_target_path_manifest.yaml §SECTION 3) | file does not exist | FAIL |
| 2.7 | TypeScript configs | `apps/product-shell/tsconfig.json` + `apps/product-shell/tsconfig.node.json` (full_parity_target_path_manifest.yaml §SECTION 3) | files do not exist | FAIL |
| 2.8 | Baseline sibling module graph | `apps/modules/engage/` with `package.json`, `vite.config.js`, `index.html`, `src/`, `public/_redirects`, `package-lock.json` (full_parity_target_path_manifest.yaml §SECTION 7) | `apps/modules/` directory does not exist | FAIL |
| 2.9 | Redirects file | `apps/product-shell/public/_redirects` with canonical rules including `/apps/{payme,engage,referrals,vault}/*` fallthrough and SPA fallback `/*  /index.html  200` (full_parity_target_path_manifest.yaml §SECTION 5) | file does not exist | FAIL |
| 2.10 | Public assets directory | `apps/product-shell/public/` (full_parity_target_path_manifest.yaml §SECTION 5) | directory does not exist | FAIL |
| 2.11 | Pages Functions directory | `apps/product-shell/functions/` (full_parity_target_path_manifest.yaml §SECTION 6) | directory does not exist | FAIL |
| 2.12 | Pages Functions `api/` subdir with 5 handlers | `apps/product-shell/functions/api/{microfrontend-bootstrap, microfrontend-trust-log, page, published-manifest, published-page}.js` (full_parity_target_path_manifest.yaml §SECTION 6) | files do not exist | FAIL |
| 2.13 | Pages Functions `_lib/` subdir with 3 helpers | `apps/product-shell/functions/_lib/{runtime-compiler, runtime-r2, runtime-schema}.js` (full_parity_target_path_manifest.yaml §SECTION 6) | files do not exist | FAIL |
| 2.14 | HTML entry | `apps/product-shell/index.html` referencing `/src/main.tsx` (full_parity_target_path_manifest.yaml §SECTION 2) | file does not exist | FAIL |
| 2.15 | Script entry | `apps/product-shell/src/main.tsx` importing from `./app/AppShell` (full_parity_target_path_manifest.yaml §SECTION 4) | file does not exist | FAIL |
| 2.16 | App root composition | `apps/product-shell/src/app/{AppShell.tsx, router.tsx, routes.ts}` (full_parity_target_path_manifest.yaml §SECTION 4) | files do not exist | FAIL |
| 2.17 | Cross-document consistency of deploy root | deploy_root_plan.md → `apps/product-shell`; pages_deployment_spec.md → `/` (repo root) | documents CONFLICT | FAIL |

---

## 3. Summary

| Criterion class | PASS | FAIL | BLOCKED | N/A |
|---|---|---|---|---|
| deploy root + dir shape | 0 | 2 | 0 | 0 |
| build command chain | 0 | 0 | 2 | 0 |
| build config | 0 | 3 | 0 | 0 |
| static routing + assets | 0 | 3 | 0 | 0 |
| Pages Functions | 0 | 3 | 0 | 0 |
| app bootstrap | 0 | 3 | 0 | 0 |
| module graph prerequisites | 0 | 1 | 0 | 0 |
| document consistency | 0 | 1 | 0 | 0 |
| output directory | 0 | 0 | 1 | 0 |
| **Total** | **0** | **16** | **3** | **0** |

**Headline verdict: FAIL.** Zero of the 17 Cloudflare Pages readiness criteria PASS. Sixteen are FAIL (declared-but-missing), three are BLOCKED (depend on FAILed prerequisites), one document-consistency FAIL (deploy-root divergence between two S2 deliverables).

---

## 4. Root Cause

No S3 execution pass has been performed. S2 Worker A produced `deploy_root_plan.md` and `full_parity_target_path_manifest.yaml` (sections 1–6 deploy app, section 7 modules added across four S3 worker_b mapping sub-passes). S2 Worker B produced `pages_deployment_spec.md` (deploy-app pass) and `full_parity_rebuild_order.md` (deploy-app pass). All of these artifacts are **planning documents**. None of them write any chassis tree file.

S3 Worker A (execution of deploy app) and subsequent S3 Worker B execution passes (writing the actual module files) have not been dispatched in this branch's history. Commits on `claude/deployment-dependency-inventory-XAAp0` through 06a69ae cover only `/job_site/*.md|*.yaml` documents; no chassis tree file has been created or modified.

---

## 5. Checksum Pointers for Foreman B

- Every row in §2 is verifiable by filesystem check at `/home/user/gateway-fullbody-freeze` against the declared path.
- Every row in §2 names its authoritative source document (deploy_root_plan.md, pages_deployment_spec.md, or full_parity_target_path_manifest.yaml) by section reference.
- The document-consistency FAIL (row 2.17) is cross-referenced in `/job_site/patch_register.md` §3.
- Every FAIL and BLOCKED row is mirrored in `/job_site/parity_verification_matrix.md` as an individual parity-surface row and in `/job_site/patch_register.md` as an unresolved item.
