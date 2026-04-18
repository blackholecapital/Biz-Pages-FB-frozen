import type { ReactNode } from "react";

import { DesktopPremiumReceiver } from "../../features/desktop-premium/DesktopPremiumReceiver";
import type {
  PremiumShellLayout,
  PublishedRuntimePage,
} from "../../runtime/types";
import {
  PREMIUM_SHELL_ID,
  adaptPremiumRuntimePage,
  isPremiumRuntimePage,
} from "../../runtime/types";

type PageShellProps = {
  children?: ReactNode;
  /** R2 tenant wallpaper URL. When provided, overrides the AppShell default.
   *  Only used by the legacy (non-premium) render path. */
  wallpaperUrl?: string;
  /**
   * Pre-adapted premium layout. When present, the shell renders the
   * canonical `DesktopPremiumReceiver` full-bleed and does not render the
   * legacy wallpaper/content frame. This is the single premium render path.
   */
  premiumLayout?: PremiumShellLayout | null;
  /**
   * Compiled runtime payload. When present AND `isPremiumRuntimePage(page)`
   * the shell dispatches to the premium receiver without the caller needing
   * to build a `PremiumShellLayout` manually. Supply `wallpaperUrl` to have
   * it flow into the adapted premium layout's `wallpaper` slot.
   */
  runtimePage?: PublishedRuntimePage | null;
};

/**
 * Legacy / static layout surface, now extended with premium dispatch.
 *
 * Dispatch rules (single path, no overlap):
 *   1. If `premiumLayout` is supplied, render the canonical premium receiver.
 *   2. Else, if `runtimePage` is supplied AND `isPremiumRuntimePage(runtimePage)`,
 *      adapt it (wallpaper URL resolved via `wallpaperUrl` prop) and render
 *      the canonical premium receiver.
 *   3. Otherwise, render the legacy wallpaper + content frame.
 *
 * This eliminates the mixed legacy/static + premium overlay behavior
 * inventoried in `runtime_parity_matrix.md` §1 and §2.
 */
export function PageShell({
  children,
  wallpaperUrl,
  premiumLayout,
  runtimePage,
}: PageShellProps) {
  const resolvedPremium: PremiumShellLayout | null =
    premiumLayout ??
    (isPremiumRuntimePage(runtimePage)
      ? adaptPremiumRuntimePage(runtimePage, wallpaperUrl ?? null)
      : null);

  if (resolvedPremium) {
    return (
      <div
        className="premiumSurface"
        data-shell={PREMIUM_SHELL_ID}
        data-premium-stage-w={resolvedPremium.stage.w}
        data-premium-stage-h={resolvedPremium.stage.h}
      >
        <DesktopPremiumReceiver layout={resolvedPremium} />
      </div>
    );
  }

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
