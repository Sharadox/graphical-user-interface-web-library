import { defineStyles } from "@sharadox/style-web-library/definition";
import type { StyleConfiguration, StyleGroup } from "@sharadox/style-web-library/definition/type";
import { INHERIT_COLOR_STYLE } from "@sharadox/graphical-user-interface-web-library/interface-configuration";
import type { InterfaceConfiguration } from "@sharadox/graphical-user-interface-web-library/interface-configuration/type";

const plain = (names: string[]) => names.map((name) => ({ name, palette: {} }));

/**
 * The interface's styles as `@sharadox/style-web-library` groups (`color`, `corner`, `line`), so the visitor's choice
 * is remembered and applied before the first paint (`StyleScript`) and switched with `useStyle` or `StyleSwitch`.
 * The values come from `InterfaceStyle`; the groups only carry the names. `inherit` is the library's `system`.
 *
 * @example
 * export const STYLES = interfaceStyles(INTERFACE);
 * <head><StyleScript configuration={STYLES} /><InterfaceStyle configuration={INTERFACE} /></head>
 */
export function interfaceStyles(configuration: InterfaceConfiguration): StyleConfiguration {
  const { colorStyles, defaultColorStyle, inheritColorStyles } = configuration;
  const color: StyleGroup = {
    name: "color",
    defaultChoice: defaultColorStyle === INHERIT_COLOR_STYLE ? "system" : defaultColorStyle,
    systemDefaults: { light: inheritColorStyles.light, dark: inheritColorStyles.dark },
    options: Object.entries(colorStyles).map(([name, style]) => ({ name, scheme: style.scheme, palette: {} })),
  };
  return defineStyles({
    groups: [
      color,
      {
        name: "corner",
        defaultChoice: configuration.defaultCornerStyle,
        options: plain(Object.keys(configuration.cornerStyles)),
      },
      {
        name: "line",
        defaultChoice: configuration.defaultLineStyle,
        options: plain(Object.keys(configuration.lineStyles)),
      },
    ],
  });
}
