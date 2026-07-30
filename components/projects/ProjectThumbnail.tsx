"use client";

import { Layers } from "lucide-react";
import { ImageFallback } from "@/components/ui/ImageFallback";

interface ProjectThumbnailProps {
  src: string;
  alt: string;
  title: string;
  index: number;
  className?: string;
  sizes?: string;
}

/**
 * Thin wrapper around the shared ImageFallback for project screenshots.
 * Kept as its own named component so ProjectCard/FloatingPreview/
 * ProjectModal call sites stay unchanged.
 */
export function ProjectThumbnail({ src, alt, title, index, className, sizes }: ProjectThumbnailProps) {
  return (
    <ImageFallback
      src={src}
      alt={alt}
      label={title}
      index={index}
      icon={Layers}
      className={className}
      sizes={sizes}
    />
  );
}
