import { expect, test } from "vitest";
import { defineInterface } from "@sharadox/graphical-user-interface-web-library/interface-configuration";
import { interfaceStyleSheet } from "@sharadox/graphical-user-interface-web-library/style-sheet";

const sheet = interfaceStyleSheet(defineInterface());
/** The declarations of the first rule whose selector is exactly `selector`, as `name:value` strings. */
const rule = (css: string, selector: string) => {
  const start = css.indexOf(`${selector}{`);
  if (start === -1) throw new Error(`no rule ${selector}`);
  const body = css.slice(start + selector.length + 1, css.indexOf("}", start));
  return body.split(";");
};
/** Whether `fragment` is inside the rules for one breakpoint. */
const inBreakpoint = (width: number, fragment: string) => {
  const start = sheet.indexOf(`@media (min-width:${width}px){`);
  const end = sheet.indexOf("@media (min-width:", start + 1);
  const at = sheet.indexOf(fragment, start);
  return start !== -1 && at !== -1 && (end === -1 || at < end);
};
const SCOPE = ":root,[data-style-color],[data-style-color-640],[data-style-color-960],[data-style-color-1280]";

test("shared values, the scale, sizes, corners and lines sit once on the root", () => {
  const root = rule(sheet, ":root");
  expect(root).toEqual(
    expect.arrayContaining([
      "--scale-0:0px",
      "--scale-14:14px",
      "--scale-128:128px",
      "--breakpoint-640:640px",
      "--transparent-color-rgb-alpha:12.5%",
      "--gradient-angle:90deg",
      "--glow-size:max(var(--scale-64), calc(60cqw + 60cqh))",
      "--line-line-solid:1",
      "--dashed-line-solid:0",
      "--line-solid:var(--line-line-solid)",
      "--transparent-hover-color-rgb-alpha:var(--transparent-color-rgb-alpha)",
      "--square-corner-radius:0px",
      "--circle-corner-radius:10000px",
      "--dashed-line-style:dashed",
      "--small-minimum-size:var(--scale-16)",
      "--large-minimum-size:48px",
      "--corner-radius:var(--rounded-square-corner-radius)",
      "--line-style:var(--line-line-style)",
      "--current-minimum-size:var(--medium-minimum-size)",
      "--current-font-size:var(--medium-font-size)",
    ]),
  );
});

test("a color style holds only the sources: each constant color's channels and the colors chosen per style", () => {
  const white = rule(sheet, ':root,[data-style-color="white"]');
  expect(white).toEqual(
    expect.arrayContaining([
      "color-scheme:light",
      "--red-color-rgb:220 38 38",
      "--middleground-color-rgb:94 94 94",
      "--foreground-color-rgb:var(--black-color-rgb)",
      "--foreground-color-gradient:var(--black-color-gradient)",
      "--foreground-transparent-hover-color-gradient:var(--black-transparent-hover-color-gradient)",
      "--foreground-color-gradient-weight:var(--black-color-gradient-weight)",
      "--foreground-text-fill:var(--black-text-fill)",
      "--foreground-hover-color-rgb:var(--black-hover-color-rgb)",
      "--foreground-active-color-rgb:var(--black-active-color-rgb)",
      "--foreground-background-color-rgb:var(--black-background-color-rgb)",
      "--foreground-border-color-rgb:var(--black-border-color-rgb)",
      // The focus ring: brand, foreground on a brand fill, background on a foreground fill (brand is foreground).
      "--focus-color-rgb:var(--brand-color-rgb)",
      "--red-focus-color-rgb:var(--brand-color-rgb)",
      "--brand-focus-color-rgb:var(--background-color-rgb)",
      "--index-focus-color-rgb:var(--background-color-rgb)",
      "--background-focus-color-rgb:var(--brand-color-rgb)",
      "--background-color-rgb:var(--white-color-rgb)",
      "--background-on-color-rgb:var(--white-on-color-rgb)",
    ]),
  );
  // Set on the reference itself, so it is in the scope's formulas, not in the style.
  expect(white).not.toContain("--foreground-on-color-rgb:var(--black-on-color-rgb)");
  const black = rule(sheet, '[data-style-color="black"]');
  expect(black).toEqual(
    expect.arrayContaining([
      "color-scheme:dark",
      "--red-color-rgb:255 69 58",
      "--foreground-color-rgb:var(--white-color-rgb)",
    ]),
  );
});

