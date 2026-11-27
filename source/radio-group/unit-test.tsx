import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { RadioGroup } from "@sharadox/graphical-user-interface-web-library/radio-group";

afterEach(cleanup);
const OPTIONS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];
const mark = (input: HTMLElement) => input.parentElement!.querySelector("[data-square]")!;

test("a group of native radios under its legend, sharing one name, round by default", () => {
  const change = vi.fn();
  render(<RadioGroup label="Contact" name="contact" options={OPTIONS} defaultValue="email" onChange={change} />);
  const group = screen.getByRole("radiogroup", { name: "Contact" });
  const [email, phone] = screen.getAllByRole("radio") as HTMLInputElement[];
  expect(group.contains(email!)).toBe(true);
  expect(email!.name).toBe("contact");
  expect(phone!.name).toBe("contact");
  expect(email!.checked).toBe(true);
  expect(mark(email!).getAttribute("data-variant")).toBe("filled");
  expect(mark(email!).getAttribute("data-style-corner")).toBe("circle");
  fireEvent.click(phone!);
  expect(change).toHaveBeenLastCalledWith("phone");
  expect(mark(phone!).getAttribute("data-variant")).toBe("filled");
  expect(mark(email!).getAttribute("data-variant")).toBe("outlined");
});

test("controlled, disabled, an error, and any look", () => {
  const change = vi.fn();
  render(
    <RadioGroup
      label="Plan"
      options={OPTIONS}
      value="phone"
      onChange={change}
      disabled
      error="Choose one."
      color="blue"
      size="medium"
      state="hover"
    />,
  );
  const [email, phone] = screen.getAllByRole("radio") as HTMLInputElement[];
  expect(phone!.checked).toBe(true);
  expect(email!.disabled).toBe(true);
  email!.disabled = false;
  fireEvent.click(email!);
  expect(change).toHaveBeenLastCalledWith("email");
  expect(phone!.checked).toBe(true);
  expect(mark(email!).getAttribute("data-state")).toBe("hover");
  expect(mark(email!).getAttribute("data-color")).toBe("blue");
  expect(screen.getByText("Choose one.").getAttribute("data-color")).toBe("error");
  expect(screen.getByRole("radiogroup").getAttribute("aria-invalid")).toBe("true");
});
