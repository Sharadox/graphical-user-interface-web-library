import type { ReactNode } from "react";
import type { BoxLook, BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface RadioOption {
  value: string;
  label: ReactNode;
}

export interface RadioGroupProperties extends Pick<BoxLook, "color" | "colorStyle" | "corner" | "line" | "size"> {
  /** The group's name, shown above it. */
  label: ReactNode;
  options: readonly RadioOption[];
  /** The form field's name; one is made otherwise. */
  name?: string;
  /** Controlled: the chosen value. */
  value?: string;
  /** Uncontrolled: the value chosen at first. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** What is wrong, under the options; marks the group invalid. */
  error?: ReactNode;
  /** Forces a state on every mark (for the design system). */
  state?: BoxState;
  className?: string;
}
