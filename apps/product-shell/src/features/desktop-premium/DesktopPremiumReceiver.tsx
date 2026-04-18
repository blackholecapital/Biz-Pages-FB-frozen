import { useRef, type RefObject } from "react";
import { DesktopPremiumShell } from "./DesktopPremiumShell";
import { DESKTOP_TARGET_ENVELOPE, useStageScale } from "./useStageScale";
// Canonical runtime contract lives in runtime/types. shellConfig's type
// aliases use literal 2560×1440 dims for authoring; the receiver accepts the
// widened runtime contract so server-emitted stage dims pass through without
// reinterpretation.
import type { PremiumShellLayout, PremiumStageTile } from "../../runtime/types";

type ReceiverTilesProps = {
  tiles: PremiumStageTile[];
};

function ReceiverTiles({ tiles }: ReceiverTilesProps) {
  if (tiles.length === 0) {
    return <div className="dpv1ReceiverEmpty">No tiles deployed</div>;
  }
  return (
    <>
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="dpv1Tile"
          style={{
            left: tile.x,
            top: tile.y,
            width: tile.w,
            height: tile.h,
            zIndex: tile.z,
          }}
        >
          {tile.asset && (
            <img
              className="dpv1TileMedia"
              src={tile.asset}
              alt=""
              draggable={false}
            />
          )}
        </div>
      ))}
    </>
  );
}

type DesktopPremiumReceiverProps = {
  layout: PremiumShellLayout;
};

/**
 * Canonical receiver renderer for desktop-premium-v1.
 *
 * Consumes a `PremiumShellLayout` directly from the published runtime
 * payload. Stage dimensions, wallpaper URL and tile coordinates are taken
 * verbatim — no re-interpretation, no fallback to module-level defaults.
 *
 * The receiver fills the full available viewport (its container is a
 * `.premiumSurface` or similar full-bleed ancestor) while preserving the
 * stage aspect ratio via CSS transform-scale and centering offsets from
 * `useStageScale`. The operator desktop target envelope is exposed on the
 * stage element for downstream verification.
 */
export function DesktopPremiumReceiver({ layout }: DesktopPremiumReceiverProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scaleState = useStageScale(
    viewportRef as RefObject<HTMLElement>,
    layout.stage
  );

  return (
    <div
      ref={viewportRef}
      className="dpv1Viewport"
      data-shell={layout.shellId}
      data-stage-w={layout.stage.w}
      data-stage-h={layout.stage.h}
      data-target-envelope-w={DESKTOP_TARGET_ENVELOPE.w}
      data-target-envelope-h={DESKTOP_TARGET_ENVELOPE.h}
    >
      <DesktopPremiumShell
        scaleState={scaleState}
        stageDims={layout.stage}
        targetEnvelope={DESKTOP_TARGET_ENVELOPE}
        wallpaperUrl={layout.wallpaper ?? undefined}
        tilesLayer={<ReceiverTiles tiles={layout.tiles} />}
      />
    </div>
  );
}