test("inherit follows the device, on the page and in any scope", () => {
  expect(sheet).toContain('[data-style-color="inherit"]{color-scheme:light;--black-color-rgb:0 0 0;');
  expect(sheet).toContain('@media (prefers-color-scheme:dark){[data-style-color="inherit"]{color-scheme:dark;');
  expect(sheet).toContain("@media (prefers-color-scheme:dark){:root:not([data-style-color]){color-scheme:dark;");
});

test("a page that starts on a fixed color style puts that style on the root", () => {
  const black = interfaceStyleSheet(defineInterface({ defaultColorStyle: "black" }));
  expect(black).toContain(':root,[data-style-color="black"]{color-scheme:dark;');
  expect(black).not.toContain(":root:not([data-style-color])");
});

test("every scope derives every value of every color from its sources", () => {
  const scope = rule(sheet, SCOPE);
  expect(scope).toEqual(
    expect.arrayContaining([
      "--red-color-rgb-alpha:var(--color-rgb-alpha)",
      "--red-color:rgb(var(--red-color-rgb) / var(--red-color-rgb-alpha))",
      // Its parts: itself, unless it names another color; pressed is as hovered, the border as the background.
      "--red-on-color-rgb:var(--foreground-color-rgb)",
      "--red-hover-color-rgb:var(--red-color-rgb)",
      "--red-active-color-rgb:var(--red-hover-color-rgb)",
      "--red-background-color-rgb:var(--red-color-rgb)",
      "--red-border-color-rgb:var(--red-background-color-rgb)",
      "--red-on-color:rgb(var(--red-on-color-rgb))",
      "--red-hover-color:rgb(var(--red-hover-color-rgb) / var(--red-color-rgb-alpha))",
      "--red-active-color:rgb(var(--red-active-color-rgb) / var(--red-color-rgb-alpha))",
      "--red-background-color:rgb(var(--red-background-color-rgb) / var(--red-color-rgb-alpha))",
      "--red-transparent-color-rgb-alpha:var(--transparent-color-rgb-alpha)",
      "--red-transparent-color:rgb(var(--red-background-color-rgb) / var(--red-transparent-color-rgb-alpha))",
      "--red-transparent-hover-color-rgb-alpha:var(--transparent-hover-color-rgb-alpha)",
      "--red-transparent-hover-color:rgb(var(--red-background-color-rgb) / var(--red-transparent-hover-color-rgb-alpha))",
      "--red-transparent-active-color-rgb-alpha:var(--transparent-active-color-rgb-alpha)",
      "--red-transparent-active-color:rgb(var(--red-background-color-rgb) / var(--red-transparent-active-color-rgb-alpha))",
      "--red-border-color:rgb(var(--red-border-color-rgb) / var(--red-transparent-color-rgb-alpha))",
      "--red-focus-color:rgb(var(--red-focus-color-rgb))",
      "--red-color-paint:var(--red-color-gradient, linear-gradient(var(--red-color), var(--red-color)))",
      "--red-color-gradient-weight:0%",
      "--red-color-gradient-display:none",
      "--red-text-fill:currentcolor",
      "--red-text-clip:border-box",
      "--focus-color:rgb(var(--focus-color-rgb))",
      // Middleground has no exceptions.
      "--middleground-hover-color-rgb:var(--middleground-color-rgb)",
      "--middleground-background-color-rgb:var(--middleground-color-rgb)",
      // Index: middleground, foreground when hovered and pressed, on foreground's fill and border.
      "--index-color-rgb:var(--middleground-color-rgb)",
      "--index-on-color-rgb:var(--background-color-rgb)",
      "--index-hover-color-rgb:var(--foreground-color-rgb)",
      "--index-active-color-rgb:var(--index-hover-color-rgb)",
      "--index-background-color-rgb:var(--foreground-color-rgb)",
      "--index-border-color-rgb:var(--foreground-color-rgb)",
      // The rainbow: the six hues at each alpha, foreground where one flat color is needed.
      "--rainbow-color-rgb:var(--foreground-color-rgb)",
      "--rainbow-on-color-rgb:var(--foreground-color-rgb)",
      "--rainbow-background-color-rgb:var(--foreground-background-color-rgb)",
      "--rainbow-gradient-angle:var(--gradient-angle)",
      "--rainbow-color-gradient:linear-gradient(var(--rainbow-gradient-angle), rgb(var(--red-color-rgb) / var(--rainbow-color-rgb-alpha)), rgb(var(--yellow-color-rgb) / var(--rainbow-color-rgb-alpha)), rgb(var(--green-color-rgb) / var(--rainbow-color-rgb-alpha)), rgb(var(--cyan-color-rgb) / var(--rainbow-color-rgb-alpha)), rgb(var(--blue-color-rgb) / var(--rainbow-color-rgb-alpha)), rgb(var(--magenta-color-rgb) / var(--rainbow-color-rgb-alpha)))",
      "--rainbow-transparent-color-gradient:linear-gradient(var(--rainbow-gradient-angle), rgb(var(--red-color-rgb) / var(--rainbow-transparent-color-rgb-alpha)), rgb(var(--yellow-color-rgb) / var(--rainbow-transparent-color-rgb-alpha)), rgb(var(--green-color-rgb) / var(--rainbow-transparent-color-rgb-alpha)), rgb(var(--cyan-color-rgb) / var(--rainbow-transparent-color-rgb-alpha)), rgb(var(--blue-color-rgb) / var(--rainbow-transparent-color-rgb-alpha)), rgb(var(--magenta-color-rgb) / var(--rainbow-transparent-color-rgb-alpha)))",
      "--rainbow-color-gradient-weight:100%",
      "--rainbow-color-gradient-display:block",
      "--rainbow-text-fill:transparent",
      "--rainbow-text-clip:text",
      // Text on black is white, on white black, on foreground and brand the background.
      "--black-on-color-rgb:var(--white-color-rgb)",
      "--white-on-color-rgb:var(--black-color-rgb)",
      "--foreground-on-color-rgb:var(--background-color-rgb)",
      // References: everything from the color they point to, unless they set it.
      "--brand-color-rgb:var(--foreground-color-rgb)",
      "--brand-color-gradient:var(--foreground-color-gradient)",
      "--brand-on-color-rgb:var(--background-color-rgb)",
      "--brand-hover-color-rgb:var(--foreground-hover-color-rgb)",
      "--brand-active-color-rgb:var(--foreground-active-color-rgb)",
      "--brand-background-color-rgb:var(--foreground-background-color-rgb)",
      "--brand-border-color-rgb:var(--foreground-border-color-rgb)",
      "--brand-transparent-color-gradient:var(--foreground-transparent-color-gradient)",
      "--brand-color-gradient-display:var(--foreground-color-gradient-display)",
      "--error-on-color-rgb:var(--red-on-color-rgb)",
    ]),
  );
  expect(scope.join(";")).not.toMatch(/filled-hover|--red-transparent-color-rgb:/);
});

