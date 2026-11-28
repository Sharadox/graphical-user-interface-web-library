import type { Axis, AxisDeclarations } from "@sharadox/graphical-user-interface-web-library/box-axis/type";
import {
  CURSOR_POSITION,
  DEFAULT_INTERFACE,
} from "@sharadox/graphical-user-interface-web-library/interface-configuration";
import type { Position } from "@sharadox/graphical-user-interface-web-library/interface-configuration/type";

/** Where every box value starts: a plain, centered flex box with nothing around it. */
export const BOX_INITIAL_VALUES: AxisDeclarations = {
  "box-display": "flex",
  "box-direction": "row",
  "box-justify": "center",
  "box-align": "center",
  "box-text-align": "center",
  "box-wrap": "nowrap",
  "box-gap": "0px",
  "box-padding": "0px",
  "box-minimum-size": "0px",
  "box-section-padding": "0px",
  "box-border-thickness": "0px",
  "box-edge-thickness": "0px",
  "box-line-limit": "10000px",
  "box-border-color": "transparent",
  "box-background": "transparent",
  "box-background-image": "none",
  "box-text-color": "currentcolor",
  "box-text-paint": "none",
  "box-text-fill": "currentcolor",
  "box-text-clip": "border-box",
  "box-border-paint": "none",
  "box-border-gradient-weight": "0%",
  "box-ring-display": "none",
  "box-backdrop": "none",
  "box-focus-color": "currentcolor",
  "box-glow-paint": "none",
  "box-title-color": "currentcolor",
};

/**
 * What every variant but inline sets, so one variant replaces another whole, at any breakpoint. The edge is the
 * line's thickness on every one: outlined draws it as a border, the others (without one) as padding, so all are
 * the same size.
 */
const SIZED: AxisDeclarations = {
  "box-display": "flex",
  "box-section-padding": "var(--current-section-padding)",
  "box-minimum-size": "var(--current-minimum-size)",
  "box-edge-thickness": "var(--line-thickness)",
  // A line of text fits inside the minimum size (less the edges), so the box is exactly 16, 32 or 48 pixels tall.
  "box-line-limit": "calc(var(--current-minimum-size) - 2 * var(--line-thickness))",
};
/** Seen against the page: the page's focus ring, the color's glow, titles in the color's active color. */
const SEE_THROUGH: AxisDeclarations = {
  "box-focus-color": "var(--focus-color)",
  "box-glow-paint": "var(--current-color-paint)",
  "box-title-color": "var(--current-active-color)",
};
const GLASS = "blur(var(--glass-blur))";
/** Text in the color, painted with its gradient where it has one. */
const PAINTED_TEXT: AxisDeclarations = {
  "box-text-color": "var(--current-color)",
  "box-text-paint": "var(--current-color-gradient, none)",
  "box-text-fill": "var(--current-text-fill)",
  "box-text-clip": "var(--current-text-clip)",
};
/** No border, no gradient border. */
const UNBORDERED: AxisDeclarations = {
  "box-border-color": "transparent",
  "box-border-paint": "none",
  "box-border-gradient-weight": "0%",
  "box-ring-display": "none",
};
/**
 * A background in a transparent color, or its gradient (whose flat color then hides), and the state's text; with a
 * background now, it is glass.
 */
const tint = (state: "hover" | "active") => ({
  "box-background": `color-mix(in srgb, transparent var(--current-color-gradient-weight), var(--current-transparent-${state}-color))`,
  "box-background-image": `var(--current-transparent-${state}-color-gradient, none)`,
  "box-text-color": `var(--current-${state}-color)`,
  "box-backdrop": GLASS,
});
/**
 * Outlined and transparent: the color's transparent background (or gradient) and its hover and active text while
 * hovered and pressed. Outlined's border is the color's border color, a gradient on whole lines; transparent has none.
 * At rest their background is wholly transparent, so there is nothing to glass: nothing behind them shows through a
 * blur until they have a background.
 */
const tinted = (bordered: boolean) => ({
  rest: {
    ...SIZED,
    ...SEE_THROUGH,
    "box-border-thickness": bordered ? "var(--line-thickness)" : "0px",
    "box-background": "transparent",
    "box-background-image": "none",
    ...PAINTED_TEXT,
    ...(bordered
      ? {
          "box-border-color": "var(--current-border-color)",
          "box-border-paint": "var(--current-transparent-color-gradient, none)",
          "box-border-gradient-weight": "var(--current-color-gradient-weight)",
          "box-ring-display": "var(--current-color-gradient-display)",
        }
      : UNBORDERED),
    "box-backdrop": "none",
  },
  hover: tint("hover"),
  active: tint("active"),
});

