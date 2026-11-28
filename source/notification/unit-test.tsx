import { join } from "node:path";
import { compile } from "sass";
// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { NotificationProvider, useNotification } from "@sharadox/graphical-user-interface-web-library/notification";

afterEach(cleanup);

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function Trigger() {
  const { notify } = useNotification();
  return (
    <>
      <button onClick={() => notify("Saved.")}>save</button>
      <button onClick={() => notify("Broken.", "error")}>fail</button>
      <button onClick={() => notify("Heads up.", "information")}>info</button>
      <button onClick={() => notify("Careful.", "warn")}>warn</button>
    </>
  );
}

const setUp = () =>
  render(
    <NotificationProvider label="Notifications" dismissLabel="Dismiss" duration={1000}>
      <Trigger />
    </NotificationProvider>,
  );

test("shows each notification in the region, then lets it go after its time", () => {
  setUp();
  fireEvent.click(screen.getByText("save"));
  const region = screen.getByRole("region", { name: "Notifications" });
  expect(region.textContent).toContain("Saved.");
  expect(screen.getByRole("status").textContent).toContain("Saved.");
  // Each tone is the interface's color of the same name, on an outlined glass card.
  expect(screen.getByRole("status").getAttribute("data-color")).toBe("success");
  expect(screen.getByRole("status").getAttribute("data-variant")).toBe("outlined");
  fireEvent.click(screen.getByText("warn"));
  expect(screen.getAllByRole("status")[1]!.getAttribute("data-color")).toBe("warn");
  act(() => void vi.advanceTimersByTime(1000));
  expect(region.textContent).toBe("");
});

test("errors are alerts that stay twice as long; hovering keeps one; the close button removes it", () => {
  setUp();
  fireEvent.click(screen.getByText("fail"));
  act(() => void vi.advanceTimersByTime(1500));
  const alert = screen.getByRole("alert");
  expect(alert.textContent).toContain("Broken.");
  expect(alert.getAttribute("data-color")).toBe("error");
  fireEvent.mouseEnter(alert);
  act(() => void vi.advanceTimersByTime(5000));
  expect(screen.queryByRole("alert")).not.toBeNull();
  fireEvent.mouseLeave(alert);
  fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
  expect(screen.queryByRole("alert")).toBeNull();
});

test("keeps at most four, newest last; without a provider, notifying does nothing", () => {
  setUp();
  for (let index = 0; index < 5; index++) fireEvent.click(screen.getByText("info"));
  expect(screen.getAllByRole("status")).toHaveLength(4);
  render(<Trigger />);
  fireEvent.click(screen.getAllByText("save")[1]!);
});

test("its own background is glass", () => {
  const sheet = compile(join(process.cwd(), "source/notification/index.module.scss"), {
    loadPaths: [join(process.cwd(), "source")],
  }).css;
  expect(sheet).toMatch(
    /\.notification \{[^}]*background: [^;]+;[^}]*-webkit-backdrop-filter: blur\(var\(--glass-blur\)\);[^}]*backdrop-filter: blur\(var\(--glass-blur\)\)/,
  );
});
