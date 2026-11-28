"use client";
import { useEffect, useState } from "react";
import { Button } from "@sharadox/graphical-user-interface-web-library/button";
import type { CopyButtonProperties } from "@sharadox/graphical-user-interface-web-library/copy-button/type";

/**
 * Copies a value to the clipboard (a key, a set of recovery codes) and says so for two seconds, with a tick: an
 * outlined index button.
 *
 * @example
 * <CopyButton value={secret} label="Copy" copiedLabel="Copied." />
 */
export function CopyButton({ value, label, copiedLabel, onCopied }: CopyButtonProperties) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <Button
      variant="outlined"
      color="index"
      size="medium"
      icon={copied ? "check" : "copy"}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopied?.();
      }}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </Button>
  );
}
