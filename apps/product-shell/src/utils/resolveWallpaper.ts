import { resolveStaticAsset } from "./resolveStaticAsset";

export function resolveWallpaper(slug?: string | null) {
  return resolveStaticAsset("/wallpapers/{assetCode}.png", slug);
}
