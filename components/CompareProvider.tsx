"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const MAX_COMPARE = 3;
const KEY = "zimoco-compare";

type Ctx = {
  slugs: string[];
  has: (s: string) => boolean;
  toggle: (s: string) => boolean;
  set: (s: string[]) => void;
  remove: (s: string) => void;
  clear: () => void;
  full: boolean;
};
const C = createContext<Ctx | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setSlugs((JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[]).slice(0, MAX_COMPARE));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(slugs));
  }, [slugs, ready]);

  const toggle = useCallback((s: string) => {
    let ok = true;
    setSlugs((cur) => {
      if (cur.includes(s)) return cur.filter((x) => x !== s);
      if (cur.length >= MAX_COMPARE) { ok = false; return cur; }
      return [...cur, s];
    });
    return ok;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      slugs,
      has: (s) => slugs.includes(s),
      toggle,
      set: (s) => setSlugs(s.slice(0, MAX_COMPARE)),
      remove: (s) => setSlugs((c) => c.filter((x) => x !== s)),
      clear: () => setSlugs([]),
      full: slugs.length >= MAX_COMPARE,
    }),
    [slugs, toggle],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useCompare() {
  const v = useContext(C);
  if (!v) throw new Error("useCompare outside provider");
  return v;
}
