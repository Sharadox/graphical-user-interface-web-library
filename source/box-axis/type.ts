/** CSS custom properties by name (without dashes) and their values. */
export type AxisDeclarations = Readonly<Record<string, string>>;

/** What one value of an axis sets: at rest, and over it while hovered and while pressed (interactive boxes). */
export interface AxisValue {
  rest: AxisDeclarations;
  hover?: AxisDeclarations;
  active?: AxisDeclarations;
}

/** One way a box can vary (its variant, direction, gap…): the attribute that carries it and each value's look. */
export interface Axis {
  /** The attribute, such as `data-variant` (and `data-variant-960` per breakpoint). */
  attribute: string;
  values: Readonly<Record<string, AxisValue>>;
}
