"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OPEN_SOURCE_CONTRIBUTIONS } from "@/constants/open-source";
import { OpenSourceCard } from "./OpenSourceCard";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function OpenSourceGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="open-source"
      ref={sectionRef}
      className="border-t px-6 py-32 md:px-12 lg:px-20"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Open Source"
          title="Contributions"
          description="Small fixes and docs improvements to projects I use daily — the kind of thing that's easy to skip but worth doing."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OPEN_SOURCE_CONTRIBUTIONS.map((item) => (
            <OpenSourceCard key={item.repository} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
