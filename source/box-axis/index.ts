import type { Axis, AxisDeclarations } from "@sharadox/graphical-user-interface-web-library/box-axis/type";

/** Where every box value starts: a plain, centered flex box with nothing around it. */
export const BOX_INITIAL_VALUES: AxisDeclarations = {
  "box-display": "flex",
  "box-direction": "row",
  "box-justify": "center",
  "box-align": "center",
  "box-text-align": "center",
  "box-gap": "0px",
  "box-padding": "0px",
  "box-minimum-size": "0px",
  "box-section-padding": "0px",
  "box-border-thickness": "0px",
  "box-border-color": "transparent",
  "box-background": "transparent",
  "box-text-color": "currentcolor",
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
/** Outlined and transparent: the color's transparent background while hovered and pressed; middleground's text turns. */
const tinted = (border: string) => ({
  rest: {
    ...SIZED,
    "box-background": "transparent",
    "box-text-color": "var(--current-color)",
    "box-border-color": border,
    "box-backdrop": GLASS,
  },
  hover: { "box-background": "var(--current-transparent-hover-color)", "box-text-color": "var(--current-hover-color)" },
  active: {
    "box-background": "var(--current-transparent-active-color)",
    "box-text-color": "var(--current-hover-color)",
  },
});

/** The variants: filled, outlined, transparent and inline (a box that sits in running text, like a link). */
export const VARIANT_AXIS: Axis = {
  attribute: "data-variant",
  values: {
    filled: {
      rest: {
        ...SIZED,
        "box-background": "var(--current-color-paint)",
        "box-text-color": "var(--current-on-color)",
        "box-border-color": "transparent",
        "box-backdrop": "none",
      },
    },
    outlined: tinted("var(--current-border-color)"),
    transparent: tinted("transparent"),
    inline: {
      rest: {
        "box-display": "inline-flex",
        "box-section-padding": "0px",
        "box-minimum-size": "0px",
        "box-border-thickness": "0px",
        "box-background": "transparent",
        "box-text-color": "var(--current-color)",
        "box-border-color": "transparent",
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

/** Spaces from the scale: `data-gap="8"` is `var(--scale-8)`. */
const spaced = (attribute: string, property: string, scale: readonly number[]) =>
  simple(attribute, property, Object.fromEntries(scale.map((step) => [String(step), `var(--scale-${step})`])));

/**
 * Every axis of a box, in the order their rules are written: variant, direction, justify, align, text align, and the
 * gap and padding from the scale.
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
    spaced("data-gap", "box-gap", scale),
    spaced("data-padding", "box-padding", scale),
  ];
}
