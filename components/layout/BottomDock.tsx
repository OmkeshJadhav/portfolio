"use client";

import { useEffect, useRef, useState, type RefObject, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import {
  Mail,
  Github,
  Linkedin,
  FileText,
  Twitter,
  Code2,
  BookOpen,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import {
  SiGithub,
  SiX,
  SiLeetcode,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { DOCK_LINKS } from "@/constants";
import { TECH_COLORS } from "@/constants/icon-colors";
import { cn, clamp } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Mail,
  Github,
  Linkedin,
  FileText,
  Twitter,
  Code2,
  BookOpen,
  PenLine,
};

const BRAND_DOCK_ICONS: Record<string, any> = {
  Github: SiGithub,
  Linkedin: FaLinkedin,
  Twitter: SiX,
  Code2: SiLeetcode,
};

const BASE_SIZE = 40;
const MAX_SIZE = 64;
const INFLUENCE_RADIUS = 110;

/**
 * macOS-dock-inspired floating bar. Icons scale up smoothly as the cursor
 * approaches, based on horizontal distance from each icon's center.
 * Falls back to a flat, evenly-sized row on touch devices.
 */
export function BottomDock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX(event.clientX - rect.left);
  };

  const handleIconEnter = (label: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({ label, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pb-0 pt-14">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouseX(null)}
        className="no-scrollbar flex max-w-full items-end gap-1.5 overflow-x-auto overflow-y-visible rounded-[28px] border px-2.5 py-2.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:gap-2 sm:px-3"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-card) 82%, transparent)",
          borderColor: "var(--color-border)",
        }}
      >
        {DOCK_LINKS.map((link, index) => {
          const BrandIcon = BRAND_DOCK_ICONS[link.icon];
          const LucideIcon = ICONS[link.icon] ?? Mail;
          const size = computeSize(containerRef, index, mouseX);
          
          // Get brand color based on link label
          let iconColor = "var(--color-ink)";
          if (link.label === "GitHub") iconColor = TECH_COLORS.GitHub || "var(--color-ink)";
          else if (link.label === "LinkedIn") iconColor = TECH_COLORS.LinkedIn || "var(--color-ink)";
          else if (link.label === "Twitter / X") iconColor = TECH_COLORS.Twitter || "var(--color-ink)";
          else if (link.label === "LeetCode") iconColor = TECH_COLORS.LeetCode || "var(--color-ink)";

          return (
            <a
              key={link.id}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              data-cursor="pointer"
              onMouseEnter={handleIconEnter(link.label)}
              onMouseLeave={() => setTooltip(null)}
              className={cn(
                "group relative z-10 flex shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 ease-out hover:z-[60] hover:shadow-md"
              )}
              style={{
                width: size,
                height: size,
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              {BrandIcon ? (
                <BrandIcon
                  aria-hidden
                  className="transition-all duration-300 ease-out"
                  style={{ width: size * 0.42, height: size * 0.42, color: iconColor }}
                />
              ) : (
                <LucideIcon
                  aria-hidden
                  strokeWidth={1.75}
                  className="transition-all duration-300 ease-out"
                  style={{ width: size * 0.42, height: size * 0.42, color: iconColor }}
                />
              )}
            </a>
          );
        })}
      </div>
      {mounted && tooltip &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y - 12,
              backgroundColor: "var(--color-ink)",
              color: "var(--color-bg)",
            }}
          >
            {tooltip.label}
          </span>,
          document.body
        )}
    </div>
  );
}

/**
 * Distance-based size falloff, evaluated per icon on every mouse move.
 * Kept outside React state to avoid re-render thrash; called during render
 * is acceptable here since it's a pure, cheap calculation.
 */
function computeSize(
  containerRef: RefObject<HTMLDivElement | null>,
  index: number,
  mouseX: number | null
): number {
  if (mouseX === null || !containerRef.current) return BASE_SIZE;

  const children = containerRef.current.children;
  const target = children[index] as HTMLElement | undefined;
  if (!target) return BASE_SIZE;

  const iconCenter = target.offsetLeft + target.offsetWidth / 2;
  const distance = Math.abs(mouseX - iconCenter);
  const falloff = clamp(1 - distance / INFLUENCE_RADIUS, 0, 1);

  return Math.round(BASE_SIZE + (MAX_SIZE - BASE_SIZE) * falloff);
}
