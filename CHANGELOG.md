# Changelog

## 0.2.0

- Form controls: `Field`, `TextField` (and text areas), `Checkbox`, `RadioGroup` and `Switch`; a box can hold a
  form control (`field`).
- Layout pieces: `Wrapper` (the page's width), `Card`, `Separator`, `Badge` and `Avatar`.
- Choosing: `Select` (the interface's own, never the browser's), `Combobox` (filters as you type, ignoring case and
  accents) and `NumberField` (minus and plus sections), on a shared `Listbox`.
- Feedback and helpers: `Dialog`, `Tip`, `NotificationProvider` with `useNotification` (tones in the interface's
  colors), `Skeleton`, `SkeletonValue`, `CopyButton` and `CodeBoxes`.
- `Navigation`: the sticky bar with its links and actions, and a phone menu below a chosen width.
- `Tabs`, `Accordion` (smooth, one or several open) and `DatePicker` (a calendar grid in the page's language).
- A button's forced `disabled` state looks disabled and refuses clicks but stays focusable; only `disabled` makes it
  natively disabled.
- Every module style sheet is tested to compile as a pure CSS module, as Next.js needs.
- States: `index` (the default) follows the pointer; any other state is set and stays (`enabled` never turns on
  hover). `active` and `loading` look pressed with the default cursor, and a button ignores clicks in them.
- Transparent colors at 12.5%.
- Colors have parts, each another color: `on`, `hover`, `active` (its hover by default), `background` and `border`
  (its background by default). Middleground is a color like any other.
- `index`: every component's color by default (middleground text turning foreground, on foreground's fill and
  border); titles are in their color's active color (on a fill, its text color).
- Filled and transparent boxes have no border: the line's thickness is padding instead, so every variant is the same
  size. Outlined boxes part their sections with a border.
- The focus ring is drawn inside the box's edge: brand, or foreground on a brand fill, or background on a
  foreground fill. `SkipLink`: the first link, to the main content, shown only to the keyboard.
- Every component's default size is medium.
- Gradient colors (`gradient: ["red", …]`, at every alpha) and `rainbow`: the six hues on fills, text, hover
  backgrounds and outlined borders.
- Positions: every physical and logical place on a box, and a brand's own (`positions`).
- Modifications (`modifications={["glass", "glow"]}`): glass, the default, and a glow that breathes, floats, rests at
  `glowPosition` (or follows the pointer at `cursor`), glides toward the pointer and swells while pressed, outside
  the box or inside it (`glowBoundary`), from `@sharadox/pointer-web-library`'s `followPointerPosition`.
- The wrapper's 1280 includes its padding. The navigation bar spans the screen, its content in a wrapper.

## 0.1.0

- The interface's configuration (`defineInterface`), its style sheet from one source of truth per value
  (`interfaceStyleSheet`, `InterfaceStyle`), values per breakpoint (`responsiveAttributes`), the box's axes, `Box`,
  `Spinner`, `Button` (a client component; its axes in `button-axis`), `Choice`, `interfaceStyles` and
  `StyleSwitch`.
