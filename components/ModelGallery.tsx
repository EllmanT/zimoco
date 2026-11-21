"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = { exterior: string[]; interior: string[]; name: string };

/** Interior slider, then exterior slider. Each shows one image with the next one peeking in. */
export default function ModelGallery({ exterior, interior, name }: Props) {
  const [view, setView] = useState<{ imgs: string[]; i: number } | null>(null);

  const sections = [
    { label: "Interior", imgs: interior },
    { label: "Exterior", imgs: exterior },
  ].filter((s) => s.imgs.length);

  const go = useCallback((n: number) => setView((v) => (v ? { ...v, i: (n + v.imgs.length) % v.imgs.length } : v)), []);

  useEffect(() => {
    if (!view) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView(null);
      if (e.key === "ArrowRight") go(view.i + 1);
      if (e.key === "ArrowLeft") go(view.i - 1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", k); };
  }, [view, go]);

  if (!sections.length) {
    return <div className="grid aspect-[16/7] place-items-center rounded-3xl bg-soft text-center text-muted"><p>Gallery images for the {name} are on the way.</p></div>;
  }

  return (
    <div className="space-y-16">
      {sections.map((s) => (
        <Slider key={s.label} label={s.label} imgs={s.imgs} name={name} onOpen={(i) => setView({ imgs: s.imgs, i })} />
      ))}
      {view && (
        <div className="fixed inset-0 z-[80] grid cursor-pointer place-items-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => setView(null)}>
          <button className="label absolute right-5 top-5 text-white" onClick={() => setView(null)}>Close</button>
          {view.imgs.length > 1 && (
            <>
              <button aria-label="Previous image" onClick={(e) => { e.stopPropagation(); go(view.i - 1); }} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90">‹</button>
              <button aria-label="Next image" onClick={(e) => { e.stopPropagation(); go(view.i + 1); }} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90">›</button>
            </>
          )}
          <div className="relative h-[80svh] w-full max-w-6xl cursor-default" onClick={(e) => e.stopPropagation()}>
            <Image src={view.imgs[view.i]} alt="" fill sizes="100vw" className="object-contain" quality={85} />
          </div>
        </div>
      )}
    </div>
  );
}

/** One row: the selected image is big and tall, the others are narrower and shorter. Click to select, click the big one to open it. */
function Slider({ label, imgs, name, onOpen }: { label: string; imgs: string[]; name: string; onOpen: (i: number) => void }) {
  const track = useRef<HTMLUListElement>(null);
  const [sel, setSel] = useState(0);

  const choose = useCallback((n: number) => setSel(Math.max(0, Math.min(imgs.length - 1, n))), [imgs.length]);

  // After a selection is applied: wait for the width transition to finish, then scroll the chosen image into view.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = track.current;
    const li = el?.children[sel] as HTMLElement | undefined;
    if (!el || !li) return;
    const start = performance.now();
    let last = -1;
    let stable = 0;
    let raf = 0;
    const tick = () => {
      const x = li.offsetLeft + li.offsetWidth;
      stable = x === last ? stable + 1 : 0;
      last = x;
      const t = performance.now() - start;
      if ((stable >= 4 && t > 200) || t > 1200) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
        el.scrollTo({ left: li.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sel]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h3 className="display text-xl md:text-2xl">{label}</h3>
        {imgs.length > 1 && (
          <div className="hidden gap-2 md:flex">
            <button aria-label={`Previous ${label.toLowerCase()} image`} disabled={sel === 0} onClick={() => choose(sel - 1)} className="grid h-11 w-11 place-items-center rounded-full bg-soft transition-[background-color,opacity,transform] hover:bg-black/10 active:scale-95 disabled:opacity-30 disabled:hover:bg-soft">‹</button>
            <button aria-label={`Next ${label.toLowerCase()} image`} disabled={sel === imgs.length - 1} onClick={() => choose(sel + 1)} className="grid h-11 w-11 place-items-center rounded-full bg-soft transition-[background-color,opacity,transform] hover:bg-black/10 active:scale-95 disabled:opacity-30 disabled:hover:bg-soft">›</button>
          </div>
        )}
      </div>
      <ul
        ref={track}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); choose(sel + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); choose(sel - 1); } }}
        aria-label={`${name} ${label.toLowerCase()} photos`}
        className="no-scrollbar relative -mx-5 mt-5 flex h-[320px] items-end gap-3 overflow-x-auto px-5 md:-mx-8 md:h-[480px] md:px-8 lg:h-[580px]"
      >
        {imgs.map((src, idx) => {
          const on = idx === sel;
          return (
            <li key={src} className={`shrink-0 transition-[width,height,opacity] duration-[350ms] ease-[var(--ease-out-strong)] ${on ? "h-full w-[86%] md:w-[66%]" : "h-[74%] w-[62%] opacity-75 hover:opacity-100 md:w-[31%]"}`}>
              <button
                onClick={() => (on ? onOpen(idx) : choose(idx))}
                aria-current={on ? "true" : undefined}
                aria-label={on ? `Expand ${label.toLowerCase()} image ${idx + 1}` : `Show ${label.toLowerCase()} image ${idx + 1}`}
                className="relative block h-full w-full overflow-hidden rounded-2xl bg-soft"
              >
                <Image src={src} alt={`${name} ${label.toLowerCase()} ${idx + 1}`} fill sizes={on ? "(min-width:1280px) 900px, (min-width:768px) 66vw, 86vw" : "(min-width:1280px) 440px, (min-width:768px) 31vw, 62vw"} className="object-cover" quality={on ? 85 : 70} />
              </button>
            </li>
          );
        })}
        <li aria-hidden className="w-1 shrink-0 md:w-4" />
      </ul>
    </div>
  );
}
