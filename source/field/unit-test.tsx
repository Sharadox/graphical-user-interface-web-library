import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { Field } from "@sharadox/graphical-user-interface-web-library/field";

afterEach(cleanup);

test("a label for the control, and its hint and error describing it", () => {
  render(
    <Field label="Email" hint="We never share it." error="Enter an email.">
      {(control) => <input {...control} />}
    </Field>,
  );
  const input = screen.getByRole("textbox", { name: "Email" });
  expect(input.getAttribute("aria-invalid")).toBe("true");
  const described = input
    .getAttribute("aria-describedby")!
    .split(" ")
    .map((id) => document.getElementById(id)!.textContent);
  expect(described).toEqual(["We never share it.", "Enter an email."]);
  expect(screen.getByText("Enter an email.").getAttribute("data-color")).toBe("error");
});

test("without hint or error, nothing describes the control and it is valid", () => {
  const { container } = render(
    <Field label="Name" className="custom" id="given">
      {(control) => <input {...control} />}
    </Field>,
  );
  const input = screen.getByRole("textbox", { name: "Name" });
  expect(input.id).toBe("given");
  expect(input.hasAttribute("aria-describedby")).toBe(false);
  expect(input.hasAttribute("aria-invalid")).toBe(false);
  expect(container.firstElementChild!.className).toContain("custom");
});

test("a label can be visually hidden and still name the control", () => {
  render(
    <Field label="Search" hideLabel>
      {(control) => <input {...control} />}
    </Field>,
  );
  expect(screen.getByRole("textbox", { name: "Search" })).toBeDefined();
  expect(screen.getByText("Search").getAttribute("data-hidden")).toBe("");
});
