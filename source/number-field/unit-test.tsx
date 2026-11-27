import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { NumberField } from "@sharadox/graphical-user-interface-web-library/number-field";

afterEach(cleanup);

test("a number input between a minus and a plus button, each its own section", () => {
  const change = vi.fn();
  render(
    <NumberField
      label="Guests"
      name="guests"
      defaultValue={2}
      min={1}
      max={4}
      onChange={change}
      decreaseLabel="Fewer"
      increaseLabel="More"
    />,
  );
  const input = screen.getByRole("spinbutton", { name: "Guests" }) as HTMLInputElement;
  expect(input.value).toBe("2");
  const field = input.closest("[data-field]")!;
  expect([...field.children].map((section) => section.getAttribute("data-section"))).toEqual([
    "prefix",
    "content",
    "suffix",
  ]);
  fireEvent.click(screen.getByRole("button", { name: "More" }));
  fireEvent.click(screen.getByRole("button", { name: "More" }));
  expect(input.value).toBe("4");
  expect(change).toHaveBeenLastCalledWith(4);
  expect((screen.getByRole("button", { name: "More" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Fewer" }));
  expect(input.value).toBe("3");
});

test("typing sets the value, kept within the limits on leaving; steps and empties", () => {
  const change = vi.fn();
  render(
    <NumberField
      label="Price"
      step={0.5}
      min={0}
      max={10}
      onChange={change}
      decreaseLabel="Less"
      increaseLabel="More"
    />,
  );
  const input = screen.getByRole("spinbutton", { name: "Price" }) as HTMLInputElement;
  expect(input.value).toBe("");
  fireEvent.click(screen.getByRole("button", { name: "More" }));
  expect(input.value).toBe("0.5");
  fireEvent.change(input, { target: { value: "12" } });
  expect(change).toHaveBeenLastCalledWith(12);
  fireEvent.blur(input);
  expect(input.value).toBe("10");
  expect(change).toHaveBeenLastCalledWith(10);
  fireEvent.change(input, { target: { value: "" } });
  expect(change).toHaveBeenLastCalledWith(undefined);
  fireEvent.blur(input);
  expect(input.value).toBe("");
  fireEvent.click(screen.getByRole("button", { name: "Less" }));
  expect(input.value).toBe("0");
  expect((screen.getByRole("button", { name: "Less" }) as HTMLButtonElement).disabled).toBe(true);
});

test("controlled, unlimited, disabled and any look", () => {
  const change = vi.fn();
  const { rerender } = render(
    <NumberField label="Count" value={5} onChange={change} decreaseLabel="Less" increaseLabel="More" />,
  );
  const input = screen.getByRole("spinbutton", { name: "Count" }) as HTMLInputElement;
  fireEvent.click(screen.getByRole("button", { name: "Less" }));
  expect(change).toHaveBeenLastCalledWith(4);
  expect(input.value).toBe("5");
  fireEvent.blur(input);
  rerender(
    <NumberField
      label="Count"
      value={-3}
      onChange={change}
      disabled
      color="green"
      size="large"
      decreaseLabel="Less"
      increaseLabel="More"
    />,
  );
  expect(input.value).toBe("-3");
  expect(input.disabled).toBe(true);
  expect((screen.getByRole("button", { name: "More" }) as HTMLButtonElement).disabled).toBe(true);
  expect(input.closest("[data-field]")!.getAttribute("data-color")).toBe("green");
});

test("without limits the buttons never stop; an error colors it; leaving inside the limits changes nothing", () => {
  const change = vi.fn();
  render(
    <NumberField
      label="Score"
      defaultValue={0}
      onChange={change}
      error="Too low."
      variant="filled"
      decreaseLabel="Less"
      increaseLabel="More"
    />,
  );
  const input = screen.getByRole("spinbutton", { name: "Score" }) as HTMLInputElement;
  expect(input.closest("[data-field]")!.getAttribute("data-color")).toBe("error");
  fireEvent.click(screen.getByRole("button", { name: "Less" }));
  expect(input.value).toBe("-1");
  expect((screen.getByRole("button", { name: "Less" }) as HTMLButtonElement).disabled).toBe(false);
  change.mockClear();
  fireEvent.blur(input);
  expect(change).not.toHaveBeenCalled();
});

test("the field's buttons take its color when one is given", () => {
  render(<NumberField label="N" color="blue" decreaseLabel="Less" increaseLabel="More" />);
  expect(screen.getByRole("button", { name: "More" }).getAttribute("data-color")).toBe("blue");
});

test("works with no one listening, and typing in a controlled field asks the owner", () => {
  const change = vi.fn();
  const { rerender } = render(<NumberField label="Free" decreaseLabel="Less" increaseLabel="More" />);
  fireEvent.click(screen.getByRole("button", { name: "More" }));
  const input = screen.getByRole("spinbutton", { name: "Free" }) as HTMLInputElement;
  fireEvent.change(input, { target: { value: "7" } });
  expect(input.value).toBe("7");
  rerender(<NumberField label="Free" value={3} onChange={change} decreaseLabel="Less" increaseLabel="More" />);
  fireEvent.change(input, { target: { value: "8" } });
  expect(change).toHaveBeenLastCalledWith(8);
  expect(input.value).toBe("3");
});
