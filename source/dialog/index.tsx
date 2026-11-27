"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Box } from "@sharadox/graphical-user-interface-web-library/box";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import type { DialogProperties } from "@sharadox/graphical-user-interface-web-library/dialog/type";
import styles from "./index.module.scss";

/** The longest a leaving animation may take before the dialog closes anyway (reduced motion runs none). */
const LEAVING_MILLISECONDS = 300;

/**
 * A pop-up in the middle of the screen (the browser's own modal dialog: focus stays inside, the page behind is
 * inert), named by its title, closed by Escape, its close button or a click on the backdrop. It leaves the way it
 * came: the opening animation runs backwards before it closes, no longer modal meanwhile, so the page behind works
 * at once.
 *
 * @example
 * <Dialog open={asking} onClose={() => setAsking(false)} title="Check Your Email" closeLabel="Close">…</Dialog>
 */
export function Dialog({ open, onClose, title, closeLabel, children }: DialogProperties) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // Leaving: closed by the parent but still on screen while its animation runs backwards.
  const [leaving, setLeaving] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    setLeaving(!open);
  }
  const finish = () => {
    dialog.current!.close();
    setLeaving(false);
  };
  useEffect(() => {
    const element = dialog.current!;
    if (open && !element.open) element.showModal();
    if (!leaving) return;
    // Leaving, it stops being modal at once, so the page behind works straight away; it stays on screen only for
    // its animation.
    element.close();
    element.show();
    const timer = setTimeout(finish, LEAVING_MILLISECONDS);
    return () => clearTimeout(timer);
  }, [open, leaving]);
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby={titleId}
      data-closing={leaving ? "" : undefined}
      onAnimationEnd={(event) => {
        if (event.target === dialog.current && leaving) finish();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      {(open || leaving) && (
        <Box direction="top-to-bottom" align="stretch" textAlign="start" gap={16} padding={24}>
          <Box justify="space-between" align="start" gap={16}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <Button
              square
              variant="transparent"
              color="middleground"
              icon="close"
              aria-label={closeLabel}
              onClick={onClose}
            />
          </Box>
          {children}
        </Box>
      )}
    </dialog>
  );
}
