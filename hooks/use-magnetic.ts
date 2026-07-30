"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "./use-reduced-motion";

interface UseMagneticOptions {
  strength?: number; // 0–1, how far the element travels toward the cursor
}

/**
 * Attaches a subtle "magnetic" pull toward the cursor on hover.
 * Used on primary buttons for the micro-interaction the brief asks for.
 */
export function useMagnetic<T extends HTMLElement>(
  options: UseMagneticOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();
  const { strength = 0.35 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);

      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, reducedMotion]);

  return ref;
}
