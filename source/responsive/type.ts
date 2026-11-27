/** A breakpoint a value can start at, in pixels (mobile first). */
export type Breakpoint = number;

/**
 * One value for every width, or a value per breakpoint (mobile first): `"small"`, or
 * `{ base: "small", 960: "large" }` (small, then large from 960 pixels wide).
 */
export type Responsive<Value extends string | number> = Value | ({ base?: Value } & { [width: Breakpoint]: Value });
