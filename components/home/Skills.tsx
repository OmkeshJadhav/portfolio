"use client";

import { useRef } from "react";
import {
  Atom,
  Triangle,
  FileCode,
  Wind,
  Hexagon,
  Server,
  Leaf,
  Database,
  Zap,
  Box,
  Cloud,
  CloudCog,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiGit,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SKILLS, SKILL_ICON_MAP } from "@/constants";
import { TECH_COLORS } from "@/constants/icon-colors";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const ICONS: Record<string, LucideIcon> = {
  Atom,
  Triangle,
  FileCode,
  Wind,
  Hexagon,
  Server,
  Leaf,
  Database,
  Zap,
  Box,
  Cloud,
  CloudCog,
  GitBranch,
};

const BRAND_ICONS: Record<string, IconType> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  Docker: SiDocker,
  Git: SiGit,
};

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="border-t px-6 py-32 md:px-12 lg:px-20"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Skills"
          title="My Toolbox"
          description="A working toolkit spanning the browser to the database - used together often enough that I know their edges, not just their happy paths."
        />

        <div data-reveal className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => {
            const BrandIcon = BRAND_ICONS[skill.name];
            const iconName = SKILL_ICON_MAP[skill.name];
            const LucideIcon = iconName ? ICONS[iconName] : undefined;
            const brandColor = TECH_COLORS[skill.name];

            return (
              <span
                key={skill.name}
                data-cursor="pointer"
                className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-ink)",
                }}
              >
                {BrandIcon ? (
                  <BrandIcon
                    className="h-4 w-4"
                    style={{ color: brandColor }}
                  />
                ) : LucideIcon && brandColor ? (
                  <LucideIcon
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    style={{ color: brandColor }}
                  />
                ) : LucideIcon ? (
                  <LucideIcon
                    className="h-4 w-4 transition-colors duration-300 group-hover:text-[var(--color-accent)]"
                    strokeWidth={1.75}
                    style={{ color: "var(--color-ink-soft)" }}
                  />
                ) : null}
                {skill.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
