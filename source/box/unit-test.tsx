import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);
import { Box } from "@sharadox/graphical-user-interface-web-library/box";

test("a box is a div with nothing set: it takes its looks from where it sits", () => {
  const { container } = render(<Box>Content</Box>);
  const box = container.firstElementChild!;
  expect(box.tagName).toBe("DIV");
  expect(box.textContent).toBe("Content");
  expect([...box.attributes].map((attribute) => attribute.name)).toEqual(["class"]);
});

test("every look is an attribute, per breakpoint where given", () => {
  const { container } = render(
    <Box
      as="section"
      variant={{ base: "outlined", 960: "filled" }}
      color="red"
      colorStyle="black"
      corner={{ base: "square", 640: "circle" }}
      line="dashed"
      size="large"
      direction="top-to-bottom"
      justify="start"
      align="stretch"
      textAlign="start"
      gap={{ base: 8, 960: 24 }}
      padding={16}
      className="custom"
      id="box"
    >
      Content
    </Box>,
  );
  const box = container.firstElementChild!;
  expect(box.tagName).toBe("SECTION");
  expect(box.id).toBe("box");
  expect(box.className).toContain("custom");
  expect(
    Object.fromEntries([...box.attributes].filter((a) => a.name.startsWith("data-")).map((a) => [a.name, a.value])),
  ).toEqual({
    "data-variant": "outlined",
    "data-variant-960": "filled",
    "data-color": "red",
    "data-style-color": "black",
    "data-style-corner": "square",
    "data-style-corner-640": "circle",
    "data-style-line": "dashed",
    "data-size": "large",
    "data-direction": "top-to-bottom",
    "data-justify": "start",
    "data-align": "stretch",
    "data-text-align": "start",
    "data-gap": "8",
    "data-gap-960": "24",
    "data-padding": "16",
  });
});

test("a prefix and a suffix are sections of their own around the content", () => {
  const { container } = render(
    <Box prefix={<span>P</span>} suffix="S">
      Content
    </Box>,
  );
  const sections = [...container.firstElementChild!.children];
  expect(sections.map((section) => section.getAttribute("data-section"))).toEqual(["prefix", "content", "suffix"]);
  expect(sections.map((section) => section.textContent)).toEqual(["P", "Content", "S"]);
});

test("a square box holds one icon or character, with no padding", () => {
  const { container } = render(<Box square>×</Box>);
  const box = container.firstElementChild!;
  expect(box.getAttribute("data-square")).toBe("");
  expect(box.firstElementChild!.getAttribute("data-section")).toBe("content");
});

test("an interactive box is enabled by default, and any state can be forced", () => {
  const { container, rerender } = render(<Box interactive>Go</Box>);
  const box = container.firstElementChild!;
  expect(box.getAttribute("data-interactive")).toBe("");
  expect(box.getAttribute("data-state")).toBe("enabled");
  expect(box.firstElementChild!.getAttribute("data-section")).toBe("content");
  rerender(
    <Box interactive state="hover">
      Go
    </Box>,
  );
  expect(box.getAttribute("data-state")).toBe("hover");
  rerender(
    <Box interactive state="disabled">
      Go
    </Box>,
  );
  expect(box.getAttribute("aria-disabled")).toBe("true");
});

test("while loading it shows the spinner over its content, which keeps its size and its name", () => {
  render(
    <Box interactive state="loading" as="button" aria-label="Save">
      Save
    </Box>,
  );
  const button = screen.getByRole("button", { name: "Save" });
  expect(button.getAttribute("aria-busy")).toBe("true");
  expect(button.getAttribute("data-state")).toBe("loading");
  expect(button.querySelector("[data-spinner]")).not.toBeNull();
  expect(button.querySelector('[data-section="content"]')!.textContent).toBe("Save");
});
