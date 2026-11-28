# @sharadox/graphical-user-interface-web-library

One generic, accessible, fully configurable component library: every interface piece in every variant, color, corner,
line, size and state, styled from a single source of truth that each brand configures.

Every piece is made here first, generically. A brand writes its own configuration (colors, gradients, defaults) once,
in its own library, and its sites use the pieces as they are. A new variant or option is added here, so every site
can use it. Every piece is shown in every combination on the design system's site, design.sharadox.com.

## Install

```sh
pnpm add @sharadox/graphical-user-interface-web-library
```

## Set up

```tsx
// <brand>-web-library: the brand's interface, once
import { defineInterface } from "@sharadox/graphical-user-interface-web-library/interface-configuration";

export const INTERFACE = defineInterface({
  colors: { gold: { rgb: { white: "180 140 60", black: "212 175 90" } }, brand: { of: "gold" } },
  defaultCornerStyle: "circle",
});
```

```tsx
// The site's root layout: the whole interface's style sheet, once
import { InterfaceStyle } from "@sharadox/graphical-user-interface-web-library/interface-style";

<html data-style-color="white">
  <head>
    <InterfaceStyle configuration={INTERFACE} />
  </head>
```

## One source of truth, cascading

Every value has exactly one source, and everything else points to it (`var(…)`). Changing a source anywhere changes
everything below it: on the page, in one part of it, or on one piece.

