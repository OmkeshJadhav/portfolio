"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Returns true if the user has requested reduced motion at the OS level.
 * All GSAP/Framer/Lenis-driven effects should check this before animating.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
