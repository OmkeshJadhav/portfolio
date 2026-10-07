import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InlineCodeText } from "@/components/notes/NoteInline";
import { TopicIcon } from "@/components/notes/TopicIcon";
import { getNoteTopics } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Interview notes on HTML, CSS, JavaScript, TypeScript and React — questions with answers and code examples.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  const topics = getNoteTopics();
  const total = topics.reduce((n, topic) => n + topic.questionCount, 0);

  return (
    <div className="px-6 pb-40 pt-32 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Notes"
          title="Interview notes"
          description={`${total} questions I've collected and answered while preparing for frontend and full-stack interviews — with code for most of them.`}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => {
            const sections = topic.sections.filter((s) => s.title).length;
            return (
              <Link
                key={topic.slug}
                href={`/notes/${topic.slug}`}
                data-cursor="pointer"
                className="group flex h-full flex-col rounded-[var(--radius-card)] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.12)]"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <div className="mb-6 flex items-start justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                    style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}
                  >
                    <TopicIcon icon={topic.icon} color={topic.color} className="h-6 w-6" />
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                    style={{ color: "var(--color-ink-soft)" }}
                  />
                </div>

                <h2 className="mb-2 font-display text-xl font-semibold tracking-tight">{topic.title}</h2>
                <p className="mb-6 flex-1 text-sm leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
                  <InlineCodeText text={topic.description} />
                </p>

                <p className="text-xs font-medium tabular-nums" style={{ color: "var(--color-ink-soft)" }}>
                  {topic.questionCount} questions
                  {sections > 0 && ` · ${sections} sections`}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
