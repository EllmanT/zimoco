"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Ring } from "./Ring";

export type Slide = {
  id: string;
  /** Bunny Stream video id (library 483818). The hero plays video only, no stills. */
  video: string;
  alt: string;
  kicker: string;
  headline: string;
  href: string;
  cta: string;
};

const LIBRARY = "483818";
const DURATION = 10000;
const embed = (id: string, play: boolean) =>
  `https://iframe.mediadelivery.net/embed/${LIBRARY}/${id}?autoplay=${play}&loop=true&muted=true&preload=true&responsive=false`;

export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const startX = useRef<number | null>(null);
  // A video is loaded the first time its slide is shown, then kept so cross-fades never flash black.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => setSeen((p) => (p.has(i) ? p : new Set(p).add(i))), [i]);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const go = useCallback((n: number) => setI(((n % slides.length) + slides.length) % slides.length), [slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured vehicles"
      className="relative -mt-14 h-svh min-h-[600px] overflow-hidden bg-black text-white"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 60) go(dx < 0 ? i + 1 : i - 1);
      }}
    >
      {slides.map((s, idx) => {
        const active = idx === i;
        const H = idx === 0 ? "h1" : "h2";
        return (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${slides.length}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-[700ms] ease-out ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <div className="absolute inset-0 overflow-hidden [container-type:size]" aria-hidden>
              {seen.has(idx) && (
                <iframe
                  title={s.alt}
                  src={embed(s.video, !reduced)}
                  loading={idx === 0 ? "eager" : "lazy"}
                  allow="autoplay; fullscreen; picture-in-picture"
                  tabIndex={-1}
                  className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
                  style={{ width: "max(100cqw, 177.78cqh)", height: "max(100cqh, 56.25cqw)" }}
                />
              )}
            </div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-20 flex justify-center px-5 md:bottom-24 md:px-8">
              <div key={active ? "on" : "off"} className={`flex flex-col items-center text-center ${active ? (reduced ? "" : "rise") : "opacity-0"}`}>
                <p className="label mb-2 text-white/85">{s.kicker}</p>
                <H className="display max-w-5xl text-[clamp(1.5rem,3.1vw,2.7rem)]">{s.headline}</H>
                <Link
                  href={s.href}
                  tabIndex={active ? 0 : -1}
                  className="ring-btn mt-4 text-white after:absolute after:inset-0 after:content-['']"
                  style={{ ["--ring-invert" as string]: "#d3202a" }}
                >
                  <span className="label">{s.cta}</span>
                  <span className="ring-btn-disc">
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2.5 9.5 7 5 11.5" /></svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 md:px-8">
        <span className="hidden w-11 md:block" aria-hidden />
        <ul className="mx-auto flex items-center" aria-label="Choose slide">
          {slides.map((s, idx) => {
            const active = idx === i;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(idx)}
                  aria-label={`Show slide ${idx + 1}: ${s.headline}`}
                  aria-current={active ? "true" : undefined}
                  className="grid h-11 w-11 place-items-center"
                >
                  {active ? (
                    <span className="relative grid place-items-center" onAnimationEnd={() => !reduced && go(i + 1)}>
                      <Ring key={`${i}-${reduced}`} size={30} stroke={1.8} className="text-[#ff3b44]" trackClassName="!text-white" timerMs={reduced ? undefined : DURATION} progress={reduced ? 1 : 0} paused={paused} />
                      <span className="absolute h-1.5 w-1.5 rounded-full bg-[#ff3b44]" />
                    </span>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70 transition-transform duration-200 hover:scale-150" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white hover:text-black"
        >
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden fill="currentColor"><path d="M3 1.5v9l7.5-4.5z" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden fill="currentColor"><rect x="2.2" y="1.5" width="2.6" height="9" rx="0.6" /><rect x="7.2" y="1.5" width="2.6" height="9" rx="0.6" /></svg>
          )}
        </button>
      </div>
      <p className="sr-only" aria-live={paused ? "polite" : "off"}>{`Slide ${i + 1} of ${slides.length}: ${slides[i].headline}`}</p>
    </section>
  );
}
