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
- States: `none` (the default) follows the pointer; any other state is set and stays (`enabled` never turns on
  hover). `active` and `loading` look pressed with the default cursor, and a button ignores clicks in them.
- Transparent colors at 12.5%. Middleground's fill turns foreground when hovered (`filledHover`).
- Gradient colors (`gradient: ["red", …]`, at every alpha) and `rainbow`: the six hues on fills, text, hover
  backgrounds and outlined borders.
- Modifications (`modifications={["glass", "glow"]}`): glass, the default, and a glow that turns toward the pointer
  (`glowStart`), from `@sharadox/pointer-web-library`'s `followPointerAngle`.
- The wrapper's 1280 includes its padding.

## 0.1.0

- The interface's configuration (`defineInterface`), its style sheet from one source of truth per value
  (`interfaceStyleSheet`, `InterfaceStyle`), values per breakpoint (`responsiveAttributes`), the box's axes, `Box`,
  `Spinner`, `Button` (a client component; its axes in `button-axis`), `Choice`, `interfaceStyles` and
  `StyleSwitch`.
