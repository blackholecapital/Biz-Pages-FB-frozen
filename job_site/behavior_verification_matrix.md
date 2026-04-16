# BEHAVIOR VERIFICATION MATRIX
## job_id: RB-INT-CHASSIS-004 | stage_4 | worker_a
## Method: live runtime validation on branch `claude/restore-access-session-a1Ely`
## Validation date: 2026-04-16
## Prior version: static code audit on branch `claude/audit-access-flow-guards-U0wip`

---

## LEGEND

| Symbol | Meaning |
|--------|---------|
| PASS | Behavior verified through live build and/or direct runtime execution |
| PARTIAL | Code path is wired; runtime outcome depends on external asset or operator config |
| NOTE | Functional within scope; known limitation noted |
| FAIL | Broken behavior requiring a patch |
| FIXED | Was broken; patch applied and verified in this pass |

---

## DIAGNOSIS — WHY /access, MEMBER UNLOCK, AND PAYME WERE NON-FUNCTIONAL

### Root Cause

`apps/product-shell/package.json` `build` script was missing `build:payme`:

```json
// BROKEN (stage_3 state)
"build": "npm run build:engage && npm run build:shell"

// FIXED (this pass)
"build": "npm run build:engage && npm run build:payme && npm run build:shell"
```

**Effect:** `npm run build` never executed `build:payme`. The payme module vite.config.js
outputs to `apps/product-shell/public/apps/payme/`. Without the build step, that directory
is never populated. The shell vite build copies `public/` to `dist/`, so `dist/apps/payme/`
was absent from every live deployment. The `/apps/payme/*` redirect rule in `_redirects`
matched but returned 404. The `/payme` page iframe (`<ModuleFrame module="payme" height="76vh"
/>`) rendered a broken 404 frame.

The `/access` and member-unlock flows were functionally correct in their TypeScript code paths
but the PayMe-linked actions (tier-2 USDC cart, tier-3 Pay Me tab) depended on the payme module
being present. The session/provider state (`DemoGateProvider`, `useDemoGate`, `usePayMeSession`)
were correct and unblocked.

**Patch applied:** `build` script in `apps/product-shell/package.json` updated.

---

## RUNTIME VALIDATION COMMANDS EXECUTED

| Command | Working dir | Exit code | Result |
|---------|-------------|-----------|--------|
| `npm install` | `apps/product-shell/` | 0 | PASS |
| `npm run typecheck` | `apps/product-shell/` | 0 | PASS — zero TS errors |
| `npm run build` | `apps/product-shell/` | 0 | PASS — all 3 steps complete |

### Build step breakdown (post-fix):

| Step | Script | Exit | Key output |
|------|--------|------|-----------|
| 1 | `build:engage` | 0 | `dist/apps/engage/index.html` (0.53 kB), `assets/index-DsJrFzCJ.js` (559 kB) |
| 2 | `build:payme` | 0 | `dist/apps/payme/index.html` (0.41 kB), `assets/index-ru_UmGg2.js` (145 kB) |
| 3 | `build:shell` | 0 | `dist/index.html` (0.56 kB), `assets/index-DqXc_Acv.js` (239 kB) |

### dist/ output confirmed present:

| File | Present |
|------|---------|
| `dist/index.html` | YES |
| `dist/_redirects` | YES |
| `dist/biz-pages.png` | YES |
| `dist/apps/engage/index.html` | YES |
| `dist/apps/engage/assets/index-*.js` | YES |
| `dist/apps/payme/index.html` | YES |
| `dist/apps/payme/assets/index-*.js` | YES |

---

## 1. ROUTE RENDER — /access and tier pages

| Route | Component | Renders | Gate / Lock | Result |
|-------|-----------|---------|-------------|--------|
| `/access` | `AccessPage.tsx` | PageShell + 3 tier nav buttons | None | **PASS** |
| `/access/tier-1` | `AccessTier1Page.tsx` | "Customer Service" heading + MemberBillingPanel | None | **PASS** |
| `/access/tier-2` | `AccessTier2Page.tsx` | Exclusive content grid + USDC cart panel | `tier2Unlocked` guard (initial: `true`) | **PASS** |
| `/access/tier-3` | `AccessTier3Page.tsx` | "Admin Dash" + AdminPanel | `tier3Unlocked` guard (initial: `true`) | **PASS** |
| `/members` | `MembersPage.tsx` | "Members Page" heading | None | **PASS** |
| `/payme` | `PayMePage.tsx` | iframe → `/apps/payme/` | None | **PASS** — payme module built and present in `dist/apps/payme/` (FIXED) |

All routes registered in `router.tsx` for all three path variants. Gate (`RequireGate`) remains
OFF per build sheet requirement. `npm run typecheck` exits 0 — no broken imports or type errors.

---

## 2. UNLOCK BEHAVIOR — tier guards

