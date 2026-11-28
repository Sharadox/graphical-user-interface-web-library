/** Whether a color style is light or dark; `inherit` follows the device's preference between them. */
export type ColorScheme = "light" | "dark";

/** A value for each color style, by the style's name: `{ white: "220 38 38", black: "255 69 58" }`. */
export type PerColorStyle = Readonly<Record<string, string>>;

/**
 * A constant color: its RGB channels (`"220 38 38"`) in each color style, the one source of truth every other value
 * of the color is derived from.
 */
export interface ConstantColor {
  rgb: PerColorStyle;
  /**
   * The colors a gradient paints the color with, in order (`["red", "yellow", …]`): its fills, its text and its
   * borders, each at the color's own alphas, in the direction of `--gradient-angle`. Flat without one.
   */
  gradient?: readonly string[];
  /** The color of text placed on its fill; `foreground` by default. */
  on?: string;
  /** The color its text turns while hovered (outlined, transparent, inline); itself by default. */
  hover?: string;
  /** The color its text turns while pressed, and its titles' color; its hover color by default. */
  active?: string;
  /** The color it fills with (filled) and tints with (hover backgrounds); itself by default. */
  background?: string;
  /** The color of its border, at the transparent alpha; its background color by default. */
  border?: string;
}

/**
 * A color that is another color: `brand` is `foreground` unless a brand says otherwise. It takes everything from that
 * color (one name for every color style, or one per color style), and may set its own parts.
 */
export interface ColorReference {
  of: string | PerColorStyle;
  on?: string;
  hover?: string;
  /** Its hover color when it sets one; the referred color's otherwise. */
  active?: string;
  background?: string;
  /** Its background color when it sets one; the referred color's otherwise. */
  border?: string;
  /** Its own gradient (the rainbow is foreground, painted with the six hues); the referred color's otherwise. */
  gradient?: readonly string[];
}

/** A color, constant or a reference to another. */
export type ColorDefinition = ConstantColor | ColorReference;

/** A color style (white, black…), light or dark. */
export interface ColorStyle {
  scheme: ColorScheme;
}

/**
 * A place on a box, from 0 to 1 of its width and height (0, 0 is the top left corner). `inline` instead of `x`
 * follows the reading direction: 0 is where a line starts (the left, or the right in Arabic).
 */
export type Position = { x: number; y: number } | { inline: number; y: number };

/** One interactive size: every value of it, each pointing to a shared value or a length. */
export type SizeDefinition = Readonly<Record<string, string>>;

/**
 * Everything the interface is drawn with. Every value has one source: shared values (`values`) point to the scale,
 * colors to their RGB channels, sizes and styles to shared values; components read only these.
 */
export interface InterfaceConfiguration {
  /** The color styles, by name; `inherit` (the device's preference) is always there too. */
  colorStyles: Readonly<Record<string, ColorStyle>>;
  /** The color style used for each device preference while the choice is `inherit`. */
  inheritColorStyles: Readonly<Record<ColorScheme, string>>;
  /** The color style before the visitor chooses: `inherit` or a color style's name. */
  defaultColorStyle: string;
  /** Every color, by name (`red`, `foreground`, `brand`…). */
  colors: Readonly<Record<string, ColorDefinition>>;
  /** The corner styles: each one's radius (`square: "0px"`). */
  cornerStyles: Readonly<Record<string, string>>;
  defaultCornerStyle: string;
  /** The line styles: each one's CSS border style (`dashed: "dashed"`). */
  lineStyles: Readonly<Record<string, string>>;
  defaultLineStyle: string;
  /** The scale every space, gap, margin, padding and font size is taken from, in pixels. */
  scale: readonly number[];
  /** Widths where a per-breakpoint value starts to apply (mobile first), in pixels. */
  breakpoints: readonly number[];
  /** The interactive sizes (`small`, `medium`, `large`) and their values. */
  sizes: Readonly<Record<string, SizeDefinition>>;
  defaultSize: string;
  /** Every place something can sit on a box (a glow), by name: physical (`top-left`) and logical (`end-start`). */
  positions: Readonly<Record<string, Position>>;
  /** Where a glow rests before the pointer comes near. */
  defaultGlowPosition: string;
  /** Every other shared value, without its leading dashes: `"transparent-color-rgb-alpha": "10%"`. */
  values: Readonly<Record<string, string>>;
}

/** What a brand changes: any part of the configuration, merged over the defaults one level deep per entry. */
export interface InterfaceOverrides {
  colorStyles?: Readonly<Record<string, ColorStyle>>;
  inheritColorStyles?: Partial<Record<ColorScheme, string>>;
  defaultColorStyle?: string;
  colors?: Readonly<Record<string, ColorDefinition>>;
  cornerStyles?: Readonly<Record<string, string>>;
  defaultCornerStyle?: string;
  lineStyles?: Readonly<Record<string, string>>;
  defaultLineStyle?: string;
  scale?: readonly number[];
  breakpoints?: readonly number[];
  sizes?: Readonly<Record<string, SizeDefinition>>;
  defaultSize?: string;
  positions?: Readonly<Record<string, Position>>;
  defaultGlowPosition?: string;
  values?: Readonly<Record<string, string>>;
}
