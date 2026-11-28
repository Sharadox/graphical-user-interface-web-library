"use client";
import { useState } from "react";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import { Field } from "@sharadox/graphical-user-interface-web-library/field";
import type { NumberFieldProperties } from "@sharadox/graphical-user-interface-web-library/number-field/type";
import styles from "./index.module.scss";

/** How many decimals a step has, so 0.1 + 0.2 shows 0.3. */
const decimals = (step: number) => (String(step).split(".")[1] ?? "").length;

/**
 * A number field: a number input between a minus and a plus button, each its own section. The buttons add or take
 * away `step` and stop at `min` and `max`; typing sets any number, brought within the limits on leaving the field.
 *
 * @example
 * <NumberField label="Guests" name="guests" defaultValue={2} min={1} max={12} decreaseLabel="Fewer" increaseLabel="More" />
 */
export function NumberField(properties: NumberFieldProperties) {
  const {
    label,
    hideLabel,
    hint,
    error,
    value,
    defaultValue,
    onChange,
    min,
    max,
    step = 1,
    name,
    disabled,
    decreaseLabel,
    increaseLabel,
    state,
    id,
    className,
    color,
    variant = "outlined",
    ...look
  } = properties;
  const [own, setOwn] = useState(defaultValue === undefined ? "" : String(defaultValue));
  const text = value === undefined ? own : String(value);
  const number = text === "" ? undefined : Number(text);
  const within = (candidate: number) =>
    Number(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, candidate)).toFixed(decimals(step)));
  const set = (next: number) => {
    if (value === undefined) setOwn(String(next));
    onChange?.(next);
  };
  // From empty, plus starts one step above the minimum (or zero) and minus at it.
  const by = (direction: 1 | -1) =>
    set(within(number === undefined ? (min ?? 0) + Math.max(0, direction) * step : number + direction * step));
  const button = (direction: 1 | -1) => (
    <Button
      // On a filled field the buttons are filled too, so their icons take the color's text color.
      variant={variant === "filled" ? "filled" : "transparent"}
      color={color ?? (error === undefined ? "middleground" : "error")}
      square
      icon={direction === 1 ? "plus" : "minus"}
      aria-label={direction === 1 ? increaseLabel : decreaseLabel}
      disabled={
        disabled ||
        (number !== undefined && (direction === 1 ? number >= (max ?? Infinity) : number <= (min ?? -Infinity)))
      }
      onClick={() => by(direction)}
      className={styles.button}
    />
  );
  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} id={id} className={className}>
      {(control) => (
        <Box
          field
          variant={variant}
          color={color ?? (error === undefined ? "middleground" : "error")}
          state={state ?? (disabled ? "disabled" : "none")}
          prefix={button(-1)}
          suffix={button(1)}
          {...look}
        >
          <input
            {...control}
            type="number"
            inputMode="decimal"
            name={name}
            min={min}
            max={max}
            step={step}
            value={text}
            disabled={disabled}
            onChange={(event) => {
              const typed = event.target.value;
              if (value === undefined) setOwn(typed);
              onChange?.(typed === "" ? undefined : Number(typed));
            }}
            onBlur={() => {
              if (number !== undefined && within(number) !== number) set(within(number));
            }}
            className={styles.input}
          />
        </Box>
      )}
    </Field>
  );
}
