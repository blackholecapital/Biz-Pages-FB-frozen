import type { ReactNode } from "react";

type PageShellProps = {
  children?: ReactNode;
  /** R2 tenant wallpaper URL. When provided, overrides the AppShell default. */
  wallpaperUrl?: string;
};

export function PageShell({ children, wallpaperUrl }: PageShellProps) {
  return (
    <div className="pageShell">
      <div className="wallpaperLayer" aria-hidden>
        <div
          className="wallpaperImage"
          style={wallpaperUrl ? { backgroundImage: `url('${wallpaperUrl}')` } : undefined}
        />
      </div>
      <div className="pageShellContent">{children}</div>
    </div>
  );
}
