import {
  INHERIT_COLOR_STYLE,
  isReference,
} from "@sharadox/graphical-user-interface-web-library/interface-configuration";
import { BOX_INITIAL_VALUES, boxAxes, glowPosition } from "@sharadox/graphical-user-interface-web-library/box-axis";
import type { Axis, AxisDeclarations } from "@sharadox/graphical-user-interface-web-library/box-axis/type";
import type {
  ColorDefinition,
  InterfaceConfiguration,
} from "@sharadox/graphical-user-interface-web-library/interface-configuration/type";

/**
 * The parts of a color: its text on a fill, its text hovered and pressed, its fill (and tint), its border. A reference
 * takes each from the color it points to, unless it sets it (or the part it follows: pressed follows hovered, the
 * border the fill).
 */
const PARTS = ["on", "hover", "active", "background", "border"] as const;
type Part = (typeof PARTS)[number];
/** What a gradient gives a color, each taken whole by a reference without its own gradient. */
const GRADIENT_VALUES = [
  "color-gradient",
  "transparent-color-gradient",
  "transparent-hover-color-gradient",
  "transparent-active-color-gradient",
  "color-gradient-weight",
  "color-gradient-display",
  "text-fill",
  "text-clip",
] as const;
/** The part a part follows when a color doesn't set it. */
const FOLLOWS: Partial<Record<Part, Part>> = { active: "hover", border: "background" };

type Declarations = string[];
const block = (selector: string, declarations: Declarations) => `${selector}{${declarations.join(";")}}`;
const media = (query: string, rules: string[]) => `@media ${query}{${rules.join("")}}`;
const attribute = (name: string, breakpoint?: number) => (breakpoint ? `${name}-${breakpoint}` : name);
const select = (name: string, value: string, breakpoint?: number) => `[${attribute(name, breakpoint)}="${value}"]`;
const take = (name: string, target: string, values: readonly string[]) =>
  values.map((value) => `--${name}-${value}:var(--${target}-${value})`);

/** The source of a color's part when the color decides it: the color it names, the part it follows, or a default. */
function ownPart(name: string, color: ColorDefinition, part: Part): string | undefined {
  const chosen = color[part];
  if (chosen) return `--${name}-${part}-color-rgb:var(--${chosen}-color-rgb)`;
  const follows = FOLLOWS[part];
  if (follows && (!isReference(color) || color[follows]))
    return `--${name}-${part}-color-rgb:var(--${name}-${follows}-color-rgb)`;
  if (isReference(color)) return undefined;
  return `--${name}-${part}-color-rgb:var(--${part === "on" ? "foreground" : name}-color-rgb)`;
}

/** A gradient through the colors at one of the color's alphas. */
const gradient = (name: string, colors: readonly string[], alpha: string) =>
  `linear-gradient(var(--${name}-gradient-angle), ${colors
    .map((stop) => `rgb(var(--${stop}-color-rgb) / var(--${name}-${alpha}))`)
    .join(", ")})`;

/**
 * A color's own gradient, at its alpha and each transparent alpha, and the flags the box reads (how much of the flat
 * color to hide, whether to draw the gradient border, the text's fill); a flat constant color says it has none.
 */
function ownGradient(name: string, color: ColorDefinition): Declarations {
  if (color.gradient) {
    const colors = color.gradient;
    return [
      `--${name}-gradient-angle:var(--gradient-angle)`,
      `--${name}-color-gradient:${gradient(name, colors, "color-rgb-alpha")}`,
      `--${name}-transparent-color-gradient:${gradient(name, colors, "transparent-color-rgb-alpha")}`,
      `--${name}-transparent-hover-color-gradient:${gradient(name, colors, "transparent-hover-color-rgb-alpha")}`,
      `--${name}-transparent-active-color-gradient:${gradient(name, colors, "transparent-active-color-rgb-alpha")}`,
      `--${name}-color-gradient-weight:100%`,
      `--${name}-color-gradient-display:block`,
      `--${name}-text-fill:transparent`,
      `--${name}-text-clip:text`,
    ];
  }
  if (isReference(color)) return [];
  return [
    `--${name}-color-gradient-weight:0%`,
    `--${name}-color-gradient-display:none`,
    `--${name}-text-fill:currentcolor`,
    `--${name}-text-clip:border-box`,
  ];
}

