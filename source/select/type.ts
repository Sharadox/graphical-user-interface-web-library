import type { ReactNode } from "react";
import type { BoxLook, BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";
import type { ListboxOption } from "@sharadox/graphical-user-interface-web-library/listbox/type";

export interface SelectProperties extends Pick<
  BoxLook,
  "variant" | "color" | "colorStyle" | "corner" | "line" | "size"
> {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  options: readonly ListboxOption[];
  /** Controlled: the chosen value. */
  value?: string;
  /** Uncontrolled: the value chosen at first. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** With a name, the value goes in a hidden field for forms. */
  name?: string;
  /** Shown while nothing is chosen. */
  placeholder?: ReactNode;
  disabled?: boolean;
  /** Forces a state (for the design system). */
  state?: BoxState;
  id?: string;
  className?: string;
}
