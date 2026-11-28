import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Checkbox } from "@sharadox/graphical-user-interface-web-library/checkbox";

afterEach(cleanup);
const mark = (input: HTMLElement) => input.parentElement!.querySelector("[data-square]")!;

test("a native checkbox named by its label, drawn outlined, then filled once checked", () => {
  const change = vi.fn();
  render(<Checkbox label="Remember me" name="remember" onChange={change} />);
  const input = screen.getByRole("checkbox", { name: "Remember me" }) as HTMLInputElement;
  expect(input.getAttribute("name")).toBe("remember");
  expect(mark(input).getAttribute("data-variant")).toBe("outlined");
  expect(mark(input).getAttribute("data-color")).toBe("index");
  expect(mark(input).getAttribute("data-size")).toBe("medium");
  fireEvent.click(input);
  expect(input.checked).toBe(true);
  expect(change).toHaveBeenLastCalledWith(true);
  expect(mark(input).getAttribute("data-variant")).toBe("filled");
});

test("controlled: shows what it is given and asks to change", () => {
  const change = vi.fn();
  render(<Checkbox label="Terms" checked onChange={change} />);
  const input = screen.getByRole("checkbox", { name: "Terms" }) as HTMLInputElement;
  expect(input.checked).toBe(true);
  fireEvent.click(input);
  expect(change).toHaveBeenLastCalledWith(false);
  expect(mark(input).getAttribute("data-variant")).toBe("filled");
});

test("starts checked when told, and disabled or any forced state shows on the mark", () => {
  render(<Checkbox label="A" defaultChecked disabled color="red" size="large" corner="circle" />);
  const input = screen.getByRole("checkbox", { name: "A" }) as HTMLInputElement;
  expect(input.checked).toBe(true);
  expect(input.disabled).toBe(true);
  expect(mark(input).getAttribute("data-state")).toBe("disabled");
  expect(mark(input).getAttribute("data-color")).toBe("red");
  expect(mark(input).getAttribute("data-style-corner")).toBe("circle");
  cleanup();
  render(<Checkbox label="B" state="hover" />);
  expect(mark(screen.getByRole("checkbox")).getAttribute("data-state")).toBe("hover");
});
