"use client";

import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "@/constants";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

/**
 * Fixed, vertically-centered dot nav on the right edge of the viewport.
 * Mirrors the "reading progress" pattern from ChatGPT's section indicator:
 * small dots on a thin connecting line, active dot expands into a label.
 */
export function RightNav() {
  const active = useActiveSection();
  const pathname = usePathname();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.1 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Tracks the home page's sections — nothing to track on other routes.
  if (pathname !== "/") return null;

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 lg:block"
    >
      <ul className="relative flex flex-col items-end gap-5">
        {/* connecting line */}
        <span
          aria-hidden
          className="absolute right-[3px] top-0 h-full w-px opacity-30"
          style={{ backgroundColor: "var(--color-ink)" }}
        />
        {NAV_SECTIONS.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id} className="relative flex items-center gap-3">
              <span
                className={cn(
                  "pointer-events-none whitespace-nowrap text-xs font-medium tracking-wide opacity-0 transition-all duration-300",
                  isActive && "-translate-x-1 opacity-100"
                )}
                style={{ color: "var(--color-ink)" }}
              >
                {section.label}
              </span>
              <button
                type="button"
                data-cursor="pointer"
                onClick={() => scrollTo(section.id)}
                aria-label={`Go to ${section.label} section`}
                aria-current={isActive ? "true" : undefined}
                className="group relative z-10 flex h-3.5 w-3.5 items-center justify-center"
              >
                <span
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 10 : 6,
                    height: isActive ? 10 : 6,
                    backgroundColor: isActive ? "var(--color-accent)" : "var(--color-ink-soft)",
                    opacity: isActive ? 1 : 0.5,
                  }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
