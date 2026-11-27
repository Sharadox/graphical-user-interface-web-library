import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { defineInterface } from "@sharadox/graphical-user-interface-web-library/interface-configuration";
import { interfaceStyles } from "@sharadox/graphical-user-interface-web-library/interface-styles";
import { StyleSwitch } from "@sharadox/graphical-user-interface-web-library/style-switch";

afterEach(cleanup);
const STYLES = interfaceStyles(defineInterface());
const LABELS = { system: "Inherit", white: "White", black: "Black" };

test("one radio per choice in the style library's order, the current one checked and filled", () => {
  render(<StyleSwitch configuration={STYLES} group="color" label="Color" labels={LABELS} />);
  const group = screen.getByRole("radiogroup", { name: "Color" });
  const radios = screen.getAllByRole("radio");
  expect(group.contains(radios[0]!)).toBe(true);
  expect(radios.map((radio) => radio.textContent)).toEqual(["White", "Inherit", "Black"]);
  expect(radios.map((radio) => radio.getAttribute("aria-checked"))).toEqual(["false", "true", "false"]);
  expect(radios.map((radio) => radio.getAttribute("data-variant"))).toEqual(["transparent", "filled", "transparent"]);
});

test("choosing applies the style to the page and remembers it", async () => {
  render(<StyleSwitch configuration={STYLES} group="color" label="Color" labels={LABELS} size="small" />);
  fireEvent.click(screen.getByRole("radio", { name: "Black" }));
  expect(document.documentElement.getAttribute("data-style-color")).toBe("black");
  expect(localStorage.getItem("style-color")).toBe("black");
  await waitFor(() => expect(screen.getByRole("radio", { name: "Black" }).getAttribute("aria-checked")).toBe("true"));
  expect(screen.getByRole("radio", { name: "Black" }).getAttribute("data-size")).toBe("small");
});

test("a choice without a label shows its name", () => {
  render(<StyleSwitch configuration={STYLES} group="corner" label="Corner" />);
  expect(screen.getAllByRole("radio").map((radio) => radio.textContent)).toEqual([
    "square",
    "rounded-square",
    "circle",
  ]);
});
