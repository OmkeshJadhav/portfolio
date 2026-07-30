"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="pointer"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-card) 82%, transparent)",
        borderColor: "var(--color-border)",
      }}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" strokeWidth={1.75} style={{ color: "var(--color-ink)" }} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.75} style={{ color: "var(--color-ink)" }} />
      )}
    </button>
  );
}
