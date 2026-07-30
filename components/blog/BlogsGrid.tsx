"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLOG_POSTS } from "@/constants/blog";
import { BlogCard } from "./BlogCard";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function BlogsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="blogs"
      ref={sectionRef}
      className="border-t px-6 py-32 md:px-12 lg:px-20"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Writing"
          title="Latest posts"
          description="Notes from building things — mostly the parts that didn't go as planned the first time."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
