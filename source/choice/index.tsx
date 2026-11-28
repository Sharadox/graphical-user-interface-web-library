"use client";
import { useRef, type KeyboardEvent } from "react";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import type { ChoiceProperties } from "@sharadox/graphical-user-interface-web-library/choice/type";

const STEPS: Readonly<Record<string, number>> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * A segmented choice: one radio button per option in a row, the chosen one filled. It is one stop in the tab order
 * (the chosen option); the arrow keys move and choose, wrapping around, and Home and End jump to the ends, as a radio
 * group does.
 *
 * @example
 * <Choice label="Size" options={[{ value: "small", label: "Small" }, …]} value={size} onChange={setSize} />
 */
export function Choice({ label, options, value, onChange, size, color = "index", className }: ChoiceProperties) {
  const group = useRef<HTMLDivElement>(null);
  const chosen = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const move = (event: KeyboardEvent) => {
    const step = STEPS[event.key];
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : step === undefined
            ? undefined
            : (chosen + step + options.length) % options.length;
    if (next === undefined) return;
    event.preventDefault();
    onChange(options[next]!.value);
    group.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };
  return (
    <Box role="radiogroup" aria-label={label} gap={4} wrap="wrap" className={className} ref={group}>
      {options.map((option, index) => (
        <Button
          key={option.value}
          role="radio"
          aria-checked={option.value === value}
          tabIndex={index === chosen ? 0 : -1}
          variant={option.value === value ? "filled" : "transparent"}
          color={color}
          size={size}
          onClick={() => onChange(option.value)}
          onKeyDown={move}
        >
          {option.label}
        </Button>
      ))}
    </Box>
  );
}
