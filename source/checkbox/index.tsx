"use client";
import { useState } from "react";
import { ToggleMark } from "@sharadox/graphical-user-interface-web-library/toggle-mark";
import type { CheckboxProperties } from "@sharadox/graphical-user-interface-web-library/checkbox/type";

/**
 * A checkbox drawn like the buttons: outlined, filled once checked, with a check growing in. A native checkbox
 * underneath, so it works with forms, keyboards and screen readers. Controlled (`checked`) or not (`defaultChecked`).
 *
 * @example
 * <Checkbox label="Remember me" name="remember" />
 */
export function Checkbox({ checked, defaultChecked = false, onChange, ...mark }: CheckboxProperties) {
  const [own, setOwn] = useState(defaultChecked);
  const current = checked ?? own;
  return (
    <ToggleMark
      {...mark}
      type="checkbox"
      checked={current}
      onChange={(next) => {
        if (checked === undefined) setOwn(next);
        onChange?.(next);
      }}
    />
  );
}
