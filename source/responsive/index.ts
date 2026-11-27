import type { Responsive } from "@sharadox/graphical-user-interface-web-library/responsive/type";

/**
 * The attributes that carry a value, or a value per breakpoint, to the interface's style sheet: `data-size` for every
 * width, `data-size-960` from 960 pixels wide. `fallback` is the base when none is given.
 *
 * @example
 * responsiveAttributes("data-size", { base: "small", 960: "large" }); // { "data-size": "small", "data-size-960": "large" }
 */
export function responsiveAttributes<Value extends string | number>(
  name: string,
  value: Responsive<Value> | undefined,
  fallback?: Value,
): Record<string, string> {
  const attributes: Record<string, string> = {};
  if (value === undefined || typeof value !== "object") {
    const base = value ?? fallback;
    if (base !== undefined) attributes[name] = String(base);
    return attributes;
  }
  const { base = fallback, ...breakpoints } = value;
  if (base !== undefined) attributes[name] = String(base);
  for (const width of Object.keys(breakpoints).sort((first, second) => Number(first) - Number(second)))
    attributes[`${name}-${width}`] = String(breakpoints[Number(width)]);
  return attributes;
}
