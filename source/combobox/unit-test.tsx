import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Combobox, matches } from "@sharadox/graphical-user-interface-web-library/combobox";

afterEach(cleanup);
const CITIES = [
  { value: "faro", label: "Faro" },
  { value: "loule", label: "Loulé" },
  { value: "lagos", label: "Lagos" },
  { value: "olhao", label: "Olhão" },
];

test("matches ignore case and accents, anywhere in the words", () => {
  expect(matches("Loulé", "loule")).toBe(true);
  expect(matches("Olhão", "HAO")).toBe(true);
  expect(matches("Faro", "x")).toBe(false);
  expect(matches("Faro", "")).toBe(true);
});

test("typing filters the options, a click chooses and fills the input", () => {
  const change = vi.fn();
  render(<Combobox label="City" options={CITIES} name="city" onChange={change} placeholder="Type a city" />);
  const input = screen.getByRole("combobox", { name: "City" }) as HTMLInputElement;
  expect(input.getAttribute("aria-autocomplete")).toBe("list");
  expect(input.placeholder).toBe("Type a city");
  fireEvent.change(input, { target: { value: "l" } });
  expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["Loulé", "Lagos", "Olhão"]);
  fireEvent.click(screen.getByRole("option", { name: "Olhão" }));
  expect(change).toHaveBeenLastCalledWith("olhao");
  expect(input.value).toBe("Olhão");
  expect((document.querySelector('input[name="city"]') as HTMLInputElement).value).toBe("olhao");
  expect(screen.queryByRole("listbox")).toBeNull();
});

test("the keyboard moves, chooses and closes; nothing found says so", () => {
  const change = vi.fn();
  render(<Combobox label="City" options={CITIES} onChange={change} empty="No city found." />);
  const input = screen.getByRole("combobox", { name: "City" }) as HTMLInputElement;
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(input.getAttribute("aria-expanded")).toBe("true");
  const active = () => document.getElementById(input.getAttribute("aria-activedescendant")!)!.textContent;
  expect(active()).toBe("Faro");
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "ArrowUp" });
  fireEvent.keyDown(input, { key: "ArrowUp" });
  expect(active()).toBe("Faro");
  fireEvent.keyDown(input, { key: "End" });
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(active()).toBe("Olhão");
  fireEvent.keyDown(input, { key: "Home" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(change).toHaveBeenLastCalledWith("faro");
  fireEvent.keyDown(input, { key: "a" });
  fireEvent.change(input, { target: { value: "zzz" } });
  expect(screen.getByText("No city found.")).toBeDefined();
  fireEvent.keyDown(input, { key: "Enter" }); // nothing to choose
  expect(change).toHaveBeenCalledOnce();
  fireEvent.keyDown(input, { key: "Escape" });
  expect(input.getAttribute("aria-expanded")).toBe("false");
  expect(input.value).toBe("Faro");
});

test("focus opens it, a click outside closes it; controlled, disabled and any look", () => {
  const { rerender } = render(<Combobox label="City" options={CITIES} value="lagos" onChange={() => {}} />);
  const input = screen.getByRole("combobox", { name: "City" }) as HTMLInputElement;
  expect(input.value).toBe("Lagos");
  fireEvent.focus(input);
  expect(screen.getAllByRole("option")).toHaveLength(4);
  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole("listbox")).toBeNull();
  rerender(
    <Combobox
      label="City"
      options={CITIES}
      value="lagos"
      onChange={() => {}}
      disabled
      color="red"
      state="active"
      error="No."
    />,
  );
  expect(input.disabled).toBe(true);
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: "ArrowDown" });
  expect(screen.queryByRole("listbox")).toBeNull();
  const field = input.closest("[data-field]")!;
  expect(field.getAttribute("data-color")).toBe("red");
  expect(field.getAttribute("data-state")).toBe("active");
});

test("controlled choices wait for the owner; a press inside keeps it open; an error colors it", () => {
  const change = vi.fn();
  render(<Combobox label="City" options={CITIES} value="faro" onChange={change} error="No." />);
  const input = screen.getByRole("combobox", { name: "City" }) as HTMLInputElement;
  expect(input.closest("[data-field]")!.getAttribute("data-color")).toBe("error");
  fireEvent.keyDown(input, { key: "Enter" }); // closed: nothing
  fireEvent.keyDown(input, { key: "ArrowUp" });
  fireEvent.pointerDown(screen.getByRole("listbox"));
  expect(screen.getByRole("listbox")).toBeDefined();
  fireEvent.click(screen.getByRole("option", { name: "Lagos" }));
  expect(change).toHaveBeenLastCalledWith("lagos");
  fireEvent.change(input, { target: { value: "q" } });
  expect(input.hasAttribute("aria-activedescendant")).toBe(false);
  expect(screen.getAllByRole("listbox")[0]!.children).toHaveLength(0);
});

test("disabled alone, and other keys while open change nothing", () => {
  const { rerender } = render(<Combobox label="City" options={CITIES} />);
  const input = screen.getByRole("combobox", { name: "City" });
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Shift" });
  expect(input.getAttribute("aria-expanded")).toBe("true");
  rerender(<Combobox label="City" options={CITIES} disabled />);
  expect(input.closest("[data-field]")!.getAttribute("data-state")).toBe("disabled");
});
