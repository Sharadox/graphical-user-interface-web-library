import { join } from "node:path";
import { compile } from "sass";
import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { Wrapper } from "@sharadox/graphical-user-interface-web-library/wrapper";

test("the page's width, any element, and every box look", () => {
  const { container } = render(
    <Wrapper as="main" direction="top-to-bottom" gap={24} className="custom">
      Page
    </Wrapper>,
  );
  const wrapper = container.firstElementChild!;
  expect(wrapper.tagName).toBe("MAIN");
  expect(wrapper.getAttribute("data-wrapper")).toBe("");
  expect(wrapper.getAttribute("data-direction")).toBe("top-to-bottom");
  expect(wrapper.className).toContain("custom");
  expect(wrapper.textContent).toBe("Page");
});

test("its width includes its padding: never wider than --wrapper-width, sides and all", () => {
  const css = compile(join(process.cwd(), "source/wrapper/index.module.scss")).css;
  expect(css).toContain("box-sizing: border-box");
  expect(css).toContain("max-inline-size: var(--wrapper-width)");
});