- **Colors** are RGB channels per color style: `--red-color-rgb: 220 38 38` in white, `255 69 58` in black. Every
  other value of a color is derived from them, in every scope:

  | Variable                                                                              | What                                                                                          |
  | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
  | `--red-color-rgb`                                                                     | the source                                                                                    |
  | `--red-on-color-rgb`, `--red-hover-color-rgb`, `--red-active-color-rgb`               | its parts' channels: text on its fill (foreground), hovered text and pressed text (red's own) |
  | `--red-background-color-rgb`, `--red-border-color-rgb`                                | what it fills and tints with, and its border (red's own)                                      |
  | `--red-focus-color-rgb`                                                               | the focus ring on its fill: brand, foreground on a brand fill, background on a foreground one |
  | `--red-color-rgb-alpha`                                                               | its alpha: `var(--color-rgb-alpha)` (100%)                                                    |
  | `--red-color`                                                                         | `rgb(var(--red-color-rgb) / var(--red-color-rgb-alpha))`                                      |
  | `--red-on-color`, `--red-hover-color`, `--red-active-color`, `--red-background-color` | each part's color                                                                             |
  | `--red-transparent-color-rgb-alpha`, `--red-transparent-color`                        | its background at `--transparent-color-rgb-alpha` (12.5%)                                     |
  | `--red-transparent-hover-color`, `--red-transparent-active-color`                     | at `--transparent-hover-…` and `--transparent-active-color-rgb-alpha`                         |
  | `--red-border-color`                                                                  | its border at the transparent alpha                                                           |
  | `--red-focus-color`                                                                   | its focus ring                                                                                |
  | `--red-color-paint`                                                                   | its fill: its gradient, or the flat color                                                     |
  | `--red-color-gradient`, `--red-transparent-color-gradient`…                           | a gradient color's gradients, at each alpha (unset when flat)                                 |

- **Colors that are other colors:** foreground (black in white, white in black), background, brand (foreground),
  information (blue), success (green), warn (yellow), error (red). They take everything from that color. Text on
  foreground and brand is the background color; on black it is white, on white black. Middleground is a color like
  any other.
- **Index**, every component's color by default: middleground text that turns foreground when hovered and pressed,
  on foreground's fill and border (`{ of: "middleground", on: "background", hover: "foreground", background:
"foreground", border: "foreground" }`). Titles take their color's active color, so foreground on index, or the fill's text color on a filled box.
- **Gradient colors** list the colors they pass through: `rainbow` is red, yellow, green, cyan, blue and magenta, in
  the direction of `--gradient-angle` (90deg). Its fill, text (outlined, transparent, inline), hover backgrounds and
  outlined border (on whole lines) are the gradient at each alpha; where one flat color is needed (icons, focus rings,
  dotted and dashed borders) it is foreground, and text on its fill is foreground.
- **A new color** needs only its channels: `defineInterface({ colors: { gold: { rgb: { white, black } } } })`,
  optionally a `gradient` (color names) and its parts: `on`, `hover`, `active` (its hover color by default),
  `background` and `border` (its background color by default), each another color's name.
- **The focus ring** is drawn inside a box's edge, so it is seen against the box: brand on the page, outlined,
  transparent and inline boxes; on a fill, brand, or foreground where brand would not show, or background where
  foreground would not either.
- **Positions:** every place something can sit on a box, from 0 to 1 of its width and height. Physical (`center`,
  `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right`) and logical, following
  the reading direction (`start`, `end`, `start-start`, `start-end`, `end-start`, `end-end`, `top-start`,
  `top-end`, `bottom-start`, `bottom-end`); a brand adds its own (`positions: { "a-quarter": { inline: 0.25, y: 0 }
}`).
- **Styles** switch only sources. `data-style-color` (`white`, `black`, `inherit` for the device's preference),
  `data-style-corner` (`square` 0, `rounded-square` 4px, `circle`) and `data-style-line` (`line`, `dotted`,
  `dashed`) work on `<html>` (through `@sharadox/style-web-library`, which remembers the choice) and on any element,
  for it and everything inside.
- **A piece's color** (`data-color="red"`) points its `--current-*` values at red; they are derived on the piece, so
  changing an alpha on one piece changes only that piece.
- **Shared values** sit once on the root: the scale (`--scale-0` … `--scale-128`: 0 4 8 12 14 16 24 32 64 128), the
  breakpoints (640, 960, 1280), sizes, corners, lines, timings (`--quick-duration` 0.1s, `--duration` 0.25s), the
  glass blur, font weights, the wrapper (1280 wide with its 16 a side inside), the focus ring (`--focus-thickness` 2,
  `--focus-offset` twice that inside), the glow (`--glow-range` 128, `--glow-overflow` 8, `--glow-size` 60% of the
  box's width plus 60% of its height, at least 64, `--glow-opacity` 50%, `--glow-breathe-duration` 4s,
  `--glow-float-duration` 7s, `--glow-press-scale` 1.35).
- **Per breakpoint:** every attribute has a version per breakpoint, mobile first (`data-color-960="blue"`), set by any
  property given as `{ base: "red", 960: "blue" }`.

## API

| Import                      | Export                                                                                                                    | Description                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `…/interface-configuration` | `defineInterface(overrides?)`, `DEFAULT_INTERFACE`, `isReference`, `INHERIT_COLOR_STYLE`                                  | A brand's interface: the defaults with its changes, checked                                          |
| `…/style-sheet`             | `interfaceStyleSheet(configuration)`                                                                                      | The whole interface as CSS                                                                           |
| `…/interface-style`         | `InterfaceStyle({ configuration })`                                                                                       | That CSS in a `<style>` element, for the root layout                                                 |
| `…/responsive`              | `responsiveAttributes(name, value, fallback?)`                                                                            | `data-*` attributes for a value or a value per breakpoint                                            |
| `…/box-axis`                | `boxAxes(scale)`, `VARIANT_AXIS`, `DIRECTION_AXIS`, `JUSTIFY_AXIS`, `ALIGN_AXIS`, `TEXT_ALIGN_AXIS`, `BOX_INITIAL_VALUES` | The ways a box varies, and each value's look                                                         |
| `…/box`                     | `Box(properties)`, `lookAttributes(look)`                                                                                 | The base of every piece                                                                              |
| `…/glow-layer`              | `GlowLayer({ attributes, boundary? })`                                                                                    | The glow modification's layer, outside its box or inside it                                          |
| `…/spinner`                 | `Spinner({ className? })`                                                                                                 | Eight bars lit one after another clockwise, leaving a trail                                          |
| `…/button`                  | `Button(properties)`                                                                                                      | A button, or with `href` a link that looks the same (a client component)                             |
| `…/button-axis`             | `BUTTON_AXES`                                                                                                             | Every value a button is shown in (readable on the server)                                            |
| `…/choice`                  | `Choice({ label, options, value, onChange, size?, color? })`                                                              | A segmented choice: a radio group, one tab stop, arrow keys                                          |
| `…/interface-styles`        | `interfaceStyles(configuration)`                                                                                          | The color, corner and line styles as remembered `style-web-library` groups                           |
| `…/style-switch`            | `StyleSwitch({ configuration, group, label, labels? })`                                                                   | A `Choice` that switches a style group for the whole page                                            |
| `…/field`                   | `Field({ label, hideLabel?, hint?, error?, id?, children: (control) => … })`                                              | A control's label, hint and error, linked for assistive technology                                   |
| `…/text-field`              | `TextField({ label, hint?, error?, prefix?, suffix?, multiline?, …input })`                                               | A text field (or with `multiline` a text area) in an outlined field box                              |
| `…/toggle-mark`             | `ToggleMark({ type, label, checked, onChange })`                                                                          | A native checkbox or radio over a drawn mark (used by the two below)                                 |
| `…/checkbox`                | `Checkbox({ label, checked?, defaultChecked?, onChange? })`                                                               | Outlined, filled once checked, the check growing in                                                  |
| `…/radio-group`             | `RadioGroup({ label, options, value?, defaultValue?, onChange?, error? })`                                                | Native radios sharing a name, round, filled once chosen                                              |
| `…/switch`                  | `Switch({ label, checked?, defaultChecked?, onChange? })`                                                                 | On/off; flips at once, busy while an async change runs, back if refused                              |
| `…/wrapper`                 | `Wrapper(box)`                                                                                                            | The page's width: up to 1280 with its 16 a side inside, centered                                     |
| `…/card`                    | `Card({ title?, headingLevel?, description?, action?, children })`                                                        | One thing: content on one side, its actions centered on the other                                    |
| `…/separator`               | `Separator({ orientation?, color?, line? })`                                                                              | A horizontal (or vertical) line in the line style; a gradient color's is its gradient on whole lines |
| `…/badge`                   | `Badge(box)`                                                                                                              | A short label in running text: small, filled, brand                                                  |
| `…/avatar`                  | `Avatar({ name, src?, size?, color?, corner? })`, `initials(name)`                                                        | A picture, or the initials when there is none; round                                                 |
| `…/listbox`                 | `Listbox({ id, labelledBy, options, chosen, active, onActive, onChoose, empty? })`                                        | The list a select or combobox opens: a glass panel, the chosen one checked                           |
| `…/select`                  | `Select({ label, options, value?, defaultValue?, onChange?, name?, placeholder? })`                                       | A select drawn by the interface, with a native select's keyboard                                     |
| `…/combobox`                | `Combobox({ label, options, … , empty? })`, `matches(label, typed)`                                                       | A text field that filters its options as you type                                                    |
| `…/number-field`            | `NumberField({ label, value?, min?, max?, step?, decreaseLabel, increaseLabel })`                                         | A number between a minus and a plus section                                                          |
| `…/dialog`                  | `Dialog({ open, onClose, title, closeLabel, children })`                                                                  | A modal in the middle of the screen that leaves the way it came                                      |
| `…/tip`                     | `Tip({ text, label })`                                                                                                    | A question mark showing a tip on hover, focus or tap                                                 |
| `…/notification`            | `NotificationProvider({ label, dismissLabel, duration? })`, `useNotification()`                                           | Notifications at the top right, in their tone's color, hiding themselves                             |
| `…/skeleton`                | `Skeleton({ label, shape?, lines?, rows?, height? })`                                                                     | Shimmering shapes like what is loading                                                               |
| `…/skeleton-value`          | `SkeletonValue({ label?, width?, circle? })`                                                                              | A shimmering shape for one value                                                                     |
| `…/copy-button`             | `CopyButton({ value, label, copiedLabel, onCopied? })`                                                                    | Copies a value and says so for two seconds                                                           |
| `…/code-boxes`              | `CodeBoxes({ label, digitLabel, ofLabel, name?, length?, onComplete? })`                                                  | One field box per digit of a one-time code                                                           |
| `…/navigation`              | `Navigation({ brand, label, links, actions?, menuLabel, closeLabel, collapse? })`                                         | The sticky bar, edge to edge with its content in a wrapper, and a phone menu below `collapse` (960)  |
| `…/skip-link`               | `SkipLink({ label, href? })`                                                                                              | The first link, to the main content, shown only to the keyboard                                      |
| `…/tabs`                    | `Tabs({ label, tabs, value?, defaultValue?, onChange? })`                                                                 | Tab buttons over the chosen tab's panel, with the arrow keys                                         |
| `…/accordion`               | `Accordion({ items, multiple?, open?, defaultOpen?, onChange? })`                                                         | Titles that open and close their content smoothly                                                    |
| `…/date-picker`             | `DatePicker({ label, value?, min?, max?, locale?, previousLabel, nextLabel })`, `parseDay`, `formatDay`, `monthDays`      | A field opening a calendar grid                                                                      |

### Box

```tsx
<Box
  as="section"
  variant="outlined" // filled | outlined | transparent | inline; none: plain
  color="brand" // any color; everything inside takes it
  colorStyle="black" // this box and everything inside
  corner="circle"
  line="dashed"
  size="large" // small (16, 12px) | medium (32, 14px) | large (48, 16px)
  direction={{ base: "top-to-bottom", 960: "left-to-right" }}
  justify="start" // start | center (default) | end | left | right | space-between
  align="stretch" // start | center (default) | end | stretch | baseline
  textAlign="start" // center by default
  gap={16} // a step of the scale
  padding={24}
  prefix={<Icon name="user" />} // a section, at least square
  suffix="→"
  square // one icon or character, no padding
  interactive // hover and pressed looks, a pointer cursor, states
  state="hover" // index (default: follows the pointer) | enabled | hover | active | loading | disabled, set for good
  modifications={["glass", "glow"]} // glass by default; [] for none
  glowPosition="top-end" // any position (bottom by default), or cursor
  glowBoundary="inside" // outside (default) | inside
