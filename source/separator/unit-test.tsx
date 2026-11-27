import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { Separator } from "@sharadox/graphical-user-interface-web-library/separator";

afterEach(cleanup);

test("a horizontal rule by default, in the line style and a color", () => {
  render(<Separator line="dashed" color="red" />);
  const rule = screen.getByRole("separator");
  expect(rule.tagName).toBe("HR");
  expect(rule.getAttribute("aria-orientation")).toBeNull();
  expect(rule.getAttribute("data-style-line")).toBe("dashed");
  expect(rule.getAttribute("data-color")).toBe("red");
});

test("vertical, between items in a row", () => {
  render(<Separator orientation="vertical" className="custom" />);
  const rule = screen.getByRole("separator");
  expect(rule.getAttribute("aria-orientation")).toBe("vertical");
  expect(rule.getAttribute("data-orientation")).toBe("vertical");
  expect(rule.getAttribute("data-color")).toBe("foreground");
  expect(rule.className).toContain("custom");
});
