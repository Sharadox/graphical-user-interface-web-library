import type { ReactNode } from "react";

/**
 * A notification after an action, in the interface's color of its tone: `success`, `information` and `warn` are
 * polite, `error` is an alert.
 */
export interface Notification {
  id: number;
  message: string;
  tone: "success" | "information" | "warn" | "error";
}

export interface NotificationContextValue {
  /** Shows a notification for a few seconds (`error`s stay twice as long). */
  notify(message: string, tone?: Notification["tone"]): void;
}

export interface NotificationProviderProperties {
  /** The region's name and the close buttons' ("Notifications", "Dismiss"). */
  label: string;
  dismissLabel: string;
  /** How long a notification stays, in milliseconds (5 seconds by default). */
  duration?: number;
  children: ReactNode;
}
