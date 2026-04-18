# Premium Surface Ownership

job_id: BIZ-PAGES-WALLPAPER-HOTFIX-003
worker: A
stage: S2
artifact: premium_surface_ownership.md

---

## 1. Problem: Conflicting Wallpaper Layers

Before this patch, when a premium published slug (`/:slug`) was visited, three
visual layers were in play simultaneously:

| Layer | Source | CSS | z-index | Covers |
|-------|--------|-----|---------|--------|
| AppShell default wallpaper | `AppShell.tsx` → `appRootWallpaper` | `position: fixed; inset: 0; z-index: -1` | -1 | Full viewport incl. nav zone |
| Legacy nav/content area | `appBody` div | normal flow | auto | Below nav |
| Premium surface | `PageShell` → `premiumSurface` | `position: fixed; top: var(--nav-h); z-index: 4` | 4 | Below nav only |

The `appRootWallpaper` (`/w99.png`) was always painted in the nav zone
(`top: 0` to `top: 72px`) because the `premiumSurface` started at
`top: var(--nav-h, 72px)` and did not cover that region.

The `TopNav` background is `background: transparent` (outer) with
`background: rgba(10,10,14,.55)` (inner) — semi-transparent. The static
`/w99.png` wallpaper bled through this transparence, creating a competing
background in the nav zone distinct from the premium stage's own wallpaper.

Additionally, `published-overlay.css` contained legacy `.publishedOverlay*`
CSS rules defining an old overlay system (absolute-positioned skin/gif/stage
layers with a 1400px fixed-width stage) that was never removed. These rules
were unreferenced in any component but represented a latent conflicting path.

---

## 2. Fix: Receiver as Owning Surface

### 2.1 Structural Change

`DesktopPremiumReceiver` now accepts an `asMount` prop. When `asMount` is
set (published page path), the receiver renders its own fixed full-viewport
surface (`dpv1ReceiverMount`) rather than relying on an external wrapper.

**Before (PageShell wrapping):**
```
PageShell
  └─ <div className="premiumSurface">   ← external wrapper, top: nav-h
       └─ <DesktopPremiumReceiver>
            └─ <div className="dpv1Viewport">
                 └─ <DesktopPremiumShell>
```

**After (receiver owns surface):**
```
PageShell
  └─ <DesktopPremiumReceiver asMount>   ← no external wrapper
       └─ <div className="dpv1ReceiverMount">  ← receiver-owned, inset: 0
            └─ <div className="dpv1Viewport">
                 └─ <DesktopPremiumShell>
```

### 2.2 CSS — `dpv1ReceiverMount` (added to `desktop-premium.css`)

```css
.dpv1ReceiverMount {
  position: fixed;
  inset: 0;              /* top: 0 — covers full viewport including nav zone */
  z-index: 4;            /* above appRootWallpaper (-1), below TopNav (50) */
  overflow: hidden;
  background: #0b0b0f;   /* occludes AppShell default wallpaper entirely */
}
.dpv1ReceiverMount > .dpv1Viewport {
  position: absolute;
  inset: 0;
}
```

The key difference from the removed `premiumSurface` CSS: `inset: 0` instead
of `top: var(--nav-h, 72px)`. The full viewport is now owned by the receiver.

### 2.3 z-index Stacking After Patch

| Element | Position | z-index | Visible? |
|---------|----------|---------|----------|
| `appRootWallpaper` (`/w99.png`) | fixed, inset: 0 | -1 | **No** — fully occluded by dpv1ReceiverMount |
| `dpv1ReceiverMount` | fixed, inset: 0 | 4 | Yes — full viewport |
| `dpv1Viewport` → `dpv1Stage` + wallpaper | absolute, inset: 0 | — | Yes — premium stage fills mount |
| `TopNav` | fixed, top: 0 | 50 | Yes — floats above premium stage |

The AppShell default wallpaper (`/w99.png`) is now completely invisible for
premium pages. The premium stage's wallpaper (from `layout.wallpaper`, the
R2 URL emitted by the server) is the sole background.

