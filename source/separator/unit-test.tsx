import { join } from "node:path";
import { compile } from "sass";
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
  expect(rule.getAttribute("data-color")).toBe("index");
  expect(rule.className).toContain("custom");
});

test("a gradient color's separator is its gradient on a whole line, the flat border color on dotted and dashed ones", () => {
  const sheet = compile(join(process.cwd(), "source/separator/index.module.scss"), {
    loadPaths: [join(process.cwd(), "source")],
  }).css;
  expect(sheet).toMatch(
    /color-mix\(in srgb, transparent calc\(var\(--current-color-gradient-weight\) \* var\(--line-solid\)\), var\(--current-border-color\)\)/,
  );
  expect(sheet).toMatch(/background: var\(--current-transparent-color-gradient, none\) border-box/);
  expect(sheet).toMatch(/background-size: calc\(var\(--line-solid\) \* 100%\) calc\(var\(--line-solid\) \* 100%\)/);
});
