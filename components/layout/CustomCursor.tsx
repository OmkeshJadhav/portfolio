"use client";

import { useEffect, useRef, useState } from "react";
import { GiArrowCursor } from "react-icons/gi";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useActiveSection } from "@/hooks/use-active-section";
import { lerp } from "@/lib/utils";

// Per-section accent used to tint the cursor — quiet, not neon.
const SECTION_TINTS: Record<string, string> = {
  home: "#2563EB",
  about: "#2563EB",
  skills: "#7C3AED",
  projects: "#2563EB",
  experience: "#0EA5E9",
  blogs: "#22C55E",
  "open-source": "#111111",
  contact: "#2563EB",
};

/**
 * Renders an arrow cursor with trailing dots that follow behind with
 * progressive lag. The arrow rotates based on movement direction and
 * scales up on interactive elements. Color shifts based on active section.
 * Disabled on touch devices and when reduced motion is requested.
 */
export function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  const dot3Ref = useRef<HTMLDivElement>(null);
  const dot4Ref = useRef<HTMLDivElement>(null);
  const dot5Ref = useRef<HTMLDivElement>(null);
  const dot6Ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const reducedMotion = useReducedMotion();
  const activeSection = useActiveSection();

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(supportsFinePointer && !reducedMotion);
    document.body.classList.toggle("custom-cursor-active", supportsFinePointer && !reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot1 = { x: mouse.x, y: mouse.y };
    const dot2 = { x: mouse.x, y: mouse.y };
    const dot3 = { x: mouse.x, y: mouse.y };
    const dot4 = { x: mouse.x, y: mouse.y };
    const dot5 = { x: mouse.x, y: mouse.y };
    const dot6 = { x: mouse.x, y: mouse.y };
    let rafId: number;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      if (arrowRef.current) {
        arrowRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
    };

    const handlePointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, [data-cursor='pointer']"
      );
      setIsPointer(Boolean(interactive));
    };

    const tick = () => {
      // Progressive lag for trail dots - slower speeds create more spacing
      dot1.x = lerp(dot1.x, mouse.x, 0.12);
      dot1.y = lerp(dot1.y, mouse.y, 0.12);

      dot2.x = lerp(dot2.x, dot1.x, 0.10);
      dot2.y = lerp(dot2.y, dot1.y, 0.10);

      dot3.x = lerp(dot3.x, dot2.x, 0.08);
      dot3.y = lerp(dot3.y, dot2.y, 0.08);

      dot4.x = lerp(dot4.x, dot3.x, 0.06);
      dot4.y = lerp(dot4.y, dot3.y, 0.06);

      dot5.x = lerp(dot5.x, dot4.x, 0.04);
      dot5.y = lerp(dot5.y, dot4.y, 0.04);

      dot6.x = lerp(dot6.x, dot5.x, 0.02);
      dot6.y = lerp(dot6.y, dot5.y, 0.02);

      if (dot1Ref.current) {
        dot1Ref.current.style.transform = `translate3d(${dot1.x}px, ${dot1.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot2Ref.current) {
        dot2Ref.current.style.transform = `translate3d(${dot2.x}px, ${dot2.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot3Ref.current) {
        dot3Ref.current.style.transform = `translate3d(${dot3.x}px, ${dot3.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot4Ref.current) {
        dot4Ref.current.style.transform = `translate3d(${dot4.x}px, ${dot4.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot5Ref.current) {
        dot5Ref.current.style.transform = `translate3d(${dot5.x}px, ${dot5.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot6Ref.current) {
        dot6Ref.current.style.transform = `translate3d(${dot6.x}px, ${dot6.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handlePointerOver);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handlePointerOver);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  const tint = SECTION_TINTS[activeSection] ?? "#2563EB";
  const scale = isPointer ? 1.4 : 1;

  return (
    <>
      {/* Arrow cursor */}
      <div
        ref={arrowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          transition: "font-size 0.3s var(--ease-out-soft)",
          willChange: "transform",
        }}
      >
        <GiArrowCursor
          size={isPointer ? 28 : 20}
          color={tint}
          style={{
            transition: "font-size 0.3s var(--ease-out-soft)",
          }}
        />
      </div>

      {/* Trail dots */}
      <div
        ref={dot1Ref}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full"
        style={{
          width: 8 * scale,
          height: 8 * scale,
          backgroundColor: tint,
          opacity: 0.8,
          transition: "background-color 0.4s var(--ease-out-soft), width 0.3s var(--ease-out-soft), height 0.3s var(--ease-out-soft)",
          willChange: "transform",
        }}
      />
      <div
        ref={dot2Ref}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9997] rounded-full"
        style={{
          width: 6 * scale,
          height: 6 * scale,
          backgroundColor: tint,
          opacity: 0.6,
          transition: "background-color 0.4s var(--ease-out-soft), width 0.3s var(--ease-out-soft), height 0.3s var(--ease-out-soft)",
          willChange: "transform",
        }}
      />
      <div
        ref={dot3Ref}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9996] rounded-full"
        style={{
          width: 5 * scale,
          height: 5 * scale,
          backgroundColor: tint,
          opacity: 0.4,
          transition: "background-color 0.4s var(--ease-out-soft), width 0.3s var(--ease-out-soft), height 0.3s var(--ease-out-soft)",
          willChange: "transform",
        }}
      />
      <div
        ref={dot4Ref}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9995] rounded-full"
        style={{
          width: 4 * scale,
          height: 4 * scale,
          backgroundColor: tint,
          opacity: 0.3,
          transition: "background-color 0.4s var(--ease-out-soft), width 0.3s var(--ease-out-soft), height 0.3s var(--ease-out-soft)",
          willChange: "transform",
        }}
      />
      <div
        ref={dot5Ref}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9994] rounded-full"
        style={{
          width: 3 * scale,
          height: 3 * scale,
          backgroundColor: tint,
          opacity: 0.2,
          transition: "background-color 0.4s var(--ease-out-soft), width 0.3s var(--ease-out-soft), height 0.3s var(--ease-out-soft)",
          willChange: "transform",
        }}
      />
      <div
        ref={dot6Ref}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9993] rounded-full"
        style={{
          width: 2 * scale,
          height: 2 * scale,
          backgroundColor: tint,
          opacity: 0.1,
          transition: "background-color 0.4s var(--ease-out-soft), width 0.3s var(--ease-out-soft), height 0.3s var(--ease-out-soft)",
          willChange: "transform",
        }}
      />
    </>
  );
}
