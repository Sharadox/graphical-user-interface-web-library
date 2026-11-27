import type { ReactNode } from "react";
import type { BoxLook } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProperties extends Pick<BoxLook, "variant" | "color" | "corner" | "line"> {
  items: readonly AccordionItem[];
  /** Several open at once (one at a time by default). */
  multiple?: boolean;
  /** Controlled: the open items. */
  open?: readonly string[];
  /** Uncontrolled: the items open at first. */
  defaultOpen?: readonly string[];
  onChange?: (open: string[]) => void;
  /** The titles' heading level (3 by default), to fit the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}
