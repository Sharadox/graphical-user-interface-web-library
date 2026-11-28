import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import type { SkipLinkProperties } from "@sharadox/graphical-user-interface-web-library/skip-link/type";
import styles from "./index.module.scss";

/**
 * The page's first link, straight to its main content past the bar and menus. Hidden until the keyboard reaches it
 * (a mouse or a finger never sees it), then shown over the page's top start corner. Put it first in the body.
 *
 * @example
 * <SkipLink label="Skip to the Content" />
 * <main id="main">…</main>
 */
export function SkipLink({ label, href = "#main" }: SkipLinkProperties) {
  return (
    <Button href={href} data-skip-link="" className={styles.skipLink}>
      {label}
    </Button>
  );
}
