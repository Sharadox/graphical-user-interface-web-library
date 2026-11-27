import type { ReactNode } from "react";
import type { BoxLook, BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface SwitchProperties extends Pick<BoxLook, "color" | "colorStyle" | "corner" | "line" | "size"> {
  /** What it turns on, beside it. */
  label: ReactNode;
  /** Controlled: whether it is on. */
  checked?: boolean;
  /** Uncontrolled: whether it starts on. */
  defaultChecked?: boolean;
  /**
   * Called with the new value. It may answer later (a promise): the switch flips at once, is busy until then, and
   * flips back when the answer is `false`.
   */
  onChange?: (checked: boolean) => void | Promise<boolean | void>;
  disabled?: boolean;
  /** Forces a state (for the design system). */
  state?: BoxState;
  className?: string;
}
