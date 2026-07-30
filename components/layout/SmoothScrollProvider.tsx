"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Owns the single Lenis instance for the page and keeps GSAP's
 * ScrollTrigger in sync with it every frame. Respects reduced-motion by
 * falling back to native scrolling entirely.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Fonts swapping in (font-display: swap) or images finishing layout
    // can shift section positions after ScrollTrigger's initial measure —
    // refresh once everything has settled, and again on resize.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    if (document.fonts) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    // Expose for anchor-link scrolling elsewhere (right nav, dock)
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [reducedMotion]);

  return <>{children}</>;
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
