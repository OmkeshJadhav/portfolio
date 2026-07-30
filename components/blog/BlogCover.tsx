"use client";

import { BookOpen } from "lucide-react";
import { ImageFallback } from "@/components/ui/ImageFallback";

interface BlogCoverProps {
  src: string;
  alt: string;
  title: string;
  index: number;
  className?: string;
  sizes?: string;
}

export function BlogCover({ src, alt, title, index, className, sizes }: BlogCoverProps) {
  return (
    <ImageFallback
      src={src}
      alt={alt}
      label={title}
      index={index}
      icon={BookOpen}
      className={className}
      sizes={sizes}
    />
  );
}
