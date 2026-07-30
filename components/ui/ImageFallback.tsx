"use client";

import { useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageFallbackProps {
  src: string;
  alt: string;
  label: string;
  index: number;
  icon: LucideIcon;
  className?: string;
  sizes?: string;
}

/**
 * Renders a real next/image when `src` resolves, otherwise falls back to a
 * generated placeholder (diagonal hairline pattern + icon + label). Shared
 * by ProjectThumbnail and BlogCover so both degrade the same way before
 * real assets are added under /public.
 */
export function ImageFallback({ src, alt, label, index, icon, className, sizes }: ImageFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <Placeholder label={label} index={index} icon={icon} className={className} />;
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function Placeholder({
  label,
  index,
  icon: Icon,
  className,
}: {
  label: string;
  index: number;
  icon: LucideIcon;
  className?: string;
}) {
  const angle = 8 + ((index * 17) % 20);

  return (
    <div
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `repeating-linear-gradient(${angle}deg, var(--color-border) 0, var(--color-border) 1px, transparent 1px, transparent 14px)`,
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-[0.08]"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      <div className="relative flex flex-col items-center gap-3">
        <Icon className="h-7 w-7" strokeWidth={1.5} style={{ color: "var(--color-accent)" }} />
        <span
          className="max-w-[80%] text-center text-sm font-medium tracking-wide"
          style={{ color: "var(--color-ink-soft)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
