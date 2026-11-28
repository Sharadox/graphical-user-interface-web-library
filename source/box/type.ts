import type { ElementType, HTMLAttributes, ReactNode } from "react";
import type { Responsive } from "@sharadox/graphical-user-interface-web-library/responsive/type";

/** Filled, outlined, transparent, or inline (sitting in running text, like a link). */
export type BoxVariant = "filled" | "outlined" | "transparent" | "inline";
export type BoxDirection = "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top";
export type BoxJustify = "start" | "center" | "end" | "left" | "right" | "space-between";
export type BoxAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type BoxTextAlign = "start" | "center" | "end" | "left" | "right";
/** A step of the scale, in pixels. */
export type ScaleStep = 0 | 4 | 8 | 12 | 14 | 16 | 24 | 32 | 64 | 128;
/**
 * An interactive box's state. `index` (the default) leaves it to the pointer: it turns when hovered and pressed. Any
 * other is set and stays: `enabled` at rest, `hover` hovered, `active` and `loading` pressed (with the default
 * cursor), `disabled` faded.
 */
export type BoxState = "index" | "enabled" | "hover" | "active" | "loading" | "disabled";
/** What a box can add to its look: `glass` (the default) blurs what is behind it, `glow` lights it. */
export type BoxModification = "glass" | "glow";
/**
 * Where a glow rests until the pointer comes near: a position of the interface, physical (`top`, `bottom-right`…)
 * or logical (`start`, `end-start`…, following the reading direction), a brand's own, or `cursor` (hidden until the
 * pointer comes, then where it is).
 */
export type GlowPosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "start"
  | "end"
  | "start-start"
  | "start-end"
  | "end-start"
  | "end-end"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "cursor"
  | (string & {});
/** Whether a glow stays inside its box (over its fill, under its content) or spreads a little outside, behind it. */
export type GlowBoundary = "inside" | "outside";

/** Every look a box can take, each for every width or per breakpoint. */
export interface BoxLook {
  variant?: Responsive<BoxVariant>;
  /** Any color of the interface (`brand`, `red`, a brand's own…); the box and everything inside take it. */
  color?: Responsive<string>;
  /** A color style for this box and everything inside (`black`, `white`, `inherit`). */
  colorStyle?: Responsive<string>;
  /** A corner style (`square`, `rounded-square`, `circle`). */
  corner?: Responsive<string>;
  /** A line style (`line`, `dotted`, `dashed`). */
  line?: Responsive<string>;
  /** An interactive size (`small`, `medium`, `large`). */
  size?: Responsive<string>;
  direction?: Responsive<BoxDirection>;
  justify?: Responsive<BoxJustify>;
  align?: Responsive<BoxAlign>;
  textAlign?: Responsive<BoxTextAlign>;
  /** Whether children wrap onto more lines when they don't fit (`nowrap` by default). */
  wrap?: Responsive<"wrap" | "nowrap">;
  gap?: Responsive<ScaleStep>;
  padding?: Responsive<ScaleStep>;
  /** Where a glow rests until the pointer comes near (`bottom` by default). */
  glowPosition?: Responsive<GlowPosition>;
}

export interface BoxProperties extends BoxLook, Omit<HTMLAttributes<HTMLElement>, "color" | "prefix"> {
  /** The element (a tag or a component such as next/link's `Link`); `div` by default. */
  as?: ElementType;
  /** A section before the content (an icon, a character…), at least square. */
  prefix?: ReactNode;
  /** A section after the content, at least square. */
  suffix?: ReactNode;
  /** Holds one icon or character: square, with no padding. */
  square?: boolean;
  /** Reacts to the pointer and the keyboard: hover and pressed looks, a pointer cursor, states. */
  interactive?: boolean;
  /**
   * Holds a form control (a text field, a select): interactive, with a text cursor, the field's font weight, a focus
   * ring while anything inside has focus, and a line between its sections.
   */
  field?: boolean;
  /** An interactive box's state (`index` by default: it follows the pointer). */
  state?: BoxState;
  /**
   * What the box adds to its look, any together: `glass` blurs what is behind a see-through box, `glow` lights it
   * with a soft light that breathes, floats, moves toward the pointer and swells while pressed. Without a list,
   * glass; an empty list, nothing.
   */
  modifications?: readonly BoxModification[];
  /** Where a glow is drawn: `outside` (the default) a little past the box, behind it; `inside` within it. */
  glowBoundary?: GlowBoundary;
  /** Anything else the element takes (`href`, `type`, `disabled`…). */
  [attribute: string]: unknown;
}
