import { expect, test } from "vitest";
import { defineInterface } from "@sharadox/graphical-user-interface-web-library/interface-configuration";
import { interfaceStyles } from "@sharadox/graphical-user-interface-web-library/interface-styles";

test("the interface's color, corner and line styles as remembered style groups, inherit being the device's", () => {
  const styles = interfaceStyles(defineInterface());
  expect(styles.groups).toEqual([
    {
      name: "color",
      defaultChoice: "system",
      systemDefaults: { light: "white", dark: "black" },
      options: [
        { name: "white", scheme: "light", palette: {} },
        { name: "black", scheme: "dark", palette: {} },
      ],
    },
    {
      name: "corner",
      defaultChoice: "rounded-square",
      options: [
        { name: "square", palette: {} },
        { name: "rounded-square", palette: {} },
        { name: "circle", palette: {} },
      ],
    },
    {
      name: "line",
      defaultChoice: "line",
      options: [
        { name: "line", palette: {} },
        { name: "dotted", palette: {} },
        { name: "dashed", palette: {} },
      ],
    },
  ]);
});

test("a fixed starting color style starts there", () => {
  expect(interfaceStyles(defineInterface({ defaultColorStyle: "black" })).groups[0]!.defaultChoice).toBe("black");
});
