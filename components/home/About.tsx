"use client";

import { useRef } from "react";
import {
  Briefcase,
  Calendar,
  MapPin,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT_INTRO, ABOUT_INFO_CARDS } from "@/constants";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const ICONS: Record<string, LucideIcon> = {
  Briefcase,
  Calendar,
  MapPin,
  Mail,
};

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="px-6 py-32 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left: Title and Description */}
          <div className="lg:w-1/2">
            <SectionHeading eyebrow="About Me" title="Who I Am" />
            
            <p
              data-reveal
              className="mt-6 text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--color-ink-soft)" }}
            >
              {ABOUT_INTRO}
            </p>
          </div>

          {/* Right: Info Cards Stacked Vertically */}
          <div className="flex flex-col gap-4 lg:w-1/2">
            {ABOUT_INFO_CARDS.map((card) => {
              const Icon = ICONS[card.icon];
              return (
                <div
                  key={card.label}
                  data-reveal
                  className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-[var(--color-card)]"
                  style={{ 
                    borderColor: "var(--color-border)"
                  }}
                >
                  <Icon
                    className="h-6 w-6 flex-shrink-0"
                    strokeWidth={1.75}
                    style={{ color: "var(--color-accent)" }}
                  />
                  <div>
                    <p className="mb-0.5 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-ink-soft)" }}>
                      {card.label}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
                      {card.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
