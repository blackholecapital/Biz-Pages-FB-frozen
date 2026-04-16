# BEHAVIOR VERIFICATION MATRIX
## job_id: RB-INT-CHASSIS-004 | stage_4 | worker_a
## Method: static code audit of current branch (claude/audit-access-flow-guards-U0wip)

---

## LEGEND

| Symbol | Meaning |
|--------|---------|
| PASS | Behavior is wired and correct per code audit |
| PARTIAL | Code path is wired; runtime outcome depends on external asset or Worker B deliverable |
| NOTE | Functional within scope; known limitation noted |
| FAIL | Broken behavior requiring a patch |

---

## 1. ROUTE RENDER — /access and tier pages

| Route | Component | Renders | Gate / Lock | Result |
|-------|-----------|---------|-------------|--------|
| `/access` | `AccessPage.tsx` | PageShell + 3 tier nav buttons | None | **PASS** |
| `/access/tier-1` | `AccessTier1Page.tsx` | "Customer Service" heading + MemberBillingPanel | None | **PASS** |
| `/access/tier-2` | `AccessTier2Page.tsx` | Exclusive content grid + USDC cart panel | `tier2Unlocked` guard (initial: `true`) | **PASS** |
| `/access/tier-3` | `AccessTier3Page.tsx` | "Admin Dash" + AdminPanel | `tier3Unlocked` guard (initial: `true`) | **PASS** |
| `/members` | `MembersPage.tsx` | "Members Page" heading | None | **PASS** |
| `/payme` | `PayMePage.tsx` | iframe → `/apps/payme/` | None | **PARTIAL** — see §5 |

All routes are registered in `router.tsx` for three path variants: base (`/access`),
slug-prefixed (`/:slug/gate/access`), and designation-prefixed (`/:designation/:slug/access`).

---

## 2. UNLOCK BEHAVIOR — tier guards

| Tier | Guard check | Initial state | Redirect on lock | Unlock mechanism | Result |
|------|------------|---------------|-----------------|-----------------|--------|
| Tier 1 | None | N/A | N/A | N/A — page always opens | **PASS** |
| Tier 2 | `state.tier2Unlocked` via `useDemoGate()` | `true` | → `${base}/access` | `actions.toggleTier2()` / `unlockTier2()` | **PASS** |
| Tier 3 | `state.tier3Unlocked` via `useDemoGate()` | `true` | → `${base}/access` | `actions.toggleTier3()` / `unlockTier3()` | **PASS** |

**Tier guard verdict:** All tiers open by default. Guards fire correctly when state is toggled
to locked. No incorrect default-deny. Build sheet outcome satisfied.

---

## 3. PROVIDER / SESSION BEHAVIOR

| Check | File | Outcome | Result |
|-------|------|---------|--------|
| `DemoGateProvider` wraps `RouterProvider` | `main.tsx` L17–22 | Correct — provider is outermost wrapper | **PASS** |
| `DemoGateContext` accessible in all routes | `main.tsx` + `AppShell.tsx` | `AppShell` renders `<Outlet />` inside provider scope | **PASS** |
| `useDemoGate()` used in tier-2 | `AccessTier2Page.tsx` L53 | Reads `state.walletConnected`, `state.signedMessage`, `state.tier2Unlocked`, `actions.*` | **PASS** |
| `useDemoGate()` used in tier-3 | `AccessTier3Page.tsx` L17 | Reads `state.tier3Unlocked` | **PASS** |
| `RequireGate` disabled in router | `router.tsx` L17 | Import commented out; no routes wrapped | **PASS** |
| `RequireGate` does not consume `DemoGateContext` | `RequireGate.tsx` | Uses local `useState` — not a problem since gate is OFF | **NOTE** — gate is OFF; no pages are incorrectly locked |
| Initial tier state: all unlocked | `demoGateState.tsx` L34–36 | `tier1/2/3Unlocked: true` | **PASS** |
| Wallet state: disconnected by default | `demoGateState.tsx` L30–31 | `walletConnected: false`, `signedMessage: false` | **PASS** |

---

## 4. DEFERRED / BLOCKED / MOCK STATE REMOVAL

| Item | File | Before patch | After patch | Result |
|------|------|-------------|-------------|--------|
| MemberBillingPanel deferred text | `MemberBillingPanel.tsx` | "being reconstructed" paragraph blocked billing display | Paragraph removed; `PayMeAdminPanel` renders directly | **PASS** |
| Exclusive tile page key | `usePublishedExclusiveTiles.ts` L21 | `"access-tier-2"` → 400 from API; tiles always fell back to 6 locked defaults | `"tier-2"` → valid API key; tile data fetched from R2 when slug present | **PASS** |
| Tier-2 tile fallback (no slug) | `AccessTier2Page.tsx` L56–57 | N/A | Falls back to `DEFAULT_CONTENT_ITEMS` (6 locked tiles) when slug absent — expected and correct | **NOTE** |
| `sendUsdcOnBase` | `usdc.ts` | Mock — returns simulated tx hash, no real chain call | Unchanged — mock remains in scope; function validates inputs and returns hash for demo flow | **NOTE** — real USDC rail is out of scope for this worker |

---

## 5. PAYME PAGE AND PAYME-LINKED ACTIONS

