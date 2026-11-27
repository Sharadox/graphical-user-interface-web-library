import type { SelectProperties } from "@sharadox/graphical-user-interface-web-library/select/type";

export interface ComboboxProperties extends Omit<SelectProperties, "placeholder"> {
  /** Shown in the empty input. */
  placeholder?: string;
  /** Shown in the list when nothing matches what was typed. */
  empty?: React.ReactNode;
}
