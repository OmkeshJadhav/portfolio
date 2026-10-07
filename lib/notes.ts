import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { NOTE_TOPICS, type NoteTopicMeta } from "@/constants/notes";
import type { NoteBlock, NoteQuestion, NoteTopic } from "@/types/notes";

const NOTES_DIR = path.join(process.cwd(), "content/notes");

export type NoteTopicWithMeta = NoteTopic & Required<Pick<NoteTopicMeta, "title" | "layout">> & NoteTopicMeta;

function withMeta(topic: NoteTopic): NoteTopicWithMeta {
  const meta = NOTE_TOPICS[topic.slug];
  return {
    ...topic,
    description: meta?.description ?? `${topic.questionCount} interview questions with answers.`,
    icon: meta?.icon ?? "notebook",
    color: meta?.color,
    title: meta?.title ?? topic.title,
    layout: meta?.layout ?? "qa",
  };
}

/** All topics, in the order set by the number prefix of their .docx file. */
export const getNoteTopics = cache((): NoteTopicWithMeta[] => {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => withMeta(JSON.parse(fs.readFileSync(path.join(NOTES_DIR, file), "utf8")) as NoteTopic))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
});

export function getNoteTopic(slug: string): NoteTopicWithMeta | undefined {
  return getNoteTopics().find((topic) => topic.slug === slug);
}

export function getQuestions(topic: NoteTopic): NoteQuestion[] {
  return topic.sections.flatMap((s) => s.subsections.flatMap((ss) => ss.questions));
}

export function countCodeBlocks(blocks: NoteBlock[]): number {
  return blocks.reduce((n, block) => {
    if (block.type === "code") return n + 1;
    if (block.type === "codeGroup") return n + block.blocks.length;
    if (block.type === "list") return n + block.items.reduce((m, item) => m + countCodeBlocks(item.children), 0);
    if (block.type === "callout") return n + countCodeBlocks(block.blocks);
    return n;
  }, 0);
}
