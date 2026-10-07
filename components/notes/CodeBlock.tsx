import { highlight } from "@/lib/highlight";
import type { NoteCodeBlock } from "@/types/notes";
import { CopyCodeButton } from "./CopyCodeButton";

const LANG_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  jsx: "JSX",
  typescript: "TypeScript",
  tsx: "TSX",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  json: "JSON",
  bash: "Shell",
  sql: "SQL",
  markdown: "Markdown",
};

export async function CodeBlock({ block }: { block: NoteCodeBlock }) {
  const html = await highlight(block.code, block.lang);

  return (
    <figure
      className="note-code my-3 min-w-0 overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--color-border)" }}
    >
      <figcaption
        className="flex items-center justify-between gap-3 border-b py-1 pl-4 pr-1.5 text-xs"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)", color: "var(--color-ink-soft)" }}
      >
        <span className="truncate font-mono">{block.filename ?? LANG_LABELS[block.lang] ?? block.lang}</span>
        <CopyCodeButton />
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
