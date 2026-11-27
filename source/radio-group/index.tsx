"use client";
import { useId, useState } from "react";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { ToggleMark } from "@sharadox/graphical-user-interface-web-library/toggle-mark";
import type { RadioGroupProperties } from "@sharadox/graphical-user-interface-web-library/radio-group/type";
import styles from "./index.module.scss";

/**
 * A group of radios under its label, one choice among them: native radios sharing a name (arrow keys move between
 * them), each drawn like the buttons (outlined, filled once chosen), round by default. Controlled (`value`) or not
 * (`defaultValue`).
 *
 * @example
 * <RadioGroup label="Contact me by" name="contact" options={[{ value: "email", label: "Email" }, …]} defaultValue="email" />
 */
export function RadioGroup(properties: RadioGroupProperties) {
  const { label, options, name, value, defaultValue, onChange, disabled, error, state, className, ...look } =
    properties;
  const id = useId();
  const [own, setOwn] = useState(defaultValue);
  const current = value ?? own;
  const errorId = `${id}-error`;
  return (
    <Box
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      {...(error !== undefined && { "aria-invalid": true, "aria-describedby": errorId })}
      direction="top-to-bottom"
      align="start"
      textAlign="start"
      gap={8}
      className={className}
    >
      <span id={`${id}-label`} className={styles.label}>
        {label}
      </span>
      {options.map((option) => (
        <ToggleMark
          key={option.value}
          {...look}
          type="radio"
          name={name ?? id}
          value={option.value}
          label={option.label}
          checked={current === option.value}
          disabled={disabled}
          state={state}
          onChange={() => {
            if (value === undefined) setOwn(option.value);
            onChange?.(option.value);
          }}
        />
      ))}
      {error !== undefined && (
        <Box as="p" id={errorId} color="error" textAlign="start" className={styles.error}>
          {error}
        </Box>
      )}
    </Box>
  );
}
