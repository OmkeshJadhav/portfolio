import { ChevronDown, Link2 } from "lucide-react";
import type { NoteTopicLayout } from "@/constants/notes";
import type { NoteBlock, NoteQuestion } from "@/types/notes";
import { NoteBlocks } from "./NoteBlocks";
import { InlineCodeText } from "./NoteInline";

interface NoteQuestionCardProps {
  question: NoteQuestion;
  number: number;
  layout: NoteTopicLayout;
}

const CARD_CLASS =
  "scroll-mt-28 rounded-[var(--radius-card)] border text-[15px] leading-relaxed transition-shadow duration-300";
const CARD_STYLE = { backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" };

/**
 * One question. "qa" topics collapse the whole answer behind the title;
 * "quiz" topics keep the question's code visible and hide only the answer,
 * so you can work out the output before revealing it.
 */
export function NoteQuestionCard({ question, number, layout }: NoteQuestionCardProps) {
  if (layout === "quiz") {
    const { prompt, answer } = splitPrompt(question.blocks);
    return (
      <article id={question.id} data-note-question className={`group ${CARD_CLASS}`} style={CARD_STYLE}>
        <div className="flex items-start gap-4 px-5 pt-5">
          <QuestionTitle question={question} number={number} />
        </div>
        <div className="px-5 pb-1">
          <NoteBlocks blocks={prompt} />
        </div>
        {answer.length > 0 && (
          <details className="group border-t" style={{ borderColor: "var(--color-border)" }}>
            <summary
              data-cursor="pointer"
              className="flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden"
              style={{ color: "var(--color-accent)" }}
            >
              <span className="group-open:hidden">Show answer</span>
              <span className="hidden group-open:inline">Hide answer</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" strokeWidth={2} />
            </summary>
            <div className="px-5 pb-5">
              <NoteBlocks blocks={answer} />
            </div>
          </details>
        )}
      </article>
    );
  }

  return (
    <details
      id={question.id}
      data-note-question
      className={`group ${CARD_CLASS} open:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.18)]`}
      style={CARD_STYLE}
    >
      <summary
        data-cursor="pointer"
        className="flex cursor-pointer list-none items-start gap-4 p-5 [&::-webkit-details-marker]:hidden"
      >
        <QuestionTitle question={question} number={number} />
        <ChevronDown
          aria-hidden
          className="mt-1 h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
          strokeWidth={2}
          style={{ color: "var(--color-ink-soft)" }}
        />
      </summary>
      <div className="border-t px-5 pb-5 pt-3 sm:pl-[3.75rem]" style={{ borderColor: "var(--color-border)" }}>
        <NoteBlocks blocks={question.blocks} />
      </div>
    </details>
  );
}

function QuestionTitle({ question, number }: { question: NoteQuestion; number: number }) {
  return (
    <>
      <span
        className="mt-0.5 w-6 shrink-0 text-right font-mono text-xs tabular-nums"
        style={{ color: "var(--color-ink-soft)" }}
      >
        {number}
      </span>
      <h3 className="min-w-0 flex-1 font-display text-base font-semibold leading-snug tracking-tight sm:text-[17px]">
        <InlineCodeText text={question.title} />
        <a
          href={`#${question.id}`}
          aria-label="Link to this question"
          data-cursor="pointer"
          className="ml-2 inline-flex align-middle opacity-0 transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-60"
        >
          <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      </h3>
    </>
  );
}

/** Leading code blocks are the question; everything after them is the answer. */
function splitPrompt(blocks: NoteBlock[]) {
  const firstAnswer = blocks.findIndex((b) => b.type !== "code" && b.type !== "codeGroup");
  const cut = firstAnswer === -1 ? blocks.length : firstAnswer;
  return { prompt: blocks.slice(0, cut), answer: blocks.slice(cut) };
}
