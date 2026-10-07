import { createHighlighter, type Highlighter } from "shiki";

// Languages the notes converter can emit (see guessLang in scripts/sync-notes.mjs).
const LANGS = ["javascript", "jsx", "typescript", "tsx", "html", "css", "scss", "json", "bash", "sql", "markdown"];

let highlighter: Promise<Highlighter> | null = null;

/**
 * Highlights code at build time with both themes baked in as CSS variables
 * (--shiki-light / --shiki-dark); globals.css picks one based on the .dark
 * class, so the theme toggle needs no client-side highlighting.
 */
export async function highlight(code: string, lang: string): Promise<string> {
  highlighter ??= createHighlighter({ themes: ["github-light", "github-dark"], langs: LANGS });
  const hl = await highlighter;
  return hl.codeToHtml(code, {
    lang: LANGS.includes(lang) ? lang : "text",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