---

## 3. Studio Parity Preserved

`DesktopPremiumReceiver` without `asMount` (the Studio preview path) is
unchanged: the component renders `dpv1Viewport` directly, filling whichever
container the Studio supplies. The Studio's container is a separate fixed div
(`top: calc(nav-h + 44px)`, not full-viewport) and is unaffected.

| Context | asMount | Root element | Positions relative to |
|---------|---------|-------------|----------------------|
| Published page | `true` | `dpv1ReceiverMount` (fixed, inset: 0) | Viewport |
| Studio preview | `false`/absent | `dpv1Viewport` (relative, fills container) | Studio container |

---

## 4. Legacy CSS Removed from `published-overlay.css`

The following rule blocks were removed as conflicting legacy paths:

| Rule | Type | Reason removed |
|------|------|----------------|
| `.premiumSurface` | Fixed surface, `top: nav-h`, z-index 4 | Replaced by `dpv1ReceiverMount` in receiver |
| `.premiumSurface > .dpv1Viewport` | Inset absolute fill | Replaced by `dpv1ReceiverMount > .dpv1Viewport` |
| `@media premiumSurface` (mobile) | Mobile height override | Replaced in `dpv1ReceiverMount` media block |
| `.publishedOverlayRoot` | Absolute, z-index 2 | Legacy overlay system, unreferenced |
| `.publishedOverlaySkin` | Absolute, z-index 0 | Legacy overlay system, unreferenced |
| `.publishedOverlayGif` | Absolute, z-index 3, screen blend | Legacy overlay system, unreferenced |
| `.publishedOverlayStage` | 1400px centered, padding-top nav-h | Legacy overlay system, unreferenced |
| `.publishedOverlayCard` | Absolute, border-radius | Legacy overlay system, unreferenced |
| `.publishedOverlayCardInner` | Flex layout | Legacy overlay system, unreferenced |
| `.publishedOverlayBadge` | Absolute, top-right badge | Legacy overlay system, unreferenced |
| `.publishedOverlayTitle` | Typography | Legacy overlay system, unreferenced |
| `.publishedOverlayBody` | Typography | Legacy overlay system, unreferenced |
| `.publishedOverlayLine` | Typography | Legacy overlay system, unreferenced |
| `.publishedOverlayCardMedia` | Background | Legacy overlay system, unreferenced |
| `.overlayMediaFrame` | Absolute inset | Legacy overlay system, unreferenced |
| `.overlayMediaImage/.overlayMediaVideo/.overlayMediaEmbed` | Media display | Legacy overlay system, unreferenced |

`.exclusiveTile*` CSS classes were retained (tier-2 exclusive page styles).

---

## 5. Non-Premium Routes Confirmed Untouched

- All `/:slug/gate/*` and `/:designation/:slug/*` page routes: unchanged
- `ExclusivePage`, `MembersPage`, `CustomerPage`, `AdminPage`, `PayMePage`,
  `EngagePage`, `ReferralsPage`, `SkinMarketplacePage`: unchanged
- `AppShell` (TopNav, PayMePanel, PayMeCartProvider): unchanged
- `StudioPage` (edit + preview): unchanged

---

---

## S3 Addendum: Full-Bleed Viewport Hardening

### S3.1 Identified Gaps

After S2, `dpv1ReceiverMount` used only `position: fixed; inset: 0` without
explicit `width`/`height` declarations. This is functionally equivalent for
a fixed element with no ancestor transforms, but creates two risk scenarios:

| Risk | Mechanism | Impact |
|------|-----------|--------|
| Ancestor CSS transform | If any parent gains `transform: ...`, the fixed element's containing block shifts from the viewport to that parent. `inset: 0` would then fill the parent, not the viewport. | Mount smaller than viewport → side/top gutters |
| Global `img { max-width: 100% }` | Tile images inside the scaled 2560×1440 stage could be constrained to their tile's rendered CSS width (not stage-space width) if the override is not explicit. | Image display cut off inside tiles |
| `dpv1ReceiverMount > .dpv1Viewport` override | The override rule only had `position: absolute; inset: 0` — `width: 100%; height: 100%` were only in the base `.dpv1Viewport` rule and could be clobbered by specificity in other contexts. | Viewport undersize edge case |

### S3.2 Changes

**`desktop-premium.css`:**
- `dpv1ReceiverMount`: added `width: 100vw; height: 100vh; max-width: 100vw; max-height: 100vh`
- `dpv1ReceiverMount > .dpv1Viewport`: added explicit `width: 100%; height: 100%`
- `dpv1TileMedia`: added `max-width: none; max-height: none` to override the global `img { max-width: 100% }` rule from `global.css`
- Mobile `@media`: added `max-height: 100dvh` alongside `height: 100dvh`

**`DesktopPremiumReceiver.tsx`:**
- Added `style={{ width: "100vw", height: "100vh" }}` inline on `dpv1ReceiverMount` div in the `asMount` branch
- Inline style is the terminal override — wins over any CSS cascade regardless of ancestor stacking context changes

### S3.3 Parent Container Audit (verified clean)

| Element | CSS | max-width? | margin:auto? | Notes |
|---------|-----|------------|--------------|-------|
| `html, body` | `height:100%`, `margin:0` | No | No | Clean |
| `div.appRoot` | `min-height:100vh; position:relative` | No | No | No transform → no containing-block change for fixed children |
| `div.appBody` | `min-height:100vh` | No | No | Mobile adds `height:100dvh; overflow:hidden` — does NOT constrain fixed descendants |
| `div.dpv1ReceiverMount` | `position:fixed; inset:0; width:100vw; height:100vh` | `max-width:100vw` | No | Full viewport |
| `PayMePanel` (aside) | `position:fixed` | n/a | n/a | Out of normal flow, no height contribution to appRoot |
| `TopNav` (nav) | `position:fixed; z-index:50` | n/a | n/a | Out of normal flow, floats above mount |

**Verdict:** No `max-width` or `margin: auto` constraints exist anywhere in the premium render path.

### S3.4 Stage Coordinate System Preserved

No changes were made to `useStageScale`, `DesktopPremiumShell`, or any stage
coordinate computation. The scale formula `min(vw / stage.w, vh / stage.h)` is
unchanged. Stage coordinates (2560×1440) are consumed verbatim.

---

## 6. Files Changed in S2 + S3

| File | Change |
|------|--------|
| `apps/product-shell/src/features/desktop-premium/DesktopPremiumReceiver.tsx` | Added `asMount` prop; conditional mount vs. viewport rendering |
| `apps/product-shell/src/components/layout/PageShell.tsx` | Removed `premiumSurface` wrapper; passes `asMount` to receiver |
| `apps/product-shell/src/features/desktop-premium/desktop-premium.css` | Added `dpv1ReceiverMount` + mobile override CSS |
| `apps/product-shell/src/styles/published-overlay.css` | Removed `premiumSurface` + `publishedOverlay*` legacy CSS |
| `apps/product-shell/src/features/desktop-premium/DesktopPremiumShell.tsx` | No change — confirmed correct |
| `apps/product-shell/src/pages/StudioPage.tsx` | No change — studio unaffected by asMount path |

**S3 additional changes:**

| File | Change |
|------|--------|
| `apps/product-shell/src/features/desktop-premium/DesktopPremiumReceiver.tsx` | Inline `style={{ width:"100vw",height:"100vh" }}` on mount div in asMount branch |
| `apps/product-shell/src/features/desktop-premium/desktop-premium.css` | `dpv1ReceiverMount`: explicit vw/vh + max-width/height; `dpv1ReceiverMount > .dpv1Viewport`: explicit w/h; `dpv1TileMedia`: `max-width:none; max-height:none` |