test("a component's color points the current values at that color, and the current values are derived on it", () => {
  expect(rule(sheet, '[data-color="red"]')).toEqual([
    "--current-color-rgb:var(--red-color-rgb)",
    "--current-on-color-rgb:var(--red-on-color-rgb)",
    "--current-hover-color-rgb:var(--red-hover-color-rgb)",
    "--current-active-color-rgb:var(--red-active-color-rgb)",
    "--current-background-color-rgb:var(--red-background-color-rgb)",
    "--current-border-color-rgb:var(--red-border-color-rgb)",
    "--current-focus-color-rgb:var(--red-focus-color-rgb)",
    "--current-color-gradient:var(--red-color-gradient)",
    "--current-transparent-color-gradient:var(--red-transparent-color-gradient)",
    "--current-transparent-hover-color-gradient:var(--red-transparent-hover-color-gradient)",
    "--current-transparent-active-color-gradient:var(--red-transparent-active-color-gradient)",
    "--current-color-gradient-weight:var(--red-color-gradient-weight)",
    "--current-color-gradient-display:var(--red-color-gradient-display)",
    "--current-text-fill:var(--red-text-fill)",
    "--current-text-clip:var(--red-text-clip)",
  ]);
  expect(rule(sheet, `:root,[data-color],${SCOPE.slice(6)}`)).toEqual(
    expect.arrayContaining([
      "--current-color:rgb(var(--current-color-rgb) / var(--current-color-rgb-alpha))",
      "--current-transparent-hover-color:rgb(var(--current-background-color-rgb) / var(--current-transparent-hover-color-rgb-alpha))",
      "--current-border-color:rgb(var(--current-border-color-rgb) / var(--current-transparent-color-rgb-alpha))",
      "--current-color-paint:var(--current-color-gradient, linear-gradient(var(--current-color), var(--current-color)))",
      "--current-active-color:rgb(var(--current-active-color-rgb) / var(--current-color-rgb-alpha))",
    ]),
  );
  // Only formulas there: the flags and parts come from the color.
  expect(rule(sheet, `:root,[data-color],${SCOPE.slice(6)}`).join(";")).not.toMatch(
    /--current-(text-fill|color-gradient-weight|hover-color-rgb):/,
  );
});