/** What a reference takes from the color it points to: its channels, its gradient and every part it doesn't set. */
function referenceDeclarations(name: string, color: ColorDefinition, target: string): Declarations {
  return [
    `--${name}-color-rgb:var(--${target}-color-rgb)`,
    ...(color.gradient ? [] : take(name, target, GRADIENT_VALUES)),
    ...PARTS.filter((part) => ownPart(name, color, part) === undefined).map(
      (part) => `--${name}-${part}-color-rgb:var(--${target}-${part}-color-rgb)`,
    ),
  ];
}

/** The constant color a color is in one color style, following its references. */
function constantOf(configuration: InterfaceConfiguration, name: string, style: string): string {
  const color = configuration.colors[name]!;
  if (!isReference(color)) return color.rgb[style]!;
  return constantOf(configuration, typeof color.of === "string" ? color.of : color.of[style]!, style);
}

/** The channels a color fills with in one color style: its background part, followed through its references. */
function fillOf(configuration: InterfaceConfiguration, name: string, style: string): string {
  const color = configuration.colors[name]!;
  if (color.background) return constantOf(configuration, color.background, style);
  if (!isReference(color)) return color.rgb[style]!;
  return fillOf(configuration, typeof color.of === "string" ? color.of : color.of[style]!, style);
}

/**
 * The focus ring's color on a fill, in one color style: brand, foreground when brand would not show on it, background
 * when foreground would not either.
 */
function focusOn(configuration: InterfaceConfiguration, fill: string, style: string): string {
  if (fill !== constantOf(configuration, "brand", style)) return "brand";
  return fill === constantOf(configuration, "foreground", style) ? "background" : "foreground";
}

/** A color style's sources: each constant color's channels, and the colors chosen per style. */
function colorStyleDeclarations(configuration: InterfaceConfiguration, style: string): Declarations {
  const declarations = [`color-scheme:${configuration.colorStyles[style]!.scheme}`];
  for (const [name, color] of Object.entries(configuration.colors)) {
    if (!isReference(color)) declarations.push(`--${name}-color-rgb:${color.rgb[style]}`);
    else if (typeof color.of !== "string") declarations.push(...referenceDeclarations(name, color, color.of[style]!));
  }
  // The focus ring on the page (its background) and on each color's fill.
  const page = focusOn(configuration, constantOf(configuration, "background", style), style);
  declarations.push(`--focus-color-rgb:var(--${page}-color-rgb)`);
  for (const name of Object.keys(configuration.colors)) {
    const focus = focusOn(configuration, fillOf(configuration, name, style), style);
    declarations.push(`--${name}-focus-color-rgb:var(--${focus}-color-rgb)`);
  }
  return declarations;
}

/** The formulas every color (and the color a component wears) derives from its channels, alphas and gradient. */
function formulas(name: string): Declarations {
  const color_ = `--${name}`;
  const opaque = (part: string) =>
    `${color_}-${part}-color:rgb(var(${color_}-${part}-color-rgb) / var(${color_}-color-rgb-alpha))`;
  return [
    `${color_}-color-rgb-alpha:var(--color-rgb-alpha)`,
    `${color_}-color:rgb(var(${color_}-color-rgb) / var(${color_}-color-rgb-alpha))`,
    `${color_}-transparent-color-rgb-alpha:var(--transparent-color-rgb-alpha)`,
    `${color_}-transparent-color:rgb(var(${color_}-background-color-rgb) / var(${color_}-transparent-color-rgb-alpha))`,
    ...(["hover", "active"] as const).flatMap((state) => [
      `${color_}-transparent-${state}-color-rgb-alpha:var(--transparent-${state}-color-rgb-alpha)`,
      `${color_}-transparent-${state}-color:rgb(var(${color_}-background-color-rgb) / var(${color_}-transparent-${state}-color-rgb-alpha))`,
    ]),
    `${color_}-border-color:rgb(var(${color_}-border-color-rgb) / var(${color_}-transparent-color-rgb-alpha))`,
    `${color_}-on-color:rgb(var(${color_}-on-color-rgb))`,
    opaque("hover"),
    opaque("active"),
    opaque("background"),
    `${color_}-focus-color:rgb(var(${color_}-focus-color-rgb))`,
    `${color_}-color-paint:var(${color_}-color-gradient, linear-gradient(var(${color_}-color), var(${color_}-color)))`,
  ];
}

