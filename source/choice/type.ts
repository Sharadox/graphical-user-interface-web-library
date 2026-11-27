import type { Responsive } from "@sharadox/graphical-user-interface-web-library/responsive/type";

/** One option: what it stores and the words it shows. */
export interface ChoiceOption {
  value: string;
  label: string;
}

export interface ChoiceProperties {
  /** The group's name for assistive technology. */
  label: string;
  options: readonly ChoiceOption[];
  /** The chosen option's value. */
  value: string;
  onChange: (value: string) => void;
  size?: Responsive<string>;
  /** The chosen option's fill, and the others' words (`foreground` by default). */
  color?: Responsive<string>;
  className?: string;
}
