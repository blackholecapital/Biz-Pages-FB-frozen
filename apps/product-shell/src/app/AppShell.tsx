import { Outlet } from "react-router-dom";
import { TopNav } from "../components/nav/TopNav";

// Default wallpaper served from public/. R2 tenant wallpapers override this
// via PageShell's wallpaperUrl prop, which renders above this fixed layer.
const DEFAULT_WALLPAPER_URL = "/biz-pages.png";

export function AppShell() {
  return (
    <div className="appRoot">
      <div className="appRootWallpaper" aria-hidden>
        <div
          className="wallpaperImage"
          style={{ backgroundImage: `url('${DEFAULT_WALLPAPER_URL}')` }}
        />
      </div>
      <TopNav />
      <div className="appBody">
        <Outlet />
      </div>
    </div>
  );
}
