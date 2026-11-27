import type { InputHTMLAttributes, ReactNode } from "react";
import type { BoxLook, BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";

/** A checkbox's or a radio's mark and label. */
export interface ToggleMarkProperties
  extends
    Pick<BoxLook, "color" | "colorStyle" | "corner" | "line" | "size">,
    Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "type" | "onChange" | "checked" | "defaultChecked"> {
  type: "checkbox" | "radio";
  label: ReactNode;
  /** Whether it is checked (the owner keeps the state). */
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Forces a state (for the design system). */
  state?: BoxState;
}
