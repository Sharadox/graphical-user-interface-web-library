import type { GlowBoundary } from "@sharadox/graphical-user-interface-web-library/box/type";

export interface GlowLayerProperties {
  /** The look attributes it wears: its box's color, color style and glow position. */
  attributes: Record<string, string>;
  /** `outside` (the default): right after its box, behind it; `inside`: the box's first child. */
  boundary?: GlowBoundary;
}
