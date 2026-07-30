"use client";

import { ArrowUp } from "lucide-react";

const STACK = ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"];

export function Footer() {
  const scrollToTop = () => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      className="border-t px-6 py-10 md:px-12 lg:px-20"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
          © {new Date().getFullYear()} Omkesh Jadhav. Built with {STACK.join(" · ")}.
        </p>

        <button
          type="button"
          data-cursor="pointer"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          style={{ borderColor: "var(--color-border)" }}
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </footer>
  );
}
