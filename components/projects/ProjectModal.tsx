"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, Github, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { ProjectThumbnail } from "./ProjectThumbnail";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface ProjectModalProps {
  project: Project | null;
  index: number;
  onClose: () => void;
}

export function ProjectModal({ project, index, onClose }: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = project !== null;

  useEffect(() => setMounted(true), []);
  useFocusTrap(dialogRef, isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      window.__lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      window.__lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !project) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(17,17,17,0.5)", backdropFilter: "blur(4px)" }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-card)] border shadow-2xl"
        style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          data-cursor="pointer"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 hover:bg-[var(--color-bg)]"
          style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="relative aspect-[16/9] w-full">
          <ProjectThumbnail
            src={project.image}
            alt={`${project.title} preview`}
            title={project.title}
            index={index}
            sizes="768px"
          />
        </div>

        <div className="p-6 sm:p-10">
          <h2 id="project-modal-title" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.title}
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
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

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveDemo ? (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                Live Demo
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            ) : null}
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Github className="h-4 w-4" strokeWidth={1.75} />
                View Code
              </a>
            ) : null}
          </div>

          <ModalSection title="Overview">
            <p className="text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--color-ink-soft)" }}>
              {project.overview}
            </p>
          </ModalSection>

          <ModalSection title="Features">
            <ul className="space-y-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-2.5 text-sm leading-relaxed sm:text-[15px]"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--color-ink-soft)" }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </ModalSection>

          <ModalSection title="Architecture">
            <p className="text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--color-ink-soft)" }}>
              {project.architecture}
            </p>
          </ModalSection>

          <ModalSection title="Tech Stack">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border px-2 py-1 text-[11px] font-medium"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </ModalSection>

          <ModalSection title="Challenges">
            <p className="text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--color-ink-soft)" }}>
              {project.challenges}
            </p>
          </ModalSection>

          {project.gallery.length > 0 ? (
            <ModalSection title="Gallery">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {project.gallery.map((src, i) => (
                  <div key={src} className="relative aspect-video overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
                    <ProjectThumbnail src={src} alt={`${project.title} gallery image ${i + 1}`} title={project.title} index={index + i} sizes="240px" />
                  </div>
                ))}
              </div>
            </ModalSection>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-8 border-t pt-8" style={{ borderColor: "var(--color-border)" }}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-ink-soft)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
