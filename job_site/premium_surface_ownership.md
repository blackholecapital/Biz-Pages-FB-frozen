form_id: premium_surface_ownership
job_id: BIZ-PAGES-WALLPAPER-HOTFIX-003
stage: S2
produced_by: derived from direct code analysis (Worker A document; Worker A did not run before Worker B)
source_files:
  - apps/product-shell/src/components/layout/PageShell.tsx
  - apps/product-shell/src/features/desktop-premium/DesktopPremiumReceiver.tsx
  - apps/product-shell/src/features/desktop-premium/DesktopPremiumShell.tsx
  - apps/product-shell/src/features/desktop-premium/desktop-premium.css
  - apps/product-shell/src/features/desktop-premium/shellConfig.ts
  - apps/product-shell/src/styles/published-overlay.css
  - apps/product-shell/src/styles/shell.css
  - apps/product-shell/src/styles/nav.css
  - apps/product-shell/src/app/AppShell.tsx

# Premium Surface Ownership

## 1. Controlling Surface for Premium Published Pages

`DesktopPremiumReceiver` is the controlling surface for published premium pages.

**Entry path:**
```
router.tsx → page component (e.g. HomePage, ExclusivePage)
  → <PageShell runtimePage={...} wallpaperUrl={...}>
    → isPremiumRuntimePage(runtimePage) === true
      → <div className="premiumSurface" ...>
          <DesktopPremiumReceiver layout={adaptedLayout} />
```

`PageShell` returns the `premiumSurface` block exclusively when the premium
guard fires. No legacy shell content is rendered alongside it.

## 2. Wallpaper Ownership — Premium Stage

Wallpaper for premium published pages is rendered inside the premium stage, not
as a shell background.

**Ownership chain:**
```
DesktopPremiumReceiver (layout.wallpaper → wallpaperUrl prop)
  → DesktopPremiumShell (wallpaperUrl → inline style on .dpv1Wallpaper)
    → .dpv1Wallpaper (position: absolute; inset: 0; background-size: cover; z-index: 0)
```

The wallpaper `backgroundImage` is set via inline style in `DesktopPremiumShell.tsx:73-80`
using `cfg.wallpaper.fit = "cover"` from `shellConfig.ts:13`. The wallpaper
node sits inside `.dpv1Stage` (the 2560×1440 CSS-transform-scaled stage div)
at z-index 0 — it is NOT a viewport-level background.

## 3. Removed Conflicting Layers

The following layers previously owned or competed with wallpaper rendering for
premium payloads and are no longer active on the premium render path:

### 3.1 PageShell `.wallpaperLayer` + `.wallpaperImage` (REMOVED from premium path)
- CSS: `shell.css:52-57` (`.wallpaperLayer`: position:absolute; inset:0; z-index:0)
- CSS: `shell.css:59-65` (`.wallpaperImage`: position:absolute; inset:0;
  **background-size: contain** — Fault A letterboxing)
- Status: not rendered for premium payloads. `PageShell.tsx:59` returns the
  `premiumSurface` block before reaching the legacy wallpaper block.

### 3.2 PageShell `.pageShellContent` (REMOVED from premium path)
- CSS: `shell.css:38-43` (padding + max-width layout frame)
- Status: not rendered for premium payloads.

### 3.3 AppShell `.appRootWallpaper` default wallpaper (VISUALLY SUPPRESSED)
- Code: `AppShell.tsx:8` — `const DEFAULT_WALLPAPER_URL = "/w99.png"`
- CSS: `shell.css:6-12` — `.appRootWallpaper { position:fixed; inset:0; z-index:-1 }`
- Status: DOM node still rendered (AppShell is always mounted) but visually
  covered by `.premiumSurface { z-index: 4 }`. The `/w99.png` image is not
  visible to users on premium pages.

## 4. Preserved UI Layers

Layers that remain active and visible for premium published pages:

| Layer | CSS Class | z-index | File | Preserved As |
|-------|-----------|---------|------|--------------|
| Top navigation bar | `.topNav` | 50 | nav.css:1-10 | Always above premiumSurface; navigation preserved |
| Premium surface container | `.premiumSurface` | 4 | published-overlay.css:9-25 | Premium receiver mount |
| Viewport within surface | `.dpv1Viewport` | — (fills parent) | desktop-premium.css:4-10 | Clips scaled stage |
| Scaled stage | `.dpv1Stage` | — (absolute) | desktop-premium.css:14-17 | 2560×1440 CSS-transform surface |
| Wallpaper (stage-space) | `.dpv1Wallpaper` | 0 | desktop-premium.css:19-28 | cover-fit, owns wallpaper |
| Workspace region | `.dpv1Workspace` | 1 | desktop-premium.css:73-78 | Content area |
| Left rail chrome | `.dpv1LeftRail` | 2 | desktop-premium.css:53-61 | 300px left chrome |
| Right rail chrome | `.dpv1RightRail` | 2 | desktop-premium.css:63-71 | 300px right chrome |
| Header band | `.dpv1Header` | 3 | desktop-premium.css:30-43 | Header above workspace |
| Tiles layer | `.dpv1TilesLayer` | 4 | desktop-premium.css:86-91 | Stage-space tile container |

## 5. Full z-index Stack for Premium Published Pages

From bottom to top, for a premium published page in the viewport:

| z-index | Layer | Scope | Note |
|---------|-------|-------|------|
| -1 | `.appRootWallpaper` | viewport-fixed | `/w99.png`; visually covered by premiumSurface |
| 0 | `.dpv1Wallpaper` | stage-space | tenant wallpaper, cover-fit — OWNS wallpaper |
| 1 | `.dpv1Workspace` | stage-space | transparent workspace region |
| 2 | `.dpv1LeftRail`, `.dpv1RightRail` | stage-space | chrome rails |
| 3 | `.dpv1Header` | stage-space | header band |
| 4 | `.premiumSurface` | viewport-fixed | receiver container (parent of dpv1Viewport) |
| 4 | `.dpv1TilesLayer` | stage-space | tile content above chrome |
| 50 | `.topNav` | viewport-fixed | navigation always on top |

## 6. Verification

| Check | Evidence | Result |
|-------|----------|--------|
| Premium receiver mounts as top-level controlling surface | PageShell.tsx:59-69 exclusive return; `.premiumSurface` z-index:4 | PASS |
| Wallpaper rendered inside stage (not shell background) | `dpv1Wallpaper` is child of `dpv1Stage`; cover-fit | PASS |
| Legacy `.wallpaperLayer`/`.wallpaperImage` not rendered for premium | PageShell return before legacy block | PASS |
| Legacy `background-size: contain` (Fault A) not active for premium | Fault A lives in shell.css `.wallpaperImage`; unreachable on premium path | PASS |
| AppShell `/w99.png` not visible on premium pages | Covered by `.premiumSurface` z-index:4 | PASS |
| TopNav preserved and visible above premium stage | nav.css z-index:50 > premiumSurface z-index:4 | PASS |
