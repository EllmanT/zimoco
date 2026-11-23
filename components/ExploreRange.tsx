"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { FACES_LEFT } from "@/lib/catalogue";

export type RangeItem = {
  slug: string;
  brand: string;
  name: string;
  body: string;
  price: string;
  image: { src: string; studio: boolean } | null;
};

const tabLabel: Record<string, string> = { Pickup: "Pickups", SUV: "SUVs", Hatchback: "Hatchbacks", Commercial: "Commercial" };

/**
 * Homepage showroom: one vehicle at a time on a soft gradient, no cards or borders.
 * Layout pattern: Asia Mobility "Explore our range". Arrows walk the whole range, tabs jump between categories.
 */
export default function ExploreRange({ items }: { items: RangeItem[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const x0 = useRef<number | null>(null);
  const n = items.length;
  if (!n) return null;

  const cur = items[i];
  const tabs = [...new Set(items.map((m) => m.body))];
  const inTab = items.map((m, idx) => ({ m, idx })).filter((o) => o.m.body === cur.body);
  const go = (to: number, d: 1 | -1) => { setDir(d); setI(((to % n) + n) % n); };
  const jump = (body: string) => {
    const first = items.findIndex((m) => m.body === body);
    if (first >= 0 && body !== cur.body) go(first, first > i ? 1 : -1);
  };

  return (
    <section
      aria-label="Explore our range"
      className="relative overflow-hidden py-10 md:py-12"
      style={{ background: "linear-gradient(to bottom, #ffffff 0%, #f1f3f5 22%, #e7ebef 50%, #f3f5f7 80%, #ffffff 100%)" }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1, 1); if (e.key === "ArrowLeft") go(i - 1, -1); }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-sm font-bold uppercase tracking-[0.35em] text-ink md:text-base">Explore our range</h2>

        <div role="tablist" aria-label="Vehicle category" className="no-scrollbar mt-4 flex gap-1 overflow-x-auto whitespace-nowrap sm:flex-wrap sm:justify-center sm:overflow-visible">
          {tabs.map((t) => {
            const on = t === cur.body;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={on}
                onClick={() => jump(t)}
                className={`shrink-0 border-b-2 px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-200 md:px-5 md:text-sm ${on ? "border-ink font-semibold text-ink" : "border-transparent font-medium text-muted hover:text-ink"}`}
              >
                {tabLabel[t] ?? t}
              </button>
            );
          })}
        </div>

        <div
          className="relative mt-2 flex items-center justify-center md:mt-3"
          onPointerDown={(e) => (x0.current = e.clientX)}
          onPointerUp={(e) => {
            if (x0.current === null) return;
            const dx = e.clientX - x0.current;
            x0.current = null;
            if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1, dx < 0 ? 1 : -1);
          }}
        >
          <button type="button" onClick={() => go(i - 1, -1)} aria-label="Previous vehicle" className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur-sm transition-[background-color,transform] duration-200 hover:bg-white active:scale-95 md:h-12 md:w-12">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M10 3 5 8l5 5" /></svg>
          </button>

          {/* Height follows the screen (never taller than ~36% of it) so category, image, text and dots share one laptop view. */}
          <div key={cur.slug} className={`group relative mx-auto h-[clamp(220px,42svh,440px)] w-full max-w-4xl px-10 md:px-14 ${dir === 1 ? "showcase-in-r" : "showcase-in-l"}`}>
            <Link href={`/showroom/${cur.slug}`} aria-label={`${cur.brand} ${cur.name}`} className="absolute inset-x-10 inset-y-0 md:inset-x-14">
              {cur.image ? (
                <Image
                  src={cur.image.src}
                  alt={`${cur.brand} ${cur.name}`}
                  fill
                  priority
                  style={FACES_LEFT.has(cur.slug) ? { transform: "scaleX(-1)" } : undefined}
                  sizes="(max-width: 768px) 90vw, 896px"
                  className={cur.image.studio
                    ? "object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.18)] transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.02]"
                    : "object-cover [mask-image:radial-gradient(ellipse_at_center,#000_48%,transparent_74%)] transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.02]"}
                />
              ) : (
                <span className="grid h-full place-items-center text-sm text-muted">Images coming soon</span>
              )}
            </Link>
          </div>

          <button type="button" onClick={() => go(i + 1, 1)} aria-label="Next vehicle" className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur-sm transition-[background-color,transform] duration-200 hover:bg-white active:scale-95 md:h-12 md:w-12">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 3 5 5-5 5" /></svg>
          </button>
        </div>

        <div key={`${cur.slug}-cap`} className="-mt-1 text-center panel-in" aria-live="polite">
          <p className="display mt-1 flex items-baseline justify-center gap-3 text-[clamp(1.6rem,3vw,2.4rem)]">
            <span className="text-[0.4em] font-semibold uppercase tracking-[0.25em] text-muted">{cur.brand}</span>
            <span>{cur.name}</span>
          </p>
          <p className="tnum mt-1 text-muted"><span>From </span><span className="font-semibold text-ink">{cur.price}</span></p>
          <Link href={`/showroom/${cur.slug}`} className="group/cta mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-[opacity,transform] duration-200 hover:opacity-85 active:scale-[0.97]">
            Explore {cur.name}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-200 group-hover/cta:translate-x-1"><path d="M5 2.5 9.5 7 5 11.5" /></svg>
          </Link>
        </div>

        {inTab.length > 1 && (
          <ul className="mt-1 flex justify-center" aria-label="Vehicles in this category">
            {inTab.map(({ m, idx }) => (
              <li key={m.slug}>
                <button type="button" onClick={() => go(idx, idx > i ? 1 : -1)} aria-label={`Show ${m.name}`} aria-current={idx === i ? "true" : undefined} className="grid h-7 w-6 place-items-center">
                  <span className={`h-1.5 rounded-full transition-all duration-300 ${idx === i ? "w-6 bg-ink" : "w-3 bg-black/20 hover:bg-black/35"}`} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