| Check | File | Outcome | Result |
|-------|------|---------|--------|
| `/payme` route registered | `router.tsx` L77 | Route exists; element is `<PayMePage />` | **PASS** |
| `PayMePage` renders iframe | `PayMePage.tsx` | `<ModuleFrame module="payme" height="76vh" />` | **PASS** |
| `resolveModuleUrl("payme")` | `moduleRegistry.ts` | Returns `/apps/payme/` | **PASS** |
| Payme module source exists | `apps/modules/payme/src/` | `App.jsx`, `index.jsx`, `main.jsx`, `services/usdcTransfer.js` present | **PASS** |
| Payme module vite.config.js `outDir` | `apps/modules/payme/vite.config.js` | **No `outDir` set** — default is `apps/modules/payme/dist/`, NOT `apps/product-shell/public/apps/payme/` | **PARTIAL** |
| Payme in product-shell build chain | `package.json` | `build:engage` only builds `modules/engage`; no `build:payme` step | **PARTIAL** |
| Engage module output path | `apps/modules/engage/vite.config.js` | `outDir: '../../public/apps/engage'` → outputs to `apps/product-shell/public/apps/engage/` ✓ | **PASS** |

**Payme deploy gap (Worker B scope):**
The PayMe module's `vite.config.js` is missing `base` and `outDir` configuration to
output into `apps/product-shell/public/apps/payme/`. Without this:
- `npm run build` does not build payme
- `/apps/payme/` is absent from `dist/`
- The iframe on `/payme` loads a 404

This is the Worker B stitch target. The product-shell component wiring for `/payme` is
correct; the gap is in the payme module's build config and the product-shell build chain.

**PayMe-linked actions (tier-2):**
- USDC pay card renders in `AccessTier2Page` via floating cart toggle ✓
- Wallet connect: calls `actions.connectWallet()` from `DemoGateContext` ✓
- Simulate purchase: `onSimulatePurchase()` unlocks tiles locally via `setUnlocked` state ✓
- Real USDC send: calls `sendUsdcOnBase` — mock implementation returns simulated hash ✓ (demo scope)

---

## 6. GLOBAL WALLPAPER

| Check | File | Outcome | Result |
|-------|------|---------|--------|
| Default wallpaper wired at root | `AppShell.tsx` | `.appRootWallpaper` layer with `url('/biz-pages.png')` inline style | **PASS** (code) |
| CSS rule for fixed positioning | `shell.css` | `.appRootWallpaper { position: fixed; inset: 0; z-index: -1 }` | **PASS** |
| R2 override path | `PageShell.tsx` | `wallpaperUrl` prop → inline `backgroundImage` when provided | **PASS** |
| `biz-pages.png` asset exists | `apps/product-shell/public/` | File not present in `public/` — only `_redirects` exists | **PARTIAL** — image will 404 until asset placed at `public/biz-pages.png` |

---

## 7. BUILD CHAIN VERIFICATION

| Check | File | Outcome | Result |
|-------|------|---------|--------|
| No bare global `vite build` | `package.json` | `"build": "npm run build:engage && npm run build:shell"` | **PASS** |
| `build:shell` sub-script | `package.json` | `"build:shell": "vite build"` — runs via npm | **PASS** |
| `build:engage` uses prefix npm | `package.json` | `npm --prefix ../modules/engage install && npm --prefix ../modules/engage run build` | **PASS** |
| Engage output lands in product-shell public | `apps/modules/engage/vite.config.js` | `outDir: '../../public/apps/engage'` | **PASS** |
| Vite config has no blocking issues | `vite.config.ts` | `defineConfig({ plugins: [react()], server: { port: 5173 } })` | **PASS** |
| TypeScript config references vite types locally | `tsconfig.json` | `"types": ["vite/client"]` uses local install | **PASS** |

---

## 8. STAGE_4 PASS GATE EVALUATION

| Pass gate condition | Status | Evidence |
|--------------------|--------|---------|
| `/access` works | **PASS** | Route registered; component renders; tier nav buttons wire to correct sub-routes |
| Required pages are not incorrectly locked or blocked | **PASS** | Gate OFF in router; all tier initial states are `true`; no RequireGate wrapping |
| PayMe-linked behavior works within scope | **PARTIAL** | `/payme` iframe wiring correct; payme module deploy gap is Worker B scope |
| Build proof exists | **PASS** | `package.json` build chain patched; no global vite assumption |
| No unresolved in-scope blocker remains | **PASS** | Deferred text removed; page key fixed; tier guards open by default |

---

## 9. OPEN ITEMS (NOT IN WORKER A SCOPE)

| Item | Owner | Notes |
|------|-------|-------|
| `apps/modules/payme/vite.config.js` — missing `base` + `outDir` | Worker B | Must output to `apps/product-shell/public/apps/payme/` same as engage pattern |
| `package.json` — no `build:payme` step | Worker B | Needs `npm --prefix ../modules/payme install && npm --prefix ../modules/payme run build` added |
| `public/biz-pages.png` asset | Operator / asset placement | Code wiring is correct; file must be placed in `apps/product-shell/public/` |
| `sendUsdcOnBase` real USDC integration | Out of scope per build sheet | Mock is acceptable for demo; real chain tx requires wallet provider wiring |
| `RequireGate` → `DemoGateContext` reconnect | Deferred | Gate is OFF; no observable impact; can be reconnected when gate is re-enabled |
