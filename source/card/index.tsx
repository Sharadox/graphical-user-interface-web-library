import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { CardProperties } from "@sharadox/graphical-user-interface-web-library/card/type";
import styles from "./index.module.scss";

/**
 * A card: one thing on its own (a picture, a name, an identifier). Its title, description and content on one side,
 * its action buttons on the other, centered on the card's height; they wrap under it when there is no room. An
 * outlined foreground article by default (see-through, so glass), with every box look.
 *
 * @example
 * <Card title="Email" description="Where sign-in codes go." action={<Button variant="outlined">Edit</Button>}>ana@example.com</Card>
 */
export function Card(properties: CardProperties) {
  const { title, headingLevel = 2, description, action, children, className, ...box } = properties;
  const Heading = `h${headingLevel}` as const;
  return (
    <Box
      as="article"
      variant="outlined"
      color="foreground"
      padding={24}
      gap={16}
      justify="space-between"
      wrap="wrap"
      textAlign="start"
      {...box}
      className={classNames(styles.card, className)}
    >
      <Box direction="top-to-bottom" align="start" textAlign="start" gap={8} className={styles.body}>
        {title !== undefined && <Heading className={styles.title}>{title}</Heading>}
        {description !== undefined && <p className={styles.description}>{description}</p>}
        {children}
      </Box>
      {action !== undefined && (
        <Box gap={8} wrap="wrap" className={styles.action}>
          {action}
        </Box>
      )}
    </Box>
  );
}
