import { join } from "node:path";
import { compile } from "sass";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { Navigation } from "@sharadox/graphical-user-interface-web-library/navigation";

afterEach(cleanup);
const LINKS = [
  { href: "/en/token", label: "Tokens" },
  { href: "/en/component/button", label: "Button", current: true },
];
const setUp = () =>
  render(
    <Navigation
      brand={<a href="/en">Brand</a>}
      label="Main"
      links={LINKS}
      actions={<button type="button">Action</button>}
      menuLabel="Open the menu"
      closeLabel="Close the menu"
    />,
  );

test("a bar with the brand, the links (the current one marked) and the actions", () => {
  setUp();
  const bar = screen.getByRole("banner");
  expect(bar.getAttribute("data-collapse")).toBe("960");
  const navigation = screen.getByRole("navigation", { name: "Main" });
  const links = [...navigation.querySelectorAll("a")];
  expect(links.map((link) => link.textContent)).toEqual(["Tokens", "Button"]);
  expect(links[1]!.getAttribute("aria-current")).toBe("page");
  expect(links[1]!.getAttribute("data-color")).toBe("foreground");
  expect(links[0]!.getAttribute("data-color")).toBe("index");
  expect(screen.getByRole("link", { name: "Brand" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Action" })).toBeDefined();
});

test("on phones a button opens a menu with the links and the actions, and anything tapped in it closes it", () => {
  setUp();
  const toggle = screen.getByRole("button", { name: "Open the menu" });
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(toggle);
  const menu = document.getElementById(toggle.getAttribute("aria-controls")!)!;
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(toggle.getAttribute("aria-label")).toBe("Close the menu");
  expect(menu.getAttribute("aria-label")).toBe("Main");
  expect([...menu.querySelectorAll("a")].map((link) => link.textContent)).toEqual(["Tokens", "Button"]);
  expect(menu.textContent).toContain("Action");
  fireEvent.click(menu.querySelector("a")!);
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  expect(document.getElementById(toggle.getAttribute("aria-controls")!)).toBeNull();
});

test("collapses at a chosen breakpoint; without actions there is nothing beside the links", () => {
  render(
    <Navigation
      brand="B"
      label="Main"
      links={LINKS}
      menuLabel="Menu"
      closeLabel="Close"
      collapse={640}
      className="custom"
    />,
  );
  const bar = screen.getByRole("banner");
  expect(bar.getAttribute("data-collapse")).toBe("640");
  expect(bar.className).toContain("custom");
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  expect(document.querySelector("[data-menu-actions]")).toBeNull();
});

test("the bar spans the screen (its line from edge to edge); its content sits in a wrapper", () => {
  setUp();
  const bar = screen.getByRole("banner");
  expect(bar.hasAttribute("data-wrapper")).toBe(false);
  const wrapper = bar.firstElementChild!;
  expect(wrapper.getAttribute("data-wrapper")).toBe("");
  expect(wrapper.contains(screen.getByRole("navigation", { name: "Main" }))).toBe(true);
});

test("the bar's line runs across the screen, so it has no corners", () => {
  const sheet = compile(join(process.cwd(), "source/navigation/index.module.scss"), {
    loadPaths: [join(process.cwd(), "source")],
  }).css;
  expect(sheet).toMatch(/\.bar \{[^}]*border-radius: 0/);
});
