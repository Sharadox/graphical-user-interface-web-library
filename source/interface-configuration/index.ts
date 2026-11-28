import type {
  ColorDefinition,
  ColorReference,
  InterfaceConfiguration,
  InterfaceOverrides,
  Position,
} from "@sharadox/graphical-user-interface-web-library/interface-configuration/type";

/** The color style that follows the device's light or dark preference. */
export const INHERIT_COLOR_STYLE = "inherit";

const both = (rgb: string) => ({ white: rgb, black: rgb });

/** The position `cursor` is taken: a glow there follows the pointer and rests hidden. */
export const CURSOR_POSITION = "cursor";

/** Every physical place on a box, then every logical one (start and end follow the reading direction). */
const POSITIONS: Readonly<Record<string, Position>> = {
  center: { x: 0.5, y: 0.5 },
  top: { x: 0.5, y: 0 },
  bottom: { x: 0.5, y: 1 },
  left: { x: 0, y: 0.5 },
  right: { x: 1, y: 0.5 },
  "top-left": { x: 0, y: 0 },
  "top-right": { x: 1, y: 0 },
  "bottom-left": { x: 0, y: 1 },
  "bottom-right": { x: 1, y: 1 },
  start: { inline: 0, y: 0.5 },
  end: { inline: 1, y: 0.5 },
  "start-start": { inline: 0, y: 0 },
  "start-end": { inline: 1, y: 0 },
  "end-start": { inline: 0, y: 1 },
  "end-end": { inline: 1, y: 1 },
  "top-start": { inline: 0, y: 0 },
  "top-end": { inline: 1, y: 0 },
  "bottom-start": { inline: 0, y: 1 },
  "bottom-end": { inline: 1, y: 1 },
};
const interactiveSize = (minimum: string, font: string) => ({
  "minimum-size": minimum,
  "font-size": font,
  "font-weight": "var(--interactive-font-weight)",
  "field-font-weight": "var(--field-font-weight)",
  "section-padding": "var(--scale-8)",
});

/**
 * The generic interface: white and black color styles (and `inherit`), the constant colors with their RGB channels,
 * the colors that refer to them (index, every component's color; the rainbow, painted with the six hues), three corner
 * styles, three line styles, the scale, the breakpoints, three interactive sizes, every position and every shared
 * value, each pointing to its source.
 */
export const DEFAULT_INTERFACE: InterfaceConfiguration = {
  colorStyles: { white: { scheme: "light" }, black: { scheme: "dark" } },
  inheritColorStyles: { light: "white", dark: "black" },
  defaultColorStyle: INHERIT_COLOR_STYLE,
  colors: {
    black: { rgb: both("0 0 0"), on: "white" },
    white: { rgb: both("255 255 255"), on: "black" },
    red: { rgb: { white: "220 38 38", black: "255 69 58" } },
    green: { rgb: { white: "22 163 74", black: "48 209 88" } },
    blue: { rgb: { white: "37 99 235", black: "10 132 255" } },
    cyan: { rgb: { white: "8 145 178", black: "0 255 255" } },
    magenta: { rgb: { white: "192 38 211", black: "255 0 255" } },
    yellow: { rgb: { white: "202 138 4", black: "255 214 10" } },
    foreground: { of: { white: "black", black: "white" }, on: "background" },
    middleground: { rgb: { white: "94 94 94", black: "161 161 161" } },
    background: { of: { white: "white", black: "black" } },
    brand: { of: "foreground", on: "background" },
    information: { of: "blue" },
    success: { of: "green" },
    warn: { of: "yellow" },
    error: { of: "red" },
    index: {
      of: "middleground",
      on: "background",
      hover: "foreground",
      background: "foreground",
      border: "foreground",
    },
    rainbow: { of: "foreground", on: "foreground", gradient: ["red", "yellow", "green", "cyan", "blue", "magenta"] },
  },
  cornerStyles: { square: "0px", "rounded-square": "4px", circle: "10000px" },
  defaultCornerStyle: "rounded-square",
  lineStyles: { line: "solid", dotted: "dotted", dashed: "dashed" },
  defaultLineStyle: "line",
  scale: [0, 4, 8, 12, 14, 16, 24, 32, 64, 128],
  breakpoints: [640, 960, 1280],
  sizes: {
    small: interactiveSize("var(--scale-16)", "var(--scale-12)"),
    medium: interactiveSize("var(--scale-32)", "var(--scale-14)"),
    large: interactiveSize("48px", "var(--scale-16)"),
  },
  defaultSize: "medium",
  positions: POSITIONS,
  defaultGlowPosition: "bottom",
  values: {
    "color-rgb-alpha": "100%",
    "transparent-color-rgb-alpha": "12.5%",
    "transparent-hover-color-rgb-alpha": "var(--transparent-color-rgb-alpha)",
    "transparent-active-color-rgb-alpha": "var(--transparent-hover-color-rgb-alpha)",
    "disabled-opacity": "50%",
    "line-thickness": "1px",
    "focus-thickness": "2px",
    // Inside the box's edge, so it is seen against the box's own fill.
    "focus-offset": "calc(-2 * var(--focus-thickness))",
    "quick-duration": "0.1s",
    duration: "0.25s",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    "glass-blur": "var(--scale-16)",
    "interactive-font-weight": "500",
    "field-font-weight": "400",
    "line-height": "1.25",
    "font-family": "system-ui, sans-serif",
    "wrapper-width": "1280px",
    "wrapper-padding": "var(--scale-16)",
    "spinner-duration": "0.8s",
    "gradient-angle": "90deg",
    "glow-range": "var(--scale-128)",
    "glow-overflow": "var(--scale-8)",
    // Its width, from the box's (its layer is a size container): half the width plus half the height.
    "glow-size": "max(var(--scale-32), calc(50cqw + 50cqh))",
    "glow-opacity": "50%",
    "glow-breathe-duration": "4s",
    "glow-float-duration": "7s",
    "glow-press-scale": "1.35",
  },
};

