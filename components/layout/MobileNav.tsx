"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_SECTIONS } from "@/constants";
import { useActiveSection } from "@/hooks/use-active-section";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

/**
 * Below the `lg` breakpoint, RightNav is hidden — this fills that gap with
 * a hamburger trigger and a full-screen overlay list. Shares the same
 * active-section tracking and the modal's focus-trap hook so keyboard and
 * screen-reader behavior stays consistent across the app.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection();
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  useFocusTrap(panelRef, open, () => setOpen(false));

  const scrollTo = (id: string) => {
    setOpen(false);
    if (!onHome) {
      router.push(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.1 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        data-cursor="pointer"
        className="fixed left-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-card) 82%, transparent)",
          borderColor: "var(--color-border)",
        }}
      >
        <Menu className="h-4 w-4" strokeWidth={1.75} style={{ color: "var(--color-ink)" }} />
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        inert={!open || undefined}
        className={cn(
          "fixed inset-0 z-[90] flex flex-col items-center justify-center gap-2 transition-opacity duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
          data-cursor="pointer"
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {NAV_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            data-cursor="pointer"
            onClick={() => scrollTo(section.id)}
            aria-current={onHome && section.id === active ? "true" : undefined}
            className="py-3 font-display text-3xl font-semibold tracking-tight transition-colors duration-200"
            style={{ color: onHome && section.id === active ? "var(--color-accent)" : "var(--color-ink)" }}
          >
            {section.label}
          </button>
        ))}
        <Link
          href="/notes"
          onClick={() => setOpen(false)}
          data-cursor="pointer"
          aria-current={pathname.startsWith("/notes") ? "page" : undefined}
          className="py-3 font-display text-3xl font-semibold tracking-tight transition-colors duration-200"
          style={{ color: pathname.startsWith("/notes") ? "var(--color-accent)" : "var(--color-ink)" }}
        >
          Notes
        </Link>
      </div>
    </div>
  );
}
