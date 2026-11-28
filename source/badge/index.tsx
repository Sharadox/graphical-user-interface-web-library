import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { BadgeProperties } from "@sharadox/graphical-user-interface-web-library/badge/type";
import styles from "./index.module.scss";

/**
 * A badge: a short label (a status, a count, "New") sitting in running text. A filled index box by default,
 * with every box look, a prefix and a suffix.
 *
 * @example
 * <Badge color="success" variant="outlined">Online</Badge>
 */
export function Badge({ className, ...box }: BadgeProperties) {
  return (
    <Box
      as="span"
      variant="filled"
      color="index"
      size="medium"
      {...box}
      data-badge=""
      className={classNames(styles.badge, className)}
    />
  );
}
