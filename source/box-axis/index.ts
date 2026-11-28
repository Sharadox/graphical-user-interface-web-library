import type { Axis, AxisDeclarations } from "@sharadox/graphical-user-interface-web-library/box-axis/type";

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
};

/** What every variant sets, so one variant replaces another whole, at any breakpoint. */
const SIZED: AxisDeclarations = {
  "box-display": "flex",
  "box-section-padding": "var(--current-section-padding)",
  "box-minimum-size": "var(--current-minimum-size)",
  "box-border-thickness": "var(--line-thickness)",
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
/** A background in a transparent color, or its gradient (whose flat color then hides). */
const tint = (state: "hover" | "active") => ({
  "box-background": `color-mix(in srgb, transparent var(--current-color-gradient-weight), var(--current-transparent-${state}-color))`,
  "box-background-image": `var(--current-transparent-${state}-color-gradient, none)`,
  "box-text-color": "var(--current-hover-color)",
});
/**
 * Outlined and transparent: the color's transparent background (or gradient) while hovered and pressed;
 * middleground's text turns. Outlined's border is the color's transparent one, a gradient on whole lines.
 */
const tinted = (bordered: boolean) => ({
  rest: {
    ...SIZED,
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
    "box-backdrop": GLASS,
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
        "box-background": "var(--current-color)",
        "box-background-image": "var(--current-color-gradient, none)",
        "box-text-color": "var(--current-on-color)",
        "box-text-paint": "none",
        "box-text-fill": "currentcolor",
        "box-text-clip": "border-box",
        ...UNBORDERED,
        "box-backdrop": "none",
      },
      // Unchanged, unless the color turns another on hover (middleground turns foreground).
      hover: {
        "box-background": "var(--current-filled-hover-color)",
        "box-background-image": "var(--current-filled-hover-color-gradient, none)",
        "box-text-color": "var(--current-filled-hover-on-color)",
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
        "box-background": "transparent",
        "box-background-image": "none",
        ...PAINTED_TEXT,
        ...UNBORDERED,
        "box-backdrop": "none",
      },
      hover: { "box-text-color": "var(--current-hover-color)" },
      active: { "box-text-color": "var(--current-hover-color)" },
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

/** Where a glow rests until the pointer comes near: below by default, or at any side. */
export const GLOW_START_AXIS = simple("data-glow-start", "glow-start-angle", {
  top: "-90deg",
  end: "0deg",
  bottom: "90deg",
  start: "180deg",
});

/**
 * Every axis of a box, in the order their rules are written: variant, direction, justify, align, text align, and the
 * gap and padding from the scale, and where a glow starts.
 *
 * @example
 * boxAxes(DEFAULT_INTERFACE.scale).map((axis) => axis.attribute); // ["data-variant", "data-direction", …]
 */
export function boxAxes(scale: readonly number[]): Axis[] {
  return [
    VARIANT_AXIS,
    DIRECTION_AXIS,
    JUSTIFY_AXIS,
    ALIGN_AXIS,
    TEXT_ALIGN_AXIS,
    WRAP_AXIS,
    spaced("data-gap", "box-gap", scale),
    spaced("data-padding", "box-padding", scale),
    GLOW_START_AXIS,
  ];
}
