import {
  INHERIT_COLOR_STYLE,
  isReference,
} from "@sharadox/graphical-user-interface-web-library/interface-configuration";
import { BOX_INITIAL_VALUES, boxAxes } from "@sharadox/graphical-user-interface-web-library/box-axis";
import type { Axis, AxisDeclarations } from "@sharadox/graphical-user-interface-web-library/box-axis/type";
import type {
  ColorDefinition,
  InterfaceConfiguration,
} from "@sharadox/graphical-user-interface-web-library/interface-configuration/type";

/** The parts of a color that a reference takes from the color it points to, unless it sets them itself. */
const PARTS = ["transparent", "on", "hover"] as const;
type Part = (typeof PARTS)[number];

type Declarations = string[];
const block = (selector: string, declarations: Declarations) => `${selector}{${declarations.join(";")}}`;
const media = (query: string, rules: string[]) => `@media ${query}{${rules.join("")}}`;
const attribute = (name: string, breakpoint?: number) => (breakpoint ? `${name}-${breakpoint}` : name);
const select = (name: string, value: string, breakpoint?: number) => `[${attribute(name, breakpoint)}="${value}"]`;

/** The source of a color's part (`on`, `transparent`, `hover`) when the color itself names it. */
function ownPart(name: string, color: ColorDefinition, part: Part): string | undefined {
  const chosen = color[part];
  if (chosen) return `--${name}-${part}-color-rgb:var(--${chosen}-color-rgb)`;
  if (isReference(color)) return undefined;
  const fallback = { on: "foreground", transparent: name, hover: name }[part];
  return `--${name}-${part}-color-rgb:var(--${fallback}-color-rgb)`;
}

/** What a reference takes from the color it points to: its channels, its gradient and every part it doesn't set. */
function referenceDeclarations(name: string, color: ColorDefinition, target: string): Declarations {
  return [
    `--${name}-color-rgb:var(--${target}-color-rgb)`,
    `--${name}-color-gradient:var(--${target}-color-gradient)`,
    ...PARTS.filter((part) => !color[part]).map(
      (part) => `--${name}-${part}-color-rgb:var(--${target}-${part}-color-rgb)`,
    ),
  ];
}

/** A color style's sources: each constant color's channels and gradient, and the colors chosen per style. */
function colorStyleDeclarations(configuration: InterfaceConfiguration, style: string): Declarations {
  const declarations = [`color-scheme:${configuration.colorStyles[style]!.scheme}`];
  for (const [name, color] of Object.entries(configuration.colors)) {
    if (!isReference(color)) {
      declarations.push(`--${name}-color-rgb:${color.rgb[style]}`);
      if (color.gradient?.[style]) declarations.push(`--${name}-color-gradient:${color.gradient[style]}`);
    } else if (typeof color.of !== "string") {
      declarations.push(...referenceDeclarations(name, color, color.of[style]!));
    }
  }
  return declarations;
}

/** Every value of a color, derived in each scope from its sources, so a style switched anywhere reaches them all. */
function derivedDeclarations(name: string, color: ColorDefinition): Declarations {
  const color_ = `--${name}`;
  const fixedReference = isReference(color) && typeof color.of === "string" ? color.of : undefined;
  return [
    ...(fixedReference ? referenceDeclarations(name, color, fixedReference) : []),
    ...PARTS.map((part) => ownPart(name, color, part)).filter((declaration) => declaration !== undefined),
    `${color_}-color-rgb-alpha:var(--color-rgb-alpha)`,
    `${color_}-color:rgb(var(${color_}-color-rgb) / var(${color_}-color-rgb-alpha))`,
    `${color_}-transparent-color-rgb-alpha:var(--transparent-color-rgb-alpha)`,
    `${color_}-transparent-color:rgb(var(${color_}-transparent-color-rgb) / var(${color_}-transparent-color-rgb-alpha))`,
    ...(["hover", "active"] as const).flatMap((state) => [
      `${color_}-transparent-${state}-color-rgb-alpha:var(--transparent-${state}-color-rgb-alpha)`,
      `${color_}-transparent-${state}-color:rgb(var(${color_}-transparent-color-rgb) / var(${color_}-transparent-${state}-color-rgb-alpha))`,
    ]),
    `${color_}-border-color:var(${color_}-transparent-color)`,
    `${color_}-on-color:rgb(var(${color_}-on-color-rgb))`,
    `${color_}-hover-color:rgb(var(${color_}-hover-color-rgb) / var(${color_}-color-rgb-alpha))`,
    `${color_}-color-paint:var(${color_}-color-gradient, linear-gradient(var(${color_}-color), var(${color_}-color)))`,
  ];
}

/** The same values for the color a component wears (`--current-*`), derived on the component itself. */
const CURRENT: Declarations = derivedDeclarations("current", { rgb: {} }).filter(
  (declaration) => !/^--current-(on|transparent|hover)-color-rgb:/.test(declaration),
);

/** Points a component's current values at one color. */
const currentColor = (name: string): Declarations => [
  `--current-color-rgb:var(--${name}-color-rgb)`,
  `--current-color-gradient:var(--${name}-color-gradient)`,
  ...PARTS.map((part) => `--current-${part}-color-rgb:var(--${name}-${part}-color-rgb)`),
];

const declare = (declarations: AxisDeclarations): Declarations =>
  Object.entries(declarations).map(([name, value]) => `--${name}:${value}`);

/**
 * One axis's rules: each value at rest, then hovered and pressed on interactive boxes, whether the state is real or
 * forced (`data-state="hover"`). Hover and pressed repeat the rest values under theirs, so a breakpoint's value
 * replaces the base value's whole look.
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
    rules.push(media("(hover:hover)", [block(`[data-interactive][data-state="enabled"]:hover${selector}`, hover)]));
    rules.push(
      block(
        `[data-interactive][data-state="active"]${selector},[data-interactive][data-state="enabled"]:active${selector}`,
        active,
      ),
    );
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
    rules.push(block(select("data-style-line", name, breakpoint), [`--line-style:var(--${name}-line-style)`]));
  for (const [name, size] of Object.entries(configuration.sizes))
    rules.push(
      block(
        select("data-size", name, breakpoint),
        Object.keys(size).map((key) => `--current-${key}:var(--${name}-${key})`),
      ),
    );
  for (const axis of boxAxes(configuration.scale)) rules.push(...axisRules(axis, breakpoint));
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
    ...Object.entries(configuration.lineStyles).map(([name, style]) => `--${name}-line-style:${style}`),
    ...Object.entries(configuration.sizes).flatMap(([name, size]) =>
      Object.entries(size).map(([key, value]) => `--${name}-${key}:${value}`),
    ),
    `--corner-radius:var(--${configuration.defaultCornerStyle}-corner-radius)`,
    `--line-style:var(--${configuration.defaultLineStyle}-line-style)`,
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
    block(
      scope.join(","),
      Object.entries(configuration.colors).flatMap(([name, color]) => derivedDeclarations(name, color)),
    ),
  );
  const styleScopes = scope.slice(1);
  rules.push(
    block(
      `:root,${styleScopes.map((selector) => `${selector}:not([data-color])`).join(",")}`,
      currentColor("foreground"),
    ),
  );
  rules.push(block([":root", "[data-color]", ...styleScopes].join(","), CURRENT));
  for (const breakpoint of breakpoints)
    rules.push(media(`(min-width:${breakpoint}px)`, attributeRules(configuration, breakpoint)));
  return rules.join("\n");
}
