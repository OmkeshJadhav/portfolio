import type { ReactNode } from "react";
import type { NoteInline as NoteInlineSpan } from "@/types/notes";

const CODE_CLASS = "rounded-md border px-1.5 py-0.5 font-mono text-[0.86em]";
const CODE_STYLE = { backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" };

export function NoteInline({ content }: { content: NoteInlineSpan[] }) {
  return (
    <>
      {content.map((span, i) => {
        let node: ReactNode = span.text;
        if (span.code) {
          node = (
            <code className={CODE_CLASS} style={CODE_STYLE}>
              {node}
            </code>
          );
        }
        if (span.italic) node = <em>{node}</em>;
        if (span.bold) node = <strong className="font-semibold">{node}</strong>;
        if (span.href) {
          node = (
            <a
              href={span.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="underline decoration-1 underline-offset-2"
              style={{ color: "var(--color-accent)" }}
            >
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

/** Plain text where `backticked` parts render as inline code — for titles and descriptions. */
export function InlineCodeText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        i % 2 ? (
          <code key={i} className={CODE_CLASS} style={CODE_STYLE}>
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        )
      )}
    </>
  );
}
