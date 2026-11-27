import type { ToggleMarkProperties } from "@sharadox/graphical-user-interface-web-library/toggle-mark/type";

export interface CheckboxProperties extends Omit<ToggleMarkProperties, "type" | "checked" | "onChange"> {
  /** Controlled: whether it is checked. */
  checked?: boolean;
  /** Uncontrolled: whether it starts checked. */
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}
