/**
 * Every value the design system shows a button in. It sits apart from the (client) button, so server code can read
 * it.
 *
 * @example
 * BUTTON_AXES.variant; // ["filled", "outlined", "transparent", "inline"]
 */
export const BUTTON_AXES = {
  variant: ["filled", "outlined", "transparent", "inline"],
  state: ["index", "enabled", "hover", "active", "loading", "disabled"],
  size: ["small", "medium", "large"],
} as const;
