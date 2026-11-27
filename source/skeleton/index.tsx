import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { SkeletonProperties } from "@sharadox/graphical-user-interface-web-library/skeleton/type";
import styles from "./index.module.scss";

const Line = ({ short }: { short?: boolean }) => (
  <span data-part="line" className={classNames(styles.shape, styles.line, short && styles.short)} />
);
/** A card as the interface draws them: an outlined foreground box. */
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Box
    as="span"
    data-part="card"
    variant="outlined"
    color="foreground"
    direction="top-to-bottom"
    align="stretch"
    gap={12}
    padding={24}
    className={classNames(styles.card, className)}
  >
    {children}
  </Box>
);

/**
 * Where data is still loading: soft shapes like what will come (lines, a card, a list of rows, a profile, a grid of
 * cards), in the foreground's transparent color, gently shimmering, so a page shows at once and fills in. Screen
 * readers hear `label` once.
 *
 * @example
 * <Suspense fallback={<Skeleton label="Loading devices…" shape="list" rows={3} />}><DeviceList /></Suspense>
 */
export function Skeleton({ label, shape = "lines", lines = 3, rows = 3, height }: SkeletonProperties) {
  const text = Array.from({ length: lines }, (_, index) => (
    <Line key={index} short={index === lines - 1 && index > 0} />
  ));
  return (
    <div className={styles.skeleton} role="status" aria-label={label}>
      {height ? (
        <span className={classNames(styles.shape, styles.block)} style={{ height }} />
      ) : shape === "lines" ? (
        text
      ) : shape === "card" ? (
        <Card>{text}</Card>
      ) : shape === "profile" ? (
        <Card className={styles.profile}>
          <span data-part="circle" className={classNames(styles.shape, styles.circle)} />
          <span className={styles.stack}>
            <Line short />
            <Line />
          </span>
        </Card>
      ) : shape === "cards" ? (
        <span className={styles.grid}>
          {Array.from({ length: rows }, (_, index) => (
            <Card key={index}>
              <Line short />
              <Line />
            </Card>
          ))}
        </span>
      ) : (
        <Card>
          {Array.from({ length: rows }, (_, index) => (
            <span key={index} data-part="row" className={styles.row}>
              <span className={classNames(styles.shape, styles.dot)} />
              <span className={styles.stack}>
                <Line />
                <Line short />
              </span>
              <span className={classNames(styles.shape, styles.button)} />
            </span>
          ))}
        </Card>
      )}
    </div>
  );
}
