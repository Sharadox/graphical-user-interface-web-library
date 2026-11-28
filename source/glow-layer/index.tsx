"use client";
import { useEffect, useId, useRef } from "react";
import { followPointerPosition } from "@sharadox/pointer-web-library/pointer-position";
import type { GlowLayerProperties } from "@sharadox/graphical-user-interface-web-library/glow-layer/type";
import styles from "./index.module.scss";

/** A number from a computed value (`"128px"`), or the fallback when it has none. */
const numberOf = (value: string, fallback: number) => {
  const number = Number.parseFloat(value);
  return Number.isNaN(number) ? fallback : number;
};
const clamp = (value: number, minimum: number, maximum: number) => Math.min(Math.max(value, minimum), maximum);

/**
 * The glow modification's layer (a `Box` with `modifications={["glow"]}` adds it): a soft light of the box's color,
 * sized to the box, that breathes and floats while on screen, rests at `--glow-x` and `--glow-y` (the box's glow
 * position, the bottom by default; hidden at `cursor` until the pointer comes), glides toward the pointer while it is
 * within `--glow-range` (128 pixels) of the box, held to the box's edges, and swells while the box is pressed.
 * - `outside` (the default): right after its box and anchored to it (CSS anchor positioning; without it, no glow),
 *   under it, reaching `--glow-overflow` past its edges: a filled box hides its middle, a see-through one shows it.
 * - `inside`: the box's first child, clipped to it, over its fill and under its content.
 *
 * It costs nothing while off screen.
 *
 * @example
 * <GlowLayer attributes={{ "data-color": "brand", "data-glow-position": "top-end" }} boundary="inside" />
 */
export function GlowLayer({ attributes, boundary = "outside" }: GlowLayerProperties) {
  const layer = useRef<HTMLSpanElement>(null);
  const anchor = `--glow-${useId().replace(/[^\w-]/g, "")}`;
  useEffect(() => {
    const glow = layer.current!;
    const light = glow.firstElementChild as HTMLElement;
    const inside = boundary === "inside";
    const box = (inside ? glow.parentElement : glow.previousElementSibling) as HTMLElement;
    if (!inside) {
      box.style.setProperty("anchor-name", anchor);
      glow.style.setProperty("position-anchor", anchor);
    }
    const style = getComputedStyle(glow);
    const overflow = inside ? 0 : numberOf(style.getPropertyValue("--glow-overflow"), 8);
    const press = () => glow.setAttribute("data-pressed", "");
    const release = () => glow.removeAttribute("data-pressed");
    const events = { pointerdown: press, pointerup: release, pointercancel: release, pointerleave: release };
    for (const [type, listener] of Object.entries(events)) box.addEventListener(type, listener);
    const stop = followPointerPosition(box, {
      range: numberOf(style.getPropertyValue("--glow-range"), 128),
      onPosition: (position) => {
        glow.toggleAttribute("data-near", position !== undefined);
        if (!position) {
          light.style.translate = "";
          return;
        }
        const x = clamp(position.x, -overflow, position.width + overflow);
        const y = clamp(position.y, -overflow, position.height + overflow);
        light.style.translate = `${x}px ${y}px`;
      },
      onVisibility: (visible) => glow.toggleAttribute("data-visible", visible),
    });
    return () => {
      stop();
      for (const [type, listener] of Object.entries(events)) box.removeEventListener(type, listener);
    };
  }, [anchor, boundary]);
  return (
    <span
      ref={layer}
      aria-hidden="true"
      data-glow=""
      data-glow-boundary={boundary}
      {...attributes}
      className={styles.glow}
    >
      <span className={styles.light} />
    </span>
  );
}
