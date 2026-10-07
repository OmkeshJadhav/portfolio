import type { NoteSection } from "@/types/notes";

/** Section → subsection outline with question counts; plain anchor links. */
export function NotesSidebar({ sections }: { sections: NoteSection[] }) {
  return (
    <nav aria-label="Sections" className="text-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>
        Sections
      </p>
      <ul className="space-y-0.5">
        {sections.map((section) => {
          const count = section.subsections.reduce((n, ss) => n + ss.questions.length, 0);
          const named = section.subsections.filter((ss) => ss.title);
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-cursor="pointer"
                className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-[var(--color-card)]"
              >
                <span className="font-medium">{section.title}</span>
                <span className="text-xs tabular-nums" style={{ color: "var(--color-ink-soft)" }}>
                  {count}
                </span>
              </a>
              {named.length > 0 && (
                <ul className="mb-1 ml-3 border-l pl-2" style={{ borderColor: "var(--color-border)" }}>
                  {named.map((ss) => (
                    <li key={ss.id}>
                      <a
                        href={`#${ss.id}`}
                        data-cursor="pointer"
                        className="block rounded-lg px-3 py-1 text-[13px] transition-colors duration-200 hover:bg-[var(--color-card)]"
                        style={{ color: "var(--color-ink-soft)" }}
                      >
                        {ss.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
