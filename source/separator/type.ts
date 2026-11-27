import type { BoxLook } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface SeparatorProperties extends Pick<BoxLook, "color" | "line"> {
  /** Across a column (`horizontal`, by default) or between items in a row (`vertical`). */
  orientation?: "horizontal" | "vertical";
  className?: string;
}
