import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { Avatar, initials } from "@sharadox/graphical-user-interface-web-library/avatar";

afterEach(cleanup);

test("initials: the first letters of the first and last words", () => {
  expect(initials("Ana Maria Silva")).toBe("AS");
  expect(initials("  ana ")).toBe("A");
  expect(initials("")).toBe("");
  expect(initials("Élio d'Ávila")).toBe("ÉD");
});

test("a picture named by the person, round and square", () => {
  render(<Avatar name="Ana Silva" src="/ana.webp" />);
  const picture = screen.getByRole("img", { name: "Ana Silva" });
  expect(picture.tagName).toBe("IMG");
  expect(picture.getAttribute("src")).toBe("/ana.webp");
  const box = picture.closest("[data-square]")!;
  expect(box.getAttribute("data-style-corner")).toBe("circle");
  expect(box.getAttribute("data-size")).toBe("medium");
});

test("without a picture, or when it fails, the initials in a filled box", () => {
  render(<Avatar name="Ana Silva" color="blue" size="large" corner="rounded-square" />);
  const box = screen.getByRole("img", { name: "Ana Silva" });
  expect(box.textContent).toBe("AS");
  expect(box.getAttribute("data-variant")).toBe("filled");
  expect(box.getAttribute("data-color")).toBe("blue");
  expect(box.getAttribute("data-style-corner")).toBe("rounded-square");
  cleanup();
  render(<Avatar name="Rui" src="/missing.webp" />);
  fireEvent.error(screen.getByRole("img", { name: "Rui" }));
  expect(screen.getByRole("img", { name: "Rui" }).textContent).toBe("R");
});
