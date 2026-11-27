import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Listbox } from "@sharadox/graphical-user-interface-web-library/listbox";

afterEach(cleanup);
const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

test("options with ids for the field, the chosen one selected, the active one lit", () => {
  const active = vi.fn();
  const choose = vi.fn();
  render(
    <Listbox
      id="list"
      labelledBy="label"
      options={OPTIONS}
      chosen="b"
      active={0}
      onActive={active}
      onChoose={choose}
    />,
  );
  const options = screen.getAllByRole("option");
  expect(options.map((option) => option.id)).toEqual(["list-0", "list-1"]);
  expect(options[1]!.getAttribute("aria-selected")).toBe("true");
  expect(options[0]!.hasAttribute("data-active")).toBe(true);
  fireEvent.pointerMove(options[1]!);
  expect(active).toHaveBeenLastCalledWith(1);
  // Pressing an option keeps the focus on the field.
  expect(fireEvent.pointerDown(options[1]!)).toBe(false);
  fireEvent.click(options[1]!);
  expect(choose).toHaveBeenLastCalledWith(1);
});

test("an empty list says so when told what to say", () => {
  render(
    <Listbox
      id="list"
      labelledBy="label"
      options={[]}
      chosen=""
      active={0}
      onActive={() => {}}
      onChoose={() => {}}
      empty="Nothing."
    />,
  );
  expect(screen.getByText("Nothing.")).toBeDefined();
});
