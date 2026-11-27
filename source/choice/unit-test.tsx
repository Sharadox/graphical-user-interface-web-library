import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Choice } from "@sharadox/graphical-user-interface-web-library/choice";

afterEach(cleanup);
const OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

test("a radio group: the chosen option checked, filled and the only one in the tab order", () => {
  render(<Choice label="Size" options={OPTIONS} value="medium" onChange={() => {}} />);
  expect(screen.getByRole("radiogroup", { name: "Size" })).toBeDefined();
  const radios = screen.getAllByRole("radio");
  expect(radios.map((radio) => radio.getAttribute("aria-checked"))).toEqual(["false", "true", "false"]);
  expect(radios.map((radio) => radio.getAttribute("data-variant"))).toEqual(["transparent", "filled", "transparent"]);
  expect(radios.map((radio) => radio.tabIndex)).toEqual([-1, 0, -1]);
});

test("a click chooses; arrow keys move and choose, wrapping around, Home and End jump", () => {
  const change = vi.fn();
  const { rerender } = render(<Choice label="Size" options={OPTIONS} value="medium" onChange={change} />);
  fireEvent.click(screen.getByRole("radio", { name: "Large" }));
  expect(change).toHaveBeenLastCalledWith("large");
  const medium = screen.getByRole("radio", { name: "Medium" });
  fireEvent.keyDown(medium, { key: "ArrowRight" });
  expect(change).toHaveBeenLastCalledWith("large");
  expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Large" }));
  fireEvent.keyDown(medium, { key: "ArrowLeft" });
  expect(change).toHaveBeenLastCalledWith("small");
  fireEvent.keyDown(medium, { key: "ArrowDown" });
  expect(change).toHaveBeenLastCalledWith("large");
  fireEvent.keyDown(medium, { key: "ArrowUp" });
  expect(change).toHaveBeenLastCalledWith("small");
  rerender(<Choice label="Size" options={OPTIONS} value="large" onChange={change} />);
  fireEvent.keyDown(screen.getByRole("radio", { name: "Large" }), { key: "ArrowRight" });
  expect(change).toHaveBeenLastCalledWith("small");
  fireEvent.keyDown(screen.getByRole("radio", { name: "Large" }), { key: "Home" });
  expect(change).toHaveBeenLastCalledWith("small");
  fireEvent.keyDown(screen.getByRole("radio", { name: "Large" }), { key: "End" });
  expect(change).toHaveBeenLastCalledWith("large");
  change.mockClear();
  fireEvent.keyDown(screen.getByRole("radio", { name: "Large" }), { key: "a" });
  expect(change).not.toHaveBeenCalled();
});

test("with no option chosen the first takes the tab; size, color and a class pass through", () => {
  const { container } = render(
    <Choice label="Size" options={OPTIONS} value="" onChange={() => {}} size="small" color="red" className="custom" />,
  );
  expect(screen.getAllByRole("radio").map((radio) => radio.tabIndex)).toEqual([0, -1, -1]);
  expect(screen.getAllByRole("radio")[0]!.getAttribute("data-size")).toBe("small");
  expect(screen.getAllByRole("radio")[0]!.getAttribute("data-color")).toBe("red");
  expect(container.firstElementChild!.className).toContain("custom");
});
