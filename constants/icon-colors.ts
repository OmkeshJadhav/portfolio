// Official brand colors for technologies and platforms
export const TECH_COLORS: Record<string, string> = {
  React: "#61DAFB",
  "Next.js": "#000000",
  TypeScript: "#3178C6",
  "Tailwind CSS": "#06B6D4",
  "Node.js": "#339933",
  Express: "#000000",
  MongoDB: "#47A248",
  PostgreSQL: "#4169E1",
  Redis: "#DC382D",
  Docker: "#2496ED",
  AWS: "#FF9900",
  Azure: "#0078D4",
  Git: "#F05032",
  GitHub: "#181717",
  LinkedIn: "#0A66C2",
  Twitter: "#000000",
  LeetCode: "#FFA116",
};

// Dark mode color overrides for logos that need adjustment
export const TECH_COLORS_DARK: Record<string, string> = {
  "Next.js": "#FFFFFF",
  Express: "#FFFFFF",
  GitHub: "#FFFFFF",
  Twitter: "#FFFFFF",
};

export function getTechColor(tech: string, isDark: boolean = false): string {
  if (isDark && TECH_COLORS_DARK[tech]) {
    return TECH_COLORS_DARK[tech];
  }
  return TECH_COLORS[tech] || "var(--color-ink-soft)";
}
