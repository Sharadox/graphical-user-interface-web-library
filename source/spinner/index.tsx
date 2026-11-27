import type { CSSProperties } from "react";
import { classNames } from "@sharadox/web-library/class-name";
import type { SpinnerProperties } from "@sharadox/graphical-user-interface-web-library/spinner/type";
import styles from "./index.module.scss";

const BARS = Array.from({ length: 8 }, (_, bar) => bar);

/**
 * The loading spinner: eight bars in a circle, each lighting up one after another clockwise and fading, so it leaves a
 * trail. It is the size of the text around it (`1em`), in its color, and hidden from screen readers (the busy element
 * says it is busy).
 *
 * @example
 * <Spinner />
 */
export function Spinner({ className }: SpinnerProperties) {
  return (
    <span className={classNames(styles.spinner, className)} data-spinner="" aria-hidden="true">
      {BARS.map((bar) => (
        <span key={bar} className={styles.bar} style={{ "--spinner-bar": String(bar) } as CSSProperties} />
      ))}
    </span>
  );
}
