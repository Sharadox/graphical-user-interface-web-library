"use client";
import { useState } from "react";
import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { AvatarProperties } from "@sharadox/graphical-user-interface-web-library/avatar/type";
import styles from "./index.module.scss";

/**
 * A name's initials: the first letter of its first and last words, upper case.
 *
 * @example
 * initials("Ana Maria Silva"); // "AS"
 */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const letters = words.length === 1 ? [words[0]!] : [words[0]!, words.at(-1)!];
  return letters.map((word) => [...word][0]!.toLocaleUpperCase()).join("");
}

/**
 * A person's (or a company's) picture: a square box of the size's height, round by default. Without a picture, or
 * when it can't load, their initials on a filled box (brand by default). Either way it is an image named by `name`.
 *
 * The picture is a plain `img`: avatars come from anywhere (uploads, other services), which next/image would need
 * each site to allow by address.
 *
 * @example
 * <Avatar name="Ana Silva" src={account.picture} size="large" />
 */
export function Avatar({
  name,
  src,
  color = "brand",
  corner = "circle",
  size = "medium",
  className,
  ...look
}: AvatarProperties) {
  const [failed, setFailed] = useState(false);
  const picture = src !== undefined && !failed;
  return (
    <Box
      as="span"
      square
      corner={corner}
      size={size}
      color={color}
      {...look}
      {...(picture ? {} : { variant: "filled", role: "img", "aria-label": name })}
      className={classNames(styles.avatar, className)}
    >
      {picture ? (
        // A plain img: avatars come from any address (see above).
        <img src={src} alt={name} className={styles.picture} onError={() => setFailed(true)} />
      ) : (
        initials(name)
      )}
    </Box>
  );
}
