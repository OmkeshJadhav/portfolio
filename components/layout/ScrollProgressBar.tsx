"use client";

import { useEffect, useRef } from "react";
import { lerp, clamp } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * A 3px bar pinned to the top of the viewport that fills left-to-right
 * with scroll progress. Reads native scroll position directly (Lenis
 * updates real window.scrollY by default, it isn't a transform-based
 * virtual scroller), lerped for a slightly premium, non-jittery fill.
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let progress = 0;
    let rafId: number;

    const getTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      return clamp(window.scrollY / max, 0, 1);
    };

    const tick = () => {
      const target = getTarget();
      progress = reducedMotion ? target : lerp(progress, target, 0.18);

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-[70] h-[3px] w-full"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{ backgroundColor: "var(--color-accent)", transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}
