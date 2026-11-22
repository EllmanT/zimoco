"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ViewSet } from "@/lib/vehicle-page";

type Tab = { label: string; sets: ViewSet[] };

/**
 * Pill tabs + stage + swatches + arrows. Used for the exterior (Colours | Wheels) and interior (Upholstery | Trims).
 * Arrows only step through the views that were uploaded for the chosen set; a set with one image shows none.
 */
export default function Viewer({ tabs, name, studio }: { tabs: Tab[]; name: string; studio: boolean }) {
  const [t, setT] = useState(0);
  const [s, setS] = useState(0);
  const [v, setV] = useState(0);
  const touch = useRef<number | null>(null);
  const tab = tabs[Math.min(t, tabs.length - 1)];
  const set = tab.sets[Math.min(s, tab.sets.length - 1)];
  const n = set.views.length;
  const view = set.views[Math.min(v, n - 1)];
  const step = (d: number) => setV((i) => (i + d + n) % n);

  // Warm the next and previous view so the crossfade never waits on the network.
  useEffect(() => {
    if (n < 2) return;
    for (const d of [1, -1]) {
      const im = new window.Image();
      im.src = set.views[(v + d + n) % n].src;
    }
  }, [set, v, n]);

  const pick = (fn: () => void) => {
    fn();
    setV(0);
  };

  return (
    <div>
      {tabs.length > 1 && (
        <div role="tablist" aria-label={`${name} options`} className="mx-auto flex w-fit rounded-full border border-line bg-white p-1">
          {tabs.map((x, i) => (
            <button key={x.label} role="tab" aria-selected={i === t} onClick={() => pick(() => { setT(i); setS(0); })} className={`min-h-10 rounded-full px-7 text-sm font-medium transition-colors duration-200 ${i === t ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}>
              {x.label}
            </button>
          ))}
        </div>
      )}

      <div
        className={`relative mt-6 overflow-hidden rounded-3xl ${studio ? "bg-gradient-to-b from-white to-soft" : "bg-ink"}`}
        onKeyDown={(e) => {
          if (n > 1 && e.key === "ArrowRight") step(1);
          if (n > 1 && e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current != null && n > 1) {
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
          }
          touch.current = null;
        }}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={`${name}: ${set.name}`}
      >
        <div className="relative aspect-[4/3] md:aspect-[16/8]">
          {set.views.map((x, i) => (
            <Image
              key={x.src}
              src={x.src}
              alt={`${name}, ${set.name}${n > 1 ? `, ${x.angle}` : ""}`}
              fill
              sizes="(min-width:1400px) 1300px, 100vw"
              className={`${studio ? "object-contain p-4 md:p-8" : "object-cover"} transition-opacity duration-200 ease-out motion-reduce:transition-none ${i === v ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />
          ))}
        </div>
        {n > 1 && (
          <>
            <button aria-label="Previous view" onClick={() => step(-1)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow transition-transform hover:bg-white active:scale-95 md:left-6">‹</button>
            <button aria-label="Next view" onClick={() => step(1)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow transition-transform hover:bg-white active:scale-95 md:right-6">›</button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden>
              {set.views.map((x, i) => <span key={x.src} className={`h-1.5 rounded-full transition-all ${i === v ? "w-5 bg-ink" : "w-1.5 bg-ink/30"}`} />)}
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-muted" aria-live="polite">{set.name}{n > 1 ? ` · ${view.angle}` : ""}</p>
      {tab.sets.length > 1 && (
        <ul className="mt-3 flex flex-wrap justify-center gap-3" aria-label="Options">
          {tab.sets.map((x, i) => (
            <li key={x.name}>
              <button
                aria-label={x.name}
                aria-pressed={i === s}
                title={x.name}
                onClick={() => pick(() => setS(i))}
                className={`grid h-11 w-11 place-items-center rounded-full border-2 transition-[border-color,transform] active:scale-95 ${i === s ? "border-accent" : "border-transparent hover:border-line"}`}
              >
                {x.hex ? (
                  <span className="h-7 w-7 rounded-full ring-1 ring-black/15" style={{ background: x.hex }} />
                ) : (
                  <span className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-black/15"><Image src={x.views[0].src} alt="" fill sizes="28px" className="object-cover" /></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
