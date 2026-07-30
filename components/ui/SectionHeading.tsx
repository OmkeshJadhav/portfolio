import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Consistent section header used across About, Skills, Experience,
 * Projects, Blogs, Open Source and Contact — keeps the large-typography
 * language of the hero going without repeating layout code.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-14",
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
      data-reveal
    >
      <span
        className="mb-4 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider"
        style={{
          backgroundColor: "var(--color-accent)",
          borderColor: "var(--color-accent)",
          color: "white",
        }}
      >
        {eyebrow}
      </span>
      <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--color-ink-soft)" }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