test("gradients, corners, lines and sizes switch only their sources, at every breakpoint", () => {
  const gold = interfaceStyleSheet(
    defineInterface({
      colors: {
        "gold-light": { rgb: { white: "212 175 90", black: "240 213 138" } },
        gold: { rgb: { white: "180 140 60", black: "212 175 90" }, gradient: ["gold", "gold-light"] },
      },
    }),
  );
  expect(rule(gold, SCOPE)).toContain(
    "--gold-color-gradient:linear-gradient(var(--gold-gradient-angle), rgb(var(--gold-color-rgb) / var(--gold-color-rgb-alpha)), rgb(var(--gold-light-color-rgb) / var(--gold-color-rgb-alpha)))",
  );
  expect(rule(sheet, '[data-style-corner="circle"]')).toEqual(["--corner-radius:var(--circle-corner-radius)"]);
  expect(rule(sheet, '[data-style-line="dashed"]')).toEqual([
    "--line-style:var(--dashed-line-style)",
    "--line-solid:var(--dashed-line-solid)",
  ]);
  expect(rule(sheet, '[data-size="small"]')).toEqual(
    expect.arrayContaining([
      "--current-minimum-size:var(--small-minimum-size)",
      "--current-font-size:var(--small-font-size)",
    ]),
  );
  expect(inBreakpoint(640, '[data-style-color-640="black"]{color-scheme:dark;')).toBe(true);
  expect(inBreakpoint(960, '[data-color-960="red"]{--current-color-rgb:var(--red-color-rgb);')).toBe(true);
  expect(inBreakpoint(1280, '[data-style-corner-1280="square"]{--corner-radius:var(--square-corner-radius)}')).toBe(
    true,
  );
  expect(inBreakpoint(640, '[data-size-640="large"]{--current-minimum-size:var(--large-minimum-size);')).toBe(true);
  expect(inBreakpoint(640, '[data-size-960="large"]')).toBe(false);
});

test("a style scope without its own color wears index, derived again inside it", () => {
  const withoutColor = SCOPE.slice(6)
    .split(",")
    .map((selector) => `${selector}:not([data-color])`);
  expect(rule(sheet, `:root,${withoutColor.join(",")}`)).toEqual(
    expect.arrayContaining([
      "--current-color-rgb:var(--index-color-rgb)",
      "--current-color-gradient:var(--index-color-gradient)",
      "--current-text-fill:var(--index-text-fill)",
    ]),
  );
});

