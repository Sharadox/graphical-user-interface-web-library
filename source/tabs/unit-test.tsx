import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Tabs } from "@sharadox/graphical-user-interface-web-library/tabs";

afterEach(cleanup);
const TABS = [
  { value: "profile", label: "Profile", content: <p>Profile panel</p> },
  { value: "security", label: "Security", content: <p>Security panel</p> },
  { value: "billing", label: "Billing", content: <p>Billing panel</p> },
];

test("a tab list named by its label; the chosen tab filled, its panel shown and labelled by it", () => {
  render(<Tabs label="Account" tabs={TABS} />);
  expect(screen.getByRole("tablist", { name: "Account" })).toBeDefined();
  const tabs = screen.getAllByRole("tab");
  expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
  expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
  expect(tabs[0]!.getAttribute("data-variant")).toBe("filled");
  expect(tabs[0]!.getAttribute("data-color")).toBe("index");
  expect(tabs[1]!.getAttribute("data-variant")).toBe("transparent");
  const panel = screen.getByRole("tabpanel");
  expect(panel.textContent).toBe("Profile panel");
  expect(panel.getAttribute("aria-labelledby")).toBe(tabs[0]!.id);
  expect(tabs[0]!.getAttribute("aria-controls")).toBe(panel.id);
  expect(panel.tabIndex).toBe(0);
});

test("a click or the arrow keys choose, wrapping around; Home and End jump", () => {
  const change = vi.fn();
  render(<Tabs label="Account" tabs={TABS} defaultValue="security" onChange={change} />);
  expect(screen.getByRole("tabpanel").textContent).toBe("Security panel");
  fireEvent.click(screen.getByRole("tab", { name: "Billing" }));
  expect(change).toHaveBeenLastCalledWith("billing");
  expect(screen.getByRole("tabpanel").textContent).toBe("Billing panel");
  const billing = screen.getByRole("tab", { name: "Billing" });
  fireEvent.keyDown(billing, { key: "ArrowRight" });
  expect(screen.getByRole("tabpanel").textContent).toBe("Profile panel");
  expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Profile" }));
  fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
  expect(change).toHaveBeenLastCalledWith("billing");
  fireEvent.keyDown(document.activeElement!, { key: "Home" });
  expect(change).toHaveBeenLastCalledWith("profile");
  fireEvent.keyDown(document.activeElement!, { key: "End" });
  expect(change).toHaveBeenLastCalledWith("billing");
  change.mockClear();
  fireEvent.keyDown(document.activeElement!, { key: "Enter" });
  expect(change).not.toHaveBeenCalled();
});

test("controlled, and any look for the tabs", () => {
  const change = vi.fn();
  render(<Tabs label="Account" tabs={TABS} value="security" onChange={change} color="blue" size="small" />);
  fireEvent.click(screen.getByRole("tab", { name: "Profile" }));
  expect(change).toHaveBeenLastCalledWith("profile");
  expect(screen.getByRole("tabpanel").textContent).toBe("Security panel");
  expect(screen.getByRole("tab", { name: "Security" }).getAttribute("data-color")).toBe("blue");
  expect(screen.getByRole("tab", { name: "Security" }).getAttribute("data-size")).toBe("small");
});
