"use client";

import { useEffect, useRef, useState } from "react";
import { Ring } from "./Ring";

type Item = { id: string; label: string };

/**
 * Left-hand section rail (desktop). Tiny dots; the current section becomes a red ring that fills with the
 * reader's progress through that section. No visible labels (aria-label only).
 */
export default function DotRail({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const measure = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.5;
        const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        let cur = 0;
        items.forEach((it, i) => {
          const el = document.getElementById(it.id);
          if (el && el.getBoundingClientRect().top <= line) cur = i;
        });
        if (atEnd) cur = items.length - 1;
        const el = document.getElementById(items[cur].id);
        if (atEnd) setProgress(1);
        else if (el) {
          const r = el.getBoundingClientRect();
          setProgress(Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height))));
        }
        setActive(cur);
      });
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [items]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });

  return (
    <nav aria-label="Page sections" className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <ul className="rounded-full bg-white/85 px-2 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li key={it.id} className="relative">
              <button type="button" onClick={() => go(it.id)} aria-label={it.label} aria-current={on ? "true" : undefined} className="group grid h-8 w-8 place-items-center">
                {on ? (
                  <span className="relative grid place-items-center">
                    <Ring size={24} stroke={1.8} progress={progress} className="text-accent" trackClassName="!text-black" />
                    <span className="absolute h-1 w-1 rounded-full bg-accent" />
                  </span>
                ) : (
                  <span className={`h-1.5 w-1.5 rounded-full transition-[transform,background-color] duration-300 group-hover:scale-150 group-hover:bg-accent ${i < active ? "bg-accent" : "bg-black/45"}`} />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
