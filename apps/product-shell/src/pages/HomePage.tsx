import { useRef, type RefObject } from "react";
import { DesktopPremiumShell } from "../features/desktop-premium/DesktopPremiumShell";
import { useStageScale } from "../features/desktop-premium/useStageScale";
import SHELL from "../features/desktop-premium/shellConfig";

export function HomePage() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scaleState = useStageScale(viewportRef as RefObject<HTMLElement>);
  const ws = SHELL.workspace;

  return (
    <div
      ref={viewportRef}
      className="dpv1PageWrapper dpv1Viewport"
      style={{
        backgroundImage: "url('/w99.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <DesktopPremiumShell
        scaleState={scaleState}
        tilesLayer={
          <div
            style={{
              position: "absolute",
              left: ws.x,
              top: ws.y,
              width: ws.w,
              height: ws.h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
            }}
          >
            <div className="homeHero">
              <h1 className="homeHeroTitle">Welcome Home</h1>
              <p className="homeHeroBody">
                Your 2560&times;1440 desktop-premium canvas, scaled to fit your screen.
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
