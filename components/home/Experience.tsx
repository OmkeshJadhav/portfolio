"use client";

import { useRef } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiExpress,
  SiDocker,
} from "react-icons/si";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EXPERIENCE_ITEMS } from "@/constants";
import { TECH_COLORS } from "@/constants/icon-colors";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const BRAND_ICONS: Record<string, any> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  "Node.js": SiNodedotjs,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Express: SiExpress,
  Docker: SiDocker,
};

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="border-t px-6 py-32 md:px-12 lg:px-20"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Experience" title="Where I've worked" />

        <ol className="relative">
          {/* connecting line */}
          <span
            aria-hidden
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px"
            style={{ backgroundColor: "var(--color-border)" }}
          />

          {EXPERIENCE_ITEMS.map((item) => (
            <li key={item.company} data-reveal className="relative mb-10 pl-10 last:mb-0">
              <span
                aria-hidden
                className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full border-2"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-accent)",
                }}
              />

              <div
                className="rounded-[var(--radius-card)] border p-6 transition-all duration-300 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.12)] sm:p-8"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      {item.role}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--color-accent)" }}>
                      {item.company}
                    </p>
                  </div>
                  <span className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
                    {item.duration}
                  </span>
                </div>

                <ul className="mb-5 space-y-2">
                  {item.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex gap-2.5 text-sm leading-relaxed sm:text-[15px]"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--color-ink-soft)" }}
                      />
                      {achievement}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => {
                    const BrandIcon = BRAND_ICONS[tech];
                    const iconColor = TECH_COLORS[tech];
                    
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
                      >
                        {BrandIcon && (
                          <BrandIcon
                            className="h-3 w-3"
                            style={{ color: iconColor }}
                          />
                        )}
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
