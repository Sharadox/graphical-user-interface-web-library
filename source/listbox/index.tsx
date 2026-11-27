import { useEffect, useRef } from "react";
import { Icon } from "@sharadox/icon-web-library/icon";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import type { ListboxProperties } from "@sharadox/graphical-user-interface-web-library/listbox/type";
import styles from "./index.module.scss";

/**
 * The list a select or a combobox opens, under its field: an outlined glass panel of options, the chosen one with a
 * check, the keyboard's one lit (`aria-activedescendant` points at it, and it scrolls into view). The pointer moves
 * the light; a click chooses. Focus stays on the field.
 *
 * @example
 * <Listbox id={listId} labelledBy={labelId} options={options} chosen={value} active={active} onActive={setActive} onChoose={choose} />
 */
export function Listbox({ id, labelledBy, options, chosen, active, onActive, onChoose, empty }: ListboxProperties) {
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    list.current?.querySelector("[data-active]")?.scrollIntoView?.({ block: "nearest" });
  }, [active]);
  return (
    <Box
      as="ul"
      ref={list}
      id={id}
      role="listbox"
      aria-labelledby={labelledBy}
      tabIndex={-1}
      variant="outlined"
      color="foreground"
      direction="top-to-bottom"
      align="stretch"
      padding={4}
      className={styles.list}
    >
      {options.length === 0 && empty !== undefined && <li className={styles.empty}>{empty}</li>}
      {options.map((option, index) => (
        <li
          key={option.value}
          id={`${id}-${index}`}
          role="option"
          aria-selected={option.value === chosen}
          {...(index === active && { "data-active": "" })}
          className={styles.option}
          onPointerMove={() => onActive(index)}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => onChoose(index)}
        >
          {option.label}
          {option.value === chosen && <Icon name="check" />}
        </li>
      ))}
    </Box>
  );
}