>
  …
</Box>
```

A box is flex and centered on both axes and in its text. Its values (`--box-*`) don't pass to boxes inside it. The
variants:

- **filled:** the color's background (or gradient), with its `on` color as text, and no border;
- **outlined:** the color's text and border, with the transparent color behind it and the hover and active text on
  hover and while pressed; a border parts its sections (prefix, content, suffix);
- **transparent:** like outlined, with no border;
- **inline:** no padding, no background and no border, inside running text.

Filled and transparent boxes have no border at all: the line's thickness is padding instead, around them and between
their sections, so every variant is the same size.

States: `index` (the default) leaves a box to the pointer, so it turns when hovered and pressed. Any other state is set
and stays: `enabled` never turns, `hover` looks hovered, `active` and `loading` look pressed with the default cursor
(a button then ignores clicks), `disabled` is at 50% opacity. While loading, the spinner replaces the words and keeps
their size.

Modifications add to any variant, together: **glass** (the default) blurs what is behind a box with a see-through
background (an outlined or transparent box only once hovered or pressed: wholly transparent, nothing shows through a
blur; listboxes, calendars, notifications and the bar glass their own backgrounds); **glow** is a soft light in the box's color, sized to the box, that breathes and floats, rests at
`glowPosition` (the bottom by default) and glides toward the pointer while it is within `--glow-range` of the box
(held to its edges), back when it leaves, and swells while the box is pressed. At `cursor` it shows only while the
pointer is near, where the pointer is. `glowBoundary`: `outside` (the default) puts it behind the box, a little past
its edges (a filled box hides its middle; an outlined one lets it show through), anchored to the box (CSS anchor
positioning); `inside` clips it to the box, over its fill (in its text's color) and under its content. It costs nothing
off screen (`followPointerPosition` from `@sharadox/pointer-web-library`) and keeps still for reduced motion.

### Button

```tsx
<Button type="submit" loading={saving}>Save</Button>
<Button href="/en/contact" variant="outlined">Contact</Button>
<Button href="/en#booking" link={SectionLink}>Book a Visit</Button>
<Button square icon="close" variant="transparent" aria-label="Close" />
```

Without `href` it is a `<button type="button">`. With one, it is next/link's `Link`, or the site's own `link`. It is
filled in index by default. A disabled link loses its address.

```tsx
<SkipLink label="Skip to the Content" /> // first in the body; <main id="main">
```

The skip link goes straight to the main content and shows only when the keyboard reaches it.

### Form controls

```tsx
<TextField label="Email" type="email" name="email" hint="We never share it." error={error} />
<TextField label="Price" type="number" prefix="€" suffix=".00" />
<TextField label="Message" multiline rows={6} />
<Checkbox label="Remember me" name="remember" />
<RadioGroup label="Contact me by" name="contact" options={[{ value: "email", label: "Email" }]} />
<Switch label="Email me" defaultChecked onChange={async (on) => (await save(on)).ok} />
```

A field box (`Box field`) is interactive with a text cursor and the field's font weight. Its focus ring circles the
whole field, and a line parts each prefix and suffix from the input. Text fields are outlined index by default, and
switch to the error color when they have an error. Checkboxes and radios are drawn like buttons: outlined, then filled once checked. The
knob and checks move in 0.25 s.

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage, benchmarks and the build. Branches follow
`<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## License

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the
[English translation](LICENSE.md).
