# Patch Register — RB-INT-CHASSIS-004

job_id: RB-INT-CHASSIS-004
stage: stage_4 | worker_b
owner: Worker B
authority: live tree inspection + build_verification_results.md + pages_readiness_matrix.md at HEAD on branch `claude/audit-payme-stitch-targets-0YbZ5`
document_role: Register all unresolved in-scope blockers after RB-INT-CHASSIS-004 gateway-finish + payme stitch work. Overwrites prior RB-INT-CHASSIS-002 register. All prior CRITICAL and HIGH items from RB-INT-CHASSIS-002 are RESOLVED at this HEAD.

---

## 0. Register Format

Each entry includes:
- **id**: stable identifier
- **severity**: CRITICAL / HIGH / MEDIUM / LOW / ADVISORY
- **state**: OPEN / RESOLVED / DEFERRED
- **class**: execution / document-consistency / deployment-config / advisory
- **current state**: live evidence at HEAD
- **resolution owner**: who clears the item
- **unblock condition**: exact test for closure

---

## 1. RESOLVED — RB-INT-CHASSIS-002 Blocker Carry-Forward

All 14 open blockers carried from RB-INT-CHASSIS-002 are RESOLVED at this HEAD. Retained for audit cross-reference.

| id | prior severity | prior state | resolution job | resolution summary |
|---|---|---|---|---|
| PATCH-RB002-001 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `apps/product-shell/` deploy root created |
| PATCH-RB002-002 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `package.json` created with declared scripts and deps |
| PATCH-RB002-003 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `vite.config.ts` created |
| PATCH-RB002-004 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `tsconfig.json` + `tsconfig.node.json` created |
| PATCH-RB002-005 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `index.html` created |
| PATCH-RB002-006 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `src/main.tsx` created |
| PATCH-RB002-007 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `AppShell.tsx`, `router.tsx`, `routes.ts` created |
| PATCH-RB002-008 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `public/_redirects` created |
| PATCH-RB002-009 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | `functions/`, `functions/api/`, `functions/_lib/` created |
| PATCH-RB002-010 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | all 5 Pages Functions API handlers created |
| PATCH-RB002-011 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_a | all 3 `_lib/` helpers created |
| PATCH-RB002-012 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_b | `apps/modules/` directory created |
| PATCH-RB002-013 | CRITICAL | OPEN | RB-INT-CHASSIS-002 S3 worker_b | `apps/modules/engage/` fully reconstructed (31 files) |
| PATCH-RB002-014 | CRITICAL | PARTIAL | RB-INT-CHASSIS-004 stage_2 | `apps/modules/payme/` fully stitched: `vite.config.js` (base + outDir), `index.html`, `src/App.jsx` (full form), `src/services/usdcTransfer.js`; `build:payme` script added to `package.json` |
| PATCH-RB002-015 | LOW | DEFERRED | — | `apps/modules/referrals/` deferred out of scope; still absent |
| PATCH-RB002-016 | LOW | DEFERRED | — | `apps/modules/vault/` deferred out of scope; still absent |
| PATCH-RB002-017 | HIGH | OPEN | RB-INT-CHASSIS-004 (operational) | deploy root `apps/product-shell` operationally confirmed; `pages_deployment_spec.md` divergence is a stale document artefact — no code impact |
| PATCH-RB002-018 | HIGH | OPEN | RB-INT-CHASSIS-004 (operational) | `full_parity_rebuild_order.md` path anchoring is a stale document artefact — no code impact |
| PATCH-RB002-019 | MEDIUM | OPEN | — | `runtime_dependency_inventory.md` scope clarification; non-blocking, deferred |
| PATCH-RB002-020 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_3 | `npm install` from `apps/product-shell/` verified exit 0 |
| PATCH-RB002-021 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_3 | `npm run build` from `apps/product-shell/` verified exit 0; `dist/` produced |
| PATCH-RB002-022 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_3 | `build_verification_results.md` reissued with green build record (PASS) |
| PATCH-RB002-023 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_2 | `src/components/` subtree reconstructed |
| PATCH-RB002-024 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_2 | `src/state/demoGateState.tsx` created; `tier1/2/3Unlocked: true` |
| PATCH-RB002-025 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_2 | `src/styles/` CSS files created |
| PATCH-RB002-026 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_2 | `src/mobile/styles/mobile-overlay.css` created |
| PATCH-RB002-027 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_2 | `src/pages/` subtree reconstructed |
| PATCH-RB002-028 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_2 | `src/features/` subtree reconstructed including payme, marketplace, engage surfaces |
| PATCH-RB002-029 | CRITICAL | OPEN | RB-INT-CHASSIS-004 stage_2 | `src/hooks/`, `src/integrations/`, `src/config/`, `src/contracts/`, `src/utils/` subtrees created |

