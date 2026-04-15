import { normalizePageSpec } from "./runtime-schema.js";

const STUDIO_PAGE_KEY = {
  home: "gate",
  members: "vip",
  access: "perks"
};

function mediaFromLegacy(kind, lines) {
  const first = String(lines[0] || "").trim();
  if (kind === "image") {
    return { title: "", lines: [], image: first, mediaUrl: "" };
  }
  if (kind === "video" || kind === "social") {
    return {
      title: "",
      lines: [],
      image: "",
      mediaUrl: first
    };
  }
  return {
    title: first,
    lines: lines.slice(1).map((entry) => String(entry)),
    image: "",
    mediaUrl: ""
  };
}

export function compileMobileBlocks(blocks) {
  const mobileWidth = 336;
  const sidePadding = 16;
  const topPadding = 16;
  const gap = 16;

  let cursorY = topPadding;

  return blocks.map((block) => {
    const lineCount = Array.isArray(block.lines) ? block.lines.length : 0;
    const estimatedHeight = Math.max(
      150,
      Math.min(360, 84 + lineCount * 22)
    );

    const mobileBlock = {
      ...block,
      x: sidePadding,
      y: cursorY,
      w: mobileWidth,
      h: Math.max(block.kind && block.kind !== "text" ? 220 : estimatedHeight, 180)
    };

    cursorY += mobileBlock.h + gap;
    return mobileBlock;
  });
}

export function compileRuntimePage(page, pageSpec, source, { slug } = {}) {
  const normalized = normalizePageSpec(pageSpec, page);
  if (!normalized) return null;

  const desktopBlocks = normalized.blocks;
  const isMobileNative = normalized.mobile === true;

  const result = {
    ok: true,
    version: 2,
    page,
    source,
    ...(slug ? { slug } : {}),
    desktop: {
      canvas: { width: 1280, minHeight: 760 },
      blocks: desktopBlocks
    }
  };

  if (isMobileNative) {
    // Mobile-native page: preserve the flag and viewport so the gateway
    // renders the blocks as a percentage-based 430×860 canvas.
    result.mobile = true;
    if (normalized.viewport) result.viewport = normalized.viewport;
  } else {
    // Standard page: compile stacked mobile layout from desktop blocks.
    const mobileBlocks = compileMobileBlocks(desktopBlocks);
    result.mobile = {
      canvas: {
        width: 368,
        minHeight: Math.max(
          640,
          mobileBlocks.length ? mobileBlocks[mobileBlocks.length - 1].y + mobileBlocks[mobileBlocks.length - 1].h + 24 : 640
        )
      },
      blocks: mobileBlocks
    };
  }

  if (normalized.wallpaper) result.wallpaper = normalized.wallpaper;
  if (normalized.skin) result.skin = normalized.skin;
  if (normalized.gif) result.gif = normalized.gif;
  if (Array.isArray(normalized.exclusiveTiles) && normalized.exclusiveTiles.length) {
    result.exclusiveTiles = normalized.exclusiveTiles;
  }

  return result;
}

export function mapLegacyBundleToPage(bundle, page) {
  const studioKey = STUDIO_PAGE_KEY[page];
  if (!studioKey) return null;

  const pageNode = bundle?.pages?.[studioKey];
  if (!pageNode) return null;

  const blocks = Array.isArray(pageNode.blocks) ? pageNode.blocks : [];
  const content = pageNode?.content || {};
  const cardKinds = pageNode?.cardKinds || {};

  const normalizedBlocks = blocks.slice(0, 6).map((block, index) => {
    const lines = Array.isArray(content?.[block.id]) ? content[block.id] : [];
    const kind = ["text", "image", "video", "social"].includes(String(cardKinds?.[block.id] || "").toLowerCase())
      ? String(cardKinds[block.id]).toLowerCase()
      : "text";
    const media = mediaFromLegacy(kind, lines);

    return {
      id: String(block.id || `block-${index + 1}`),
      x: Number(block.x || 0),
      y: Number(block.y || 0),
      w: Number(block.w || 320),
      h: Number(block.h || 180),
      title: media.title,
      lines: media.lines,
      kind,
      image: media.image,
      mediaUrl: media.mediaUrl
    };
  });

  return {
    version: 2,
    page,
    blocks: normalizedBlocks
  };
}

export function normalizePublishedPage(page, rawPage) {
  return normalizePageSpec(rawPage, page);
}
