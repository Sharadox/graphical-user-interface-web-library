import type { TextareaHTMLAttributes } from "react";
import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Field } from "@sharadox/graphical-user-interface-web-library/field";
import type { TextFieldProperties } from "@sharadox/graphical-user-interface-web-library/text-field/type";
import styles from "./index.module.scss";

/**
 * A text field: its label, an outlined field box (middleground by default, the error color with an error) with
 * optional prefix and suffix sections, and its hint and error under it. One line by default; `multiline` makes it a
 * text area. Every look of a box applies, per breakpoint too.
 *
 * @example
 * <TextField label="Email" type="email" name="email" error={error} />
 * <TextField label="Price" type="number" prefix="€" />
 * <TextField label="Message" multiline rows={6} />
 */
export function TextField(properties: TextFieldProperties) {
  const {
    label,
    hideLabel,
    hint,
    error,
    prefix,
    suffix,
    state,
    variant = "outlined",
    color,
    colorStyle,
    corner,
    line,
    size,
    className,
    multiline,
    id,
    ...control
  } = properties;
  const disabled = Boolean(control.disabled);
  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} id={id}>
      {(attributes) => (
        <Box
          field
          variant={variant}
          color={color ?? (error === undefined ? "middleground" : "error")}
          colorStyle={colorStyle}
          corner={corner}
          line={line}
          size={size}
          state={state ?? (disabled ? "disabled" : "none")}
          prefix={prefix}
          suffix={suffix}
          className={classNames(styles.field, multiline && styles.multiline, className)}
          {...(multiline && { "data-multiline": "" })}
        >
          {multiline ? (
            <textarea
              rows={3}
              {...(control as TextareaHTMLAttributes<HTMLTextAreaElement>)}
              {...attributes}
              className={styles.control}
            />
          ) : (
            <input type="text" {...(control as object)} {...attributes} className={styles.control} />
          )}
        </Box>
      )}
    </Field>
  );
}
