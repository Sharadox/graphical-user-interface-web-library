"use client";
import { useId } from "react";
import { classNames } from "@sharadox/web-library/class-name";
import { useMenu } from "@sharadox/menu-web-library/use-menu";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import { Wrapper } from "@sharadox/graphical-user-interface-web-library/wrapper";
import type { NavigationProperties } from "@sharadox/graphical-user-interface-web-library/navigation/type";
import styles from "./index.module.scss";

/**
 * The site's bar, sticky at the top and as wide as the screen (its line goes from edge to edge, its content sits in a
 * wrapper): the brand at its start, the links, and the actions at its end. Below `collapse`
 * pixels wide the links and actions move into a phone menu, opened by a button: it covers the page under the bar,
 * scrolls when it doesn't fit (a phone held sideways), keeps the page behind still, and closes on Escape, on anything
 * tapped in it, and when the screen widens (`@sharadox/menu-web-library`). Links are transparent buttons; the current
 * page's is foreground and marked `aria-current`.
 *
 * @example
 * <Navigation brand={<Button href="/en" variant="inline">Name</Button>} label="Main" links={links} actions={<StyleSwitch … />} menuLabel="Open the menu" closeLabel="Close the menu" />
 */
export function Navigation(properties: NavigationProperties) {
  const { brand, label, links, actions, menuLabel, closeLabel, collapse = 960, className } = properties;
  const id = useId();
  const menu = useMenu({ wide: `(min-width: ${collapse}px)`, id });
  const list = (direction: "left-to-right" | "top-to-bottom") =>
    links.map((link) => (
      <Button
        key={link.href}
        href={link.href}
        variant="transparent"
        color={link.current ? "foreground" : "index"}
        size={direction === "top-to-bottom" ? "large" : undefined}
        aria-current={link.current ? "page" : undefined}
        className={direction === "top-to-bottom" ? styles.menuLink : undefined}
      >
        {link.label}
      </Button>
    ));
  return (
    <>
      <Box as="header" data-collapse={collapse} className={classNames(styles.bar, className)} {...menu.closer}>
        <Wrapper justify="space-between" gap={16}>
          <Box justify="start" className={styles.brand}>
            {brand}
          </Box>
          <Box as="nav" aria-label={label} gap={4} wrap="wrap" className={styles.wide}>
            {list("left-to-right")}
          </Box>
          {actions !== undefined && (
            <Box gap={8} wrap="wrap" justify="end" className={styles.wide}>
              {actions}
            </Box>
          )}
          <Button
            {...menu.toggle}
            square
            variant="transparent"
            color="foreground"
            icon={menu.open ? "close" : "menu"}
            aria-label={menu.open ? closeLabel : menuLabel}
            className={styles.toggle}
          />
        </Wrapper>
      </Box>
      {menu.open && (
        <Box
          as="nav"
          id={id}
          aria-label={label}
          data-lenis-prevent=""
          direction="top-to-bottom"
          align="stretch"
          justify="start"
          gap={24}
          className={styles.menu}
          {...menu.closer}
        >
          <Box direction="top-to-bottom" align="stretch" gap={4}>
            {list("top-to-bottom")}
          </Box>
          {actions !== undefined && (
            <Box data-menu-actions="" direction="top-to-bottom" align="start" gap={12}>
              {actions}
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
