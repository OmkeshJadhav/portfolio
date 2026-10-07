import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { NoteQuestionCard } from "@/components/notes/NoteQuestionCard";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { NotesToolbar } from "@/components/notes/NotesToolbar";
import { InlineCodeText } from "@/components/notes/NoteInline";
import { TopicIcon } from "@/components/notes/TopicIcon";
import { countCodeBlocks, getNoteTopic, getNoteTopics, getQuestions } from "@/lib/notes";

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getNoteTopics().map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const topic = getNoteTopic((await params).topic);
  if (!topic) return {};
  const title = `${topic.title} Interview Questions & Answers`;
  const description = `${topic.questionCount} ${topic.title} interview questions with answers and code examples. ${topic.description.replace(/`/g, "")}`;
  return {
    title,
    description,
    alternates: { canonical: `/notes/${topic.slug}` },
    openGraph: { title, description, url: `/notes/${topic.slug}` },
  };
}

export default async function NotesTopicPage({ params }: TopicPageProps) {
  const topic = getNoteTopic((await params).topic);
  if (!topic) notFound();

  const questions = getQuestions(topic);
  const codeCount = questions.reduce((n, q) => n + countCodeBlocks(q.blocks), 0);
  const titledSections = topic.sections.filter((s) => s.title);
  const hasSidebar = titledSections.length > 1;
  let number = 0;

  return (
    <div className="px-6 pb-40 pt-28 md:px-12 lg:px-20">
      <div className={hasSidebar ? "mx-auto max-w-7xl" : "mx-auto max-w-3xl"}>
        <Link
          href="/notes"
          data-cursor="pointer"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-ink)]"
          style={{ color: "var(--color-ink-soft)" }}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          All notes
        </Link>

        <header className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl border"
              style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
              <TopicIcon icon={topic.icon} color={topic.color} className="h-7 w-7" />
            </span>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{topic.title}</h1>
          </div>
          <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--color-ink-soft)" }}>
            <InlineCodeText text={topic.description} />
          </p>
          <p className="mt-4 text-sm tabular-nums" style={{ color: "var(--color-ink-soft)" }}>
            {topic.questionCount} questions
            {titledSections.length > 0 && ` · ${titledSections.length} sections`}
            {codeCount > 0 && ` · ${codeCount} code examples`}
          </p>
        </header>

        <div className={hasSidebar ? "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12" : undefined}>
          {hasSidebar && (
            <aside className="hidden lg:block">
              <div data-lenis-prevent className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto pb-6 pr-2">
                <NotesSidebar sections={titledSections} />
              </div>
            </aside>
          )}

          <div className="min-w-0">
            <NotesToolbar containerId="notes-content" total={topic.questionCount} />

            {hasSidebar && (
              <details
                className="group mb-10 rounded-[var(--radius-card)] border lg:hidden"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <summary
                  data-cursor="pointer"
                  className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 text-sm font-medium [&::-webkit-details-marker]:hidden"
                >
                  Jump to section
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" strokeWidth={2} />
                </summary>
                <div className="border-t px-2 py-3" style={{ borderColor: "var(--color-border)" }}>
                  <NotesSidebar sections={titledSections} />
                </div>
              </details>
            )}

            <div id="notes-content" className="space-y-16">
              {topic.sections.map((section) => (
                <section key={section.id} id={section.id} data-note-group className="scroll-mt-28">
                  {section.title && (
                    <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{section.title}</h2>
                  )}
                  <div className="space-y-10">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.id} id={subsection.id} data-note-group className="scroll-mt-28">
                        {subsection.title && (
                          <h3
                            className="mb-4 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {subsection.title}
                          </h3>
                        )}
                        <div className="space-y-3">
                          {subsection.questions.map((question) => (
                            <NoteQuestionCard
                              key={question.id}
                              question={question}
                              number={++number}
                              layout={topic.layout}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
