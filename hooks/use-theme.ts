"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const THEME_EVENT = "themechange";

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

// The inline script in app/layout.tsx sets the .dark class before hydration,
// so the class on <html> is the source of truth on the client.
const getSnapshot = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

// The server can't know the theme; React renders this first, then switches
// to the client snapshot without a hydration mismatch.
const getServerSnapshot = (): Theme => "light";

/**
 * Self-contained theme hook. All color values live in CSS custom
 * properties toggled by the `.dark` class on <html> (see globals.css), so
 * no other component needs to know the current theme — this hook only
 * needs to be used by the toggle button itself.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return { theme, toggle };
}