test("each variant sets the box's values at rest, on hover and while pressed, forced or real", () => {
  expect(rule(sheet, '[data-variant="filled"]')).toEqual(
    expect.arrayContaining([
      "--box-background:var(--current-background-color)",
      "--box-background-image:var(--current-color-gradient, none)",
      "--box-text-color:var(--current-on-color)",
      "--box-text-paint:none",
      "--box-text-fill:currentcolor",
      "--box-text-clip:border-box",
      // No border at all: its width is padding instead, so it is as big as an outlined box.
      "--box-border-thickness:0px",
      "--box-edge-thickness:var(--line-thickness)",
      "--box-ring-display:none",
      // Its focus ring is drawn on its fill; its glow inside it in the text's color.
      "--box-focus-color:var(--current-focus-color)",
      "--box-glow-paint:linear-gradient(var(--current-on-color), var(--current-on-color))",
      // A title on its fill is in the fill's text color.
      "--box-title-color:var(--current-on-color)",
    ]),
  );
  // Filled stays as it is on hover, for every color.
  expect(rule(sheet, '[data-interactive][data-state="hover"][data-variant="filled"]')).toEqual(
    expect.arrayContaining([
      "--box-background:var(--current-background-color)",
      "--box-text-color:var(--current-on-color)",
    ]),
  );
  expect(rule(sheet, '[data-variant="outlined"]')).toEqual(
    expect.arrayContaining([
      "--box-background:transparent",
      "--box-text-color:var(--current-color)",
      "--box-border-thickness:var(--line-thickness)",
      "--box-edge-thickness:var(--line-thickness)",
      "--box-border-color:var(--current-border-color)",
      // Nothing to glass while its background is wholly transparent: the blur comes with the hover background.
      "--box-backdrop:none",
      // A line of text fits inside the minimum size, so a box is exactly 16, 32 or 48 pixels tall.
      "--box-line-limit:calc(var(--current-minimum-size) - 2 * var(--line-thickness))",
      "--box-focus-color:var(--focus-color)",
      "--box-glow-paint:var(--current-color-paint)",
      "--box-title-color:var(--current-active-color)",
      // A gradient color paints its text and its border with the gradient.
      "--box-text-paint:var(--current-color-gradient, none)",
      "--box-text-fill:var(--current-text-fill)",
      "--box-text-clip:var(--current-text-clip)",
      "--box-border-paint:var(--current-transparent-color-gradient, none)",
      "--box-border-gradient-weight:var(--current-color-gradient-weight)",
      "--box-ring-display:var(--current-color-gradient-display)",
    ]),
  );
  const hover = '[data-interactive][data-state="hover"][data-variant="outlined"]';
  expect(rule(sheet, hover)).toEqual(
    expect.arrayContaining([
      "--box-background:color-mix(in srgb, transparent var(--current-color-gradient-weight), var(--current-transparent-hover-color))",
      "--box-background-image:var(--current-transparent-hover-color-gradient, none)",
      "--box-text-color:var(--current-hover-color)",
      "--box-border-color:var(--current-border-color)",
      "--box-backdrop:blur(var(--glass-blur))",
    ]),
  );
  // Only a box left to the pointer (state index) turns on hover; a set state stays as it is.
  expect(
    rule(sheet, '@media (hover:hover){[data-interactive][data-state="index"]:hover[data-variant="outlined"]'),
  ).toContain("--box-background-image:var(--current-transparent-hover-color-gradient, none)");
  expect(sheet).not.toContain('[data-state="enabled"]:hover');
  expect(sheet).not.toContain('[data-state="none"]');
  const pressed =
    '[data-interactive][data-state="active"][data-variant="transparent"],[data-interactive][data-state="loading"][data-variant="transparent"],[data-interactive][data-state="index"]:active[data-variant="transparent"]';
  expect(rule(sheet, pressed)).toEqual(
    expect.arrayContaining([
      "--box-background-image:var(--current-transparent-active-color-gradient, none)",
      "--box-text-color:var(--current-active-color)",
      "--box-backdrop:blur(var(--glass-blur))",
      "--box-border-thickness:0px",
      "--box-edge-thickness:var(--line-thickness)",
      "--box-border-paint:none",
    ]),
  );
  expect(rule(sheet, '[data-variant="inline"]')).toEqual(
    expect.arrayContaining([
      "--box-display:inline-flex",
      "--box-section-padding:0px",
      "--box-border-thickness:0px",
      "--box-edge-thickness:0px",
      "--box-minimum-size:0px",
      "--box-line-limit:10000px",
    ]),
  );
  expect(inBreakpoint(960, '[data-interactive][data-state="hover"][data-variant-960="filled"]{')).toBe(true);
});

