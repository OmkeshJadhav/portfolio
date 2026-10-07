"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronsDownUp, ChevronsUpDown, Search, X } from "lucide-react";

interface NotesToolbarProps {
  /** id of the element wrapping the rendered questions */
  containerId: string;
  total: number;
}

/**
 * Search, expand/collapse-all and deep-link handling for a notes page.
 * The questions are server-rendered; this only toggles `hidden` / `open`
 * on them, so the content itself never ships as client-side data.
 */
export function NotesToolbar({ containerId, total }: NotesToolbarProps) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState(total);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter questions by title + answer text; hide groups left empty.
  const search = (value: string) => {
    setQuery(value);
    const container = document.getElementById(containerId);
    if (!container) return;
    const terms = value.toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    container.querySelectorAll<HTMLElement>("[data-note-question]").forEach((el) => {
      el.dataset.searchText ??= (el.textContent ?? "").toLowerCase();
      const hit = terms.every((term) => el.dataset.searchText!.includes(term));
      el.hidden = !hit;
      if (hit) count++;
    });
    container.querySelectorAll<HTMLElement>("[data-note-group]").forEach((group) => {
      group.hidden = !group.querySelector("[data-note-question]:not([hidden])");
    });
    setMatches(count);
  };

  // Open the question named in the URL hash — on load and on in-page links.
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target?.hasAttribute("data-note-question")) return;
      if (target instanceof HTMLDetailsElement) target.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  // "/" focuses search, like most docs sites.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing =
        event.target instanceof HTMLElement &&
        event.target.closest("input, textarea, [contenteditable]");
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleAll = () => {
    const next = !expanded;
    document
      .getElementById(containerId)
      ?.querySelectorAll<HTMLDetailsElement>("details")
      .forEach((details) => (details.open = next));
    setExpanded(next);
  };

  return (
    <div className="mb-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label
          className="flex h-11 items-center gap-3 rounded-full sm:flex-1 border px-4 transition-colors duration-200 focus-within:border-[var(--color-accent)]"
          style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <Search
            aria-hidden
            className="h-4 w-4 shrink-0"
            strokeWidth={2}
            style={{ color: "var(--color-ink-soft)" }}
          />
          <span className="sr-only">Search questions</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => search(event.target.value)}
            placeholder={`Search ${total} questions…`}
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-ink-soft)] [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => search("")}
              aria-label="Clear search"
              data-cursor="pointer"
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          ) : (
            <kbd
              className="hidden rounded border px-1.5 font-mono text-[11px] sm:inline"
              style={{ borderColor: "var(--color-border)", color: "var(--color-ink-soft)" }}
            >
              /
            </kbd>
          )}
        </label>

        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <span
            aria-live="polite"
            className="text-xs tabular-nums"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {query ? `${matches} of ${total}` : null}
          </span>
          <button
            type="button"
            onClick={toggleAll}
            data-cursor="pointer"
            className="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200 hover:border-[var(--color-ink-soft)]"
            style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
          >
            {expanded ? (
              <ChevronsDownUp className="h-4 w-4" strokeWidth={2} />
            ) : (
              <ChevronsUpDown className="h-4 w-4" strokeWidth={2} />
            )}
            {expanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>
      {query && matches === 0 && (
        <p className="mt-8 text-center text-sm" style={{ color: "var(--color-ink-soft)" }}>
          No questions match “{query}”.
        </p>
      )}
    </div>
  );
}
