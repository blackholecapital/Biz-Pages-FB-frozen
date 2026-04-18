// Client half of the resolver contract declared in
// /job_site/resolver_contract_spec.md §1. Mirrors the server-side
// `resolveAssetUrl` in apps/product-shell/functions/_lib/runtime-r2.js
// so client and server produce identical URLs for the same input.
//
// The previous slug-based static path (`/wallpapers/<slug>.png`) is
// removed: the slug is not an asset key and the file did not exist for
// any tenant. Wallpapers are now keyed by their asset code only.

const ASSET_CLASS: Record<string, { folder: string; ext: string } | undefined> = {
  w: { folder: "wallpaper", ext: "png" },
  m: { folder: "mobile-wallpaper", ext: "png" },
};

function normalizeBaseUrl(baseUrl?: string | null): string {
  if (!baseUrl) return "";
  return baseUrl.replace(/\/+$/, "");
}

/**
 * Resolve a wallpaper code (e.g. "w91", "m12") to the canonical URL.
 * Returns null when the code is missing or fails the grammar — callers
 * should fall back to the bundled shell default rather than fabricate a
 * URL.
 */
export function resolveWallpaperUrl(
  code?: string | null,
  baseUrl?: string | null
): string | null {
  const value = String(code || "").trim().toLowerCase();
  if (!value) return null;

  const cls = ASSET_CLASS[value[0]];
  if (!cls) return null;

  const rest = value.slice(1);
  if (!rest || !/^\d+$/.test(rest)) return null;

  const base = normalizeBaseUrl(baseUrl);
  // Worker-fronted host: root-level folders. Pages-only fallback: /assets/
  // prefix so the deploy-side route can rewrite to R2 (see §1.2 of the
  // resolver contract spec).
  return base
    ? `${base}/${cls.folder}/${value}.${cls.ext}`
    : `/assets/${cls.folder}/${value}.${cls.ext}`;
}
