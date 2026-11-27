import type { ReactNode } from "react";
import type { BoxLook, BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";

/** A calendar day, without time or time zone; `month` counts from 0. */
export interface Day {
  year: number;
  month: number;
  day: number;
}

export interface DatePickerProperties extends Pick<
  BoxLook,
  "variant" | "color" | "colorStyle" | "corner" | "line" | "size"
> {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  /** Controlled: the day as `yyyy-mm-dd` (empty for none). */
  value?: string;
  /** Uncontrolled: the day at first. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** With a name, the day goes in a hidden field for forms (`yyyy-mm-dd`). */
  name?: string;
  /** The first and last days that can be chosen (`yyyy-mm-dd`). */
  min?: string;
  max?: string;
  /** The language days, months and weekdays are written in (`en`, `pt-PT`…); `en` by default. */
  locale?: string;
  /** The weekday weeks start on: 1 (Monday, the default) or 0 (Sunday). */
  weekStart?: 0 | 1;
  /** Today (`yyyy-mm-dd`), where the calendar opens when no day is chosen; the device's today by default. */
  today?: string;
  /** Shown while no day is chosen. */
  placeholder?: ReactNode;
  /** The month buttons' names ("Previous month", "Next month"). */
  previousLabel: string;
  nextLabel: string;
  disabled?: boolean;
  /** Forces a state (for the design system). */
  state?: BoxState;
  id?: string;
  className?: string;
}
