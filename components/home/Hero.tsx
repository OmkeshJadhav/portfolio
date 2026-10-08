"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Github, ArrowRight, Download } from "lucide-react";
import { HERO_COPY } from "@/constants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroIllustration } from "./HeroIllustration";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: reducedMotion ? 0 : 0.15,
      });

      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 16, duration: reducedMotion ? 0 : 0.6 })
        .from(
          "[data-hero-line]",
          { opacity: 0, y: 28, duration: reducedMotion ? 0 : 0.75, stagger: 0.08 },
          "-=0.35"
        )
        .from(
          "[data-hero-sub]",
          { opacity: 0, y: 16, duration: reducedMotion ? 0 : 0.6 },
          "-=0.4"
        )
        .from(
          "[data-hero-cta]",
          { opacity: 0, y: 16, duration: reducedMotion ? 0 : 0.6, stagger: 0.1 },
          "-=0.35"
        )
        .from(
          "[data-hero-illustration]",
          { opacity: 0, scale: 0.94, duration: reducedMotion ? 0 : 0.9, ease: "power2.out" },
          "-=0.6"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-svh items-center overflow-hidden px-6 pb-24 pt-24 md:px-12 md:pb-44 lg:px-20"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <div>
          <div
            data-hero-eyebrow
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <span style={{ color: "var(--color-ink)" }}>{HERO_COPY.role}</span>
          </div>

          <h1 className="font-display leading-[0.95] tracking-tight">
            <span
              data-hero-line
              className="block text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold"
              // style={{ color: "var(--color-ink-soft)" }}
            >
              {HERO_COPY.greeting}
            </span>
            <span data-hero-line className="block text-[clamp(2.75rem,10vw,5rem)] font-bold">
              <span style={{ color: "var(--color-accent)" }}>Omkesh</span>{" "}
              <span style={{ color: "var(--color-ink)" }}>Jadhav</span>
            </span>
          </h1>

          <p
            data-hero-sub
            className="mt-8 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {HERO_COPY.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <span data-hero-cta>
              <MagneticButton href="#projects" variant="primary">
                View My Work
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </MagneticButton>
            </span>
            <span data-hero-cta>
              <MagneticButton href="/resume.pdf" variant="secondary">
                <Download className="h-4 w-4" strokeWidth={2} />
                Download Resume
              </MagneticButton>
            </span>
            <span data-hero-cta>
              <MagneticButton
                href="https://github.com/omkeshjadhav"
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" strokeWidth={2} />
                GitHub
              </MagneticButton>
            </span>
          </div>
        </div>

        {/* Right: illustration */}
        <div data-hero-illustration>
          <HeroIllustration />
        </div>
      </div>

      {/* scroll cue — sits above the fixed bottom dock */}
      <div
        className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs md:flex"
        style={{ color: "var(--color-ink-soft)" }}
      >
        <span>Scroll</span>
        <span className="h-8 w-px animate-pulse" style={{ backgroundColor: "var(--color-border)" }} />
      </div>
    </section>
  );
}