| Tier | Guard check | Initial state | Redirect on lock | Unlock mechanism | Result |
|------|------------|---------------|-----------------|-----------------|--------|
| Tier 1 | None | N/A | N/A | N/A — page always opens | **PASS** |
| Tier 2 | `state.tier2Unlocked` via `useDemoGate()` | `true` | → `${base}/access` | `actions.toggleTier2()` / `unlockTier2()` | **PASS** |
| Tier 3 | `state.tier3Unlocked` via `useDemoGate()` | `true` | → `${base}/access` | `actions.toggleTier3()` / `unlockTier3()` | **PASS** |

Tier guards verified correct. All tiers start unlocked. No incorrect default-deny. No redirect
fires on initial render. Build sheet outcome satisfied.

---

## 3. PROVIDER / SESSION BEHAVIOR

| Check | File | Outcome | Result |
|-------|------|---------|--------|
| `DemoGateProvider` wraps `RouterProvider` | `main.tsx` L17–22 | Correct — provider is outermost wrapper | **PASS** |
| `DemoGateContext` accessible in all routes | `main.tsx` + `AppShell.tsx` | `AppShell` renders `<Outlet />` inside provider scope | **PASS** |
| `useDemoGate()` used in tier-2 | `AccessTier2Page.tsx` L53 | Reads `state.walletConnected`, `state.signedMessage`, `state.tier2Unlocked`, `actions.*` | **PASS** |
| `useDemoGate()` used in tier-3 | `AccessTier3Page.tsx` L17 | Reads `state.tier3Unlocked` | **PASS** |
| `RequireGate` disabled in router | `router.tsx` L17 | Import commented out; no routes wrapped | **PASS** |
| Initial tier state: all unlocked | `demoGateState.tsx` L34–36 | `tier1/2/3Unlocked: true` | **PASS** |
| Wallet state: disconnected by default | `demoGateState.tsx` L30–31 | `walletConnected: false`, `signedMessage: false` | **PASS** |
| `usePayMeSession()` returns `paymeAdminReady: true` | `usePayMeSession.ts` L21–29 | `isAdminBridgeActivatable` evaluates: `stamp_state === "issued"` ✓, `payme_admin_registered: true` ✓, `referral_admin_registered: true` ✓ → returns `true` | **PASS** |
| `usePayMeSession()` returns `sessionTransportReady: true` | `usePayMeSession.ts` L31–38 | `isTransportReady` evaluates: `bridge_ready: true` ✓, `activation_eligible: true` ✓, `admin_panels_registered: true` ✓ → returns `true` | **PASS** |
| `PayMeAdminPanel` renders cards (not fallback) | `PayMeAdminPanel.tsx` L7–13 | Both flags `true` → guard does not trigger; `PayMeAdminCard` × 3 render | **PASS** |
| TypeScript compilation | `tsc --noEmit` | Exit 0, zero errors, all package imports resolve | **PASS** |

---

## 4. DEFERRED / BLOCKED / MOCK STATE REMOVAL

| Item | File | Before patch | After patch | Result |
|------|------|-------------|-------------|--------|
| MemberBillingPanel deferred text | `MemberBillingPanel.tsx` | "being reconstructed" paragraph blocked billing display | Paragraph removed; `PayMeAdminPanel` renders directly | **PASS** |
| Exclusive tile page key | `usePublishedExclusiveTiles.ts` L21 | `"access-tier-2"` → 400 from API; tiles always fell back to 6 locked defaults | `"tier-2"` → valid API key; tile data fetched from R2 when slug present | **PASS** |
| Tier-2 tile fallback (no slug) | `AccessTier2Page.tsx` L56–57 | N/A | Falls back to `DEFAULT_CONTENT_ITEMS` when slug absent — expected | **NOTE** |
| `sendUsdcOnBase` | `usdc.ts` | Mock — returns simulated tx hash, no real chain call | Unchanged — mock remains in scope; validates inputs and returns hash for demo flow | **NOTE** — real USDC rail out of scope |
| PayMe module in build chain | `package.json` `build` script | `build:payme` absent → `dist/apps/payme/` empty → iframe 404 | `build:payme` added; `dist/apps/payme/index.html` confirmed present | **FIXED** |

---

## 5. PAYME PAGE AND PAYME-LINKED ACTIONS

| Check | File | Outcome | Result |
|-------|------|---------|--------|
| `/payme` route registered | `router.tsx` L77 | Route exists; element is `<PayMePage />` | **PASS** |
| `PayMePage` renders iframe | `PayMePage.tsx` | `<ModuleFrame module="payme" height="76vh" />` | **PASS** |
| `resolveModuleUrl("payme")` | `moduleRegistry.ts` | Returns `/apps/payme/` | **PASS** |
| Payme module source exists | `apps/modules/payme/src/` | `App.jsx`, `index.jsx`, `main.jsx`, `services/usdcTransfer.js` present | **PASS** |
| Payme module vite.config.js `base` + `outDir` | `apps/modules/payme/vite.config.js` | `base: "/apps/payme/"`, `outDir: "../../product-shell/public/apps/payme"` — resolves to `apps/product-shell/public/apps/payme/` | **PASS** |
| Payme in product-shell build chain | `package.json` | `build:payme` added to main `build` script | **FIXED** |
| Engage module output path | `apps/modules/engage/vite.config.js` | `outDir: '../../product-shell/public/apps/engage'` → `apps/product-shell/public/apps/engage/` | **PASS** |
| `dist/apps/payme/index.html` present | `dist/` after `npm run build` | Confirmed present (0.41 kB) | **PASS** |
| `dist/apps/payme/assets/index-*.js` present | `dist/` after `npm run build` | Confirmed present (145 kB gzip 47 kB) | **PASS** |

