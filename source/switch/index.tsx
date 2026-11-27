"use client";
import { useState } from "react";
import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Spinner } from "@sharadox/graphical-user-interface-web-library/spinner";
import type { SwitchProperties } from "@sharadox/graphical-user-interface-web-library/switch/type";
import styles from "./index.module.scss";

/**
 * An on/off switch beside its label: a round track, outlined when off and filled when on, whose knob glides across.
 * A change shows at once: while an asynchronous `onChange` runs the knob holds a spinner and clicks are ignored, and
 * if it answers `false` the switch flips back.
 *
 * @example
 * <Switch label="Email me" checked={on} onChange={async (next) => (await save(next)).ok} />
 */
export function Switch(properties: SwitchProperties) {
  const {
    label,
    checked,
    defaultChecked = false,
    onChange,
    disabled,
    state,
    className,
    corner = "circle",
    size = "small",
    color = "brand",
    ...look
  } = properties;
  const [own, setOwn] = useState(defaultChecked);
  const [shown, setShown] = useState<boolean | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const current = shown ?? checked ?? own;
  const toggle = async () => {
    if (pending) return;
    const next = !current;
    setShown(next);
    const answer = onChange?.(next);
    if (answer instanceof Promise) {
      setPending(true);
      const accepted = (await answer) !== false;
      setPending(false);
      if (accepted && checked === undefined) setOwn(next);
      setShown(undefined);
    } else {
      if (checked === undefined) setOwn(next);
      setShown(undefined);
    }
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={current}
      {...(pending && { "aria-busy": true })}
      disabled={disabled}
      onClick={toggle}
      className={classNames(styles.switch, className)}
      data-checked={current || undefined}
    >
      <Box
        as="span"
        interactive
        variant={current ? "filled" : "outlined"}
        color={color}
        corner={corner}
        size={size}
        state={state ?? (disabled ? "disabled" : "enabled")}
        {...look}
        className={styles.track}
      >
        <span className={styles.knob}>{pending && <Spinner />}</span>
      </Box>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
