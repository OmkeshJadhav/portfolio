"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/types";
import { PROJECTS } from "@/constants/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { FloatingPreview } from "./FloatingPreview";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

// Portal + focus-trap logic only matters after a user opens a project, so
// it's kept out of the initial bundle.
const ProjectModal = dynamic(() => import("./ProjectModal").then((mod) => mod.ProjectModal), {
  ssr: false,
});

export function ProjectsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const [hovered, setHovered] = useState<Project | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const hoveredIndex = hovered ? PROJECTS.findIndex((p) => p.slug === hovered.slug) : -1;
  const selectedIndex = selected ? PROJECTS.findIndex((p) => p.slug === selected.slug) : -1;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="border-t px-6 py-32 md:px-12 lg:px-20"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work"
          description="A mix of shipped products and personal builds — hover a card for a closer look, click for the full breakdown."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              onHover={setHovered}
              onOpen={setSelected}
            />
          ))}
        </div>
      </div>

      <FloatingPreview project={hovered} projectIndex={hoveredIndex} />
      <ProjectModal project={selected} index={selectedIndex} onClose={() => setSelected(null)} />
    </section>
  );
}
