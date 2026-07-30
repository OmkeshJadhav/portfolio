"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Finds every element with [data-reveal] inside the given section and
 * fades/slides them in as the section enters the viewport, staggered in
 * source order. One ScrollTrigger per section, not per element, to keep
 * things cheap.
 */
export function useScrollReveal<T extends HTMLElement>(sectionRef: RefObject<T | null>) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      section.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const targets = section.querySelectorAll("[data-reveal]");
      
      // Set initial state
      gsap.set(targets, { opacity: 0, y: 32 });
      
      // Animate in
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef, reducedMotion]);
}
