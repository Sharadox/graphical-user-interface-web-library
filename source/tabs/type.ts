import type { ReactNode } from "react";
import type { BoxLook } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface Tab {
  value: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProperties extends Pick<BoxLook, "color" | "size"> {
  /** The tab list's name for assistive technology. */
  label: string;
  tabs: readonly Tab[];
  /** Controlled: the chosen tab. */
  value?: string;
  /** Uncontrolled: the tab chosen at first (the first one otherwise). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}
