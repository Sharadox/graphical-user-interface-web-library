"use client";
import { useId, useState } from "react";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import type { TipProperties } from "@sharadox/graphical-user-interface-web-library/tip/type";
import styles from "./index.module.scss";

/**
 * A small question mark beside a label that shows a tip on hover, on keyboard focus, or on a tap (phones). Escape
 * hides it. The button is described by the tip, so screen readers hear it too.
 *
 * @example
 * <label>Identifier <Tip label="What's this?" text="Like a username…" /></label>
 */
export function Tip({ text, label }: TipProperties) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className={styles.tip} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Button
        square
        variant="transparent"
        color="middleground"
        size="small"
        icon="question"
        aria-label={label}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      />
      <Box
        as="span"
        id={id}
        role="tooltip"
        hidden={!open}
        variant="filled"
        color="foreground"
        size="small"
        padding={8}
        textAlign="start"
        className={styles.bubble}
      >
        {text}
      </Box>
    </span>
  );
}
