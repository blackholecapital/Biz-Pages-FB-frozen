export type RuntimeOverlayKind = "text" | "image" | "video" | "social";

export type ExclusiveTile = {
  tileNumber: number;
  contentCode: string;
  tileName: string;
  lockStatus: "locked" | "unlocked";
  purchasePrice: string | null;
  contentUrl: string | null;
};

export type RenderedExclusiveTile = {
  slot: number;
  id: string;
  label: string;
  imageUrl: string | null;
  locked: boolean;
  price: string | null;
  assetCode?: string;
  destinationPath?: string | null;
};

export type RuntimeOverlayBlock = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  kind?: RuntimeOverlayKind;
  image?: string;
  contentUrl?: string;
  mediaUrl?: string;
};

export type RuntimePageCanvas = {
  width: number;
  minHeight: number;
};

export type RuntimePageLayout = {
  canvas: RuntimePageCanvas;
  blocks: RuntimeOverlayBlock[];
};

export type PublishedRuntimePage = {
  ok: true;
  version: 2;
  page: string;
  /** true when the studio deployed this page in mobile-native mode (430×860 canvas) */
  mobile: RuntimePageLayout | true;
  viewport?: { width: number; height: number };
  source: {
    mode: "published-page" | "legacy-bundle";
    key: string;
  };
  slug?: string;
  wallpaper?: string;
  skin?: string;
  gif?: string;
  desktop: RuntimePageLayout;
  exclusiveTiles?: RenderedExclusiveTile[];

  // ── Desktop-Premium contract ──
  // Present when the compiled page declares `shellId: "desktop-premium-v1"`.
  // Clients MUST consume these fields verbatim and dispatch to the premium
  // receiver path — no re-interpretation of stage dims or tile coordinates.
  shellId?: PremiumShellId;
  stage?: PremiumStageDims;
  /** Stage-space tile coordinates emitted directly by the studio save path. */
  tiles?: PremiumStageTile[];
};

// ── Desktop Premium v1 types ─────────────────────────────────────────────────

export const PREMIUM_SHELL_ID = "desktop-premium-v1" as const;
export type PremiumShellId = typeof PREMIUM_SHELL_ID;

export type PremiumStageDims = { w: number; h: number };

export type PremiumStageTile = {
  id: string;
  asset?: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
};

export type PremiumShellLayout = {
  shellId: PremiumShellId;
  stage: PremiumStageDims;
  wallpaper?: string | null;
  tiles: PremiumStageTile[];
};

/**
 * Type guard: narrow `PublishedRuntimePage` to a page that carries the premium
 * shell contract. Used by `PageShell` to dispatch to `DesktopPremiumReceiver`
 * instead of the legacy wallpaper/content frame.
 */
export function isPremiumRuntimePage(
  p: PublishedRuntimePage | null | undefined
): p is PublishedRuntimePage & {
  shellId: PremiumShellId;
  stage: PremiumStageDims;
} {
  return (
    !!p &&
    p.shellId === PREMIUM_SHELL_ID &&
    !!p.stage &&
    typeof p.stage.w === "number" &&
    typeof p.stage.h === "number"
  );
}

/**
 * Adapt a compiled runtime page into the canonical `PremiumShellLayout`
 * shape consumed by `DesktopPremiumReceiver`. The caller supplies the
 * already-resolved wallpaper URL (the runtime payload carries an asset
 * code, not a URL, so resolution belongs at the caller boundary).
 */
export function adaptPremiumRuntimePage(
  page: PublishedRuntimePage,
  wallpaperUrl: string | null = null
): PremiumShellLayout | null {
  if (!isPremiumRuntimePage(page)) return null;
  return {
    shellId: PREMIUM_SHELL_ID,
    stage: { w: page.stage.w, h: page.stage.h },
    wallpaper: wallpaperUrl,
    tiles: Array.isArray(page.tiles) ? page.tiles : [],
  };
}

// ── Manifest ─────────────────────────────────────────────────────────────────

export type PublishedRuntimeManifest = {
  ok: true;
  version: 2;
  slug: string;
  pages: Record<
    string,
    {
      mode: "published-page" | "legacy-bundle";
      key: string;
    }
  >;
  mobile: {
    editableNamespace: string;
    notes: string;
  };
};
