import type { ReactNode } from "react";

/** A link of the main navigation. */
export interface NavigationLink {
  href: string;
  label: ReactNode;
  /** The page being shown: marked for assistive technology and drawn in foreground. */
  current?: boolean;
}

export interface NavigationProperties {
  /** The name or logo, at the bar's start (a link home). */
  brand: ReactNode;
  /** The navigation's name for assistive technology ("Main"). */
  label: string;
  links: readonly NavigationLink[];
  /** What sits at the bar's end (style switches, a profile picture, a call to action); in the menu on phones. */
  actions?: ReactNode;
  /** The menu button's names, closed and open ("Open the menu", "Close the menu"). */
  menuLabel: string;
  closeLabel: string;
  /** The width below which the links and actions move into the menu: 640, 960 (the default) or 1280. */
  collapse?: 640 | 960 | 1280;
  className?: string;
}