/** The variants: filled, outlined, transparent and inline (a box that sits in running text, like a link). */
export const VARIANT_AXIS: Axis = {
  attribute: "data-variant",
  values: {
    filled: {
      rest: {
        ...SIZED,
        "box-border-thickness": "0px",
        // Its focus ring and inner glow are drawn on its fill.
        "box-focus-color": "var(--current-focus-color)",
        "box-glow-paint": "linear-gradient(var(--current-on-color), var(--current-on-color))",
        "box-title-color": "var(--current-on-color)",
        "box-background": "var(--current-background-color)",
        "box-background-image": "var(--current-color-gradient, none)",
        "box-text-color": "var(--current-on-color)",
        "box-text-paint": "none",
        "box-text-fill": "currentcolor",
        "box-text-clip": "border-box",
        ...UNBORDERED,
        "box-backdrop": "none",
      },
    },
    outlined: tinted(true),
    transparent: tinted(false),
    inline: {
      rest: {
        "box-display": "inline-flex",
        "box-section-padding": "0px",
        "box-minimum-size": "0px",
        "box-border-thickness": "0px",
        "box-edge-thickness": "0px",
        "box-line-limit": "10000px",
        ...SEE_THROUGH,
        "box-background": "transparent",
        "box-background-image": "none",
        ...PAINTED_TEXT,
        ...UNBORDERED,
        "box-backdrop": "none",
      },
      hover: { "box-text-color": "var(--current-hover-color)" },
      active: { "box-text-color": "var(--current-active-color)" },
    },
  },
};

const simple = (attribute: string, property: string, values: Record<string, string>): Axis => ({
  attribute,
  values: Object.fromEntries(Object.entries(values).map(([name, value]) => [name, { rest: { [property]: value } }])),
});
const same = (...names: string[]) => Object.fromEntries(names.map((name) => [name, name]));

/** The direction sections and children follow; left to right follows the reading direction (it flips in Arabic). */
export const DIRECTION_AXIS = simple("data-direction", "box-direction", {
  "left-to-right": "row",
  "right-to-left": "row-reverse",
  "top-to-bottom": "column",
  "bottom-to-top": "column-reverse",
});
/** Along the direction: start, center (the default), end; left and right only where a side must be fixed. */
export const JUSTIFY_AXIS = simple(
  "data-justify",
  "box-justify",
  same("start", "center", "end", "left", "right", "space-between"),
);
/** Across the direction. */
export const ALIGN_AXIS = simple("data-align", "box-align", same("start", "center", "end", "stretch", "baseline"));
/** The text inside, centered by default. */
export const TEXT_ALIGN_AXIS = simple(
  "data-text-align",
  "box-text-align",
  same("start", "center", "end", "left", "right"),
);

/** Whether children wrap onto more lines when they don't fit. */
export const WRAP_AXIS = simple("data-wrap", "box-wrap", same("wrap", "nowrap"));

/** Spaces from the scale: `data-gap="8"` is `var(--scale-8)`. */
const spaced = (attribute: string, property: string, scale: readonly number[]) =>
  simple(attribute, property, Object.fromEntries(scale.map((step) => [String(step), `var(--scale-${step})`])));

/**
 * A position's place for a glow (`--glow-x` and `--glow-y`, from 0 to 1 of the box); a logical one follows the
 * reading direction through the glow's `--glow-inline-origin` and `--glow-inline-direction`.
 */
export function glowPosition(position: Position): AxisDeclarations {
  return {
    "glow-x":
      "x" in position
        ? String(position.x)
        : `calc(var(--glow-inline-origin) + var(--glow-inline-direction) * ${position.inline})`,
    "glow-y": String(position.y),
  };
}

/** Where a glow rests until the pointer comes near: every position, and `cursor` (hidden until the pointer comes). */
export const glowPositionAxis = (positions: Readonly<Record<string, Position>>): Axis => ({
  attribute: "data-glow-position",
  values: {
    ...Object.fromEntries(
      Object.entries(positions).map(([name, position]) => [name, { rest: glowPosition(position) }]),
    ),
    [CURSOR_POSITION]: { rest: { ...glowPosition({ x: 0.5, y: 0.5 }), "glow-rest-opacity": "0" } },
  },
});

/**
 * Every axis of a box, in the order their rules are written: variant, direction, justify, align, text align, and the
 * gap and padding from the scale, and where a glow rests (every position of the interface).
 *
 * @example
 * boxAxes(DEFAULT_INTERFACE.scale).map((axis) => axis.attribute); // ["data-variant", "data-direction", …]
 */
export function boxAxes(
  scale: readonly number[],
  positions: Readonly<Record<string, Position>> = DEFAULT_INTERFACE.positions,
): Axis[] {
  return [
    VARIANT_AXIS,
    DIRECTION_AXIS,
    JUSTIFY_AXIS,
    ALIGN_AXIS,
    TEXT_ALIGN_AXIS,
    WRAP_AXIS,
    spaced("data-gap", "box-gap", scale),
    spaced("data-padding", "box-padding", scale),
    glowPositionAxis(positions),
  ];
}
