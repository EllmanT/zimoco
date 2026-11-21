"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { kwLabel, nmLabel, specFor, visual, type Model } from "@/lib/catalogue";

/** Tween a number toward `to` with a strong ease-out. Starts when `run` is true; instant under reduced motion. */
function useCountTo(to: number, run: boolean) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { from.current = to; setV(to); return; }
    const start = performance.now();
    const a = from.current;
    const dur = 900;
    let id = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      const n = a + (to - a) * e;
      from.current = n;
      setV(n);
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [to, run]);
  return Math.round(v);
}

function Figure({ label, value, unit, run }: { label: string; value: number | string; unit?: string; run: boolean }) {
  const n = useCountTo(typeof value === "number" ? value : 0, run && typeof value === "number");
  return (
    <div className="px-2 py-6 text-center md:px-6">
      <dd className={`display tnum font-light leading-none ${typeof value === "number" ? "text-[clamp(2.6rem,6vw,5rem)]" : "flex min-h-[clamp(2.6rem,6vw,5rem)] items-center justify-center text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight"}`}>
        {typeof value === "number" ? n.toLocaleString("en-US") : value}
        {unit && <span className="ml-1.5 align-baseline text-[0.32em] font-normal tracking-wide text-muted">{unit}</span>}
      </dd>
      <dt className="label mt-3 text-muted">{label}</dt>
    </div>
  );
}

/** Specs follow the selected trim. All values indicative. */
export default function SpecsPanel({ model }: { model: Model }) {
  const [vid, setVid] = useState(model.variants[0].id);
  const [seen, setSeen] = useState(false);
  const figs = useRef<HTMLDListElement>(null);
  const s = specFor(model, vid);
  const img = visual(model, vid);

  useEffect(() => {
    const el = figs.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const groups: [string, [string, string | undefined][]][] = [
    ["Engine and drive", [["Engine", s.engine], ["Fuel", s.fuel], ["Power", s.powerKw == null ? undefined : `${kwLabel(s)} (${Math.round(s.powerKw * 1.341)} hp)`], ["Torque", s.torqueNm == null ? undefined : nmLabel(s)], ["Drive", s.drive]]],
    ["Transmission and economy", [["Transmission", s.transmission], ["Fuel economy", s.economy ? `${s.economy} L/100 km (indicative)` : undefined]]],
    ["Capacity", [["Seats", String(s.seats)], ["Payload", s.payloadKg ? `${s.payloadKg} kg` : undefined], ["Towing", s.towingKg ? `${s.towingKg.toLocaleString("en-US")} kg braked` : undefined], ["Length", s.lengthMm ? `${s.lengthMm.toLocaleString("en-US")} mm` : undefined]]],
    ["Safety", [["Highlights", s.safety]]],
  ];

  return (
    <div>
      <div className="relative mx-auto aspect-[16/7] w-full max-w-5xl">
        <div aria-hidden className="absolute inset-x-[14%] bottom-[8%] h-6 rounded-[50%] bg-black/10 blur-xl" />
        {img ? (
          <Image key={img.src} src={img.src} alt={`${model.name} specifications`} fill sizes="(min-width:1024px) 960px, 100vw" className={`cfg-fade ${img.studio ? "object-contain" : "rounded-2xl object-cover"}`} />
        ) : (
          <div className="grid h-full place-items-center text-muted">Images coming soon</div>
        )}
      </div>

      {model.variants.length > 1 && (
        <div className="sticky top-16 z-20 mt-6 flex justify-center py-3">
          <div role="tablist" aria-label="Trim" className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/85 p-1 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.4)] ring-1 ring-black/5 backdrop-blur">
            {model.variants.map((v) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={v.id === vid}
                onClick={() => setVid(v.id)}
                className={`label shrink-0 rounded-full px-4 py-2 text-xs transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${v.id === vid ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <dl ref={figs} className="mt-8 grid grid-cols-2 border-y border-line md:grid-cols-4 md:divide-x md:divide-line">
        <Figure label="Power" value={s.powerKw ?? "—"} unit={s.powerKw == null ? undefined : "kW"} run={seen} />
        <Figure label="Torque" value={s.torqueNm ?? "—"} unit={s.torqueNm == null ? undefined : "Nm"} run={seen} />
        <Figure label="Drive" value={s.drive} run={seen} />
        <Figure label="Seats" value={s.seats} run={seen} />
      </dl>

      <div className="mx-auto mt-12 grid max-w-5xl gap-x-16 lg:grid-cols-2">
        {groups.map(([title, rows], gi) => {
          const present = rows.filter(([, v]) => v);
          if (!present.length) return null;
          return (
            <details key={title} open={gi < 2} className="group border-b border-line">
              <summary className="flex list-none items-center justify-between py-5">
                <h3 className="display text-lg">{title}</h3>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted transition-transform duration-300 group-open:rotate-180"><path d="M2.5 5 7 9.5 11.5 5" /></svg>
              </summary>
              <dl className="pb-5">
                {present.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-2.5 text-[0.97rem]"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </details>
          );
        })}
      </div>
      <p className="mx-auto mt-8 max-w-5xl text-xs text-muted">Specifications are typical for the model range and indicative. Your quote confirms the exact specification of the unit.</p>
    </div>
  );
}
