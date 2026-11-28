import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Select } from "@sharadox/graphical-user-interface-web-library/select";

afterEach(cleanup);
const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
];

test("a combobox named by its label, showing the placeholder, in a field box with a chevron", () => {
  render(<Select label="Month" placeholder="Choose a month" options={MONTHS} name="month" />);
  const select = screen.getByRole("combobox", { name: "Month" });
  expect(select.textContent).toContain("Choose a month");
  expect(select.getAttribute("aria-expanded")).toBe("false");
  const field = select.closest("[data-field]")!;
  expect(field.getAttribute("data-color")).toBe("index");
  expect(field.lastElementChild!.getAttribute("data-section")).toBe("suffix");
  expect((document.querySelector('input[name="month"]') as HTMLInputElement).value).toBe("");
});

test("opens on a click, chooses with a click, closes, and keeps the value for forms", () => {
  const change = vi.fn();
  render(<Select label="Month" options={MONTHS} name="month" onChange={change} />);
  const select = screen.getByRole("combobox", { name: "Month" });
  fireEvent.click(select);
  expect(select.getAttribute("aria-expanded")).toBe("true");
  const list = screen.getByRole("listbox", { name: "Month" });
  expect(list.getAttribute("data-variant")).toBe("outlined");
  fireEvent.pointerMove(screen.getByRole("option", { name: "March" }));
  fireEvent.click(screen.getByRole("option", { name: "March" }));
  expect(change).toHaveBeenLastCalledWith("3");
  expect(select.textContent).toContain("March");
  expect(screen.queryByRole("listbox")).toBeNull();
  expect((document.querySelector('input[name="month"]') as HTMLInputElement).value).toBe("3");
  fireEvent.click(select);
  expect(screen.getByRole("option", { name: "March" }).getAttribute("aria-selected")).toBe("true");
  fireEvent.click(select);
  expect(screen.queryByRole("listbox")).toBeNull();
});

test("the keyboard works as a native select's", () => {
  const change = vi.fn();
  render(<Select label="Month" options={MONTHS} defaultValue="2" onChange={change} />);
  const select = screen.getByRole("combobox", { name: "Month" });
  const active = () => document.getElementById(select.getAttribute("aria-activedescendant")!)!.textContent;
  fireEvent.keyDown(select, { key: "Tab" }); // closed: nothing
  fireEvent.keyDown(select, { key: "ArrowDown" });
  expect(active()).toBe("February");
  fireEvent.keyDown(select, { key: "ArrowDown" });
  expect(active()).toBe("March");
  fireEvent.keyDown(select, { key: "ArrowUp" });
  fireEvent.keyDown(select, { key: "ArrowUp" });
  fireEvent.keyDown(select, { key: "ArrowUp" });
  expect(active()).toBe("January");
  fireEvent.keyDown(select, { key: "End" });
  expect(active()).toBe("July");
  fireEvent.keyDown(select, { key: "ArrowDown" });
  expect(active()).toBe("July");
  fireEvent.keyDown(select, { key: "Home" });
  fireEvent.keyDown(select, { key: "j" });
  expect(active()).toBe("June");
  fireEvent.keyDown(select, { key: "x" }); // no option starts with x
  expect(active()).toBe("June");
  fireEvent.keyDown(select, { key: "Enter" });
  expect(change).toHaveBeenLastCalledWith("6");
  fireEvent.keyDown(select, { key: " " });
  fireEvent.keyDown(select, { key: "Escape" });
  expect(select.getAttribute("aria-expanded")).toBe("false");
  fireEvent.keyDown(select, { key: "Enter" });
  fireEvent.keyDown(select, { key: "ArrowDown" });
  fireEvent.keyDown(select, { key: "Tab" });
  expect(change).toHaveBeenLastCalledWith("7");
  fireEvent.keyDown(select, { key: "j" }); // closed: a letter chooses the next one starting with it
  expect(change).toHaveBeenLastCalledWith("1");
  fireEvent.keyDown(select, { key: "Shift" });
  expect(select.getAttribute("aria-expanded")).toBe("false");
});

test("a click outside closes it; controlled, disabled, an error and any look", () => {
  const { rerender } = render(<Select label="Month" options={MONTHS} value="7" onChange={() => {}} />);
  const select = screen.getByRole("combobox", { name: "Month" });
  expect(select.textContent).toContain("July");
  fireEvent.click(select);
  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole("listbox")).toBeNull();
  rerender(<Select label="Month" options={MONTHS} value="7" disabled error="Pick one." color="blue" state="hover" />);
  expect((select as HTMLButtonElement).disabled).toBe(true);
  fireEvent.keyDown(select, { key: "ArrowDown" });
  expect(select.getAttribute("aria-expanded")).toBe("false");
  const field = select.closest("[data-field]")!;
  expect(field.getAttribute("data-color")).toBe("blue");
  expect(field.getAttribute("data-state")).toBe("hover");
  expect(select.getAttribute("aria-invalid")).toBe("true");
});

test("controlled choices wait for the owner; a press inside keeps it open; an error colors it", () => {
  const change = vi.fn();
  render(<Select label="Month" options={MONTHS} value="1" onChange={change} error="Pick one." />);
  const select = screen.getByRole("combobox", { name: "Month" });
  expect(select.closest("[data-field]")!.getAttribute("data-color")).toBe("error");
  fireEvent.click(select);
  fireEvent.pointerDown(screen.getByRole("listbox"));
  expect(screen.getByRole("listbox")).toBeDefined();
  fireEvent.click(screen.getByRole("option", { name: "July" }));
  expect(change).toHaveBeenLastCalledWith("7");
  expect(select.textContent).toContain("January");
});

test("disabled alone, and other keys while open change nothing", () => {
  const { rerender } = render(<Select label="Month" options={MONTHS} />);
  const select = screen.getByRole("combobox", { name: "Month" });
  fireEvent.click(select);
  fireEvent.keyDown(select, { key: "Shift" });
  expect(select.getAttribute("aria-expanded")).toBe("true");
  rerender(<Select label="Month" options={MONTHS} disabled />);
  expect(select.closest("[data-field]")!.getAttribute("data-state")).toBe("disabled");
});
