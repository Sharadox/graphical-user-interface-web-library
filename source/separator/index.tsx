import { classNames } from "@sharadox/web-library/class-name";
import { lookAttributes } from "@sharadox/graphical-user-interface-web-library/box";
import type { SeparatorProperties } from "@sharadox/graphical-user-interface-web-library/separator/type";
import styles from "./index.module.scss";

/**
 * A line between things: a horizontal rule by default, or vertical between items in a row. It is the color's border
 * color (index's by default), in the line style and thickness.
 *
 * @example
 * <Separator />
 * <Separator orientation="vertical" line="dashed" />
 */
export function Separator({ orientation = "horizontal", color = "index", line, className }: SeparatorProperties) {
  return (
    <hr
      {...lookAttributes({ color, line })}
      {...(orientation === "vertical" && { "aria-orientation": "vertical" })}
      data-orientation={orientation}
      className={classNames(styles.separator, className)}
    />
  );
}
