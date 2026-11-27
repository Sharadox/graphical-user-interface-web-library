import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { Spinner } from "@sharadox/graphical-user-interface-web-library/spinner";

test("eight bars in a circle, each starting its fade one eighth later, hidden from screen readers", () => {
  const { container } = render(<Spinner className="custom" />);
  const spinner = container.firstElementChild!;
  expect(spinner.getAttribute("aria-hidden")).toBe("true");
  expect(spinner.getAttribute("data-spinner")).toBe("");
  expect(spinner.className).toContain("custom");
  const bars = [...spinner.children] as HTMLElement[];
  expect(bars).toHaveLength(8);
  expect(bars.map((bar) => bar.style.getPropertyValue("--spinner-bar"))).toEqual([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
  ]);
});
