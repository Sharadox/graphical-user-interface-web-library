import { join } from "node:path";
import { compile } from "sass";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import type { PointerPositionOptions } from "@sharadox/pointer-web-library/pointer-position/type";

const followed: { element: Element; options: PointerPositionOptions }[] = [];
const stop = vi.fn();
vi.mock("@sharadox/pointer-web-library/pointer-position", () => ({
  followPointerPosition: (element: Element, options: PointerPositionOptions) => {
    followed.push({ element, options });
    return stop;
  },
}));
const { GlowLayer } = await import("@sharadox/graphical-user-interface-web-library/glow-layer");

afterEach(() => {
  cleanup();
  followed.length = 0;
  vi.restoreAllMocks();
});

const styled = (values: Record<string, string>) => {
  const original = window.getComputedStyle.bind(window);
  vi.spyOn(window, "getComputedStyle").mockImplementation((element) => {
    const style = original(element);
    return Object.assign(Object.create(style), {
      getPropertyValue: (name: string) => values[name] ?? style.getPropertyValue(name),
    });
  });
};

test("outside: anchors itself to the box before it and its light follows the pointer, a little past the edges", () => {
  styled({ "--glow-range": " 64px", "--glow-overflow": "8px" });
  const { container, unmount } = render(
    <>
      <button>Box</button>
      <GlowLayer attributes={{ "data-color": "red" }} />
    </>,
  );
  const [box, layer] = [...container.children] as HTMLElement[];
  const light = layer!.firstElementChild as HTMLElement;
  expect(layer!.getAttribute("data-color")).toBe("red");
  expect(layer!.getAttribute("data-glow-boundary")).toBe("outside");
  const anchor = box!.style.getPropertyValue("anchor-name");
  expect(anchor).toMatch(/^--glow-[\w-]+$/);
  expect(layer!.style.getPropertyValue("position-anchor")).toBe(anchor);
  expect(followed[0]!.element).toBe(box);
  expect(followed[0]!.options.range).toBe(64);
  const { onPosition, onVisibility } = followed[0]!.options;
  // Within the box; then far to its left and below: held 8 pixels past its edges.
  onPosition({ x: 30, y: 10, width: 100, height: 40 });
  expect(light.style.translate).toBe("30px 10px");
  expect(layer!.hasAttribute("data-near")).toBe(true);
  onPosition({ x: -50, y: 90, width: 100, height: 40 });
  expect(light.style.translate).toBe("-8px 48px");
  // Gone: back to where it rests.
  onPosition(undefined);
  expect(light.style.translate).toBe("");
  expect(layer!.hasAttribute("data-near")).toBe(false);
  // It breathes only while on screen.
  onVisibility!(true);
  expect(layer!.hasAttribute("data-visible")).toBe(true);
  onVisibility!(false);
  expect(layer!.hasAttribute("data-visible")).toBe(false);
  unmount();
  expect(stop).toHaveBeenCalled();
});

test("inside: follows the box it sits in, held within its edges, and swells while the box is pressed", () => {
  styled({ "--glow-range": "", "--glow-overflow": "" });
  const { container, unmount } = render(
    <button>
      <GlowLayer attributes={{}} boundary="inside" />
      Box
    </button>,
  );
  const box = container.firstElementChild as HTMLElement;
  const layer = box.firstElementChild as HTMLElement;
  expect(box.style.getPropertyValue("anchor-name")).toBe("");
  expect(followed[0]!.element).toBe(box);
  expect(followed[0]!.options.range).toBe(128);
  followed[0]!.options.onPosition({ x: 130, y: -20, width: 100, height: 40 });
  expect((layer.firstElementChild as HTMLElement).style.translate).toBe("100px 0px");
  fireEvent.pointerDown(box);
  expect(layer.hasAttribute("data-pressed")).toBe(true);
  fireEvent.pointerUp(box);
  expect(layer.hasAttribute("data-pressed")).toBe(false);
  fireEvent.pointerDown(box);
  fireEvent.pointerLeave(box);
  expect(layer.hasAttribute("data-pressed")).toBe(false);
  unmount();
  fireEvent.pointerDown(box);
  expect(layer.hasAttribute("data-pressed")).toBe(false);
});

test("the light rests at its position, breathes and floats on screen, and is still for reduced motion", () => {
  const sheet = compile(join(process.cwd(), "source/glow-layer/index.module.scss"), {
    loadPaths: [join(process.cwd(), "source")],
  }).css;
  expect(sheet).toMatch(/translate: calc\(var\(--glow-x\) \* 100cqw\) calc\(var\(--glow-y\) \* 100cqh\)/);
  expect(sheet).toMatch(/container-type: size/);
  expect(sheet).toMatch(/opacity: calc\(var\(--glow-opacity\) \* var\(--glow-rest-opacity\)\)/);
  expect(sheet).toMatch(/\[data-visible\][^{]*\{[^}]*animation-play-state: running/);
  expect(sheet).toMatch(/\[data-pressed\][^{]*\{[^}]*scale: var\(--glow-press-scale\)/);
  expect(sheet).toMatch(/@keyframes [\w-]*breathe/);
  expect(sheet).toMatch(/@keyframes [\w-]*float/);
  expect(sheet).toMatch(/prefers-reduced-motion: reduce[\s\S]*::before \{\s*animation: none/);
  // A logical position flips in right-to-left text.
  expect(sheet).toMatch(/:dir\(rtl\)[^{]*\{[^}]*--glow-inline-origin: 1;[^}]*--glow-inline-direction: -1/);
});