/** Every value of a color, derived in each scope from its sources, so a style switched anywhere reaches them all. */
function derivedDeclarations(name: string, color: ColorDefinition): Declarations {
  const fixedReference = isReference(color) && typeof color.of === "string" ? color.of : undefined;
  return [
    ...(fixedReference ? referenceDeclarations(name, color, fixedReference) : []),
    ...PARTS.map((part) => ownPart(name, color, part)).filter((declaration) => declaration !== undefined),
    ...ownGradient(name, color),
    ...formulas(name),
  ];
}

/** The same formulas for the color a component wears (`--current-*`), derived on the component itself. */
const CURRENT: Declarations = formulas("current");

/** Points a component's current values at one color: its channels, parts, gradient and flags. */
const currentColor = (name: string): Declarations =>
  take("current", name, [
    "color-rgb",
    ...PARTS.map((part) => `${part}-color-rgb`),
    "focus-color-rgb",
    ...GRADIENT_VALUES,
  ]);

const declare = (declarations: AxisDeclarations): Declarations =>
  Object.entries(declarations).map(([name, value]) => `--${name}:${value}`);

/**
 * One axis's rules: each value at rest, then hovered and pressed on interactive boxes. Only a box left to the pointer
 * (`data-state="index"`) turns when hovered or pressed; a set state stays: `hover` looks hovered, `active` and
 * `loading` pressed, `enabled` and `disabled` at rest. Hover and pressed repeat the rest values under theirs, so a
 * breakpoint's value replaces the base value's whole look.
 */
function axisRules(axis: Axis, breakpoint?: number): string[] {
  const rules: string[] = [];
  // When any value changes on hover, every value writes its hover rules: a breakpoint's value must beat the base
  // value's hover rules, which are more specific than its own rest rule.
  const stateful = Object.values(axis.values).some((value) => value.hover || value.active);
  for (const [name, value] of Object.entries(axis.values)) {
    const selector = select(axis.attribute, name, breakpoint);
    rules.push(block(selector, declare(value.rest)));
    const hover = declare({ ...value.rest, ...value.hover });
    const active = declare({ ...value.rest, ...value.hover, ...value.active });
    if (!stateful) continue;
    rules.push(block(`[data-interactive][data-state="hover"]${selector}`, hover));
    rules.push(media("(hover:hover)", [block(`[data-interactive][data-state="index"]:hover${selector}`, hover)]));
    const pressed = ['[data-state="active"]', '[data-state="loading"]', '[data-state="index"]:active'];
    rules.push(block(pressed.map((state) => `[data-interactive]${state}${selector}`).join(","), active));
  }
  return rules;
}

/** The rules that depend on an attribute's value, for the base attribute or one breakpoint's. */
function attributeRules(configuration: InterfaceConfiguration, breakpoint?: number): string[] {
  const { colorStyles, inheritColorStyles } = configuration;
  const rules = Object.keys(colorStyles).map((style) =>
    block(select("data-style-color", style, breakpoint), colorStyleDeclarations(configuration, style)),
  );
  const inherit = select("data-style-color", INHERIT_COLOR_STYLE, breakpoint);
  rules.push(block(inherit, colorStyleDeclarations(configuration, inheritColorStyles.light)));
  rules.push(
    media("(prefers-color-scheme:dark)", [
      block(inherit, colorStyleDeclarations(configuration, inheritColorStyles.dark)),
    ]),
  );
  for (const name of Object.keys(configuration.colors))
    rules.push(block(select("data-color", name, breakpoint), currentColor(name)));
  for (const name of Object.keys(configuration.cornerStyles))
    rules.push(block(select("data-style-corner", name, breakpoint), [`--corner-radius:var(--${name}-corner-radius)`]));
  for (const name of Object.keys(configuration.lineStyles))
    rules.push(
      block(select("data-style-line", name, breakpoint), [
        `--line-style:var(--${name}-line-style)`,
        `--line-solid:var(--${name}-line-solid)`,
      ]),
    );
  for (const [name, size] of Object.entries(configuration.sizes))
    rules.push(
      block(
        select("data-size", name, breakpoint),
        Object.keys(size).map((key) => `--current-${key}:var(--${name}-${key})`),
      ),
    );
  for (const axis of boxAxes(configuration.scale, configuration.positions)) rules.push(...axisRules(axis, breakpoint));
  return rules;
}

