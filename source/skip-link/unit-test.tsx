import { join } from "node:path";
import { compile } from "sass";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { SkipLink } from "@sharadox/graphical-user-interface-web-library/skip-link";

afterEach(cleanup);

test("a link to the main content, first in the tab order, named by its label", () => {
  render(<SkipLink label="Skip to the Content" />);
  const link = screen.getByRole("link", { name: "Skip to the Content" });
  expect(link.getAttribute("href")).toBe("#main");
  expect(link.getAttribute("data-skip-link")).toBe("");
  expect(link.getAttribute("data-variant")).toBe("filled");
  expect(link.tabIndex).toBe(0);
});

test("any target", () => {
  render(<SkipLink label="Skip" href="#content" />);
  expect(screen.getByRole("link", { name: "Skip" }).getAttribute("href")).toBe("#content");
});

test("hidden until the keyboard reaches it: a mouse never sees it", () => {
  const css = compile(join(process.cwd(), "source/skip-link/index.module.scss"), {
    loadPaths: [join(process.cwd(), "source")],
  }).css;
  expect(css).toMatch(/\.skipLink[^{]*\{[^}]*position: fixed/);
  expect(css).toMatch(/\.skipLink:not\(:focus-visible\)[^{]*\{[^}]*clip-path: inset\(50%\)/);
});
