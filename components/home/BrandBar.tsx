"use client";

import { useEffect, useRef, useState } from "react";
import { setActiveBrand, useActiveBrand } from "@/lib/brand-store";

type P = { brands: { uid: string; name: string; inert?: boolean }[]; label: string };

/**
 * Wide pill bar. Sits over the bottom of the hero; once scrolled past it docks under the header
 * and stays there until the "Our models" section ends (marked with [data-brand-end]).
 */
export default function BrandBar({ brands, label }: P) {
  const active = useActiveBrand(brands[0]?.uid ?? "");
  const holder = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const on = () => {
      const top = el.getBoundingClientRect().top;
      const end = document.querySelector("[data-brand-end]")?.getBoundingClientRect().bottom ?? Infinity;
      setDocked(top <= 56 + 12 && end > 56 + 72);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  return (
    <div ref={holder} className="relative z-30 -mt-8 h-[3.75rem]">
      <div className={docked ? "fixed inset-x-0 top-[3.75rem] z-40 px-5 md:px-8" : "absolute inset-x-0 top-0 px-5 md:px-8"}>
        <div className="mx-auto max-w-[1600px]">
          <div role="tablist" aria-label={label} className={`no-scrollbar flex gap-1 overflow-x-auto rounded-full lg:justify-between lg:overflow-visible bg-white p-1.5 ${docked ? "shadow-[0_8px_24px_rgba(0,0,0,.18)]" : "shadow-[0_16px_40px_-12px_rgba(0,0,0,.35)]"}`}>
            {brands.map((b) => (
              <button
                key={b.uid}
                role="tab"
                aria-selected={!b.inert && b.uid === active}
                onClick={b.inert ? undefined : () => setActiveBrand(b.uid)}
                className={`min-h-11 shrink-0 rounded-full px-5 text-[0.95rem] lg:flex-1 lg:px-2 font-medium transition-colors duration-200 ${!b.inert && b.uid === active ? "bg-sky text-black" : "text-ink/70 hover:bg-sky-soft hover:text-ink"}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
