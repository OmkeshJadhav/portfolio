"use client";

import { useState, type MouseEvent } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Copies the code of the surrounding <figure>. Reads it from the DOM rather
 * than taking it as a prop so the code isn't shipped twice to the client.
 */
export function CopyCodeButton() {
  const [copied, setCopied] = useState(false);

  const copy = async (event: MouseEvent<HTMLButtonElement>) => {
    const code = event.currentTarget.closest("figure")?.querySelector("pre")?.innerText;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="pointer"
      aria-label={copied ? "Copied" : "Copy code"}
      className="flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-200 hover:bg-[var(--color-border)]"
      style={{ color: copied ? "var(--color-success)" : "var(--color-ink-soft)" }}
    >
      {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />}
    </button>
  );
}
