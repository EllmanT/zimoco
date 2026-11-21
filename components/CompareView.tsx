"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cardImage, findCompareModel, fromPrice, fullName, kwLabel, nmLabel, specFor, usd, type Catalogue, type Model, type Spec } from "@/lib/catalogue";
import { useCatalogue } from "./CatalogueProvider";
import { comparePhotos } from "@/lib/site-images";
import { MAX_COMPARE, useCompare } from "./CompareProvider";
import { useRfq } from "./RfqProvider";
import VehicleCard from "./compare/VehicleCard";
import SpecBar from "./compare/SpecBar";

type Row = { label: string; get: (m: Model, s: Spec) => string; num?: (m: Model, s: Spec) => number | null; best?: "max" | "min" };

const rows: Row[] = [
  { label: "Indicative from", get: (m) => usd(fromPrice(m)), num: (m) => fromPrice(m), best: "min" },
  { label: "Body", get: (m) => m.body },
  { label: "Engine", get: (_, s) => s.engine },
  { label: "Fuel", get: (_, s) => s.fuel },
  { label: "Power", get: (_, s) => kwLabel(s), num: (_, s) => s.powerKw, best: "max" },
  { label: "Torque", get: (_, s) => nmLabel(s), num: (_, s) => s.torqueNm, best: "max" },
  { label: "Transmission", get: (_, s) => s.transmission },
  { label: "Drive", get: (_, s) => s.drive },
  { label: "Fuel economy", get: (_, s) => (s.economy ? `${s.economy} L/100 km` : "—"), num: (_, s) => s.economy, best: "min" },
  { label: "Seats", get: (_, s) => String(s.seats), num: (_, s) => s.seats, best: "max" },
  { label: "Payload", get: (_, s) => (s.payloadKg ? `${s.payloadKg} kg` : "—"), num: (_, s) => s.payloadKg ?? null, best: "max" },
  { label: "Towing", get: (_, s) => (s.towingKg ? `${s.towingKg.toLocaleString("en-US")} kg` : "—"), num: (_, s) => s.towingKg ?? null, best: "max" },
  { label: "Safety", get: (_, s) => s.safety ?? "—" },
];

/** Retired slugs that old links and saved selections may still carry. */
const LEGACY: Record<string, string> = { "toyota-hilux": "toyota-hilux-double-cab" };

/** Deterministic "which one for you": rule-based, no AI, always explainable. */
function verdicts(items: { m: Model; s: Spec }[]) {
  const pick = (f: (x: { m: Model; s: Spec }) => number | null, dir: "max" | "min") => {
    const v = items.map((x) => ({ x, n: f(x) })).filter((a) => a.n != null) as { x: { m: Model }; n: number }[];
    if (v.length < 2) return null;
    const best = v.reduce((a, b) => (dir === "max" ? (b.n > a.n ? b : a) : b.n < a.n ? b : a));
    return v.filter((a) => a.n === best.n).length > 1 ? null : fullName(best.x.m);
  };
  return [
    ["Lowest price", pick((x) => fromPrice(x.m), "min")],
    ["Best fuel economy", pick((x) => x.s.economy, "min")],
    ["Most power", pick((x) => x.s.powerKw, "max")],
    ["Most seats", pick((x) => x.s.seats, "max")],
    ["Best for towing and load", pick((x) => (x.s.towingKg ?? 0) + (x.s.payloadKg ?? 0) || null, "max")],
  ].filter((v) => v[1]) as [string, string][];
}

function Thumb({ slug, cat }: { slug: string; cat: Catalogue }) {
  const m = findCompareModel(cat, slug);
  const ph = comparePhotos[slug];
  const img = m && cardImage(m);
  const src = ph?.src ?? img?.src;
  if (!src) return null;
  return <span className="relative block h-9 w-9 overflow-hidden rounded-full bg-soft ring-2 ring-white"><Image src={src} alt="" fill sizes="36px" quality={70} className={ph || !img?.studio ? "object-cover" : "object-contain p-0.5"} /></span>;
}

