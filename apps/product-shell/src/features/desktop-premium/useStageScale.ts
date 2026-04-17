import { useEffect, useRef, useState, type RefObject } from "react";
import SHELL from "./shellConfig";

export type StageScaleState = {
  scale: number;
  stageOffsetX: number;
  stageOffsetY: number;
};

const INITIAL: StageScaleState = { scale: 1, stageOffsetX: 0, stageOffsetY: 0 };

/**
 * Observes the container element and computes the CSS scale + centering offsets
 * needed to fit a 2560×1440 stage inside it while preserving aspect ratio.
 *
 * Formula: scale = min(containerW / 2560, containerH / 1440)
 * Stage is centered: offsetX = (containerW - 2560*scale) / 2
 */
export function useStageScale(containerRef: RefObject<HTMLElement>): StageScaleState {
  const [ss, setSS] = useState<StageScaleState>(INITIAL);
  const ssRef = useRef<StageScaleState>(INITIAL);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function update() {
      const vw = el!.clientWidth;
      const vh = el!.clientHeight;
      if (!vw || !vh) return;
      const s = Math.min(vw / SHELL.stage.w, vh / SHELL.stage.h);
      const ox = (vw - SHELL.stage.w * s) / 2;
      const oy = (vh - SHELL.stage.h * s) / 2;
      const next: StageScaleState = { scale: s, stageOffsetX: ox, stageOffsetY: oy };
      ssRef.current = next;
      setSS(next);
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return ss;
}

/**
 * Returns a function that converts viewport-relative pointer coordinates
 * into stage-space coordinates using the current scale state ref.
 */
export function makeToStageCoords(
  containerRef: RefObject<HTMLElement>,
  ssRef: RefObject<StageScaleState>
) {
  return function toStageCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = containerRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const { scale, stageOffsetX, stageOffsetY } = ssRef.current ?? INITIAL;
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;
    return {
      x: (rawX - stageOffsetX) / scale,
      y: (rawY - stageOffsetY) / scale,
    };
  };
}
