import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Switch } from "@sharadox/graphical-user-interface-web-library/switch";

afterEach(cleanup);
const track = (control: HTMLElement) => control.querySelector("[data-variant]")!;

test("a switch named by its label: off and outlined, then on and filled", () => {
  const change = vi.fn();
  render(<Switch label="Notifications" onChange={change} />);
  const control = screen.getByRole("switch", { name: "Notifications" });
  expect(control.tagName).toBe("BUTTON");
  expect(control.getAttribute("aria-checked")).toBe("false");
  expect(track(control).getAttribute("data-variant")).toBe("outlined");
  expect(track(control).getAttribute("data-style-corner")).toBe("circle");
  expect(track(control).getAttribute("data-color")).toBe("index");
  expect(track(control).getAttribute("data-size")).toBe("medium");
  fireEvent.click(control);
  expect(control.getAttribute("aria-checked")).toBe("true");
  expect(track(control).getAttribute("data-variant")).toBe("filled");
  expect(change).toHaveBeenLastCalledWith(true);
});

test("flips at once, busy until the change answers, and flips back when refused", async () => {
  let answer: (accepted: boolean) => void = () => {};
  const change = vi.fn(() => new Promise<boolean>((resolve) => (answer = resolve)));
  render(<Switch label="Public" onChange={change} />);
  const control = screen.getByRole("switch", { name: "Public" });
  fireEvent.click(control);
  expect(control.getAttribute("aria-checked")).toBe("true");
  expect(control.getAttribute("aria-busy")).toBe("true");
  fireEvent.click(control); // ignored while busy
  expect(change).toHaveBeenCalledOnce();
  await act(async () => answer(false));
  expect(control.getAttribute("aria-checked")).toBe("false");
  expect(control.hasAttribute("aria-busy")).toBe(false);
  fireEvent.click(control);
  await act(async () => answer(true));
  expect(control.getAttribute("aria-checked")).toBe("true");
});

test("controlled, starting on, disabled, or any look and forced state", () => {
  const { rerender } = render(<Switch label="A" checked onChange={() => {}} />);
  const control = screen.getByRole("switch", { name: "A" });
  expect(control.getAttribute("aria-checked")).toBe("true");
  rerender(<Switch label="A" checked={false} onChange={() => {}} />);
  expect(control.getAttribute("aria-checked")).toBe("false");
  fireEvent.click(control); // the owner keeps it off
  expect(control.getAttribute("aria-checked")).toBe("false");
  cleanup();
  render(<Switch label="B" defaultChecked disabled color="green" size="large" />);
  const other = screen.getByRole("switch", { name: "B" }) as HTMLButtonElement;
  expect(other.getAttribute("aria-checked")).toBe("true");
  expect(other.disabled).toBe(true);
  expect(track(other).getAttribute("data-state")).toBe("disabled");
  expect(track(other).getAttribute("data-color")).toBe("green");
  cleanup();
  render(<Switch label="C" state="hover" />);
  expect(track(screen.getByRole("switch")).getAttribute("data-state")).toBe("hover");
});

test("controlled and answering later, it shows the new value until the owner passes it", async () => {
  const change = vi.fn(async () => true);
  const { rerender } = render(<Switch label="Sync" checked={false} onChange={change} />);
  const control = screen.getByRole("switch", { name: "Sync" });
  await act(async () => fireEvent.click(control));
  expect(change).toHaveBeenLastCalledWith(true);
  rerender(<Switch label="Sync" checked onChange={change} />);
  expect(control.getAttribute("aria-checked")).toBe("true");
});
