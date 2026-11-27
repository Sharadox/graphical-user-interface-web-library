"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@sharadox/icon-web-library/icon";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Field } from "@sharadox/graphical-user-interface-web-library/field";
import { Listbox } from "@sharadox/graphical-user-interface-web-library/listbox";
import type { ComboboxProperties } from "@sharadox/graphical-user-interface-web-library/combobox/type";
import styles from "./index.module.scss";

/** Lower case without accents, so "Loulé" is found by "loule". */
const plain = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/**
 * Whether an option's words contain what was typed, ignoring case and accents.
 *
 * @example
 * matches("Loulé", "loule"); // true
 */
export function matches(label: string, typed: string): boolean {
  return plain(label).includes(plain(typed));
}

/**
 * A combobox: a text field that filters its options as you type (ignoring case and accents) and opens a `Listbox`
 * of the ones that match. The arrows, Home and End move, Enter chooses, Escape closes and puts back the chosen
 * option's words, and a click outside closes. With a `name`, the chosen value goes in a hidden field for forms.
 *
 * @example
 * <Combobox label="City" name="city" options={cities} empty="No city found." />
 */
export function Combobox(properties: ComboboxProperties) {
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
    empty,
    disabled,
    state,
    id,
    className,
    color,
    ...look
  } = properties;
  const [own, setOwn] = useState(defaultValue ?? "");
  const chosen = value ?? own;
  const words = (chosenValue: string) => options.find((option) => option.value === chosenValue)?.label ?? "";
  const [typed, setTyped] = useState(() => words(chosen));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  // Until something new is typed, every option shows; then only those that match.
  const shown = typed === words(chosen) ? options : options.filter((option) => matches(option.label, typed));

  const show = () => {
    if (disabled) return;
    setActive(0);
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setTyped(words(chosen));
  };
  const choose = (index: number) => {
    const option = shown[index]!;
    if (value === undefined) setOwn(option.value);
    onChange?.(option.value);
    setTyped(option.label);
    setOpen(false);
  };
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current!.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  });

  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp") {
        event.preventDefault();
        show();
      }
      return;
    }
    const moves: Record<string, number> = {
      ArrowDown: Math.min(shown.length - 1, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: shown.length - 1,
    };
    if (key in moves) {
      event.preventDefault();
      setActive(moves[key]!);
    } else if (key === "Enter") {
      event.preventDefault();
      if (shown.length > 0) choose(active);
    } else if (key === "Escape") {
      event.preventDefault();
      close();
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
            suffix={<Icon name="chevron-down" />}
            {...look}
          >
            <input
              {...control}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={`${control.id}-list`}
              aria-activedescendant={open && shown.length > 0 ? `${control.id}-list-${active}` : undefined}
              placeholder={placeholder}
              value={typed}
              disabled={disabled}
              onFocus={show}
              onChange={(event) => {
                setTyped(event.target.value);
                setActive(0);
                setOpen(true);
              }}
              onKeyDown={keyDown}
              className={styles.input}
            />
          </Box>
          {open && (
            <Listbox
              id={`${control.id}-list`}
              labelledBy={`${control.id}-label`}
              options={shown}
              chosen={chosen}
              active={active}
              onActive={setActive}
              onChoose={choose}
              empty={empty}
            />
          )}
        </div>
      )}
    </Field>
  );
}
