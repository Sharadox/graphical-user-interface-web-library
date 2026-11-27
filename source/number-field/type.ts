import type { ReactNode } from "react";
import type { BoxLook, BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface NumberFieldProperties extends Pick<
  BoxLook,
  "variant" | "color" | "colorStyle" | "corner" | "line" | "size"
> {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  /** Controlled: the number (or `undefined` while empty). */
  value?: number;
  /** Uncontrolled: the number at first. */
  defaultValue?: number;
  /** The new number, or `undefined` once emptied. */
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  /** How much each button adds or takes away (1 by default). */
  step?: number;
  name?: string;
  disabled?: boolean;
  /** The minus button's name for assistive technology ("Fewer"). */
  decreaseLabel: string;
  /** The plus button's name ("More"). */
  increaseLabel: string;
  /** Forces a state (for the design system). */
  state?: BoxState;
  id?: string;
  className?: string;
}