export default function CompareView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const rfq = useRfq();
  const cat = useCatalogue();
  const { compareModels: models, comparePresets } = cat;
  const { slugs, set, toggle, remove } = useCompare();
  const seeded = useRef(false);
  const first = useRef(true);
  const stripRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState(0);
  const onStripScroll = () => {
    const el = stripRef.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    setCard(Math.round(el.scrollLeft / w));
  };

  // URL is the source of truth when present (shareable); otherwise the stored selection.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const q = [...new Set((params.get("m") ?? "").split(",").map((s) => LEGACY[s] ?? s).filter((s) => findCompareModel(cat, s)))];
    if (q.length) set(q);
  }, [params, set, cat]);
  // Drop saved vehicles that no longer exist (retired or renamed), so the page and the nav count never show ghosts.
  useEffect(() => {
    const live = slugs.map((s) => LEGACY[s] ?? s).filter((s, i, a) => findCompareModel(cat, s) && a.indexOf(s) === i);
    if (live.length !== slugs.length || live.some((s, i) => s !== slugs[i])) set(live);
  }, [slugs, set, cat]);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const cur = params.get("m") ?? "";
    const next = slugs.join(",");
    if (cur !== next && (slugs.length || cur)) router.replace(next ? `${path}?m=${next}` : path, { scroll: false });
  }, [slugs, params, path, router]);

  const items = useMemo(() => slugs.map((s) => findCompareModel(cat, s)).filter(Boolean).map((m) => ({ m: m as Model, s: specFor(m as Model) })), [slugs, cat]);
  const v = items.length >= 2 ? verdicts(items) : [];
  const shareUrl = typeof window !== "undefined" ? `${location.origin}/compare?m=${slugs.join(",")}` : "";
  const cols = items.length;

  return (
    <div className="mx-auto max-w-[1300px] overflow-x-clip px-5 pb-32 pt-14 md:px-8">
      <h1 className="display mt-3 text-[clamp(2.2rem,5vw,4rem)]">Side by side</h1>
      <p className="measure mt-4 text-muted">Pick up to three vehicles. The best value in each row is marked in red.</p>

      <div className="mt-8">
        <p className="label text-muted">Popular comparisons</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {comparePresets.map((p) => (
            <button key={p.label} onClick={() => set([p.a, p.b, ...(p.c ? [p.c] : [])])} className="group inline-flex items-center gap-2.5 rounded-full border border-line min-h-11 py-1.5 pl-4 pr-4 text-sm transition-[border-color,color,transform] duration-200 active:scale-[0.97] hover:border-red hover:text-red"><span className="-ml-2.5 flex -space-x-2 empty:hidden" aria-hidden>{[p.a, p.b].map((sl) => <Thumb key={sl} slug={sl} cat={cat} />)}</span>{p.label}</button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 rounded-3xl bg-soft p-12 text-center">
          <p className="display text-2xl">Nothing to compare yet</p>
          <p className="mt-3 text-muted">Choose a popular comparison above, or add vehicles from the showroom.</p>
          <Link href="/showroom" className="btn btn-red mt-6">Browse the showroom</Link>
        </div>
      ) : (
        <>
          <div ref={stripRef} onScroll={onStripScroll} className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:overflow-visible md:px-0" style={{ gridTemplateColumns: `repeat(${cols + (cols < MAX_COMPARE ? 1 : 0)}, minmax(0,1fr))` }} aria-label="Vehicles being compared">
            {items.map(({ m }, i) => (
              <div key={m.slug} className="w-[82%] shrink-0 snap-center sm:w-[60%] md:w-auto">
                <VehicleCard m={m} priority={i === 0} onRemove={() => remove(m.slug)} onQuote={() => rfq.open({ modelSlug: m.slug })} />
              </div>
            ))}
            {cols < MAX_COMPARE && (
              <div className="grid w-[82%] shrink-0 snap-center place-items-center rounded-3xl bg-soft p-6 text-center sm:w-[60%] md:w-auto">
                <div>
                  <label className="display block text-lg" htmlFor="add-m">Add a vehicle</label>
                  <p className="mt-1 text-sm text-muted">Up to {MAX_COMPARE} side by side</p>
                  <select id="add-m" className="field mt-4" value="" onChange={(e) => e.target.value && toggle(e.target.value)}>
                    <option value="">Choose…</option>
                    {models.filter((m) => !slugs.includes(m.slug)).map((m) => <option key={m.slug} value={m.slug}>{fullName(m)}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
          {cols > 1 && (
            <div className="mt-3 flex justify-center gap-2 md:hidden" aria-hidden>
              {Array.from({ length: cols + (cols < MAX_COMPARE ? 1 : 0) }).map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === card ? "w-5 bg-ink" : "w-1.5 bg-black/25"}`} />)}
            </div>
          )}

          <div className="relative mt-8 overflow-x-auto">
            <div className="min-w-[640px]" style={{ ["--cols" as string]: cols + (cols < MAX_COMPARE ? 1 : 0) }}>
              <div className="grid gap-4" style={{ gridTemplateColumns: `9rem repeat(${cols + (cols < MAX_COMPARE ? 1 : 0)}, minmax(0,1fr))` }}>
                <div />
                {items.map(({ m }) => (
                  <div key={m.slug} className="pb-2">
                    <p className="label text-muted">{m.brand}</p>
                    <Link href={`/showroom/${m.slug}`} className="display text-lg hover:text-red">{m.name}</Link>
                  </div>
                ))}
                {cols < MAX_COMPARE && <span />}
              </div>

              <div className="mt-6 divide-y divide-line border-y border-line">
                {rows.map((r) => {
                  const nums = r.num ? items.map(({ m, s }) => r.num!(m, s)) : [];
                  const valid = nums.filter((n): n is number => n != null);
                  const best = r.best && valid.length > 1 ? (r.best === "max" ? Math.max(...valid) : Math.min(...valid)) : null;
                  const tied = best != null && valid.filter((n) => n === best).length === valid.length;
                  return (
                    <div key={r.label} className="grid items-start gap-4 py-3.5" style={{ gridTemplateColumns: `9rem repeat(${cols + (cols < MAX_COMPARE ? 1 : 0)}, minmax(0,1fr))` }}>
                      <p className="label text-muted">{r.label}</p>
                      {items.map(({ m, s }, i) => {
                        const isBest = best != null && !tied && nums[i] === best;
                        const n = nums[i];
                        return (
                          <div key={m.slug}>
                            <p className={`text-[0.97rem] ${isBest ? "font-semibold text-red" : ""}`}>{r.get(m, s)}{isBest && <span className="sr-only"> (best in this row)</span>}</p>
                            {r.num && n != null && valid.length > 1 && <SpecBar ratio={n / Math.max(...valid)} best={isBest} delay={i * 90} />}
                          </div>
                        );
                      })}
                      {cols < MAX_COMPARE && <span />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {v.length > 0 && (
            <section className="mt-12 rounded-3xl bg-soft p-6 md:p-10" aria-labelledby="which">
              <h2 id="which" className="display text-2xl">Which one for you?</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {v.map(([k, who]) => <li key={k} className="rounded-xl bg-white p-4"><p className="label text-muted">{k}</p><p className="display mt-1 text-lg">{who}</p></li>)}
              </ul>
              <p className="mt-4 text-xs text-muted">Based on the indicative figures shown. Your quote confirms the exact unit.</p>
            </section>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button className="btn btn-red" disabled={items.length < 2} onClick={() => rfq.open({ type: "comparison", compare: slugs, notes: `Comparing: ${items.map(({ m }) => fullName(m)).join(" vs ")}` })}>Send me this comparison</button>
            <button className="btn btn-ghost" onClick={async () => { try { await navigator.clipboard.writeText(shareUrl); } catch {} }}>Copy link</button>
          </div>
        </>
      )}
    </div>
  );
}
