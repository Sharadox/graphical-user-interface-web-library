"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@sharadox/icon-web-library/icon";
import { classNames } from "@sharadox/web-library/class-name";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import { Field } from "@sharadox/graphical-user-interface-web-library/field";
import type { DatePickerProperties, Day } from "@sharadox/graphical-user-interface-web-library/date-picker/type";
import styles from "./index.module.scss";

const pad = (number: number, length = 2) => String(number).padStart(length, "0");

/**
 * A day written as `yyyy-mm-dd`.
 *
 * @example
 * formatDay({ year: 2026, month: 1, day: 28 }); // "2026-02-28"
 */
export function formatDay({ year, month, day }: Day): string {
  return `${pad(year, 4)}-${pad(month + 1)}-${pad(day)}`;
}

/**
 * A `yyyy-mm-dd` day, or `undefined` when it isn't one (a 13th month, a 30th of February).
 *
 * @example
 * parseDay("2026-02-28"); // { year: 2026, month: 1, day: 28 }
 */
export function parseDay(text: string | undefined): Day | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text ?? "");
  if (!match) return undefined;
  const [year, month, day] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  const date = new Date(Date.UTC(year, month, day));
  return date.getUTCMonth() === month && date.getUTCDate() === day ? { year, month, day } : undefined;
}

/** The day `days` after a day (before, when negative). */
const addDays = (text: string, days: number) => {
  const { year, month, day } = parseDay(text)!;
  const date = new Date(Date.UTC(year, month, day + days));
  return formatDay({ year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() });
};

/** The same day `months` later (the month's last day when it has fewer). */
const addMonths = (text: string, months: number) => {
  const { year, month, day } = parseDay(text)!;
  const last = new Date(Date.UTC(year, month + months + 1, 0)).getUTCDate();
  const date = new Date(Date.UTC(year, month + months, Math.min(day, last)));
  return formatDay({ year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() });
};

/**
 * A month's calendar: whole weeks (starting on `weekStart`, 1 for Monday or 0 for Sunday) as `yyyy-mm-dd` days,
 * with the days of the months before and after that fill them.
 *
 * @example
 * monthDays(2026, 1, 1)[0]; // ["2026-01-26", …, "2026-02-01"]
 */
export function monthDays(year: number, month: number, weekStart: 0 | 1): string[][] {
  const first = formatDay({ year, month, day: 1 });
  const lead = (new Date(Date.UTC(year, month, 1)).getUTCDay() - weekStart + 7) % 7;
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const weeks = Math.ceil((lead + length) / 7);
  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => addDays(first, week * 7 + weekday - lead)),
  );
}

/** Today on this device, as `yyyy-mm-dd`. */
const deviceToday = () => {
  const now = new Date();
  return formatDay({ year: now.getFullYear(), month: now.getMonth(), day: now.getDate() });
};

/**
 * A date picker: a field box showing the chosen day in the page's language, with a calendar section, opening a
 * calendar under it. The calendar's grid follows the ARIA date picker pattern: the arrows move by day and week,
 * Home and End to the week's start and end, Page Up and Page Down by month, Enter chooses, Escape closes; the month
 * buttons change month; days outside `min` and `max` can't be chosen; a press outside closes. Days are `yyyy-mm-dd`,
 * free of time zones, and with a `name` the day goes in a hidden field for forms.
 *
 * @example
 * <DatePicker label="Visit" name="visit" locale="pt-PT" min={today} previousLabel="Mês anterior" nextLabel="Mês seguinte" />
 */
