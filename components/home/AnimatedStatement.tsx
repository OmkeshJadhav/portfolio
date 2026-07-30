"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT = "I build products that solve real problems with beautiful user experiences.";

/**
 * As the section scrolls through the viewport, the statement's text-fill
 * gradient sweeps left to right — letters look like they're filling with
 * ink. Implemented with a background-clip: text gradient scrubbed by
 * ScrollTrigger, rather than per-letter DOM nodes, for performance.
 */
export function AnimatedStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    if (reducedMotion) {
      textRef.current.style.backgroundSize = "100% 100%";
      return;
    }

    // Set initial state
    gsap.set(textRef.current, { backgroundSize: "0% 100%" });

    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        backgroundSize: "200% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "center 25%",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[70vh] items-center justify-center px-6 py-32 md:px-12"
    >
      <p
        ref={textRef}
        className="ink-fill-text max-w-5xl text-center font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl"
      >
        {STATEMENT}
      </p>
    </section>
  );
}
