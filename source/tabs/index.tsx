"use client";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import type { TabsProperties } from "@sharadox/graphical-user-interface-web-library/tabs/type";
import styles from "./index.module.scss";

const STEPS: Readonly<Record<string, number>> = { ArrowRight: 1, ArrowLeft: -1 };

/**
 * Tabs: a row of tab buttons (the chosen one filled) over the chosen tab's panel. As the ARIA tabs pattern asks, the
 * row is one stop in the tab order; the arrow keys choose the next or previous tab (wrapping around) and Home and End
 * the first and last; the panel is named by its tab and can be reached with Tab.
 *
 * @example
 * <Tabs label="Account" tabs={[{ value: "profile", label: "Profile", content: <Profile /> }, …]} />
 */
export function Tabs({ label, tabs, value, defaultValue, onChange, color = "index", size, className }: TabsProperties) {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);
  const [own, setOwn] = useState(defaultValue ?? tabs[0]!.value);
  const chosen = value ?? own;
  const index = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === chosen),
  );
  const choose = (next: number) => {
    const tab = tabs[next]!;
    if (value === undefined) setOwn(tab.value);
    onChange?.(tab.value);
  };
  const move = (event: KeyboardEvent) => {
    const step = STEPS[event.key];
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : step === undefined
            ? undefined
            : (index + step + tabs.length) % tabs.length;
    if (next === undefined) return;
    event.preventDefault();
    choose(next);
    list.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };
  return (
    <Box direction="top-to-bottom" align="stretch" gap={16} className={className}>
      <Box ref={list} role="tablist" aria-label={label} gap={4} justify="start" wrap="wrap" className={styles.list}>
        {tabs.map((tab, at) => (
          <Button
            key={tab.value}
            id={`${id}-tab-${at}`}
            role="tab"
            aria-selected={at === index}
            aria-controls={`${id}-panel`}
            tabIndex={at === index ? 0 : -1}
            variant={at === index ? "filled" : "transparent"}
            color={color}
            size={size}
            onClick={() => choose(at)}
            onKeyDown={move}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${index}`}
        tabIndex={0}
        className={styles.panel}
      >
        {tabs[index]!.content}
      </div>
    </Box>
  );
}
