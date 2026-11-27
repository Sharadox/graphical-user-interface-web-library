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
/** An interactive box's state; forcing one shows it without the pointer (for the design system's pages). */
export type BoxState = "enabled" | "hover" | "active" | "loading" | "disabled";

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
  /** An interactive box's state (`enabled` by default). */
  state?: BoxState;
  /** Anything else the element takes (`href`, `type`, `disabled`…). */
  [attribute: string]: unknown;
}
