import { join } from "node:path";
import { compile } from "sass";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { Card } from "@sharadox/graphical-user-interface-web-library/card";

afterEach(cleanup);

test("an outlined article: title, description and content, the action beside them", () => {
  render(
    <Card title="Email" description="Where codes are sent." action={<button type="button">Edit</button>}>
      <p>ana@example.com</p>
    </Card>,
  );
  const card = screen.getByRole("article");
  expect(card.getAttribute("data-variant")).toBe("outlined");
  expect(card.getAttribute("data-color")).toBe("index");
  expect(card.getAttribute("data-padding")).toBe("24");
  expect(screen.getByRole("heading", { name: "Email" }).tagName).toBe("H2");
  expect(screen.getByText("Where codes are sent.")).toBeDefined();
  expect(screen.getByText("ana@example.com")).toBeDefined();
  expect(card.lastElementChild!.textContent).toBe("Edit");
});

test("a chosen heading level, look and element; nothing empty is drawn", () => {
  render(
    <Card
      as="section"
      title="Plain"
      headingLevel={3}
      variant="filled"
      color="blue"
      padding={16}
      aria-label="Plain card"
    />,
  );
  const card = screen.getByRole("region", { name: "Plain card" });
  expect(screen.getByRole("heading", { name: "Plain" }).tagName).toBe("H3");
  expect(card.getAttribute("data-variant")).toBe("filled");
  expect(card.getAttribute("data-color")).toBe("blue");
  expect(card.getAttribute("data-padding")).toBe("16");
  expect(card.querySelectorAll("p")).toHaveLength(0);
  cleanup();
  const { container } = render(<Card>Only content</Card>);
  expect(container.querySelector("h2")).toBeNull();
  expect(container.textContent).toBe("Only content");
});

test("titles are in their color's active color (foreground on index), or its text on a fill: card, dialog, accordion", () => {
  const compiled = (name: string) =>
    compile(join(process.cwd(), `source/${name}/index.module.scss`), { loadPaths: [join(process.cwd(), "source")] })
      .css;
  expect(compiled("card")).toMatch(/\.title\)? ?\{[^}]*color: var\(--title-color, var\(--current-active-color\)\)/);
  expect(compiled("dialog")).toMatch(/\.title\)? ?\{[^}]*color: var\(--title-color, var\(--current-active-color\)\)/);
  expect(compiled("accordion")).toMatch(
    /\.button\)? ?\{[^}]*color: var\(--title-color, var\(--current-active-color\)\)/,
  );
});
