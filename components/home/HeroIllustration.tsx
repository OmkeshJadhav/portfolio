"use client";

import Image from "next/image";

/**
 * Professional avatar image of the developer working on a laptop,
 * with floating tech icons integrated into the image itself.
 */
export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <Image
        src="/images/projects/omkesh_avatar.png"
        alt="Omkesh Jadhav - Full Stack Developer working on a MacBook with floating tech icons including React, TypeScript, and code snippets"
        width={1024}
        height={768}
        priority
        className="h-auto w-full rounded-2xl"
      />
      
      {/* Availability badge */}
      <div
        className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg backdrop-blur-sm"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: "var(--color-success)" }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--color-success)" }}
          />
        </span>
        <span className="text-xs font-medium" style={{ color: "var(--color-ink)" }}>
          Available for
        </span>
        <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
          opportunities
        </span>
      </div>
    </div>
  );
}
