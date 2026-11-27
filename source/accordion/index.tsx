"use client";
import { useId, useState } from "react";
import { Icon } from "@sharadox/icon-web-library/icon";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { AccordionProperties } from "@sharadox/graphical-user-interface-web-library/accordion/type";
import styles from "./index.module.scss";

/**
 * An accordion: titles that open and close their content, smoothly (its height grows and shrinks). Each title is a
 * heading holding a button, which says whether its region is open; a closed region is inert. One item open at a time,
 * or several with `multiple`. Each item is a box (outlined foreground by default).
 *
 * @example
 * <Accordion items={[{ value: "price", title: "How much is it?", content: <p>…</p> }]} />
 */
export function Accordion(properties: AccordionProperties) {
  const {
    items,
    multiple,
    open,
    defaultOpen = [],
    onChange,
    headingLevel = 3,
    className,
    variant = "outlined",
    color = "foreground",
    ...look
  } = properties;
  const id = useId();
  const [own, setOwn] = useState<readonly string[]>(defaultOpen);
  const current = open ?? own;
  const Heading = `h${headingLevel}` as const;
  const toggle = (value: string) => {
    const next = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : multiple
        ? [...current, value]
        : [value];
    if (open === undefined) setOwn(next);
    onChange?.(next);
  };
  return (
    <Box direction="top-to-bottom" align="stretch" gap={8} className={className}>
      {items.map((item, index) => {
        const expanded = current.includes(item.value);
        return (
          <Box key={item.value} variant={variant} color={color} direction="top-to-bottom" align="stretch" {...look}>
            <Heading className={styles.heading}>
              <button
                type="button"
                id={`${id}-${index}`}
                aria-expanded={expanded}
                aria-controls={`${id}-${index}-region`}
                onClick={() => toggle(item.value)}
                className={styles.button}
              >
                <span>{item.title}</span>
                <Icon name="chevron-down" className={styles.chevron} />
              </button>
            </Heading>
            <div
              id={`${id}-${index}-region`}
              role="region"
              aria-labelledby={`${id}-${index}`}
              {...(expanded ? { "data-open": "" } : { inert: true })}
              className={styles.region}
            >
              <div className={styles.inner}>
                <div className={styles.content}>{item.content}</div>
              </div>
            </div>
          </Box>
        );
      })}
    </Box>
  );
}
