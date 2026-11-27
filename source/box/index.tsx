import { classNames } from "@sharadox/web-library/class-name";
import { responsiveAttributes } from "@sharadox/graphical-user-interface-web-library/responsive";
import type { Responsive } from "@sharadox/graphical-user-interface-web-library/responsive/type";
import { Spinner } from "@sharadox/graphical-user-interface-web-library/spinner";
import type { BoxLook, BoxProperties } from "@sharadox/graphical-user-interface-web-library/box/type";
import styles from "./index.module.scss";

/** Each look and the attribute that carries it to the interface's style sheet. */
const LOOK_ATTRIBUTES: ReadonlyArray<[keyof BoxLook, string]> = [
  ["variant", "data-variant"],
  ["color", "data-color"],
  ["colorStyle", "data-style-color"],
  ["corner", "data-style-corner"],
  ["line", "data-style-line"],
  ["size", "data-size"],
  ["direction", "data-direction"],
  ["justify", "data-justify"],
  ["align", "data-align"],
  ["textAlign", "data-text-align"],
  ["gap", "data-gap"],
  ["padding", "data-padding"],
];

/** The attributes for a set of looks, each for every width or per breakpoint. */
export function lookAttributes(look: BoxLook): Record<string, string> {
  return Object.assign(
    {},
    ...LOOK_ATTRIBUTES.map(([key, name]) =>
      responsiveAttributes(name, look[key] as Responsive<string | number> | undefined),
    ),
  );
}

/**
 * The base of every piece: a flex box, centered on both axes and in its text unless told otherwise, wearing any
 * variant, color, color style, corner, line and size, each for every width or per breakpoint, with an optional
 * prefix and suffix section (at least square). An interactive box adds the hover and pressed looks, a pointer cursor
 * and its states; while loading, the spinner covers its content, which keeps its size and its name.
 *
 * @example
 * <Box variant="outlined" color="brand" padding={16} direction={{ base: "top-to-bottom", 960: "left-to-right" }}>…</Box>
 */
export function Box(properties: BoxProperties) {
  const { as: Element = "div", prefix, suffix, square, interactive, state, className, children, ...rest } = properties;
  const look: BoxLook = {};
  const element: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (LOOK_ATTRIBUTES.some(([name]) => name === key)) look[key as keyof BoxLook] = value as never;
    else element[key] = value;
  }
  const sectioned = prefix !== undefined || suffix !== undefined || square || interactive;
  const currentState = interactive ? (state ?? "enabled") : undefined;
  return (
    <Element
      {...element}
      className={classNames(styles.box, className)}
      {...lookAttributes(look)}
      {...(square && { "data-square": "" })}
      {...(interactive && { "data-interactive": "", "data-state": currentState })}
      {...(currentState === "disabled" && { "aria-disabled": "true" })}
      {...(currentState === "loading" && { "aria-busy": "true" })}
    >
      {sectioned ? (
        <>
          {prefix !== undefined && (
            <span className={styles.section} data-section="prefix">
              {prefix}
            </span>
          )}
          <span className={styles.content} data-section="content">
            {children}
          </span>
          {suffix !== undefined && (
            <span className={styles.section} data-section="suffix">
              {suffix}
            </span>
          )}
          {currentState === "loading" && <Spinner className={styles.spinner} />}
        </>
      ) : (
        children
      )}
    </Element>
  );
}
