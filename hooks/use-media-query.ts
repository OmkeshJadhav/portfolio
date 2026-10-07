"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. Reads `false` during SSR and hydration,
 * then the live value — without a setState-in-effect round trip.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true once running in the browser — e.g. to gate portals. */
export function useIsClient(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