/** Whether a color is a reference to another color rather than constant RGB channels. */
export function isReference(color: ColorDefinition): color is ColorReference {
  return "of" in color;
}

const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/** Every color a color refers to in each color style, for checks. */
function referencesOf(color: ColorDefinition, styles: string[]): string[] {
  const own = [color.on, color.hover, color.active, color.background, color.border, ...(color.gradient ?? [])].filter(
    (name): name is string => name !== undefined,
  );
  if (!isReference(color)) return own;
  return [...own, ...(typeof color.of === "string" ? [color.of] : styles.map((style) => color.of[style as never]!))];
}

/** Checks that every name a configuration uses exists, and that no color refers back to itself. */
function check(configuration: InterfaceConfiguration): InterfaceConfiguration {
  const styles = Object.keys(configuration.colorStyles);
  if (styles.includes(INHERIT_COLOR_STYLE)) throw new Error(`"${INHERIT_COLOR_STYLE}" is not a color style`);
  for (const style of [configuration.defaultColorStyle, ...Object.values(configuration.inheritColorStyles)]) {
    if (style !== INHERIT_COLOR_STYLE && !styles.includes(style)) throw new Error(`no color style "${style}"`);
  }
  const { colors } = configuration;
  for (const [name, color] of Object.entries(colors)) {
    if (!KEBAB_CASE.test(name)) throw new Error(`"${name}" is not a kebab-case name`);
    for (const style of styles) {
      if (isReference(color) && typeof color.of !== "string" && !color.of[style])
        throw new Error(`color "${name}" has no color for the "${style}" style`);
      if (!isReference(color) && !color.rgb[style])
        throw new Error(`color "${name}" has no rgb for the "${style}" style`);
    }
    for (const reference of referencesOf(color, styles)) {
      if (!colors[reference]) throw new Error(`color "${name}" refers to "${reference}"`);
    }
  }
  // A reference that, followed, comes back to where it started would never resolve in CSS.
  for (const start of Object.keys(colors)) {
    for (const style of styles) {
      const seen = new Set<string>();
      let current: ColorDefinition = colors[start]!;
      let name = start;
      while (isReference(current)) {
        if (seen.has(name)) throw new Error(`color "${start}" refers to itself`);
        seen.add(name);
        name = typeof current.of === "string" ? current.of : current.of[style]!;
        current = colors[name]!;
      }
    }
  }
  const named = [
    ["corner style", configuration.cornerStyles, configuration.defaultCornerStyle],
    ["line style", configuration.lineStyles, configuration.defaultLineStyle],
    ["size", configuration.sizes, configuration.defaultSize],
  ] as const;
  for (const [kind, options, chosen] of named) if (!(chosen in options)) throw new Error(`no ${kind} "${chosen}"`);
  if (CURSOR_POSITION in configuration.positions) throw new Error(`"${CURSOR_POSITION}" is not a position name`);
  if (!(configuration.defaultGlowPosition in configuration.positions))
    throw new Error(`no position "${configuration.defaultGlowPosition}"`);
  return configuration;
}

/**
 * A brand's interface: the defaults with its changes (each color, style, size and value merged one level deep),
 * checked so every name it uses exists. A new color needs only its RGB channels; every value of it is derived.
 *
 * @example
 * export const INTERFACE = defineInterface({
 *   colors: { gold: { rgb: { white: "180 140 60", black: "212 175 90" } }, brand: { of: "gold" } },
 *   defaultCornerStyle: "circle",
 * });
 */
export function defineInterface(overrides: InterfaceOverrides = {}): InterfaceConfiguration {
  const base = DEFAULT_INTERFACE;
  const sizes = { ...base.sizes };
  for (const [name, size] of Object.entries(overrides.sizes ?? {})) sizes[name] = { ...sizes[name], ...size };
  return check({
    ...base,
    ...overrides,
    colorStyles: { ...base.colorStyles, ...overrides.colorStyles },
    inheritColorStyles: { ...base.inheritColorStyles, ...overrides.inheritColorStyles },
    colors: { ...base.colors, ...overrides.colors },
    cornerStyles: { ...base.cornerStyles, ...overrides.cornerStyles },
    lineStyles: { ...base.lineStyles, ...overrides.lineStyles },
    sizes,
    positions: { ...base.positions, ...overrides.positions },
    values: { ...base.values, ...overrides.values },
  });
}
