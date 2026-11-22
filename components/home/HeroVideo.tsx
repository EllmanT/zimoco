"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroSlide = { video: string; kicker: string; headline: string; body: string; primary: { label: string; href: string } | null; secondary: { label: string; href: string } | null };

const LIBRARY = "483818";
const DURATION = 10000;
const embed = (id: string) => `https://iframe.mediadelivery.net/embed/${LIBRARY}/${id}?autoplay=true&loop=true&muted=true&preload=true&responsive=false`;

export default function HeroVideo({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [paused, setPaused] = useState(false);
  useEffect(() => setSeen((p) => (p.has(i) ? p : new Set(p).add(i))), [i]);
  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, slides.length]);

  if (!slides.length) return <section className="-mt-14 h-[70svh] bg-black" aria-hidden />;

  return (
    <section aria-roledescription="carousel" aria-label="Featured" className="relative -mt-14 h-svh min-h-[600px] overflow-hidden bg-[radial-gradient(ellipse_at_70%_30%,#12384f_0%,#0b1218_55%,#000_100%)] text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((s, n) => (
        <div key={n} aria-hidden={n !== i} className={`absolute inset-0 transition-opacity duration-700 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          {seen.has(n) && s.video && (
            <iframe title={s.headline} src={embed(s.video)} loading={n === 0 ? "eager" : "lazy"} allow="autoplay; encrypted-media" tabIndex={-1} className="pointer-events-none absolute left-1/2 top-1/2 h-[max(100%,56.25vw)] w-[max(100%,177.78svh)] -translate-x-1/2 -translate-y-1/2 border-0" />
          )}
        </div>
      ))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-5 pb-28 pt-24 md:px-8">
        {slides.map((s, n) => n === i && (
          <div key={n} className="panel-in max-w-xl">
            <h1 className="display mt-3 text-[clamp(2.4rem,5.6vw,5rem)] font-light">{s.headline}</h1>
            {s.body && <p className="mt-5 max-w-md text-lg text-white/85">{s.body}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {s.primary && <Link href={s.primary.href} className="btn btn-accent">{s.primary.label}</Link>}
              {s.secondary && <Link href={s.secondary.href} className="btn !border-white/70 !text-white hover:!bg-white/10">{s.secondary.label}</Link>}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-24 left-5 flex gap-2 md:left-8" role="group" aria-label="Choose slide">
          {slides.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} aria-current={n === i} className="flex h-6 w-10 items-center"><span className={`block h-0.5 w-full transition-colors ${n === i ? "bg-white" : "bg-white/40"}`} /></button>
          ))}
        </div>
      )}
    </section>
  );
}
