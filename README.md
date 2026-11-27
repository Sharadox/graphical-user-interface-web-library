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

  | Variable                                                          | What                                                                    |
  | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
  | `--red-color-rgb`                                                 | the source                                                              |
  | `--red-color-rgb-alpha`                                           | its alpha: `var(--color-rgb-alpha)` (100%)                              |
  | `--red-color`                                                     | `rgb(var(--red-color-rgb) / var(--red-color-rgb-alpha))`                |
  | `--red-transparent-color-rgb`                                     | the transparent color's channels (red's own)                            |
  | `--red-transparent-color-rgb-alpha`, `--red-transparent-color`    | from `--transparent-color-rgb-alpha` (10%)                              |
  | `--red-transparent-hover-color`, `--red-transparent-active-color` | from `--transparent-hover-…` and `--transparent-active-color-rgb-alpha` |
  | `--red-border-color`                                              | the transparent color                                                   |
  | `--red-on-color`                                                  | text on a red fill (foreground)                                         |
  | `--red-hover-color`                                               | its text when hovered (red's own)                                       |
  | `--red-color-paint`                                               | its fill: its gradient, or the flat color                               |

- **Colors that are other colors:** foreground (black in white, white in black), background, brand (foreground),
  information (blue), success (green), warn (yellow), error (red). They take everything from that color. Text on
  foreground and brand is the background color; on black it is white, on white black. Middleground's border and
  hover background use foreground's channels, and its text turns foreground when hovered.
- **A new color** needs only its channels: `defineInterface({ colors: { gold: { rgb: { white, black } } } })`,
  optionally a `gradient` per color style, `on`, `transparent` and `hover`.
- **Styles** switch only sources. `data-style-color` (`white`, `black`, `inherit` for the device's preference),
  `data-style-corner` (`square` 0, `rounded-square` 4px, `circle`) and `data-style-line` (`line`, `dotted`,
  `dashed`) work on `<html>` (through `@sharadox/style-web-library`, which remembers the choice) and on any element,
  for it and everything inside.
- **A piece's color** (`data-color="red"`) points its `--current-*` values at red; they are derived on the piece, so
  changing an alpha on one piece changes only that piece.
- **Shared values** sit once on the root: the scale (`--scale-0` … `--scale-128`: 0 4 8 12 14 16 24 32 64 128), the
  breakpoints (640, 960, 1280), sizes, corners, lines, timings (`--quick-duration` 0.1s, `--duration` 0.25s), the
  glass blur, font weights, the wrapper (1280 wide, 16 a side).
- **Per breakpoint:** every attribute has a version per breakpoint, mobile first (`data-color-960="blue"`), set by any
  property given as `{ base: "red", 960: "blue" }`.

## API

| Import                      | Export                                                                                                                    | Description                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `…/interface-configuration` | `defineInterface(overrides?)`, `DEFAULT_INTERFACE`, `isReference`, `INHERIT_COLOR_STYLE`                                  | A brand's interface: the defaults with its changes, checked                |
| `…/style-sheet`             | `interfaceStyleSheet(configuration)`                                                                                      | The whole interface as CSS                                                 |
| `…/interface-style`         | `InterfaceStyle({ configuration })`                                                                                       | That CSS in a `<style>` element, for the root layout                       |
| `…/responsive`              | `responsiveAttributes(name, value, fallback?)`                                                                            | `data-*` attributes for a value or a value per breakpoint                  |
| `…/box-axis`                | `boxAxes(scale)`, `VARIANT_AXIS`, `DIRECTION_AXIS`, `JUSTIFY_AXIS`, `ALIGN_AXIS`, `TEXT_ALIGN_AXIS`, `BOX_INITIAL_VALUES` | The ways a box varies, and each value's look                               |
| `…/box`                     | `Box(properties)`, `lookAttributes(look)`                                                                                 | The base of every piece                                                    |
| `…/spinner`                 | `Spinner({ className? })`                                                                                                 | Eight bars lit one after another clockwise, leaving a trail                |
| `…/button`                  | `Button(properties)`                                                                                                      | A button, or with `href` a link that looks the same (a client component)   |
| `…/button-axis`             | `BUTTON_AXES`                                                                                                             | Every value a button is shown in (readable on the server)                  |
| `…/choice`                  | `Choice({ label, options, value, onChange, size?, color? })`                                                              | A segmented choice: a radio group, one tab stop, arrow keys                |
| `…/interface-styles`        | `interfaceStyles(configuration)`                                                                                          | The color, corner and line styles as remembered `style-web-library` groups |
| `…/style-switch`            | `StyleSwitch({ configuration, group, label, labels? })`                                                                   | A `Choice` that switches a style group for the whole page                  |
| `…/field`                   | `Field({ label, hideLabel?, hint?, error?, id?, children: (control) => … })`                                              | A control's label, hint and error, linked for assistive technology         |
| `…/text-field`              | `TextField({ label, hint?, error?, prefix?, suffix?, multiline?, …input })`                                               | A text field (or with `multiline` a text area) in an outlined field box    |
| `…/toggle-mark`             | `ToggleMark({ type, label, checked, onChange })`                                                                          | A native checkbox or radio over a drawn mark (used by the two below)       |
| `…/checkbox`                | `Checkbox({ label, checked?, defaultChecked?, onChange? })`                                                               | Outlined, filled once checked, the check growing in                        |
| `…/radio-group`             | `RadioGroup({ label, options, value?, defaultValue?, onChange?, error? })`                                                | Native radios sharing a name, round, filled once chosen                    |
| `…/switch`                  | `Switch({ label, checked?, defaultChecked?, onChange? })`                                                                 | On/off; flips at once, busy while an async change runs, back if refused    |
| `…/wrapper`                 | `Wrapper(box)`                                                                                                            | The page's width: up to 1280, centered, 16 a side                          |
| `…/card`                    | `Card({ title?, headingLevel?, description?, action?, children })`                                                        | One thing: content on one side, its actions centered on the other          |
| `…/separator`               | `Separator({ orientation?, color?, line? })`                                                                              | A horizontal (or vertical) line in the line style                          |
| `…/badge`                   | `Badge(box)`                                                                                                              | A short label in running text: small, filled, brand                        |
| `…/avatar`                  | `Avatar({ name, src?, size?, color?, corner? })`, `initials(name)`                                                        | A picture, or the initials when there is none; round                       |
| `…/listbox`                 | `Listbox({ id, labelledBy, options, chosen, active, onActive, onChoose, empty? })`                                        | The list a select or combobox opens: a glass panel, the chosen one checked |
| `…/select`                  | `Select({ label, options, value?, defaultValue?, onChange?, name?, placeholder? })`                                       | A select drawn by the interface, with a native select's keyboard           |
| `…/combobox`                | `Combobox({ label, options, … , empty? })`, `matches(label, typed)`                                                       | A text field that filters its options as you type                          |
| `…/number-field`            | `NumberField({ label, value?, min?, max?, step?, decreaseLabel, increaseLabel })`                                         | A number between a minus and a plus section                                |
| `…/dialog`                  | `Dialog({ open, onClose, title, closeLabel, children })`                                                                  | A modal in the middle of the screen that leaves the way it came            |
| `…/tip`                     | `Tip({ text, label })`                                                                                                    | A question mark showing a tip on hover, focus or tap                       |
| `…/notification`            | `NotificationProvider({ label, dismissLabel, duration? })`, `useNotification()`                                           | Notifications at the top right, in their tone's color, hiding themselves   |
| `…/skeleton`                | `Skeleton({ label, shape?, lines?, rows?, height? })`                                                                     | Shimmering shapes like what is loading                                     |
| `…/skeleton-value`          | `SkeletonValue({ label?, width?, circle? })`                                                                              | A shimmering shape for one value                                           |
| `…/copy-button`             | `CopyButton({ value, label, copiedLabel, onCopied? })`                                                                    | Copies a value and says so for two seconds                                 |
| `…/code-boxes`              | `CodeBoxes({ label, digitLabel, ofLabel, name?, length?, onComplete? })`                                                  | One field box per digit of a one-time code                                 |
| `…/navigation`              | `Navigation({ brand, label, links, actions?, menuLabel, closeLabel, collapse? })`                                         | The sticky bar, and a phone menu below `collapse` (960)                    |
| `…/tabs`                    | `Tabs({ label, tabs, value?, defaultValue?, onChange? })`                                                                 | Tab buttons over the chosen tab's panel, with the arrow keys               |
| `…/accordion`               | `Accordion({ items, multiple?, open?, defaultOpen?, onChange? })`                                                         | Titles that open and close their content smoothly                          |
| `…/date-picker`             | `DatePicker({ label, value?, min?, max?, locale?, previousLabel, nextLabel })`, `parseDay`, `formatDay`, `monthDays`      | A field opening a calendar grid                                            |

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
  state="hover" // enabled | hover | active | loading | disabled, forced
>
  …
</Box>
```

A box is flex and centered on both axes and in its text. Its values (`--box-*`) don't pass to boxes inside it. The
variants:

- **filled:** the color's paint, with its `on` color as text;
- **outlined:** the color's text and border, with the transparent color behind it on hover and while pressed;
- **transparent:** like outlined, with no border;
- **inline:** no padding, no background and no border, inside running text.

Outlined and transparent blur what is behind them (glass). Disabled is at 50% opacity. While loading, the spinner
replaces the words and keeps their size. Hover and pressed looks never apply while loading or disabled.

### Button

```tsx
<Button type="submit" loading={saving}>Save</Button>
<Button href="/en/contact" variant="outlined" color="middleground">Contact</Button>
<Button href="/en#booking" link={SectionLink}>Book a Visit</Button>
<Button square icon="close" variant="transparent" aria-label="Close" />
```

Without `href` it is a `<button type="button">`. With one, it is next/link's `Link`, or the site's own `link`. It is
filled in brand by default. A disabled link loses its address.

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
whole field, and a line parts each prefix and suffix from the input. Text fields are outlined middleground by
default, and switch to the error color when they have an error. The typed text is the color's hovered text, so
foreground on middleground. Checkboxes and radios are drawn like buttons: outlined, then filled once checked. The
knob and checks move in 0.25 s.

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage, benchmarks and the build. Branches follow
`<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## License

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the
[English translation](LICENSE.md).
