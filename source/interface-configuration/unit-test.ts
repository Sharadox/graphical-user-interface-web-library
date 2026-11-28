import { expect, test } from "vitest";
import {
  DEFAULT_INTERFACE,
  defineInterface,
  isReference,
} from "@sharadox/graphical-user-interface-web-library/interface-configuration";

test("the defaults hold the owner's colors, styles, scale and breakpoints", () => {
  expect(Object.keys(DEFAULT_INTERFACE.colorStyles)).toEqual(["white", "black"]);
  expect(DEFAULT_INTERFACE.defaultColorStyle).toBe("inherit");
  expect(DEFAULT_INTERFACE.inheritColorStyles).toEqual({ light: "white", dark: "black" });
  expect(DEFAULT_INTERFACE.colors.black).toEqual({ rgb: { white: "0 0 0", black: "0 0 0" }, on: "white" });
  expect(DEFAULT_INTERFACE.colors.white).toEqual({ rgb: { white: "255 255 255", black: "255 255 255" }, on: "black" });
  expect(DEFAULT_INTERFACE.colors.cyan).toMatchObject({ rgb: { black: "0 255 255" } });
  expect(DEFAULT_INTERFACE.colors.magenta).toMatchObject({ rgb: { black: "255 0 255" } });
  expect(DEFAULT_INTERFACE.colors.middleground).toEqual({
    rgb: { white: "94 94 94", black: "161 161 161" },
    transparent: "foreground",
    hover: "foreground",
    filledHover: "foreground",
  });
  // The rainbow paints with the six hues; its flat color (icons, focus rings, dashed borders) is foreground's.
  expect(DEFAULT_INTERFACE.colors.rainbow).toEqual({
    of: "foreground",
    on: "foreground",
    gradient: ["red", "yellow", "green", "cyan", "blue", "magenta"],
  });
  expect(DEFAULT_INTERFACE.colors.foreground).toEqual({ of: { white: "black", black: "white" }, on: "background" });
  expect(DEFAULT_INTERFACE.colors.background).toEqual({ of: { white: "white", black: "black" } });
  expect(DEFAULT_INTERFACE.colors.brand).toEqual({ of: "foreground", on: "background" });
  expect(DEFAULT_INTERFACE.colors.information).toEqual({ of: "blue" });
  expect(DEFAULT_INTERFACE.colors.success).toEqual({ of: "green" });
  expect(DEFAULT_INTERFACE.colors.warn).toEqual({ of: "yellow" });
  expect(DEFAULT_INTERFACE.colors.error).toEqual({ of: "red" });
  expect(DEFAULT_INTERFACE.cornerStyles).toEqual({ square: "0px", "rounded-square": "4px", circle: "10000px" });
  expect(DEFAULT_INTERFACE.defaultCornerStyle).toBe("rounded-square");
  expect(DEFAULT_INTERFACE.lineStyles).toEqual({ line: "solid", dotted: "dotted", dashed: "dashed" });
  expect(DEFAULT_INTERFACE.defaultLineStyle).toBe("line");
  expect(DEFAULT_INTERFACE.scale).toEqual([0, 4, 8, 12, 14, 16, 24, 32, 64, 128]);
  expect(DEFAULT_INTERFACE.breakpoints).toEqual([640, 960, 1280]);
  expect(DEFAULT_INTERFACE.defaultSize).toBe("medium");
  expect(DEFAULT_INTERFACE.sizes.small).toMatchObject({
    "minimum-size": "var(--scale-16)",
    "font-size": "var(--scale-12)",
  });
  expect(DEFAULT_INTERFACE.sizes.medium).toMatchObject({
    "minimum-size": "var(--scale-32)",
    "font-size": "var(--scale-14)",
  });
  expect(DEFAULT_INTERFACE.sizes.large).toMatchObject({ "minimum-size": "48px", "font-size": "var(--scale-16)" });
  expect(DEFAULT_INTERFACE.values).toMatchObject({
    "color-rgb-alpha": "100%",
    "transparent-color-rgb-alpha": "12.5%",
    "transparent-hover-color-rgb-alpha": "var(--transparent-color-rgb-alpha)",
    "transparent-active-color-rgb-alpha": "var(--transparent-hover-color-rgb-alpha)",
    "disabled-opacity": "50%",
    "line-thickness": "1px",
    "quick-duration": "0.1s",
    duration: "0.25s",
    "wrapper-width": "1280px",
    "wrapper-padding": "var(--scale-16)",
    "gradient-angle": "90deg",
    "glow-range": "var(--scale-128)",
    "glow-spread": "var(--scale-32)",
    "glow-radius": "var(--scale-64)",
    "glow-opacity": "50%",
  });
});

