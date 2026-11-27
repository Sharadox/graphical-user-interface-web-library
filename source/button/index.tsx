"use client";
import Link from "next/link";
import type { MouseEvent } from "react";
import { Icon } from "@sharadox/icon-web-library/icon";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";
import type { ButtonProperties } from "@sharadox/graphical-user-interface-web-library/button/type";

/**
 * The button: a `<button>`, or with `href` a link (next/link's `Link`, or the site's own `link`) that looks the same,
 * so the two can never drift apart. Filled in the brand color by default; any variant, color, color style, corner,
 * line and size (each per breakpoint too), a prefix and a suffix section, or one square icon. While `loading` it
 * shows the spinner, is marked busy and ignores clicks, so an action never runs twice; disabled, a link loses its
 * address. It is a client component (it handles clicks), so a server page can use it with serializable properties.
 *
 * @example
 * <Button type="submit" loading={saving}>Save</Button>
 * <Button href="/en/contact" variant="outlined">Contact</Button>
 * <Button square icon="close" variant="transparent" aria-label="Close" />
 */
export function Button(properties: ButtonProperties) {
  const {
    variant = "filled",
    color = "brand",
    state,
    loading = false,
    disabled = false,
    icon,
    square,
    children,
    onClick,
    ...rest
  } = properties;
  const currentState: BoxState = state ?? (disabled ? "disabled" : loading ? "loading" : "enabled");
  const ignored = currentState === "loading" || currentState === "disabled";
  const click = (event: MouseEvent<HTMLElement>) => {
    if (ignored) event.preventDefault();
    else (onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
  };
  const content = (
    <>
      {icon && <Icon name={icon} />}
      {children}
    </>
  );
  const box = { ...rest, variant, color, square, interactive: true, state: currentState, onClick: click };
  if (rest.href !== undefined) {
    const { link: Anchor = Link, href, ...anchor } = box as typeof box & { href: string; link?: typeof Link };
    if (currentState === "disabled") {
      // A disabled link goes nowhere: no address, still announced as a link that is disabled.
      return (
        <Box {...anchor} as="a" role="link">
          {content}
        </Box>
      );
    }
    return (
      <Box {...anchor} as={Anchor} href={href}>
        {content}
      </Box>
    );
  }
  const { type = "button", link: _link, ...button } = box as typeof box & { type?: string; link?: undefined };
  void _link;
  return (
    <Box {...button} as="button" type={type} disabled={disabled}>
      {content}
    </Box>
  );
}
