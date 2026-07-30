import { GitPullRequest, CircleDot, Github } from "lucide-react";
import type { OpenSourceContribution } from "@/types";

interface OpenSourceCardProps {
  item: OpenSourceContribution;
}

export function OpenSourceCard({ item }: OpenSourceCardProps) {
  return (
    <div
      data-reveal
      className="flex h-full flex-col rounded-[var(--radius-card)] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.12)]"
      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight sm:text-base">{item.repository}</p>
          <span
            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-ink-soft)" }}
          >
            {item.technology}
          </span>
        </div>
        <a
          href={item.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${item.repository} on GitHub`}
          data-cursor="pointer"
          className="shrink-0 rounded-full border p-2 transition-colors duration-200 hover:border-[var(--color-accent)]"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Github className="h-4 w-4" strokeWidth={1.75} />
        </a>
      </div>

      <p className="mb-5 flex-1 text-sm leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
        {item.contribution}
      </p>

      <div className="flex flex-wrap gap-4 text-sm font-medium">
        <a
          href={item.prUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-success)" }}
        >
          <GitPullRequest className="h-4 w-4" strokeWidth={1.75} />
          Merged PR
        </a>
        {item.issueUrl ? (
          <a
            href={item.issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--color-accent)]"
            style={{ color: "var(--color-ink-soft)" }}
          >
            <CircleDot className="h-4 w-4" strokeWidth={1.75} />
            Issue
          </a>
        ) : null}
      </div>
    </div>
  );
}
