form_id: preserved_functionality_matrix
job_id: BIZ-PAGES-WALLPAPER-HOTFIX-003
stage: S1 / Worker B
task: Verify legacy published shell path no longer owns premium slug rendering;
      verify non-premium route ownership is preserved.
source_files:
  - apps/product-shell/src/app/router.tsx
  - apps/product-shell/src/components/layout/PageShell.tsx
  - apps/product-shell/src/runtime/types.ts
  - apps/product-shell/src/pages/*.tsx
  - apps/product-shell/src/styles/published-overlay.css
  - apps/product-shell/src/styles/shell.css
references:
  - /job_site/premium_route_contract.md
  - /job_site/wallpaper_issue_audit.md
  - /job_site/build-sheet-active.txt

# Preserved Functionality Matrix

## 1. Premium-Route Decision Rule (Exact)

**Decision gate:** `PageShell.tsx:53-57` — `resolvedPremium` is non-null when:

```
isPremiumRuntimePage(runtimePage) === true
```

which requires ALL of the following on the compiled runtime payload:
- `p != null`
- `p.shellId === "desktop-premium-v1"`
- `p.stage != null`
- `typeof p.stage.w === "number"`
- `typeof p.stage.h === "number"`

When `resolvedPremium` is non-null, `PageShell` returns the exclusive premium
mount (`.premiumSurface` > `DesktopPremiumReceiver`) and the legacy
`.wallpaperLayer` + `.pageShellContent` frame is **not rendered**.

**Legacy shell path ownership status:** REMOVED for premium payloads.
The legacy path is only taken when `isPremiumRuntimePage` returns false.

---

## 2. Non-Premium Route Surfaces — Preserved

### 2.1 Router Routes

All routes in `apps/product-shell/src/app/router.tsx` are structurally unchanged.
The premium dispatch is at the component level (inside `PageShell`), not the
router level. No route path was added, removed, or altered.

| Route Pattern | Component | PageKey | Premium Dispatch Risk | Status |
|---------------|-----------|---------|----------------------|--------|
| `/` (index) | HomePage | home | None — no runtimePage prop passed | PRESERVED |
| `/gate` | HomePage | home | None | PRESERVED |
| `/:slug` | HomePage | home | None — slug-based home entry; no runtimePage | PRESERVED |
| `/:slug/gate` | HomePage | home | None | PRESERVED |
| `/:designation/:slug` | HomePage | home | None | PRESERVED |
| `/:designation/:slug/gate` | HomePage | home | None | PRESERVED |
| `/members` | MembersPage | members | None | PRESERVED |
| `/exclusive` | ExclusivePage | exclusive | None | PRESERVED |
| `/customer` | CustomerPage | customer | None | PRESERVED |
| `/payme` | PayMePage | payme | None | PRESERVED |
| `/engage` | EngagePage | engage | None | PRESERVED |
| `/referrals` | ReferralsPage | referrals | None | PRESERVED |
| `/skins` | SkinMarketplacePage | skins | None | PRESERVED |
| `/admin` | AdminPage | admin | None | PRESERVED |
| `/studio` | StudioPage | studio | N/A — StudioPage mounts receiver directly; no PageShell | PRESERVED |
| `/:slug/gate/members` | MembersPage | members | None | PRESERVED |
| `/:slug/gate/exclusive` | ExclusivePage | exclusive | None | PRESERVED |
| `/:slug/gate/customer` | CustomerPage | customer | None | PRESERVED |
| `/:slug/gate/payme` | PayMePage | payme | None | PRESERVED |
| `/:slug/gate/engage` | EngagePage | engage | None | PRESERVED |
| `/:slug/gate/referrals` | ReferralsPage | referrals | None | PRESERVED |
| `/:slug/gate/skins` | SkinMarketplacePage | skins | None | PRESERVED |
| `/:slug/gate/admin` | AdminPage | admin | None | PRESERVED |
| `/:slug/gate/studio` | StudioPage | studio | N/A | PRESERVED |
| `/:designation/:slug/members` | MembersPage | members | None | PRESERVED |
| `/:designation/:slug/exclusive` | ExclusivePage | exclusive | None | PRESERVED |
| `/:designation/:slug/customer` | CustomerPage | customer | None | PRESERVED |
| `/:designation/:slug/payme` | PayMePage | payme | None | PRESERVED |
| `/:designation/:slug/engage` | EngagePage | engage | None | PRESERVED |
| `/:designation/:slug/referrals` | ReferralsPage | referrals | None | PRESERVED |
| `/:designation/:slug/skins` | SkinMarketplacePage | skins | None | PRESERVED |
| `/:designation/:slug/admin` | AdminPage | admin | None | PRESERVED |
| `/:designation/:slug/studio` | StudioPage | studio | N/A | PRESERVED |
| `/access` | Navigate → `/exclusive` | — | None | PRESERVED |
| `/access/tier-1` | Navigate → `/customer` | — | None | PRESERVED |
| `/access/tier-2` | Navigate → `/exclusive` | — | None | PRESERVED |
| `/access/tier-3` | Navigate → `/admin` | — | None | PRESERVED |

### 2.2 PageShell Legacy Render Path

The legacy wallpaper+content frame inside `PageShell` is preserved and
unchanged for non-premium payloads.

| Surface | Condition for Use | CSS Class | Status |
|---------|-------------------|-----------|--------|
| `.wallpaperLayer` | `isPremiumRuntimePage` returns false | shell.css:52-57 | PRESERVED |
| `.wallpaperImage` | Same | shell.css:59-65 | PRESERVED |
| `.pageShellContent` | Same | shell.css:38-43 | PRESERVED |
| AppShell default `/w99.png` | All routes (base layer, z-index:-1) | shell.css:6-12 | PRESERVED |

### 2.3 Studio Page — Premium Authoring/Preview Surface

`StudioPage.tsx` directly mounts `DesktopPremiumReceiver` in preview mode.
This path is independent of `PageShell` and was not modified by the patch.

| Surface | File | Status |
|---------|------|--------|
| `DesktopPremiumStudio` (editor) | StudioPage.tsx:84 | PRESERVED |
| `DesktopPremiumReceiver` (preview) | StudioPage.tsx:87 | PRESERVED |
| Mode toggle bar | StudioPage.tsx:26-71 | PRESERVED |

### 2.4 Published Overlay CSS — Non-Premium Classes

`published-overlay.css` retains all non-premium overlay classes unchanged.
The `.premiumSurface` class was added to this file as part of the patch; all
pre-existing classes are preserved.

| Class | Purpose | Status |
|-------|---------|--------|
| `.publishedOverlayRoot` | Legacy overlay container | PRESERVED |
| `.publishedOverlaySkin` | Skin image layer | PRESERVED |
| `.publishedOverlayGif` | Ambient GIF layer | PRESERVED |
| `.publishedOverlayStage` | 1400px stage container | PRESERVED |
| `.publishedOverlayCard` | Content card | PRESERVED |
| `.publishedOverlayCardInner` | Card content frame | PRESERVED |
| `.publishedOverlayBadge` | Badge element | PRESERVED |
| `.publishedOverlayTitle` | Card title | PRESERVED |
| `.publishedOverlayBody` | Card body | PRESERVED |
| `.publishedOverlayLine` | Body line | PRESERVED |
| `.publishedOverlayCardMedia` | Media card variant | PRESERVED |
| `.overlayMediaFrame` | Media inner frame | PRESERVED |
| `.overlayMediaImage` / `.overlayMediaVideo` / `.overlayMediaEmbed` | Media types | PRESERVED |
| `.exclusiveTileGrid` | Exclusive tile grid | PRESERVED |
| `.exclusiveTile` | Tile card | PRESERVED |
| `.exclusiveTileImageWrap` | Tile image wrapper | PRESERVED |
| `.exclusiveTileImage` | Tile image | PRESERVED |
| `.exclusiveTilePlaceholder` | Empty tile | PRESERVED |
| `.exclusiveTileTint` | Locked tile overlay | PRESERVED |
| `.exclusiveTileLabelTop` | Tile label | PRESERVED |
| `.exclusiveTileBadgeArea` | Tile badge area | PRESERVED |
| `.exclusiveTileBadgeCol` | Badge column | PRESERVED |
| `.exclusiveTileBadgeText` | Badge text | PRESERVED |
| `.exclusiveTilePrice` | Price label | PRESERVED |
| `.exclusiveTileBadgeSubtext` | Badge subtext | PRESERVED |
| `.exclusiveTileUnlocked` | Unlocked tile modifier | PRESERVED |

---

## 3. Legacy Shell Path Ownership — Verification

| Verification Point | Evidence | Result |
|-------------------|----------|--------|
| PageShell no longer renders legacy block for premium payloads | `if (resolvedPremium) { return ...; }` at PageShell.tsx:59 — exclusive return prevents fall-through | PASS |
| No route dispatches to a separate published-premium shell component | router.tsx:35-95 — all slug routes use existing page components with no premium-specific route | PASS |
| isPremiumRuntimePage is the sole gating function | types.ts:117-130 — single exported guard, imported and used at PageShell.tsx:55 | PASS |
| Legacy `.wallpaperLayer` not rendered when premium fires | PageShell.tsx:71-82 only reached when resolvedPremium is falsy | PASS |
| Premium receiver not accidentally suppressed for non-premium | isPremiumRuntimePage strict: must have shellId "desktop-premium-v1" + valid stage — undefined/missing returns false | PASS |
| AppShell unchanged | AppShell.tsx:1-28 — no changes from pre-patch; still renders default wallpaper at z-index:-1 | PASS |

---

## 4. Summary

**Premium-route ownership:** `DesktopPremiumReceiver` via `PageShell` premium
dispatch. The legacy published shell path (`.wallpaperLayer` + children) no
longer owns premium slug rendering. Ownership transferred exclusively to the
`DesktopPremiumReceiver` mount when `shellId === "desktop-premium-v1"` with
valid `stage` dims.

**Non-premium route ownership:** Fully preserved. All 34 route entries in
`router.tsx` are structurally unchanged. The legacy `PageShell` frame remains
the render path for every payload that does not satisfy the premium guard.
Studio authoring and preview are unaffected.
