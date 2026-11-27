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
- Every module style sheet is tested to compile as a pure CSS module, as Next.js needs.

## 0.1.0

- The interface's configuration (`defineInterface`), its style sheet from one source of truth per value
  (`interfaceStyleSheet`, `InterfaceStyle`), values per breakpoint (`responsiveAttributes`), the box's axes, `Box`,
  `Spinner`, `Button` (a client component; its axes in `button-axis`), `Choice`, `interfaceStyles` and
  `StyleSwitch`.
