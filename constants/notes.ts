// Display settings for each notes topic, keyed by the slug the converter
// derives from the .docx file name (see scripts/sync-notes.mjs). A topic
// without an entry here still shows up — with its file-name title and a
// generic icon — so dropping a new .docx in content/notes-src/ just works.

export type NoteTopicLayout = "qa" | "quiz";

export interface NoteTopicMeta {
  title?: string;
  description: string;
  icon: string; // key in NOTE_TOPIC_ICONS (components/notes/TopicIcon.tsx)
  color?: string;
  /** "quiz" keeps each question's code visible and hides the answer. */
  layout?: NoteTopicLayout;
}

export const NOTE_TOPICS: Record<string, NoteTopicMeta> = {
  html: {
    title: "HTML",
    description: "Document structure, semantic elements, attributes, links, forms and HTML5 APIs.",
    icon: "html",
    color: "#E34F26",
  },
  css: {
    title: "CSS",
    description: "Selectors, specificity, the box model, positioning, Flexbox and responsive design.",
    icon: "css",
    color: "#663399",
  },
  javascript: {
    title: "JavaScript",
    description: "Scope, hoisting, closures, `this`, prototypes, the event loop, async code and the DOM.",
    icon: "javascript",
    color: "#F7DF1E",
  },
  "output-based-questions": {
    title: "JS Output Questions",
    description: "Predict what the snippet logs — coercion, scope, closures, `this`, promises and more.",
    icon: "terminal",
    layout: "quiz",
  },
  "interview-coding-questions": {
    title: "JS Coding Questions",
    description: "Classic string and array problems, each with a worked JavaScript solution.",
    icon: "braces",
  },
  typescript: {
    title: "TypeScript",
    description: "Types, interfaces vs type aliases, classes, generics, modules and type guards.",
    icon: "typescript",
    color: "#3178C6",
  },
  react: {
    title: "React",
    description: "Virtual DOM, components, hooks, routing, Redux, performance, testing and security.",
    icon: "react",
    color: "#61DAFB",
  },
  "questions-to-ask-at-the-end-of-the-interview": {
    title: "Questions to Ask",
    description: "Good questions to ask the interviewer at the end — and what to listen for in the answers.",
    icon: "messages",
  },
};
