import { useRef, type RefObject } from "react";
import { DesktopPremiumShell } from "./DesktopPremiumShell";
import { useStageScale } from "./useStageScale";
import type { PremiumShellLayout, PremiumStageTile } from "./shellConfig";

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
 * Receiver renderer for desktop-premium-v1.
 *
 * Reads a PremiumShellLayout (shellId + stage + wallpaper + tiles) and renders
 * the canonical 2560×1440 stage scaled to fit the viewport. Tile positions are
 * read directly from stage-space coordinates — no re-interpretation.
 *
 * Visual output is pixel-identical to DesktopPremiumStudio for the same layout.
 */
export function DesktopPremiumReceiver({ layout }: DesktopPremiumReceiverProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scaleState = useStageScale(viewportRef as RefObject<HTMLElement>);

  return (
    <div ref={viewportRef} className="dpv1Viewport">
      <DesktopPremiumShell
        scaleState={scaleState}
        wallpaperUrl={layout.wallpaper ?? undefined}
        tilesLayer={<ReceiverTiles tiles={layout.tiles} />}
      />
    </div>
  );
}
