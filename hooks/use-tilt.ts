"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "./use-reduced-motion";

interface UseTiltOptions {
  max?: number; // max rotation in degrees
  scale?: number; // hover scale
}

/**
 * Subtle pointer-tracked tilt + scale for cards. Rotation is derived from
 * cursor position relative to the card center, eased with GSAP so it never
 * snaps. Disabled under reduced motion.
 */
export function useTilt<T extends HTMLElement>(
  options: UseTiltOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();
  const { max = 6, scale = 1.02 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const quickRotateX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const quickRotateY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const quickScale = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power3.out" });

    gsap.set(el, { transformPerspective: 800, transformStyle: "preserve-3d" });

    const handleMouseMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;

      quickRotateY(relX * max);
      quickRotateX(-relY * max);
      quickScale(scale);
    };

    const handleMouseLeave = () => {
      quickRotateX(0);
      quickRotateY(0);
      quickScale(1);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [max, scale, reducedMotion]);

  return ref;
}
