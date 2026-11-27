"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@sharadox/icon-web-library/icon";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import type {
  Notification,
  NotificationContextValue,
  NotificationProviderProperties,
} from "@sharadox/graphical-user-interface-web-library/notification/type";
import styles from "./index.module.scss";

const NotificationContext = createContext<NotificationContextValue>({ notify: () => {} });
const ICONS = { success: "check", information: "bell", warn: "warning", error: "warning" } as const;

/**
 * The notifications shown after each action, from anywhere under `NotificationProvider`.
 *
 * @example
 * const { notify } = useNotification();
 * notify("Saved.");
 */
export function useNotification(): NotificationContextValue {
  return useContext(NotificationContext);
}

/** One notification: hides itself after `duration` (not while the pointer is on it), or with its close button. */
function NotificationItem({
  notification,
  duration,
  dismissLabel,
  onDismiss,
}: {
  notification: Notification;
  duration: number;
  dismissLabel: string;
  onDismiss: (id: number) => void;
}) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => onDismiss(notification.id), notification.tone === "error" ? duration * 2 : duration);
    return () => clearTimeout(timer);
  }, [paused, notification, duration, onDismiss]);
  return (
    <Box
      role={notification.tone === "error" ? "alert" : "status"}
      variant="outlined"
      color={notification.tone}
      gap={8}
      justify="start"
      textAlign="start"
      padding={8}
      className={styles.notification}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Icon name={ICONS[notification.tone]} />
      <p className={styles.message}>{notification.message}</p>
      <Button
        square
        variant="transparent"
        color="middleground"
        size="small"
        icon="close"
        aria-label={dismissLabel}
        onClick={() => onDismiss(notification.id)}
      />
    </Box>
  );
}

/**
 * Shows a notification after every action, at the top right just below the site's bar: it goes after a few
 * seconds, or when closed. Each is an outlined glass card in its tone's color (success, information, warn, error).
 * At most four at once, newest last.
 *
 * @example
 * <NotificationProvider label="Notifications" dismissLabel="Dismiss">{children}</NotificationProvider>
 */
export function NotificationProvider({
  label,
  dismissLabel,
  duration = 5000,
  children,
}: NotificationProviderProperties) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const next = useRef(0);
  const dismiss = useCallback((id: number) => setNotifications((all) => all.filter((item) => item.id !== id)), []);
  const value = useMemo<NotificationContextValue>(
    () => ({
      notify: (message, tone = "success") =>
        setNotifications((all) => [...all, { id: ++next.current, message, tone }].slice(-4)),
    }),
    [],
  );
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <section className={styles.region} aria-label={label}>
        {notifications.map((item) => (
          <NotificationItem
            key={item.id}
            notification={item}
            duration={duration}
            dismissLabel={dismissLabel}
            onDismiss={dismiss}
          />
        ))}
      </section>
    </NotificationContext.Provider>
  );
}
