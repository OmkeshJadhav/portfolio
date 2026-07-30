"use client";

import { Github, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { useTilt } from "@/hooks/use-tilt";

interface ProjectCardProps {
  project: Project;
  index: number;
  onHover: (project: Project | null) => void;
  onOpen: (project: Project) => void;
}

export function ProjectCard({ project, index, onHover, onOpen }: ProjectCardProps) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 5, scale: 1.015 });

  return (
    <div
      ref={tiltRef}
      data-reveal
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border"
      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      <button
        type="button"
        data-cursor="pointer"
        onClick={() => onOpen(project)}
        aria-label={`View details for ${project.title}`}
        className="relative aspect-[16/10] w-full text-left"
      >
        <ProjectThumbnail
          src={project.image}
          alt={`${project.title} preview`}
          title={project.title}
          index={index}
        />
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: "var(--color-bg)", color: "var(--color-ink-soft)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          data-cursor="pointer"
          onClick={() => onOpen(project)}
          className="mb-2 text-left text-lg font-semibold tracking-tight transition-colors duration-200 hover:text-[var(--color-accent)] sm:text-xl"
        >
          {project.title}
        </button>

        <p
          className="mb-5 flex-1 text-sm leading-relaxed"
          style={{ color: "var(--color-ink-soft)" }}
        >
          {project.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border px-2 py-1 text-[11px] font-medium"
              style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <Github className="h-4 w-4" strokeWidth={1.75} />
              Code
            </a>
          ) : null}
          {project.liveDemo ? (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-ink-soft)" }}
            >
              Live Demo
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
