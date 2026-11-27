import type { ReactNode } from "react";
import type { BoxProperties } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface CardProperties extends Omit<BoxProperties, "title"> {
  /** The card's heading. */
  title?: ReactNode;
  /** Its level (`h2` by default), to fit the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** A line under the title. */
  description?: ReactNode;
  /** Buttons beside the content, centered on the card's height. */
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}
