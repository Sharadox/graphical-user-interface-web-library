import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { WrapperProperties } from "@sharadox/graphical-user-interface-web-library/wrapper/type";
import styles from "./index.module.scss";

/**
 * The page's width: a box as wide as its container up to `--wrapper-width` (1280), centered, with
 * `--wrapper-padding` (16) on each side, so content never touches the screen's edges. Any element and box look.
 *
 * @example
 * <Wrapper as="main" direction="top-to-bottom" gap={64}>…</Wrapper>
 */
export function Wrapper({ className, ...box }: WrapperProperties) {
  return <Box {...box} data-wrapper="" className={classNames(styles.wrapper, className)} />;
}