export function DatePicker(properties: DatePickerProperties) {
  const {
    label,
    hideLabel,
    hint,
    error,
    value,
    defaultValue,
    onChange,
    name,
    min,
    max,
    locale = "en",
    weekStart = 1,
    today = deviceToday(),
    placeholder,
    previousLabel,
    nextLabel,
    disabled,
    state,
    id,
    className,
    color,
    variant = "outlined",
    ...look
  } = properties;
  const [own, setOwn] = useState(defaultValue ?? "");
  const chosen = value ?? own;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(chosen || today);
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLButtonElement>(null);
  const write = (text: string, options: Intl.DateTimeFormatOptions) => {
    const { year, month, day } = parseDay(text)!;
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(
      new Date(Date.UTC(year, month, day)),
    );
  };
  const allowed = (day: string) => (min === undefined || day >= min) && (max === undefined || day <= max);
  const view = parseDay(focused)!;
  const monthStart = formatDay({ ...view, day: 1 });
  const weeks = monthDays(view.year, view.month, weekStart);

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLElement>(`[data-day="${focused}"]`)?.focus();
  }, [open, focused]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current!.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const show = () => {
    setFocused(chosen || today);
    setOpen(true);
  };
  const choose = (day: string) => {
    if (!allowed(day)) return;
    if (value === undefined) setOwn(day);
    onChange?.(day);
    setOpen(false);
    field.current?.focus();
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const weekday = (new Date(Date.UTC(view.year, view.month, view.day)).getUTCDay() - weekStart + 7) % 7;
    const moves: Record<string, () => string> = {
      ArrowRight: () => addDays(focused, 1),
      ArrowLeft: () => addDays(focused, -1),
      ArrowDown: () => addDays(focused, 7),
      ArrowUp: () => addDays(focused, -7),
      Home: () => addDays(focused, -weekday),
      End: () => addDays(focused, 6 - weekday),
      PageDown: () => addMonths(focused, 1),
      PageUp: () => addMonths(focused, -1),
    };
    if (event.key in moves) {
      event.preventDefault();
      setFocused(moves[event.key]!());
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(focused);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      field.current?.focus();
    }
  };
  const previousMonth = addMonths(monthStart, -1);
  const nextMonth = addMonths(monthStart, 1);
  const lastOfMonth = (start: string) => addDays(addMonths(start, 1), -1);
  const weekdays = weeks[0]!.map((day) => ({
    short: write(day, { weekday: "short" }).replace(/\.$/, "").slice(0, 2),
    long: write(day, { weekday: "long" }),
  }));

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} id={id} className={className}>
      {(control) => (
        <div ref={root} className={styles.anchor}>
          {name && <input type="hidden" name={name} value={chosen} />}
          <Box
            field
            variant={variant}
            color={color ?? (error === undefined ? "middleground" : "error")}
            state={state ?? (disabled ? "disabled" : "none")}
            suffix={<Icon name="calendar" />}
            {...look}
            className={styles.field}
          >
            <button
              {...control}
              ref={field}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={open}
              disabled={disabled}
              onClick={() => (open ? setOpen(false) : show())}
              className={styles.button}
            >
              <span className={classNames(!chosen && styles.placeholder)}>
                {chosen ? write(chosen, { dateStyle: "long" }) : placeholder}
              </span>
            </button>
          </Box>
          {open && (
            <Box
              role="dialog"
              aria-labelledby={`${control.id}-label`}
              variant="outlined"
              color="foreground"
              direction="top-to-bottom"
              align="stretch"
              gap={8}
              padding={12}
              className={styles.calendar}
            >
              <Box justify="space-between" gap={8}>
                <Button
                  square
                  variant="transparent"
                  color="middleground"
                  icon="chevron-left"
                  aria-label={previousLabel}
                  disabled={min !== undefined && lastOfMonth(previousMonth) < min}
                  onClick={() => setFocused(addMonths(focused, -1))}
                />
                <span aria-live="polite" className={styles.month}>
                  {write(monthStart, { month: "long", year: "numeric" })}
                </span>
                <Button
                  square
                  variant="transparent"
                  color="middleground"
                  icon="chevron-right"
                  aria-label={nextLabel}
                  disabled={max !== undefined && nextMonth > max}
                  onClick={() => setFocused(addMonths(focused, 1))}
                />
              </Box>
              <table role="grid" className={styles.grid}>
                <thead>
                  <tr>
                    {weekdays.map((weekday) => (
                      <th key={weekday.long} role="columnheader" abbr={weekday.long} className={styles.weekday}>
                        {weekday.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week) => (
                    <tr key={week[0]}>
                      {week.map((day) => (
                        <td
                          key={day}
                          role="gridcell"
                          aria-selected={day === chosen}
                          {...(parseDay(day)!.month !== view.month && { "data-outside": "" })}
                          className={styles.cell}
                        >
                          <Button
                            data-day={day}
                            square
                            variant={day === chosen ? "filled" : "transparent"}
                            color={
                              day === chosen
                                ? "brand"
                                : parseDay(day)!.month === view.month
                                  ? "foreground"
                                  : "middleground"
                            }
                            tabIndex={day === focused ? 0 : -1}
                            aria-label={write(day, { dateStyle: "full" })}
                            aria-current={day === today ? "date" : undefined}
                            // Disabled but still focusable, so the arrow keys can pass over it.
                            state={allowed(day) ? undefined : "disabled"}
                            onClick={() => choose(day)}
                            onKeyDown={keyDown}
                            className={styles.day}
                          >
                            {parseDay(day)!.day}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </div>
      )}
    </Field>
  );
}
