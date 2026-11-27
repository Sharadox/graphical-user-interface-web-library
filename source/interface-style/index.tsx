import { interfaceStyleSheet } from "@sharadox/graphical-user-interface-web-library/style-sheet";
import type { InterfaceStyleProperties } from "@sharadox/graphical-user-interface-web-library/interface-style/type";

/**
 * The interface's style sheet, written once into the page (in the root layout's `<head>`): every value, color style,
 * corner, line, size and variant rule, from the brand's configuration. Libraries never import global CSS; this is
 * the one place the interface's shared rules come from.
 *
 * @example
 * <head><StyleScript configuration={STYLES} /><InterfaceStyle configuration={INTERFACE} /></head>
 */
export function InterfaceStyle({ configuration }: InterfaceStyleProperties) {
  return <style data-interface-style="" dangerouslySetInnerHTML={{ __html: interfaceStyleSheet(configuration) }} />;
}
