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

| Import                      | Export                                                                                                                    | Description                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `…/interface-configuration` | `defineInterface(overrides?)`, `DEFAULT_INTERFACE`, `isReference`, `INHERIT_COLOR_STYLE`                                  | A brand's interface: the defaults with its changes, checked |
| `…/style-sheet`             | `interfaceStyleSheet(configuration)`                                                                                      | The whole interface as CSS                                  |
| `…/interface-style`         | `InterfaceStyle({ configuration })`                                                                                       | That CSS in a `<style>` element, for the root layout        |
| `…/responsive`              | `responsiveAttributes(name, value, fallback?)`                                                                            | `data-*` attributes for a value or a value per breakpoint   |
| `…/box-axis`                | `boxAxes(scale)`, `VARIANT_AXIS`, `DIRECTION_AXIS`, `JUSTIFY_AXIS`, `ALIGN_AXIS`, `TEXT_ALIGN_AXIS`, `BOX_INITIAL_VALUES` | The ways a box varies, and each value's look                |
| `…/box`                     | `Box(properties)`, `lookAttributes(look)`                                                                                 | The base of every piece                                     |
| `…/spinner`                 | `Spinner({ className? })`                                                                                                 | Eight bars lit one after another clockwise, leaving a trail |
| `…/button`                  | `Button(properties)`, `BUTTON_AXES`                                                                                       | A button, or with `href` a link that looks the same         |

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

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage, benchmarks and the build. Branches follow
`<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## License

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the
[English translation](LICENSE.md).