/**
 * The whole interface as CSS, from its configuration alone. Each value has one source:
 * - the root holds the shared values, the scale, the breakpoints, every size, corner and line, and the defaults;
 * - each color style (`[data-style-color="black"]`, also on any element, and `inherit`, which follows the device) holds
 *   only its sources: the constant colors' channels and the colors it chooses;
 * - every scope derives every value of every color from them (`--red-color`, `--red-transparent-color`,
 *   `--red-border-color`, `--red-on-color`, `--red-color-paint`…), so switching a style changes only the sources;
 * - `[data-color="red"]` points a component's `--current-*` values at red, derived on the component, so overriding a
 *   shared value (an alpha) on one component changes only that component;
 * - `data-style-corner`, `data-style-line` and `data-size` switch their values the same way;
 * - every attribute has a version per breakpoint (`data-color-960`), mobile first.
 *
 * @example
 * <style>{interfaceStyleSheet(defineInterface({ colors: { brand: { of: "blue" } } }))}</style>
 */
export function interfaceStyleSheet(configuration: InterfaceConfiguration): string {
  const { defaultColorStyle, inheritColorStyles, breakpoints } = configuration;
  const root: Declarations = [
    ...configuration.scale.map((step) => `--scale-${step}:${step}px`),
    ...breakpoints.map((breakpoint) => `--breakpoint-${breakpoint}:${breakpoint}px`),
    ...Object.entries(configuration.values).map(([name, value]) => `--${name}:${value}`),
    ...Object.entries(configuration.cornerStyles).map(([name, radius]) => `--${name}-corner-radius:${radius}`),
    ...Object.entries(configuration.lineStyles).flatMap(([name, style]) => [
      `--${name}-line-style:${style}`,
      // Whether the line is whole: a gradient border is drawn only on whole lines.
      `--${name}-line-solid:${style === "solid" ? 1 : 0}`,
    ]),
    ...Object.entries(configuration.sizes).flatMap(([name, size]) =>
      Object.entries(size).map(([key, value]) => `--${name}-${key}:${value}`),
    ),
    `--corner-radius:var(--${configuration.defaultCornerStyle}-corner-radius)`,
    `--line-style:var(--${configuration.defaultLineStyle}-line-style)`,
    `--line-solid:var(--${configuration.defaultLineStyle}-line-solid)`,
    ...Object.keys(configuration.sizes[configuration.defaultSize]!).map(
      (key) => `--current-${key}:var(--${configuration.defaultSize}-${key})`,
    ),
  ];
  const inherit = defaultColorStyle === INHERIT_COLOR_STYLE;
  const starting = inherit ? inheritColorStyles.light : defaultColorStyle;
  const scope = [":root", "[data-style-color]", ...breakpoints.map((breakpoint) => `[data-style-color-${breakpoint}]`)];
  const rules = [
    // A box's values stay on the box: one inside another starts plain, not with its parent's border or background.
    ...Object.entries(BOX_INITIAL_VALUES).map(
      ([name, value]) => `@property --${name}{syntax:"*";inherits:false;initial-value:${value}}`,
    ),
    block(":root", root),
    block(`:root,${select("data-style-color", starting)}`, colorStyleDeclarations(configuration, starting)),
    ...attributeRules(configuration).filter((rule) => !rule.startsWith(`${select("data-style-color", starting)}{`)),
  ];
  if (inherit)
    rules.push(
      media("(prefers-color-scheme:dark)", [
        block(":root:not([data-style-color])", colorStyleDeclarations(configuration, inheritColorStyles.dark)),
      ]),
    );
  rules.push(
    block(scope.join(","), [
      ...Object.entries(configuration.colors).flatMap(([name, color]) => derivedDeclarations(name, color)),
      "--focus-color:rgb(var(--focus-color-rgb))",
    ]),
  );
  const styleScopes = scope.slice(1);
  rules.push(
    block(`:root,${styleScopes.map((selector) => `${selector}:not([data-color])`).join(",")}`, currentColor("index")),
  );
  rules.push(
    block(
      "[data-glow]:not([data-glow-position])",
      declare(glowPosition(configuration.positions[configuration.defaultGlowPosition]!)),
    ),
  );
  rules.push(block([":root", "[data-color]", ...styleScopes].join(","), CURRENT));
  for (const breakpoint of breakpoints)
    rules.push(media(`(min-width:${breakpoint}px)`, attributeRules(configuration, breakpoint)));
  return rules.join("\n");
}
