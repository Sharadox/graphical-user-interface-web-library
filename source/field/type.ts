import type { ReactNode } from "react";

/** What the control inside a field takes, so the label names it and the hint and error describe it. */
export interface FieldControl {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

export interface FieldProperties {
  /** The control's name, shown above it. */
  label: ReactNode;
  /** Hides the label from sight; screen readers still read it. */
  hideLabel?: boolean;
  /** A line of help under the control. */
  hint?: ReactNode;
  /** What is wrong, in the error color; marks the control invalid. */
  error?: ReactNode;
  /** The control's id; one is made otherwise. */
  id?: string;
  className?: string;
  /** Draws the control with what it must take. */
  children: (control: FieldControl) => ReactNode;
}
