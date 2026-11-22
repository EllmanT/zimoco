"use client";
import { useSyncExternalStore } from "react";

// Tiny shared store: the brand pill bar, Top Picks and Our Models all read the same selection.
let active: string | null = null;
const subs = new Set<() => void>();

export function setActiveBrand(uid: string) {
  if (uid === active) return;
  active = uid;
  subs.forEach((f) => f());
}
export function useActiveBrand(fallback: string): string {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => { subs.delete(f); }; },
    () => active ?? fallback,
    () => fallback,
  );
}
