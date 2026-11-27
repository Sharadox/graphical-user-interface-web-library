"use client";
import { useStyle } from "@sharadox/style-web-library/use-style";
import { Choice } from "@sharadox/graphical-user-interface-web-library/choice";
import type { StyleSwitchProperties } from "@sharadox/graphical-user-interface-web-library/style-switch/type";

/**
 * A switch for one style group (color, corner, line…): a `Choice` of its options, the chosen one filled. The choice
 * applies to the whole page at once and is remembered.
 *
 * @example
 * <StyleSwitch configuration={STYLES} group="color" label="Color" labels={{ system: "Inherit", white: "White", black: "Black" }} />
 */
export function StyleSwitch({ configuration, group, label, labels = {}, size, className }: StyleSwitchProperties) {
  const { choice, choices, choose } = useStyle(configuration, group);
  return (
    <Choice
      label={label}
      options={choices.map((entry) => ({ value: entry.name, label: labels[entry.name] ?? entry.name }))}
      value={choice}
      onChange={choose}
      size={size}
      className={className}
    />
  );
}
