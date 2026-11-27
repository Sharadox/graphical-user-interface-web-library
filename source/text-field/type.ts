import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { BoxLook, BoxState } from "@sharadox/graphical-user-interface-web-library/box/type";

/** What a text field shares, one line or many. */
interface TextFieldLook extends Pick<BoxLook, "variant" | "color" | "colorStyle" | "corner" | "line" | "size"> {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** What is wrong: the field turns to the error color and the input is marked invalid. */
  error?: ReactNode;
  /** A section before the input (a currency, an icon), at least square. */
  prefix?: ReactNode;
  /** A section after the input (a unit, a button), at least square. */
  suffix?: ReactNode;
  /** Forces a state (for the design system); otherwise it follows the pointer and `disabled`. */
  state?: BoxState;
  /** The field box's class (the label, hint and error sit around it). */
  className?: string;
}

/** A text field: one line, or with `multiline` a text area. */
export type TextFieldProperties =
  | (TextFieldLook & Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "prefix" | "size"> & { multiline?: false })
  | (TextFieldLook &
      Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color" | "prefix"> & {
        /** Many lines: a text area, `rows` high (3 by default), growing taller by hand. */
        multiline: true;
      });
