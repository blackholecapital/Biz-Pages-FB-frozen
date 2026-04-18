# Wallpaper Issue Audit

job_id: BIZ-PAGES-WALLPAPER-HOTFIX-003
worker: A
stage: S1
artifact: wallpaper_issue_audit.md

---

## 1. Fault Summary

Premium published pages for tenant slugs were being routed through the legacy
`PageShell` + `homeHero` static shell instead of the canonical
`DesktopPremiumReceiver`. The wallpaper never rendered (wrong shell) and the
premium stage/tile layout was silently discarded.

---

## 2. Route Trace — `/:slug` (published home page)

```
Browser: GET /:slug
  └─ react-router: path ":slug" → <HomePage />
       └─ PageShell (no runtimePage prop — only static homeHero children)
            └─ legacy path: appRootWallpaper (/w99.png) + homeHero div
```

**Expected path (premium slug):**
```
Browser: GET /:slug
  └─ react-router: path ":slug" → <HomePage />
       └─ fetchPublishedRuntimePage(slug, "home")
            └─ isPremiumRuntimePage → TRUE
                 └─ PageShell (runtimePage prop set)
                      └─ premium path: DesktopPremiumReceiver (2560×1440)
```

---

## 3. Conflicting Legacy Path — Exact Interception Point

| Layer | File | Line(s) | Fault |
|-------|------|---------|-------|
| Router | `apps/product-shell/src/app/router.tsx` | 45 | `{ path: ":slug", element: <HomePage /> }` — correct route, but component never fetched runtime page |
| Page component | `apps/product-shell/src/pages/HomePage.tsx` | 3-11 (pre-patch) | Renders `PageShell` with only static children; no `useParams`, no `fetchPublishedRuntimePage` call, no `runtimePage` prop passed |
| Shell dispatch | `apps/product-shell/src/components/layout/PageShell.tsx` | 53-57 | `isPremiumRuntimePage(runtimePage)` guard correct but never triggered because `runtimePage` was always `undefined` |

**Root cause:** `HomePage` did not fetch the published runtime page. `PageShell`'s
premium dispatch is gated on a `runtimePage` prop that was never supplied.

---

## 4. Wallpaper Rendering Path (Pre-Patch)

```
AppShell.tsx:14-18  →  appRootWallpaper div  →  /w99.png (static, always shown)
PageShell.tsx:76-78 →  wallpaperLayer div    →  no wallpaperUrl supplied (undefined)
                                                 → no inline style, /w99.png bleeds through
```

Premium pages carry `wallpaperUrl` (server-resolved R2 URL) in the payload, but
`HomePage` never called `selectWallpaperUrl()` on the fetched payload, so the
tenant wallpaper never replaced the static `/w99.png`.

---

## 5. Fix Applied

**File:** `apps/product-shell/src/pages/HomePage.tsx`

Added `useParams` to extract `slug`, `useEffect` + `useState` to fetch the
published runtime page via `fetchPublishedRuntimePage(slug, "home")`, and
`selectWallpaperUrl` to extract the server-resolved wallpaper URL.

Both `runtimePage` and `wallpaperUrl` are now passed as props to `PageShell`.

**Dispatch result after patch:**
- Premium slug (`shellId === "desktop-premium-v1"`): `PageShell` detects via
  `isPremiumRuntimePage(runtimePage)`, adapts to `PremiumShellLayout`, renders
  `DesktopPremiumReceiver` full-bleed. The `homeHero` children are not rendered
  (early return).
- Non-premium slug with wallpaper: `PageShell` renders legacy wallpaper layer
  using `wallpaperUrl`, `homeHero` children render normally.
- No slug (root `/`, `/gate`): `runtimePage` and `wallpaperUrl` remain `null`,
  `PageShell` renders legacy path with default AppShell wallpaper. Unchanged
  behavior.

---

## 6. Non-Premium Routes Confirmed Untouched

The following routes and their components are unchanged:

| Route | Component | Status |
|-------|-----------|--------|
| `/members`, `/:slug/gate/members` | `MembersPage` | Unchanged |
| `/exclusive`, `/:slug/gate/exclusive` | `ExclusivePage` | Unchanged |
| `/customer` | `CustomerPage` | Unchanged |
| `/admin` | `AdminPage` | Unchanged |
| `/payme`, `/:slug/gate/payme` | `PayMePage` | Unchanged |
| `/engage`, `/:slug/gate/engage` | `EngagePage` | Unchanged |
| `/referrals` | `ReferralsPage` | Unchanged |
| `/skins` | `SkinMarketplacePage` | Unchanged |
| `/studio` | `StudioPage` | Unchanged |
| `/:designation/:slug` and all sub-routes | `HomePage` + all pages | Unchanged |

`AppShell` (nav, PayMePanel, PayMeCartProvider, default wallpaper layer) is
unchanged. No app chrome was removed.

---

## 7. AppShell Path Note

The expected artifact path `apps/product-shell/src/components/layout/AppShell.tsx`
does not exist. The AppShell component lives at:

```
apps/product-shell/src/app/AppShell.tsx
```

The mirror artifact is copied from that path. No changes were made to AppShell.

---

## 8. Patch Files

| File | Changed? | Change Summary |
|------|----------|----------------|
| `apps/product-shell/src/pages/HomePage.tsx` | YES | Added runtime page fetch + premium prop pass-through |
| `apps/product-shell/src/app/router.tsx` | NO | Routes confirmed correct; no interception to remove at router layer |
| `apps/product-shell/src/components/layout/PageShell.tsx` | NO | Premium dispatch already correct; no changes needed |
| `apps/product-shell/src/app/AppShell.tsx` | NO | App chrome unchanged |
