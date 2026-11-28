import { Icon } from "@sharadox/icon-web-library/icon";
import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { ToggleMarkProperties } from "@sharadox/graphical-user-interface-web-library/toggle-mark/type";
import styles from "./index.module.scss";

/**
 * A checkbox's or a radio's mark beside its label: the native input, invisible, lies over a square box drawn like a
 * button (outlined, then filled once checked) holding a check (or a dot), so keyboards, forms and screen readers get
 * the real control. Used by `Checkbox` and `RadioGroup`.
 *
 * @example
 * <ToggleMark type="checkbox" label="Remember me" checked={on} onChange={setOn} />
 */
export function ToggleMark(properties: ToggleMarkProperties) {
  const {
    type,
    label,
    checked,
    onChange,
    state,
    color = "brand",
    colorStyle,
    corner,
    line,
    size = "small",
    className,
    ...input
  } = properties;
  return (
    <label className={classNames(styles.toggle, className)} data-checked={checked || undefined}>
      <span className={styles.control}>
        <input
          {...input}
          type={type}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className={styles.native}
        />
        <Box
          as="span"
          square
          interactive
          variant={checked ? "filled" : "outlined"}
          color={color}
          colorStyle={colorStyle}
          corner={corner ?? (type === "radio" ? "circle" : undefined)}
          line={line}
          size={size}
          state={state ?? (input.disabled ? "disabled" : "none")}
          aria-hidden="true"
          className={styles.mark}
        >
          {type === "checkbox" ? <Icon name="check" strokeWidth={2.5} /> : <span className={styles.dot} />}
        </Box>
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
