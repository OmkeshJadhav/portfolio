"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const MIN_VISIBLE_MS = 450;
const MAX_WAIT_MS = 900;

/**
 * A brief full-screen cover that fades out once the page has settled.
 * Deliberately short and capped — this is a stylistic beat for the entry
 * moment, not a real loading indicator, so it must never meaningfully
 * delay perceived performance. Skipped entirely under reduced motion.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      return;
    }

    const start = performance.now();
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => setVisible(false), remaining);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    // Hard cap — never block the entrance beyond this, regardless of what
    // else is still loading (fonts, late images, etc).
    const hardCap = window.setTimeout(dismiss, MAX_WAIT_MS);

    return () => {
      window.removeEventListener("load", dismiss);
      window.clearTimeout(hardCap);
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-500"
      style={{
        backgroundColor: "var(--color-bg)",
        opacity: visible ? 1 : 0,
      }}
    >
      <LoadingMark />
    </div>
  );
}

function LoadingMark() {
  useEffect(() => {
    gsap.fromTo(
      "[data-loading-bar]",
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, ease: "power2.inOut", transformOrigin: "left" }
    );
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="font-display text-sm font-medium tracking-[0.3em]" style={{ color: "var(--color-ink)" }}>
        OJ
      </span>
      <div className="h-px w-16 overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
        <div data-loading-bar className="h-full w-full" style={{ backgroundColor: "var(--color-accent)" }} />
      </div>
    </div>
  );
}
