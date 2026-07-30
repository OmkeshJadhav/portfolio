"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/types";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { lerp, clamp } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface FloatingPreviewProps {
  project: Project | null;
  projectIndex: number;
}

const WIDTH = 320;
const HEIGHT = 220;
const OFFSET_X = 28;
const OFFSET_Y = -HEIGHT / 2;

/**
 * A fixed-position panel that trails the cursor while a project card is
 * hovered — lerped like the custom cursor for a smooth, non-gimmicky feel,
 * with a slight rotation driven by horizontal velocity and a scale-in on
 * appear. Hidden entirely on touch devices and under reduced motion (the
 * card's own tilt + click-to-open modal cover those cases instead).
 */
export function FloatingPreview({ project, projectIndex }: FloatingPreviewProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(supportsFinePointer && !reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const mouse = { x: -9999, y: -9999 };
    const pos = { x: -9999, y: -9999 };
    let rafId: number;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const tick = () => {
      const prevX = pos.x;
      pos.x = lerp(pos.x, mouse.x, 0.14);
      pos.y = lerp(pos.y, mouse.y, 0.14);

      const velocity = clamp(pos.x - prevX, -40, 40);
      const rotation = clamp(velocity * 0.6, -10, 10);

      if (panelRef.current) {
        const maxX = window.innerWidth - WIDTH - 24;
        const clampedX = clamp(pos.x + OFFSET_X, 24, Math.max(24, maxX));
        panelRef.current.style.transform = `translate3d(${clampedX}px, ${pos.y + OFFSET_Y}px, 0) rotate(${rotation}deg)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={panelRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] overflow-hidden rounded-2xl border shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] transition-opacity duration-300"
      style={{
        width: WIDTH,
        height: HEIGHT,
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-card)",
        opacity: project ? 1 : 0,
        willChange: "transform, opacity",
      }}
    >
      {project ? (
        <ProjectThumbnail
          src={project.image}
          alt=""
          title={project.title}
          index={projectIndex}
          className="h-full w-full"
          sizes="320px"
        />
      ) : null}
    </div>
  );
}
