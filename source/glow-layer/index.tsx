"use client";
import { useEffect, useId, useRef } from "react";
import { followPointerAngle } from "@sharadox/pointer-web-library/pointer-angle";
import type { GlowLayerProperties } from "@sharadox/graphical-user-interface-web-library/glow-layer/type";
import styles from "./index.module.scss";

/** A number from a computed value (`"128px"`, `"-90deg"`), or the fallback when it has none. */
const numberOf = (value: string, fallback: number) => {
  const number = Number.parseFloat(value);
  return Number.isNaN(number) ? fallback : number;
};

/**
 * The glow modification's layer, placed right after its box (a `Box` with `modifications={["glow"]}` adds it): a soft
 * light of the box's color around and behind the box, always shown, resting at `--glow-start-angle` (below by default)
 * and turning toward the pointer while it is within `--glow-range` (128 pixels) of the box. It sits under the box, so a
 * filled box hides its middle and an outlined one lets it show through. It is anchored to the box (CSS anchor
 * positioning; without it, no glow), and costs nothing while off screen.
 *
 * @example
 * <GlowLayer attributes={{ "data-color": "brand" }} />
 */
export function GlowLayer({ attributes }: GlowLayerProperties) {
  const layer = useRef<HTMLSpanElement>(null);
  const anchor = `--glow-${useId().replace(/[^\w-]/g, "")}`;
  useEffect(() => {
    const glow = layer.current!;
    const box = glow.previousElementSibling as HTMLElement;
    box.style.setProperty("anchor-name", anchor);
    glow.style.setProperty("position-anchor", anchor);
    const style = getComputedStyle(glow);
    return followPointerAngle(box, {
      range: numberOf(style.getPropertyValue("--glow-range"), 128),
      rest: numberOf(style.getPropertyValue("--glow-start-angle"), 90),
      onAngle: (angle) => glow.style.setProperty("--glow-angle", `${angle}deg`),
    });
  }, [anchor]);
  return <span ref={layer} aria-hidden="true" data-glow="" {...attributes} className={styles.glow} />;
}
