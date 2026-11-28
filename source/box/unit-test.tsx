import { join } from "node:path";
import { compile } from "sass";
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
      wrap="wrap"
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
    "data-wrap": "wrap",
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

test("an interactive box is left to the pointer by default (state index), and any state can be set", () => {
  const { container, rerender } = render(<Box interactive>Go</Box>);
  const box = container.firstElementChild!;
  expect(box.getAttribute("data-interactive")).toBe("");
  expect(box.getAttribute("data-state")).toBe("index");
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

test("a field box holds a form control: marked, interactive, and its sections apart", () => {
  const { container } = render(
    <Box field prefix="€">
      <input aria-label="Price" />
    </Box>,
  );
  const box = container.firstElementChild!;
  expect(box.getAttribute("data-field")).toBe("");
  expect(box.getAttribute("data-interactive")).toBe("");
  expect(box.getAttribute("data-state")).toBe("index");
  expect([...box.children].map((section) => section.getAttribute("data-section"))).toEqual(["prefix", "content"]);
});

test("modifications are listed on the box: none set keeps the default (glass), an empty list takes it away", () => {
  const { container, rerender } = render(<Box variant="outlined">Glass</Box>);
  expect(container.firstElementChild!.hasAttribute("data-modifications")).toBe(false);
  rerender(
    <Box variant="outlined" modifications={[]}>
      Plain
    </Box>,
  );
  expect(container.firstElementChild!.getAttribute("data-modifications")).toBe("");
  rerender(
    <Box variant="outlined" modifications={["glass", "glow"]}>
      Both
    </Box>,
  );
  expect(container.firstElementChild!.getAttribute("data-modifications")).toBe("glass glow");
});

test("a glow is a layer right after the box (outside, by default), wearing the box's color, color style and position", () => {
  const { container } = render(
    <Box
      variant="filled"
      color="red"
      colorStyle="black"
      glowPosition={{ base: "top", 960: "end-start" }}
      modifications={["glow"]}
    >
      Glowing
    </Box>,
  );
  const [box, glow] = [...container.children];
  expect(box!.getAttribute("data-glow-position")).toBe("top");
  expect(box!.getAttribute("data-glow-boundary")).toBe("outside");
  expect(glow!.getAttribute("aria-hidden")).toBe("true");
  expect(
    Object.fromEntries([...glow!.attributes].filter((a) => a.name.startsWith("data-")).map((a) => [a.name, a.value])),
  ).toEqual({
    "data-glow": "",
    "data-glow-boundary": "outside",
    "data-color": "red",
    "data-style-color": "black",
    "data-glow-position": "top",
    "data-glow-position-960": "end-start",
  });
});

test("a glow inside the box is its first child, under its sections", () => {
  const { container } = render(
    <Box interactive glowBoundary="inside" glowPosition="cursor" modifications={["glow"]} prefix="€">
      Glowing
    </Box>,
  );
  expect(container.children).toHaveLength(1);
  const box = container.firstElementChild!;
  expect(box.getAttribute("data-glow-boundary")).toBe("inside");
  const [glow, ...sections] = [...box.children];
  expect(glow!.getAttribute("data-glow")).toBe("");
  expect(glow!.getAttribute("data-glow-boundary")).toBe("inside");
  expect(glow!.getAttribute("data-glow-position")).toBe("cursor");
  expect(sections.map((section) => section.getAttribute("data-section"))).toEqual(["prefix", "content"]);
});

test("without a glow there is no boundary", () => {
  const { container } = render(<Box glowBoundary="inside">Plain</Box>);
  expect(container.firstElementChild!.hasAttribute("data-glow-boundary")).toBe(false);
});

const css = () =>
  compile(join(process.cwd(), "source/box/index.module.scss"), { loadPaths: [join(process.cwd(), "source")] }).css;

test("the edge is a border on outlined boxes and padding on the others, around the box and between its sections", () => {
  const box = css();
  expect(box).toMatch(
    /padding: calc\(var\(--box-padding\) \+ var\(--box-edge-thickness\) - var\(--box-border-thickness\)\)/,
  );
  expect(box).toMatch(/--section-minimum-size: calc\(var\(--box-minimum-size\) - 2 \* var\(--box-edge-thickness\)\)/);
  expect(box).toMatch(/--section-edge: calc\(var\(--box-edge-thickness\) - var\(--box-border-thickness\)\)/);
  expect(box).toMatch(
    /\[data-section=prefix\]\)[^{]*\{[^}]*border-inline-end: var\(--section-border-thickness\) var\(--line-style\) var\(--section-border-color\);[^}]*padding-inline-end: var\(--section-edge\)/,
  );
  expect(box).toMatch(/\[data-section=suffix\]\)[^{]*\{[^}]*border-inline-start: var\(--section-border-thickness\)/);
});

test("the focus ring is drawn inside the box's edge, in the color its variant chose", () => {
  const box = css();
  expect(box).toMatch(
    /:focus-visible[^{]*\{[^}]*outline: var\(--focus-thickness\) solid var\(--box-focus-color\);[^}]*outline-offset: var\(--focus-offset\)/,
  );
  expect(box).toMatch(/:focus-within[^{]*\{[^}]*outline: var\(--focus-thickness\) solid var\(--box-focus-color\)/);
  expect(box).toMatch(/--glow-paint: var\(--box-glow-paint\)/);
  // Only a box with a variant decides its titles' color, so the plain boxes inside a card keep the card's.
  expect(box).toMatch(/\.box\[data-variant\]\) \{\s*--title-color: var\(--box-title-color\)/);
});

test("the gradient ring reads values the box passes down (its own don't reach its pseudo-element), and loading hides gradient text", () => {
  const sheet = css();
  expect(sheet).toMatch(/--ring-display: var\(--box-ring-display\)/);
  expect(sheet).toMatch(/--ring-paint: var\(--box-border-paint\)/);
  expect(sheet).toMatch(/display: var\(--ring-display\)/);
  expect(sheet).toMatch(/--ring-thickness: var\(--box-border-thickness\)/);
  expect(sheet).toMatch(/inset: calc\(-1 \* var\(--ring-thickness\)\)/);
  expect(sheet).toMatch(/border: var\(--ring-thickness\) solid transparent/);
  expect(sheet).toMatch(/background: var\(--ring-paint\) border-box/);
  expect(sheet).toMatch(/\[data-state=loading\]\)[^{]*\{[^}]*background-image: none, var\(--box-background-image\)/);
});