test("tells references from constant colors", () => {
  expect(isReference({ of: "blue" })).toBe(true);
  expect(isReference({ rgb: { white: "0 0 0" } })).toBe(false);
});

test("a brand overrides and adds to the defaults, one level deep, without changing them", () => {
  const brand = defineInterface({
    colors: { gold: { rgb: { white: "180 140 60", black: "212 175 90" } }, brand: { of: "gold" } },
    defaultCornerStyle: "circle",
    inheritColorStyles: { light: "black" },
    values: { "transparent-color-rgb-alpha": "20%" },
    sizes: { small: { "minimum-size": "24px" } },
  });
  expect(brand.colors.gold).toEqual({ rgb: { white: "180 140 60", black: "212 175 90" } });
  expect(brand.colors.brand).toEqual({ of: "gold" });
  expect(brand.colors.red).toEqual(DEFAULT_INTERFACE.colors.red);
  expect(brand.defaultCornerStyle).toBe("circle");
  expect(brand.inheritColorStyles).toEqual({ light: "black", dark: "black" });
  expect(brand.values["transparent-color-rgb-alpha"]).toBe("20%");
  expect(brand.values["disabled-opacity"]).toBe("50%");
  expect(brand.sizes.small).toMatchObject({ "minimum-size": "24px", "font-size": "var(--scale-12)" });
  expect(DEFAULT_INTERFACE.colors.brand).toEqual({ of: "foreground", on: "background" });
  expect(defineInterface()).toEqual(DEFAULT_INTERFACE);
});

test("refuses a configuration that points nowhere", () => {
  expect(() => defineInterface({ colors: { brand: { of: "gold" } } })).toThrow('color "brand" refers to "gold"');
  expect(() => defineInterface({ colors: { brand: { of: { white: "black" } } } })).toThrow(
    'color "brand" has no color for the "black" style',
  );
  expect(() => defineInterface({ colors: { gold: { rgb: { white: "1 2 3" } } } })).toThrow(
    'color "gold" has no rgb for the "black" style',
  );
  expect(() =>
    defineInterface({ colors: { gold: { rgb: { white: "1 2 3", black: "1 2 3" }, on: "silver" } } }),
  ).toThrow('color "gold" refers to "silver"');
  expect(() => defineInterface({ colors: { a: { of: "b" }, b: { of: "a" } } })).toThrow('color "a" refers to itself');
  expect(() => defineInterface({ defaultColorStyle: "grey" })).toThrow('no color style "grey"');
  expect(() => defineInterface({ colorStyles: { inherit: { scheme: "light" } } })).toThrow(
    '"inherit" is not a color style',
  );
  expect(() => defineInterface({ inheritColorStyles: { dark: "grey" } })).toThrow('no color style "grey"');
  expect(() => defineInterface({ defaultCornerStyle: "oval" })).toThrow('no corner style "oval"');
  expect(() => defineInterface({ defaultLineStyle: "wavy" })).toThrow('no line style "wavy"');
  expect(() => defineInterface({ defaultSize: "huge" })).toThrow('no size "huge"');
  expect(() => defineInterface({ colors: { gold: { of: "white", gradient: ["white", "silver"] } } })).toThrow(
    'color "gold" refers to "silver"',
  );
  expect(() => defineInterface({ colors: { gold: { of: "white", filledHover: "silver" } } })).toThrow(
    'color "gold" refers to "silver"',
  );
  expect(() => defineInterface({ colors: { "Gold Leaf": { of: "white" } } })).toThrow(
    '"Gold Leaf" is not a kebab-case name',
  );
});
