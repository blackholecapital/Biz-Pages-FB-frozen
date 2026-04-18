import { useEffect, useRef, useState, type RefObject } from "react";
import SHELL from "./shellConfig";

export type StageDims = { w: number; h: number };

export type StageScaleState = {
  scale: number;
  stageOffsetX: number;
  stageOffsetY: number;
  /** Actual stage dims the scale was computed against — kept in state so
   *  downstream consumers (tile layer, pointer math) cannot drift from the
   *  envelope in use. */
  stageW: number;
  stageH: number;
};

export type UseStageScaleOptions = {
  /**
   * Operator desktop target envelope — the reference container size the
   * 2560×1440 stage is tuned for. `useStageScale` always aspect-preserves
   * `stage`; the envelope is carried alongside the scale state so the
   * receiver can expose it (e.g. via `data-*` attrs) and so downstream
   * layout code has one authoritative desktop target instead of rederiving
   * it from scattered constants.
   */
  targetEnvelope?: StageDims;
};

/** Canonical desktop envelope for the premium shell (operator target). */
export const DESKTOP_TARGET_ENVELOPE: StageDims = { w: 2560, h: 1440 };

/** Canonical stage used when the caller does not pass explicit dims. */
export const DEFAULT_PREMIUM_STAGE: StageDims = { w: SHELL.stage.w, h: SHELL.stage.h };

const INITIAL: StageScaleState = {
  scale: 1,
  stageOffsetX: 0,
  stageOffsetY: 0,
  stageW: DEFAULT_PREMIUM_STAGE.w,
  stageH: DEFAULT_PREMIUM_STAGE.h,
};

/**
 * Observes the container element and computes the CSS scale + centering
 * offsets needed to fit a `stage.w × stage.h` surface inside it while
 * preserving aspect ratio.
 *
 * Formula (aspect-preserving, full-viewport fill on the limiting axis):
 *   scale    = min(containerW / stage.w, containerH / stage.h)
 *   offsetX  = (containerW - stage.w * scale) / 2
 *   offsetY  = (containerH - stage.h * scale) / 2
 *
 * The stage dims are sourced from the premium payload (or the default
 * operator envelope when absent). This function does NOT re-interpret tile
 * coordinates — it only derives CSS transform values.
 */
export function useStageScale(
  containerRef: RefObject<HTMLElement>,
  stage: StageDims = DEFAULT_PREMIUM_STAGE,
  _options: UseStageScaleOptions = {}
): StageScaleState {
  const [ss, setSS] = useState<StageScaleState>(() => ({
    ...INITIAL,
    stageW: stage.w,
    stageH: stage.h,
  }));
  const ssRef = useRef<StageScaleState>(ss);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function update() {
      const vw = el!.clientWidth;
      const vh = el!.clientHeight;
      if (!vw || !vh) return;
      const s = Math.min(vw / stage.w, vh / stage.h);
      const ox = (vw - stage.w * s) / 2;
      const oy = (vh - stage.h * s) / 2;
      const next: StageScaleState = {
        scale: s,
        stageOffsetX: ox,
        stageOffsetY: oy,
        stageW: stage.w,
        stageH: stage.h,
      };
      ssRef.current = next;
      setSS(next);
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, stage.w, stage.h]);

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
    const current = ssRef.current ?? INITIAL;
    const { scale, stageOffsetX, stageOffsetY } = current;
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;
    return {
      x: (rawX - stageOffsetX) / scale,
      y: (rawY - stageOffsetY) / scale,
    };
  };
}