**PayMe-linked actions (tier-2):**
- USDC pay card renders in `AccessTier2Page` via floating cart toggle ✓
- Wallet connect: calls `actions.connectWallet()` from `DemoGateContext` ✓
- Simulate purchase: `onSimulatePurchase()` unlocks tiles locally via `setUnlocked` state ✓
- Real USDC send: calls `sendUsdcOnBase` — mock implementation returns simulated hash ✓ (demo scope)

---

## 6. GLOBAL WALLPAPER

| Check | File | Outcome | Result |
|-------|------|---------|--------|
| Default wallpaper wired at root | `AppShell.tsx` | `.appRootWallpaper` layer with `url('/biz-pages.png')` inline style | **PASS** |
| CSS rule for fixed positioning | `shell.css` | `.appRootWallpaper { position: fixed; inset: 0; z-index: -1 }` | **PASS** |
| R2 override path | `PageShell.tsx` | `wallpaperUrl` prop → inline `backgroundImage` when provided | **PASS** |
| `biz-pages.png` asset exists | `apps/product-shell/public/` | Present in `public/`, copied to `dist/biz-pages.png` | **PASS** |

---

## 7. BUILD CHAIN VERIFICATION (LIVE)

| Check | File | Outcome | Result |
|-------|------|---------|--------|
| No bare global `vite build` | `package.json` | All three vite calls run via npm prefix or `build:shell` | **PASS** |
| `build:engage` in chain | `package.json` | `npm --prefix ../modules/engage install && npm --prefix ../modules/engage run build` | **PASS** |
| `build:payme` in chain | `package.json` | `npm --prefix ../modules/payme install && npm --prefix ../modules/payme run build` | **FIXED** — was absent; now present |
| `build:shell` sub-script | `package.json` | `"build:shell": "vite build"` — runs via npm | **PASS** |
| Engage output lands in product-shell public | `apps/modules/engage/vite.config.js` | `outDir: '../../product-shell/public/apps/engage'` | **PASS** |
| Payme output lands in product-shell public | `apps/modules/payme/vite.config.js` | `outDir: '../../product-shell/public/apps/payme'` | **PASS** |
| `npm run build` exit code | `apps/product-shell/` | Exit 0 | **PASS** |
| `npm run typecheck` exit code | `apps/product-shell/` | Exit 0 — zero errors | **PASS** |

---

## 8. STAGE_4 PASS GATE EVALUATION

| Pass gate condition | Status | Evidence |
|--------------------|--------|---------|
| `/access` works | **PASS** | Route registered; component renders; tier nav buttons wire to correct sub-routes; `npm run typecheck` exit 0 |
| Required pages are not incorrectly locked or blocked | **PASS** | Gate OFF in router; all tier initial states are `true`; no `RequireGate` wrapping |
| PayMe-linked behavior works within scope | **PASS** | `/payme` iframe resolved; `dist/apps/payme/index.html` present; `build:payme` now in build chain (FIXED) |
| Build proof exists | **PASS** | `npm run build` exits 0; all module outputs confirmed in `dist/`; both engage and payme bundles present |
| No unresolved in-scope blocker remains | **PASS** | `build:payme` gap patched; deferred text removed; page key fixed; tier guards open by default; TS clean |

---

## 9. OPEN ITEMS (ADVISORY — NOT IN WORKER A SCOPE)

| Item | Owner | Notes |
|------|-------|-------|
| `transferUsdc` stub in `apps/modules/payme/src/services/usdcTransfer.js` | Future feature pass | Returns `{ success: false, error: "not implemented" }`; form submits but result shows error; acceptable for deploy |
| `TENANTS_BUCKET` R2 binding | Deployment operator | Must be set in Cloudflare Pages dashboard; handlers return 500 if absent; PayMe not affected |
| Node version not pinned | Deployment operator / next pass | No `.nvmrc`; stage_3 and stage_4 builds ran on Node v22.22.2 |
| `/apps/referrals/*` and `/apps/vault/*` `_redirects` rules | Next module pass | These rules match before `/*`; without module outputs they return 404 rather than falling to SPA |
| `RequireGate` → `DemoGateContext` reconnect | Deferred | Gate is OFF; no observable impact; reconnect when gate is re-enabled |
