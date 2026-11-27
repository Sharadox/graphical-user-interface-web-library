import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { TextField } from "@sharadox/graphical-user-interface-web-library/text-field";

afterEach(cleanup);
const box = (control: HTMLElement) => control.closest("[data-field]")!;

test("an input named by its label, in an outlined middleground field box", () => {
  const change = vi.fn();
  render(<TextField label="Name" name="name" placeholder="Your name" onChange={change} />);
  const input = screen.getByRole("textbox", { name: "Name" });
  expect(input.tagName).toBe("INPUT");
  expect(input.getAttribute("name")).toBe("name");
  expect(input.getAttribute("placeholder")).toBe("Your name");
  expect(box(input).getAttribute("data-variant")).toBe("outlined");
  expect(box(input).getAttribute("data-color")).toBe("middleground");
  expect(box(input).getAttribute("data-state")).toBe("enabled");
  fireEvent.change(input, { target: { value: "Ana" } });
  expect(change).toHaveBeenCalledOnce();
});

test("a prefix and a suffix are sections of their own", () => {
  render(<TextField label="Price" prefix="€" suffix=".00" type="number" />);
  const field = box(screen.getByRole("spinbutton", { name: "Price" }));
  expect([...field.children].map((section) => section.textContent)).toEqual(["€", "", ".00"]);
});

test("an error turns the field to the error color and describes the input", () => {
  render(<TextField label="Email" error="Enter an email." hint="We never share it." />);
  const input = screen.getByRole("textbox", { name: "Email" });
  expect(box(input).getAttribute("data-color")).toBe("error");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.getAttribute("aria-describedby")!.split(" ")).toHaveLength(2);
});

test("disabled, or any forced state, and every look passes to the field box", () => {
  render(
    <TextField
      label="Code"
      disabled
      variant="filled"
      color="blue"
      size="large"
      corner="circle"
      line="dashed"
      colorStyle="black"
    />,
  );
  const input = screen.getByRole("textbox", { name: "Code" }) as HTMLInputElement;
  expect(input.disabled).toBe(true);
  const field = box(input);
  expect(field.getAttribute("data-state")).toBe("disabled");
  for (const [name, value] of [
    ["data-variant", "filled"],
    ["data-color", "blue"],
    ["data-size", "large"],
    ["data-style-corner", "circle"],
    ["data-style-line", "dashed"],
    ["data-style-color", "black"],
  ] as const)
    expect(field.getAttribute(name)).toBe(value);
  cleanup();
  render(<TextField label="Code" state="hover" />);
  expect(box(screen.getByRole("textbox")).getAttribute("data-state")).toBe("hover");
});

test("multiline, it is a text area with its rows", () => {
  render(<TextField label="Message" multiline rows={6} defaultValue="Hello" />);
  const area = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
  expect(area.tagName).toBe("TEXTAREA");
  expect(area.getAttribute("rows")).toBe("6");
  expect(area.value).toBe("Hello");
  expect(box(area).getAttribute("data-multiline")).toBe("");
});
