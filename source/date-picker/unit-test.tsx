import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { DatePicker, monthDays, parseDay, formatDay } from "@sharadox/graphical-user-interface-web-library/date-picker";

afterEach(cleanup);
const WORDS = { previousLabel: "Previous month", nextLabel: "Next month" };

test("days as yyyy-mm-dd, read and written without time zones", () => {
  expect(formatDay(parseDay("2026-02-28")!)).toBe("2026-02-28");
  expect(parseDay("2026-13-01")).toBeUndefined();
  expect(parseDay("nonsense")).toBeUndefined();
  expect(parseDay(undefined)).toBeUndefined();
});

test("a month's grid: whole weeks from the chosen first day, with the days of the months around it", () => {
  const weeks = monthDays(2026, 1, 1); // February 2026, weeks from Monday
  expect(weeks[0]![0]).toBe("2026-01-26");
  expect(weeks[0]![6]).toBe("2026-02-01");
  expect(weeks.at(-1)![6]).toBe("2026-03-01");
  expect(monthDays(2026, 1, 0)[0]![0]).toBe("2026-02-01"); // from Sunday
});

test("a field showing the day in the page's language; the calendar opens on it", () => {
  const change = vi.fn();
  render(<DatePicker label="Visit" name="visit" defaultValue="2026-02-10" locale="en" onChange={change} {...WORDS} />);
  const field = screen.getByRole("button", { name: /Visit/ });
  expect(field.textContent).toContain("February 10, 2026");
  expect((document.querySelector('input[name="visit"]') as HTMLInputElement).value).toBe("2026-02-10");
  fireEvent.click(field);
  const calendar = screen.getByRole("dialog", { name: "Visit" });
  expect(calendar.textContent).toContain("February 2026");
  const grid = screen.getByRole("grid");
  expect(screen.getAllByRole("columnheader").map((day) => day.textContent)).toEqual([
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
    "Su",
  ]);
  const chosen = screen.getByRole("gridcell", { selected: true });
  expect(chosen.textContent).toBe("10");
  expect(document.activeElement).toBe(chosen.querySelector("button"));
  expect(grid.querySelector("[data-outside] button")!.textContent).toBe("26");
  fireEvent.click(screen.getByRole("button", { name: /February 12, 2026/ }));
  expect(change).toHaveBeenLastCalledWith("2026-02-12");
  expect(field.textContent).toContain("February 12, 2026");
  expect(screen.queryByRole("dialog")).toBeNull();
});

test("the keyboard moves by day, week and month; Enter chooses, Escape closes", () => {
  const change = vi.fn();
  render(<DatePicker label="Visit" defaultValue="2026-02-10" locale="en" onChange={change} {...WORDS} />);
  fireEvent.click(screen.getByRole("button", { name: /Visit/ }));
  const focused = () => (document.activeElement as HTMLElement).getAttribute("data-day");
  const key = (name: string) => fireEvent.keyDown(document.activeElement!, { key: name });
  key("ArrowRight");
  expect(focused()).toBe("2026-02-11");
  key("ArrowDown");
  expect(focused()).toBe("2026-02-18");
  key("ArrowLeft");
  key("ArrowUp");
  expect(focused()).toBe("2026-02-10");
  key("Home");
  expect(focused()).toBe("2026-02-09");
  key("End");
  expect(focused()).toBe("2026-02-15");
  key("PageDown");
  expect(focused()).toBe("2026-03-15");
  expect(screen.getByRole("dialog").textContent).toContain("March 2026");
  key("PageUp");
  key("PageUp");
  expect(focused()).toBe("2026-01-15");
  key("x");
  key("Enter");
  expect(change).toHaveBeenLastCalledWith("2026-01-15");
  fireEvent.click(screen.getByRole("button", { name: /Visit/ }));
  key("Escape");
  expect(screen.queryByRole("dialog")).toBeNull();
});

test("the arrows change month; days outside the limits can't be chosen; a press outside closes", () => {
  const change = vi.fn();
  render(
    <DatePicker
      label="Visit"
      value=""
      placeholder="Choose a day"
      min="2026-02-05"
      max="2026-03-10"
      locale="pt-PT"
      onChange={change}
      {...WORDS}
      today="2026-02-20"
    />,
  );
  const field = screen.getByRole("button", { name: /Visit/ });
  expect(field.textContent).toContain("Choose a day");
  fireEvent.click(field);
  expect(document.activeElement!.getAttribute("data-day")).toBe("2026-02-20");
  expect(screen.getByRole("dialog").textContent).toContain("fevereiro de 2026");
  const early = screen.getByRole("button", { name: /, 4 de fevereiro de 2026/ });
  expect(early.getAttribute("aria-disabled")).toBe("true");
  fireEvent.click(early);
  expect(change).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Next month" }));
  expect(screen.getByRole("dialog").textContent).toContain("março de 2026");
  expect((screen.getByRole("button", { name: "Next month" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
  expect((screen.getByRole("button", { name: "Previous month" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.keyDown(document.activeElement!, { key: "Enter" });
  expect(change).toHaveBeenLastCalledWith("2026-02-20");
  expect(screen.queryByRole("dialog")).toBeNull();
  fireEvent.click(field);
  // A day outside the limits isn't chosen, by key or by click.
  fireEvent.keyDown(document.activeElement!, { key: "PageUp" });
  expect(document.activeElement!.getAttribute("data-day")).toBe("2026-01-20");
  fireEvent.keyDown(document.activeElement!, { key: "Enter" });
  expect(change).toHaveBeenCalledOnce();
  fireEvent.pointerDown(screen.getByRole("dialog"));
  expect(screen.getByRole("dialog")).toBeDefined();
  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(field.textContent).toContain("Choose a day");
});

test("disabled, an error and any look", () => {
  render(<DatePicker label="Visit" disabled error="Pick a day." color="blue" state="hover" {...WORDS} />);
  const field = screen.getByRole("button", { name: /Visit/ }) as HTMLButtonElement;
  expect(field.disabled).toBe(true);
  expect(field.getAttribute("aria-invalid")).toBe("true");
  const box = field.closest("[data-field]")!;
  expect(box.getAttribute("data-color")).toBe("blue");
  expect(box.getAttribute("data-state")).toBe("hover");
});

test("a second press on the field closes it; an error alone turns it to the error color", () => {
  render(<DatePicker label="Visit" error="Pick a day." today="2026-02-20" {...WORDS} />);
  const field = screen.getByRole("button", { name: /Visit/ });
  expect(field.closest("[data-field]")!.getAttribute("data-color")).toBe("error");
  fireEvent.click(field);
  fireEvent.click(field);
  expect(screen.queryByRole("dialog")).toBeNull();
});

test("disabled alone shows as disabled", () => {
  render(<DatePicker label="Visit" disabled {...WORDS} />);
  expect(screen.getByRole("button", { name: /Visit/ }).closest("[data-field]")!.getAttribute("data-state")).toBe(
    "disabled",
  );
});
