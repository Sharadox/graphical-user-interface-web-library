import { useId } from "react";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { FieldControl, FieldProperties } from "@sharadox/graphical-user-interface-web-library/field/type";
import styles from "./index.module.scss";

/**
 * A form control with its label above it and its hint and error under it, all linked for assistive technology: the
 * label names the control, the hint and error describe it, and an error marks it invalid. The control is drawn by
 * `children`, which receives the attributes to spread on it. The label's id is the control's plus `-label`.
 *
 * @example
 * <Field label="Email" hint="We never share it." error={error}>{(control) => <input {...control} type="email" />}</Field>
 */
export function Field({ label, hideLabel, hint, error, id, className, children }: FieldProperties) {
  const made = useId();
  const controlId = id ?? made;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = [hint !== undefined && hintId, error !== undefined && errorId].filter(Boolean).join(" ");
  const control: FieldControl = {
    id: controlId,
    ...(describedBy && { "aria-describedby": describedBy }),
    ...(error !== undefined && { "aria-invalid": true }),
  };
  return (
    <Box direction="top-to-bottom" align="stretch" textAlign="start" gap={8} className={className}>
      <label
        id={`${controlId}-label`}
        htmlFor={controlId}
        className={styles.label}
        {...(hideLabel && { "data-hidden": "" })}
      >
        {label}
      </label>
      {children(control)}
      {hint !== undefined && (
        <Box as="p" id={hintId} color="middleground" justify="start" textAlign="start" className={styles.message}>
          {hint}
        </Box>
      )}
      {error !== undefined && (
        <Box as="p" id={errorId} color="error" justify="start" textAlign="start" className={styles.message}>
          {error}
        </Box>
      )}
    </Box>
  );
}
