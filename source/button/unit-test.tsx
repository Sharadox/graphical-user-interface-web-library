import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(cleanup);
import type { ButtonLinkProperties } from "@sharadox/graphical-user-interface-web-library/button/type";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";

test("without href it is a button: filled, brand, medium, left to the pointer (state none)", () => {
  const click = vi.fn();
  render(<Button onClick={click}>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });
  expect(button.tagName).toBe("BUTTON");
  expect(button.getAttribute("type")).toBe("button");
  expect(button.getAttribute("data-variant")).toBe("filled");
  expect(button.getAttribute("data-color")).toBe("brand");
  expect(button.getAttribute("data-state")).toBe("none");
  expect(button.getAttribute("data-interactive")).toBe("");
  fireEvent.click(button);
  expect(click).toHaveBeenCalledOnce();
});

test("with href it is a next/link link with the same look", () => {
  render(
    <Button href="/en/contact" variant="outlined" color="middleground">
      Contact
    </Button>,
  );
  const link = screen.getByRole("link", { name: "Contact" });
  expect(link.tagName).toBe("A");
  expect(link.getAttribute("href")).toBe("/en/contact");
  expect(link.getAttribute("type")).toBeNull();
  expect(link.getAttribute("data-variant")).toBe("outlined");
  expect(link.getAttribute("data-color")).toBe("middleground");
});

test("a site's own link component can draw the link", () => {
  const Own = ({ children, ...anchor }: ButtonLinkProperties) => (
    <a {...anchor} data-own="">
      {children}
    </a>
  );
  render(
    <Button href="/en#booking" link={Own}>
      Book
    </Button>,
  );
  expect(screen.getByRole("link", { name: "Book" }).getAttribute("data-own")).toBe("");
});

test("disabled: the button is disabled, a link loses its address and says it is disabled", () => {
  const click = vi.fn();
  const { rerender } = render(
    <Button disabled onClick={click}>
      Save
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Save" });
  expect(button.hasAttribute("disabled")).toBe(true);
  expect(button.getAttribute("data-state")).toBe("disabled");
  rerender(
    <Button disabled href="/en">
      Home
    </Button>,
  );
  const link = screen.getByText("Home").closest("a")!;
  expect(link.hasAttribute("href")).toBe(false);
  expect(link.getAttribute("aria-disabled")).toBe("true");
  expect(link.getAttribute("role")).toBe("link");
});

test("loading: busy, the spinner instead of the words, and clicks ignored", () => {
  const click = vi.fn();
  render(
    <Button loading onClick={click} type="submit">
      Send
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Send" });
  expect(button.getAttribute("type")).toBe("submit");
  expect(button.getAttribute("aria-busy")).toBe("true");
  expect(button.getAttribute("data-state")).toBe("loading");
  expect(button.querySelector("[data-spinner]")).not.toBeNull();
  fireEvent.click(button);
  expect(click).not.toHaveBeenCalled();
});

test("any state, size, corner, prefix and suffix, and icons sized like the words", () => {
  render(
    <Button state="hover" size={{ base: "small", 960: "large" }} corner="circle" prefix="+" suffix={<span>→</span>}>
      Add
    </Button>,
  );
  const button = screen.getByRole("button");
  expect(button.getAttribute("data-state")).toBe("hover");
  expect(button.getAttribute("data-size")).toBe("small");
  expect(button.getAttribute("data-size-960")).toBe("large");
  expect(button.getAttribute("data-style-corner")).toBe("circle");
  expect([...button.children].map((section) => section.getAttribute("data-section"))).toEqual([
    "prefix",
    "content",
    "suffix",
  ]);
});

test("an icon button is square and named by its label", () => {
  render(<Button square icon="close" aria-label="Close" />);
  const button = screen.getByRole("button", { name: "Close" });
  expect(button.getAttribute("data-square")).toBe("");
  expect(button.querySelector("svg")).not.toBeNull();
});

test("a forced disabled state looks disabled and refuses clicks, yet stays focusable (a calendar's day past a limit)", () => {
  const click = vi.fn();
  render(
    <Button state="disabled" onClick={click}>
      4
    </Button>,
  );
  const button = screen.getByRole("button", { name: "4" }) as HTMLButtonElement;
  expect(button.disabled).toBe(false);
  expect(button.getAttribute("aria-disabled")).toBe("true");
  fireEvent.click(button);
  expect(click).not.toHaveBeenCalled();
});

test("a set active state looks pressed and refuses clicks; a set enabled or hover state still works", () => {
  const click = vi.fn();
  const { rerender } = render(
    <Button state="active" onClick={click}>
      Current
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Current" });
  fireEvent.click(button);
  expect(click).not.toHaveBeenCalled();
  for (const state of ["enabled", "hover"] as const) {
    rerender(
      <Button state={state} onClick={click}>
        Current
      </Button>,
    );
    fireEvent.click(button);
  }
  expect(click).toHaveBeenCalledTimes(2);
});
