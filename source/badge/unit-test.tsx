import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { Badge } from "@sharadox/graphical-user-interface-web-library/badge";

test("a small filled brand label in running text, any look", () => {
  const { container, rerender } = render(<Badge>New</Badge>);
  const badge = container.firstElementChild!;
  expect(badge.tagName).toBe("SPAN");
  expect(badge.textContent).toBe("New");
  expect(badge.getAttribute("data-variant")).toBe("filled");
  expect(badge.getAttribute("data-color")).toBe("brand");
  expect(badge.getAttribute("data-size")).toBe("small");
  expect(badge.getAttribute("data-badge")).toBe("");
  rerender(
    <Badge variant="outlined" color="success" size="medium" prefix="●">
      Online
    </Badge>,
  );
  expect(badge.getAttribute("data-variant")).toBe("outlined");
  expect(badge.getAttribute("data-color")).toBe("success");
  expect(badge.firstElementChild!.getAttribute("data-section")).toBe("prefix");
});
