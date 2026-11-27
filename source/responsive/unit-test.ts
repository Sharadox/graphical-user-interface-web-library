import { expect, test } from "vitest";
import { responsiveAttributes } from "@sharadox/graphical-user-interface-web-library/responsive";

test("one value is the base attribute", () => {
  expect(responsiveAttributes("data-size", "small")).toEqual({ "data-size": "small" });
  expect(responsiveAttributes("data-gap", 8)).toEqual({ "data-gap": "8" });
});

test("values per breakpoint become one attribute per breakpoint", () => {
  expect(responsiveAttributes("data-size", { base: "small", 960: "large", 640: "medium" })).toEqual({
    "data-size": "small",
    "data-size-640": "medium",
    "data-size-960": "large",
  });
});

test("nothing given, or only a fallback, gives the fallback alone", () => {
  expect(responsiveAttributes("data-size", undefined)).toEqual({});
  expect(responsiveAttributes("data-size", undefined, "medium")).toEqual({ "data-size": "medium" });
  expect(responsiveAttributes("data-size", { 640: "large" })).toEqual({ "data-size-640": "large" });
  expect(responsiveAttributes("data-size", { 640: "large" }, "medium")).toEqual({
    "data-size": "medium",
    "data-size-640": "large",
  });
});