test("direction, alignment, gap and padding are values of the box too", () => {
  expect(rule(sheet, '[data-direction="right-to-left"]')).toEqual(["--box-direction:row-reverse"]);
  expect(rule(sheet, '[data-direction="bottom-to-top"]')).toEqual(["--box-direction:column-reverse"]);
  expect(rule(sheet, '[data-justify="end"]')).toEqual(["--box-justify:end"]);
  expect(rule(sheet, '[data-align="stretch"]')).toEqual(["--box-align:stretch"]);
  expect(rule(sheet, '[data-text-align="start"]')).toEqual(["--box-text-align:start"]);
  expect(rule(sheet, '[data-wrap="wrap"]')).toEqual(["--box-wrap:wrap"]);
  expect(sheet).toContain('@property --box-wrap{syntax:"*";inherits:false;initial-value:nowrap}');
  expect(rule(sheet, '[data-gap="24"]')).toEqual(["--box-gap:var(--scale-24)"]);
  expect(rule(sheet, '[data-padding="128"]')).toEqual(["--box-padding:var(--scale-128)"]);
  expect(rule(sheet, '[data-glow-position="top"]')).toEqual(["--glow-x:0.5", "--glow-y:0"]);
  expect(rule(sheet, '[data-glow-position="bottom-right"]')).toEqual(["--glow-x:1", "--glow-y:1"]);
  // Logical positions follow the reading direction.
  expect(rule(sheet, '[data-glow-position="end-start"]')).toEqual([
    "--glow-x:calc(var(--glow-inline-origin) + var(--glow-inline-direction) * 0)",
    "--glow-y:1",
  ]);
  // The cursor's glow waits, hidden, in the middle.
  expect(rule(sheet, '[data-glow-position="cursor"]')).toEqual([
    "--glow-x:0.5",
    "--glow-y:0.5",
    "--glow-rest-opacity:0",
  ]);
  // Without a position, the default one (bottom).
  expect(rule(sheet, "[data-glow]:not([data-glow-position])")).toEqual(["--glow-x:0.5", "--glow-y:1"]);
  expect(inBreakpoint(960, '[data-glow-position-960="left"]{--glow-x:0;--glow-y:0.5}')).toBe(true);
  const quarter = interfaceStyleSheet(defineInterface({ positions: { "a-quarter": { x: 0.25, y: 0 } } }));
  expect(rule(quarter, '[data-glow-position="a-quarter"]')).toEqual(["--glow-x:0.25", "--glow-y:0"]);
  expect(inBreakpoint(640, '[data-gap-640="8"]{--box-gap:var(--scale-8)}')).toBe(true);
});

test("a box's values stay on it: registered without inheritance, starting plain and centered", () => {
  expect(sheet).toContain('@property --box-background{syntax:"*";inherits:false;initial-value:transparent}');
  expect(sheet).toContain('@property --box-text-color{syntax:"*";inherits:false;initial-value:currentcolor}');
  expect(sheet).toContain('@property --box-justify{syntax:"*";inherits:false;initial-value:center}');
  expect(sheet).toContain('@property --box-text-align{syntax:"*";inherits:false;initial-value:center}');
  expect(sheet).toContain('@property --box-border-thickness{syntax:"*";inherits:false;initial-value:0px}');
  expect(sheet).toContain('@property --box-text-fill{syntax:"*";inherits:false;initial-value:currentcolor}');
  expect(sheet).toContain('@property --box-ring-display{syntax:"*";inherits:false;initial-value:none}');
  expect(sheet).toContain('@property --box-edge-thickness{syntax:"*";inherits:false;initial-value:0px}');
  // Without a minimum size, a line of text is as tall as it likes.
  expect(sheet).toContain('@property --box-line-limit{syntax:"*";inherits:false;initial-value:10000px}');
  expect(sheet).toContain('@property --box-focus-color{syntax:"*";inherits:false;initial-value:currentcolor}');
  expect(sheet).not.toContain("--glow-angle");
  expect(sheet.indexOf("@property")).toBe(0);
});
