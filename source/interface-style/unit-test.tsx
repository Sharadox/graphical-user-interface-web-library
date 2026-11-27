import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { defineInterface } from "@sharadox/graphical-user-interface-web-library/interface-configuration";
import { InterfaceStyle } from "@sharadox/graphical-user-interface-web-library/interface-style";
import { interfaceStyleSheet } from "@sharadox/graphical-user-interface-web-library/style-sheet";

test("writes the interface's whole style sheet into one style element", () => {
  const configuration = defineInterface({ colors: { brand: { of: "blue" } } });
  const { container } = render(<InterfaceStyle configuration={configuration} />);
  const style = container.querySelector("style")!;
  expect(style.textContent).toBe(interfaceStyleSheet(configuration));
  expect(style.getAttribute("data-interface-style")).toBe("");
});
