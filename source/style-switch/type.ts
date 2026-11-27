import type { StyleConfiguration } from "@sharadox/style-web-library/definition/type";
import type { Responsive } from "@sharadox/graphical-user-interface-web-library/responsive/type";

export interface StyleSwitchProperties {
  /** The styles (`interfaceStyles(INTERFACE)`). */
  configuration: StyleConfiguration;
  /** The group it switches: `color`, `corner`, `line`. */
  group: string;
  /** The switch's name for assistive technology ("Color"). */
  label: string;
  /** Each choice's words (`system` is the device's: "Inherit"); a choice without one shows its name. */
  labels?: Readonly<Record<string, string>>;
  size?: Responsive<string>;
  className?: string;
}
