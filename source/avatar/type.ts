import type { BoxLook } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface AvatarProperties extends Pick<BoxLook, "color" | "colorStyle" | "corner" | "line" | "size"> {
  /** Whose picture: its accessible name, and the initials without a picture. */
  name: string;
  /** The picture's address; without one (or when it fails) the initials show. */
  src?: string;
  className?: string;
}
