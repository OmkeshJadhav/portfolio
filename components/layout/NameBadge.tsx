"use client";

import Image from "next/image";

/**
 * Name badge displayed in the top-left corner with avatar initials
 * and full name. Clickable to scroll to top of page.
 */
export function NameBadge() {
  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed left-6 top-6 z-50 hidden items-center gap-3 lg:flex">
      <button
        type="button"
        onClick={scrollToTop}
        data-cursor="pointer"
        className="relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg)",
        }}
        aria-label="Scroll to top"
      >
        <Image
          src="/images/projects/omkesh_reading.webp"
          alt="Omkesh Jadhav"
          fill
          className="object-cover"
          sizes="56px"
        />
      </button>
      <button
        type="button"
        onClick={scrollToTop}
        data-cursor="pointer"
        className="rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
        aria-label="Scroll to top"
      >
        <span className="text-sm font-medium tracking-tight" style={{ color: "var(--color-ink)" }}>
          Omkesh Jadhav
        </span>
      </button>
    </div>
  );
}
