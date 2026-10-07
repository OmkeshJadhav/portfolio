// Shape of the JSON files in content/notes/, generated from the .docx
// sources by scripts/sync-notes.mjs. Keep the two in sync.

export interface NoteInline {
  text: string;
  bold?: true;
  italic?: true;
  code?: true;
  href?: string;
}

export interface NoteCodeBlock {
  type: "code";
  code: string;
  lang: string;
  filename?: string;
}

export type NoteBlock =
  | { type: "paragraph"; content: NoteInline[] }
  | { type: "heading"; content: NoteInline[] }
  | { type: "list"; ordered: boolean; items: NoteListItem[] }
  | NoteCodeBlock
  | { type: "codeGroup"; blocks: NoteCodeBlock[] }
  | { type: "table"; header: NoteInline[][]; rows: NoteInline[][][] }
  | { type: "callout"; blocks: NoteBlock[] }
  | { type: "image"; src: string; width: number; height: number };

export interface NoteListItem {
  content: NoteInline[];
  children: NoteBlock[];
}

export interface NoteQuestion {
  id: string;
  title: string;
  blocks: NoteBlock[];
}

export interface NoteSubsection {
  id: string;
  title: string | null;
  questions: NoteQuestion[];
}

export interface NoteSection {
  id: string;
  title: string | null;
  subsections: NoteSubsection[];
}

export interface NoteTopic {
  slug: string;
  title: string;
  order: number;
  source: string;
  questionCount: number;
  sections: NoteSection[];
}