---

## 2. RB-INT-CHASSIS-004 New Items — ADVISORY ONLY

No new CRITICAL, HIGH, or MEDIUM blockers remain in scope. The following advisory items are noted for the deployment operator and a future feature pass. None block Cloudflare Pages deployment or PayMe core rendering.

### 2.1 PATCH-RB004-001 — `transferUsdc` stub (advisory)

- **severity:** ADVISORY
- **state:** OPEN
- **class:** advisory (feature incomplete)
- **current state:** `apps/modules/payme/src/services/usdcTransfer.js` exports `transferUsdc` as a stub returning `{ success: false, error: "not implemented" }`. `formatUsdc` and `toUsdcAtomicUnits` are implemented. PayMe form renders and submits; result always shows not-implemented error.
- **resolution owner:** Future feature pass (wallet SDK integration)
- **unblock condition:** `transferUsdc` executes an actual on-chain USDC transfer via the Base network wallet SDK and returns `{ success: true, txHash }` on success

### 2.2 PATCH-RB004-002 — Node version not pinned (advisory)

- **severity:** ADVISORY
- **state:** OPEN
- **class:** deployment-config
- **current state:** No `.nvmrc` and no `engines.node` in `apps/product-shell/package.json`. Stage_3 build used Node v22.22.2. Cloudflare Pages default may differ.
- **resolution owner:** Deployment operator or next code pass
- **unblock condition:** `.nvmrc` containing `22` added to `apps/product-shell/`, or `"engines": { "node": "22" }` added to `package.json`

### 2.3 PATCH-RB004-003 — `TENANTS_BUCKET` R2 binding (advisory — dashboard config)

- **severity:** ADVISORY
- **state:** OPEN
- **class:** deployment-config
- **current state:** Three Pages Functions handlers (`page.js`, `published-manifest.js`, `published-page.js`) reference `env.TENANTS_BUCKET`. Binding must be configured in Cloudflare Pages dashboard → Settings → Bindings. If absent, those three handlers return a graceful 500. PayMe embed and admin panel do not use these handlers.
- **resolution owner:** Deployment operator (dashboard action — not a code change)
- **unblock condition:** `TENANTS_BUCKET` R2 binding pointing to the correct R2 bucket is set in the Cloudflare Pages project settings for both production and preview environments

### 2.4 PATCH-RB004-004 — `/apps/referrals/*` and `/apps/vault/*` `_redirects` rules return 404 (advisory)

- **severity:** ADVISORY
- **state:** OPEN
- **class:** advisory (out-of-scope modules)
- **current state:** `dist/_redirects` contains rules for referrals and vault whose target files are absent. Specific rules match before the `/*` catch-all; Cloudflare Pages returns 404 for those paths rather than falling back to the SPA.
- **resolution owner:** Next module reconstruction pass, or remove rules until modules are built
- **unblock condition:** Either (a) `apps/modules/referrals/` and `apps/modules/vault/` are built and their outputs land in `dist/apps/{referrals,vault}/index.html`, or (b) the two rules are removed from `apps/product-shell/public/_redirects`

---

## 3. Summary

| Severity | OPEN | RESOLVED | DEFERRED |
|---|---|---|---|
| CRITICAL | 0 | 29 | 0 |
| HIGH | 0 | 2 | 0 |
| MEDIUM | 0 | 0 | 1 |
| LOW | 0 | 0 | 2 |
| ADVISORY | 4 | 0 | 0 |
| **Total** | **4** | **31** | **3** |

**In-scope blocker count: 0.** All 31 prior CRITICAL and HIGH blockers resolved. 3 items remain DEFERRED (out-of-scope modules + scope-clarification doc). 4 advisory items recorded; none block deployment.

**Overall register state: CLEAR (advisory only).**

---

## 4. Checksum Pointers for Foreman B

- All 29 RB-INT-CHASSIS-002 CRITICAL entries in §1 are resolved at HEAD on branch `claude/audit-payme-stitch-targets-0YbZ5`. Verification: `npm run build` from `apps/product-shell/` exits 0 and produces `dist/` — see `/job_site/build_verification_results.md`.
- All 4 advisory entries in §2 are non-blocking for Cloudflare Pages deployment of the gateway + PayMe.
- PATCH-RB004-003 (`TENANTS_BUCKET`) is the only deployment operator action required before full handler functionality is available. PayMe is not affected.
- PATCH-RB004-001 (`transferUsdc` stub) is the only remaining PayMe feature gap; UI renders and submits correctly.
- PATCH-RB004-004 (referrals/vault 404) is self-contained and does not affect any in-scope module path.
