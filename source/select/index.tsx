"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@sharadox/icon-web-library/icon";
import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Field } from "@sharadox/graphical-user-interface-web-library/field";
import { Listbox } from "@sharadox/graphical-user-interface-web-library/listbox";
import type { SelectProperties } from "@sharadox/graphical-user-interface-web-library/select/type";
import styles from "./index.module.scss";

/**
 * A select drawn by the interface, never the browser: a field box showing the choice, with a chevron section,
 * opening a `Listbox` under it. It works as a native select does (the select-only combobox of the ARIA practices):
 * the arrows, Home and End move, Enter, Space or Tab choose, Escape closes, a letter jumps to the next option
 * starting with it (and chooses it while closed), and a click outside closes. With a `name`, the value goes in a
 * hidden field for forms.
 *
 * @example
 * <Select label="Month" name="month" placeholder="Choose a month" options={[{ value: "1", label: "January" }]} />
 */
export function Select(properties: SelectProperties) {
  const {
    label,
    hideLabel,
    hint,
    error,
    options,
    value,
    defaultValue,
    onChange,
    name,
    placeholder,
    disabled,
    state,
    id,
    className,
    color,
    ...look
  } = properties;
  const [own, setOwn] = useState(defaultValue ?? "");
  const chosen = value ?? own;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const chosenIndex = options.findIndex((option) => option.value === chosen);

  const choose = (index: number) => {
    const option = options[index]!;
    if (value === undefined) setOwn(option.value);
    onChange?.(option.value);
    setOpen(false);
  };
  const show = () => {
    setActive(Math.max(0, chosenIndex));
    setOpen(true);
  };
  /** The next option after `from` whose label starts with `letter`, from the top again at the end. */
  const startingWith = (letter: string, from: number) => {
    for (let step = 1; step <= options.length; step++) {
      const index = (from + step) % options.length;
      if (options[index]!.label.toLowerCase().startsWith(letter)) return index;
    }
    return -1;
  };
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current!.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const { key } = event;
    if (key.length === 1 && key !== " ") {
      const index = startingWith(key.toLowerCase(), open ? active : chosenIndex);
      if (index < 0) return;
      if (open) setActive(index);
      else choose(index);
      return;
    }
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    const moves: Record<string, number> = {
      ArrowDown: Math.min(options.length - 1, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: options.length - 1,
    };
    if (key in moves) {
      event.preventDefault();
      setActive(moves[key]!);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      choose(active);
    } else if (key === "Tab") choose(active);
    else if (key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} id={id} className={className}>
      {(control) => (
        <div ref={root} className={styles.anchor}>
          {name && <input type="hidden" name={name} value={chosen} />}
          <Box
            field
            variant="outlined"
            color={color ?? (error === undefined ? "middleground" : "error")}
            state={state ?? (disabled ? "disabled" : "enabled")}
            suffix={<Icon name="chevron-down" className={classNames(styles.chevron, open && styles.open)} />}
            {...look}
            className={styles.field}
          >
            <button
              {...control}
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={`${control.id}-list`}
              aria-activedescendant={open ? `${control.id}-list-${active}` : undefined}
              disabled={disabled}
              onClick={() => (open ? setOpen(false) : show())}
              onKeyDown={keyDown}
              className={styles.button}
            >
              <span className={classNames(styles.value, chosenIndex < 0 && styles.placeholder)}>
                {chosenIndex < 0 ? placeholder : options[chosenIndex]!.label}
              </span>
            </button>
          </Box>
          {open && (
            <Listbox
              id={`${control.id}-list`}
              labelledBy={`${control.id}-label`}
              options={options}
              chosen={chosen}
              active={active}
              onActive={setActive}
              onChoose={choose}
            />
          )}
        </div>
      )}
    </Field>
  );
}
