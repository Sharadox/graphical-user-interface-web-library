import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import type { PointerAngleOptions } from "@sharadox/pointer-web-library/pointer-angle/type";

const followed: { element: Element; options: PointerAngleOptions }[] = [];
const stop = vi.fn();
vi.mock("@sharadox/pointer-web-library/pointer-angle", () => ({
  followPointerAngle: (element: Element, options: PointerAngleOptions) => {
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

test("anchors itself to the box before it and turns toward the pointer within the glow's range", () => {
  styled({ "--glow-range": " 128px", "--glow-start-angle": "-90deg" });
  const { container, unmount } = render(
    <>
      <button>Box</button>
      <GlowLayer attributes={{ "data-color": "red" }} />
    </>,
  );
  const [box, layer] = [...container.children] as HTMLElement[];
  expect(layer!.getAttribute("data-color")).toBe("red");
  const anchor = box!.style.getPropertyValue("anchor-name");
  expect(anchor).toMatch(/^--glow-[\w-]+$/);
  expect(layer!.style.getPropertyValue("position-anchor")).toBe(anchor);
  expect(followed).toHaveLength(1);
  expect(followed[0]!.element).toBe(box);
  expect(followed[0]!.options).toMatchObject({ range: 128, rest: -90 });
  followed[0]!.options.onAngle(45);
  expect(layer!.style.getPropertyValue("--glow-angle")).toBe("45deg");
  unmount();
  expect(stop).toHaveBeenCalled();
});

test("without values it rests below and follows within 128 pixels", () => {
  styled({ "--glow-range": "", "--glow-start-angle": "" });
  render(
    <>
      <span />
      <GlowLayer attributes={{}} />
    </>,
  );
  expect(followed[0]!.options).toMatchObject({ range: 128, rest: 90 });
});
