import type { ReactNode } from "react";

/** One option of a list: what it stores and the words it shows. */
export interface ListboxOption {
  value: string;
  label: string;
}

export interface ListboxProperties {
  /** The list's id; each option's is the list's plus `-<index>`, for `aria-activedescendant`. */
  id: string;
  /** The id of what names the list (its field's label). */
  labelledBy: string;
  options: readonly ListboxOption[];
  /** The chosen option's value, marked selected with a check. */
  chosen: string;
  /** The index of the option the keyboard is on. */
  active: number;
  onActive: (index: number) => void;
  onChoose: (index: number) => void;
  /** Shown when there is no option (nothing matches what was typed). */
  empty?: ReactNode;
}
