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
};

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
