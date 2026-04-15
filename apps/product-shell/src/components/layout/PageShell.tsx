import type { ReactNode } from "react";

type PageShellProps = {
  children?: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="pageShell">
      <div className="wallpaperLayer" aria-hidden>
        <div className="wallpaperImage" />
      </div>
      <div className="pageShellContent">{children}</div>
    </div>
  );
}
