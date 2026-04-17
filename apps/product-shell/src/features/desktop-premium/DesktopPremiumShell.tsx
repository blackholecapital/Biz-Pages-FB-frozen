import type { ReactNode } from "react";
import type { StageScaleState } from "./useStageScale";
import SHELL from "./shellConfig";

type DesktopPremiumShellProps = {
  scaleState: StageScaleState;
  wallpaperUrl?: string;
  tilesLayer?: ReactNode;
  studioMode?: boolean;
};

/**
 * Pure stage renderer for desktop-premium-v1.
 *
 * Renders a 2560×1440 stage div scaled and centered via CSS transform.
 * Does not manage its own scale — caller provides scaleState from useStageScale.
 * Used identically by Studio and Receiver; both see the same shell geometry.
 */
export function DesktopPremiumShell({
  scaleState,
  wallpaperUrl,
  tilesLayer,
  studioMode = false,
}: DesktopPremiumShellProps) {
  const cfg = SHELL;
  const { scale, stageOffsetX, stageOffsetY } = scaleState;

  return (
    <div
      className="dpv1Stage"
      style={{
        width: cfg.stage.w,
        height: cfg.stage.h,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        left: stageOffsetX,
        top: stageOffsetY,
      }}
    >
      {/* Wallpaper — same fit/position/repeat in both Studio and Receiver */}
      <div
        className="dpv1Wallpaper"
        aria-hidden
        style={
          wallpaperUrl
            ? {
                backgroundImage: `url('${wallpaperUrl}')`,
                backgroundSize: cfg.wallpaper.fit,
                backgroundPosition: cfg.wallpaper.position,
                backgroundRepeat: cfg.wallpaper.repeat,
              }
            : undefined
        }
      />

      {/* Header */}
      <div className="dpv1Header" style={{ height: cfg.header.h }}>
        <span className="dpv1HeaderLabel">{cfg.shellId}</span>
      </div>

      {/* Left rail */}
      <div
        className="dpv1LeftRail"
        style={{ width: cfg.leftRail.w, top: cfg.header.h }}
      />

      {/* Right rail */}
      <div
        className="dpv1RightRail"
        style={{ width: cfg.rightRail.w, top: cfg.header.h }}
      />

      {/* Workspace visual region */}
      <div
        className={`dpv1Workspace${studioMode ? " dpv1WorkspaceStudio" : ""}`}
        style={{
          left: cfg.workspace.x,
          top: cfg.workspace.y,
          width: cfg.workspace.w,
          height: cfg.workspace.h,
        }}
      />

      {/* Tiles layer — stage-space absolute coordinates */}
      {tilesLayer && <div className="dpv1TilesLayer">{tilesLayer}</div>}
    </div>
  );
}
