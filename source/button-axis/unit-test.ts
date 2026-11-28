import { expect, test } from "vitest";
import { BUTTON_AXES } from "@sharadox/graphical-user-interface-web-library/button-axis";

test("lists every value the design system shows a button in", () => {
  expect(BUTTON_AXES.variant).toEqual(["filled", "outlined", "transparent", "inline"]);
  expect(BUTTON_AXES.state).toEqual(["index", "enabled", "hover", "active", "loading", "disabled"]);
  expect(BUTTON_AXES.size).toEqual(["small", "medium", "large"]);
});
