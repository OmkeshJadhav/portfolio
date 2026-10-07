import { Braces, MessagesSquare, NotebookText, Terminal, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { SiCss, SiGit, SiHtml5, SiJavascript, SiMongodb, SiNodedotjs, SiPostgresql, SiReact, SiTypescript } from "react-icons/si";

// Keys used by `icon` in constants/notes.ts. Brand logos where one exists,
// lucide glyphs for the non-technology topics.
const NOTE_TOPIC_ICONS: Record<string, IconType | LucideIcon> = {
  html: SiHtml5,
  css: SiCss,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  node: SiNodedotjs,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  git: SiGit,
  terminal: Terminal,
  braces: Braces,
  messages: MessagesSquare,
  notebook: NotebookText,
};

interface TopicIconProps {
  icon: string;
  color?: string;
  className?: string;
}

export function TopicIcon({ icon, color, className }: TopicIconProps) {
  const Icon = NOTE_TOPIC_ICONS[icon] ?? NotebookText;
  return <Icon aria-hidden className={className} style={{ color: color ?? "var(--color-accent)" }} />;
}
