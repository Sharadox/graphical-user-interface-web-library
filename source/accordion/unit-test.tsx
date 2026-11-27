import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Accordion } from "@sharadox/graphical-user-interface-web-library/accordion";

afterEach(cleanup);
const ITEMS = [
  { value: "one", title: "What is it?", content: <p>An answer.</p> },
  { value: "two", title: "How long?", content: <p>A week.</p> },
];

test("each title is a button that opens its region, one at a time by default", () => {
  const change = vi.fn();
  render(<Accordion items={ITEMS} onChange={change} />);
  const [one, two] = screen.getAllByRole("button");
  expect(one!.getAttribute("aria-expanded")).toBe("false");
  const region = document.getElementById(one!.getAttribute("aria-controls")!)!;
  expect(region.getAttribute("role")).toBe("region");
  expect(region.getAttribute("aria-labelledby")).toBe(one!.id);
  expect(region.hasAttribute("inert")).toBe(true);
  expect(region.getAttribute("data-open")).toBeNull();
  fireEvent.click(one!);
  expect(one!.getAttribute("aria-expanded")).toBe("true");
  expect(region.hasAttribute("inert")).toBe(false);
  expect(region.getAttribute("data-open")).toBe("");
  expect(change).toHaveBeenLastCalledWith(["one"]);
  fireEvent.click(two!);
  expect(one!.getAttribute("aria-expanded")).toBe("false");
  expect(change).toHaveBeenLastCalledWith(["two"]);
  fireEvent.click(two!);
  expect(change).toHaveBeenLastCalledWith([]);
});

test("several open at once when allowed, starting open when told; headings at a chosen level", () => {
  render(<Accordion items={ITEMS} multiple defaultOpen={["two"]} headingLevel={4} variant="filled" color="blue" />);
  const [one, two] = screen.getAllByRole("button");
  expect(two!.getAttribute("aria-expanded")).toBe("true");
  fireEvent.click(one!);
  expect(one!.getAttribute("aria-expanded")).toBe("true");
  expect(two!.getAttribute("aria-expanded")).toBe("true");
  expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(2);
  expect(one!.closest("[data-variant]")!.getAttribute("data-variant")).toBe("filled");
});

test("controlled: shows what it is given", () => {
  const change = vi.fn();
  render(<Accordion items={ITEMS} open={["one"]} onChange={change} />);
  const [one] = screen.getAllByRole("button");
  fireEvent.click(one!);
  expect(change).toHaveBeenLastCalledWith([]);
  expect(one!.getAttribute("aria-expanded")).toBe("true");
});
