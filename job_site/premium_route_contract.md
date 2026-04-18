# Premium Route Contract

job_id: BIZ-PAGES-WALLPAPER-HOTFIX-003
worker: A
stage: S1
artifact: premium_route_contract.md

---

## 1. Contract Overview

This document declares the normative routing contract for premium published
tenant pages in the Biz product shell. Clients MUST follow this contract to
ensure premium payloads reach the canonical `DesktopPremiumReceiver` and do not
fall through to the legacy wallpaper/homeHero shell.

---

## 2. Slug Route → Published Runtime Page → Shell Dispatch

```
URL                    Route match           Component      Page key  Runtime fetch
─────────────────────────────────────────────────────────────────────────────────────
/:slug                 path ":slug"          HomePage       "home"    fetchPublishedRuntimePage(slug, "home")
/:slug/gate            path ":slug/gate"     HomePage       "home"    fetchPublishedRuntimePage(slug, "home")
/:d/:slug              path ":d/:slug"       HomePage       "home"    fetchPublishedRuntimePage(slug, "home")
/:d/:slug/gate         path ":d/:slug/gate"  HomePage       "home"    fetchPublishedRuntimePage(slug, "home")
/                      index                 HomePage       "home"    no slug → no fetch (static)
/gate                  path "gate"           HomePage       "home"    no slug → no fetch (static)
```

`slug` is extracted from `useParams<{ slug?: string; designation?: string }>()`.
When `slug` is absent (root and /gate routes), no runtime fetch is performed and
`PageShell` renders the static legacy path.

---

## 3. Premium Detection Contract

The runtime payload must carry all three fields for the premium dispatch to fire:

```
PublishedRuntimePage {
  shellId: "desktop-premium-v1"   // == PREMIUM_SHELL_ID
  stage:   { w: number, h: number }
  tiles:   PremiumStageTile[]
}
```

Type guard: `isPremiumRuntimePage(page)` in `runtime/types.ts`.

**Clients MUST NOT re-interpret stage dimensions.** The server emits
`stage: { w: 2560, h: 1440 }` as the canonical stage envelope. Receivers
scale to fit the available viewport via `useStageScale` — they do not change
the stage coordinate space.

---

## 4. Shell Dispatch Rules (single path, no overlap)

Implemented in `PageShell` (`components/layout/PageShell.tsx`):

```
Priority 1: premiumLayout prop supplied               → DesktopPremiumReceiver
Priority 2: runtimePage supplied AND isPremiumRuntimePage(runtimePage) → adapt → DesktopPremiumReceiver
Priority 3: (default)                                 → legacy wallpaper + children frame
```

`HomePage` uses Priority 2: it supplies `runtimePage` (raw payload) and
`wallpaperUrl` (server-resolved URL via `selectWallpaperUrl`). `PageShell`
adapts and dispatches.

---

## 5. Wallpaper Resolution Contract

For published premium pages, wallpaper is resolved server-side and emitted as
`wallpaperUrl` on the `PublishedRuntimePage` payload. Clients MUST:

1. Call `selectWallpaperUrl(page)` to extract the resolved URL.
2. Pass it as the `wallpaperUrl` prop to `PageShell`.
3. `PageShell` forwards it into `adaptPremiumRuntimePage(runtimePage, wallpaperUrl)`
   which populates `PremiumShellLayout.wallpaper`.
4. `DesktopPremiumReceiver` renders the wallpaper from `layout.wallpaper`.

Clients MUST NOT compose wallpaper URLs from slug or asset codes on the
client side for published premium pages. The server-emitted URL is the
single source of truth. See `/job_site/resolver_contract_spec.md §1.2`.

---

## 6. Non-Premium Slug Behavior

When a slug's published runtime page payload is:
- absent (`null`) — network error or no published page
- present but not premium (missing `shellId` or `stage`)

`PageShell` falls through to Priority 3 (legacy path). The `homeHero` children
render normally and the wallpaper layer uses `wallpaperUrl` if present (tenant
non-premium wallpaper) or the AppShell default (`/w99.png`).

This preserves backwards-compatibility for all non-premium tenants and for the
static root routes (`/`, `/gate`).

---

## 7. Files Involved

| File | Role |
|------|------|
| `apps/product-shell/src/app/router.tsx` | Declares `/:slug` → `<HomePage />` mapping |
| `apps/product-shell/src/pages/HomePage.tsx` | Fetches runtime page; passes `runtimePage` + `wallpaperUrl` to `PageShell` |
| `apps/product-shell/src/components/layout/PageShell.tsx` | Premium dispatch gatekeeper |
| `apps/product-shell/src/runtime/types.ts` | `isPremiumRuntimePage`, `adaptPremiumRuntimePage`, type definitions |
| `apps/product-shell/src/runtime/publishedClient.ts` | `fetchPublishedRuntimePage`, `selectWallpaperUrl` |
| `apps/product-shell/src/features/desktop-premium/DesktopPremiumReceiver.tsx` | Canonical premium renderer |

---

## 8. Invariants

- `DesktopPremiumReceiver` is the ONLY component that renders the premium shell
  for end-user pages. `/studio` preview also renders it for parity checking.
- No route bypasses `PageShell` dispatch for published pages. All published
  premium renders go through `PageShell → DesktopPremiumReceiver`.
- The `homeHero` children inside `PageShell` are NEVER rendered for a premium
  runtime page (early return at priority 1/2 in `PageShell`).
- `AppShell` app chrome (TopNav, PayMePanel, PayMeCartProvider) is always
  present regardless of premium/non-premium rendering.
