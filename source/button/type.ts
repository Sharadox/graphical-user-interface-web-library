import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentType, ReactNode } from "react";
import type { IconName } from "@sharadox/icon-web-library/icon/type";
import type { BoxLook, BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";

/** What a link component receives to draw a button-looking link (next/link's `Link` by default). */
export interface ButtonLinkProperties extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children?: ReactNode;
}

/** What every button shares, a link or not. */
interface ButtonLook extends Omit<BoxLook, "direction" | "justify" | "align" | "textAlign" | "gap" | "padding"> {
  /**
   * Sets a state that stays (`none`, the default, follows the pointer, `disabled` and `loading`); `active`,
   * `loading` and `disabled` ignore clicks.
   */
  state?: BoxState;
  /** Shows the spinner instead of the words and ignores clicks while an action runs. */
  loading?: boolean;
  disabled?: boolean;
  /** A section before the words. */
  prefix?: ReactNode;
  /** A section after the words. */
  suffix?: ReactNode;
  /** An icon as the whole content (with `square`) or before the words. */
  icon?: IconName;
  /** Holds one icon or character: square, with no padding. Name it with `aria-label`. */
  square?: boolean;
  children?: ReactNode;
}

/** A button, or a link that looks like one (with `href`). */
export type ButtonProperties =
  | (ButtonLook &
      Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "prefix" | "disabled"> & {
        href?: undefined;
        link?: undefined;
      })
  | (ButtonLook &
      Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "color" | "prefix"> & {
        /** Where the link leads. */
        href: string;
        /** The link component (a site's own, such as one gliding to sections): next/link's `Link` by default. */
        link?: ComponentType<ButtonLinkProperties>;
      });
