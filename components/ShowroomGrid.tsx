"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ModelCard from "./ModelCard";
import { COMMERCIAL_BRANDS, fromPrice } from "@/lib/catalogue";
import { useCatalogue } from "./CatalogueProvider";

const budgets: [string, number, number][] = [
  ["Any budget", 0, Infinity],
  ["Under US$ 15 000", 0, 15000],
  ["US$ 15 000 to 35 000", 15000, 35000],
  ["US$ 35 000 to 60 000", 35000, 60000],
  ["Over US$ 60 000", 60000, Infinity],
];

const tabName: Record<string, string> = { All: "All", Pickup: "Pickups", SUV: "SUVs", Commercial: "Commercial", Hatchback: "Hatchbacks" };

function QuietSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-muted">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none bg-transparent py-1 pr-6 text-sm font-semibold text-ink focus-visible:underline focus-visible:outline-none">
          {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"><path d="M2.5 5 7 9.5 11.5 5" /></svg>
      </div>
    </div>
  );
}

/** Mercedes-Benz Trucks & Buses, FUSO and Freightliner share one "Commercial" entry in the brand filter, to keep the list short. */
const brandGroup = (b: string) => (COMMERCIAL_BRANDS.has(b) ? "Commercial" : b);

export default function ShowroomGrid() {
  const params = useSearchParams();
  const { models, bodies, brands: allBrands } = useCatalogue();
  const brands = useMemo(() => [...new Set(allBrands.map(brandGroup))], [allBrands]);
  const [body, setBody] = useState("All");
  const [brand, setBrand] = useState(brandGroup(params.get("brand") ?? "All"));
  const [bi, setBi] = useState(0);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const close = useCallback(() => { setOpen(false); setQ(""); }, []);

  // "/" opens search, Esc closes it
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !open && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [open, close]);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => input.current?.focus(), 220);
    return () => clearTimeout(t);
  }, [open]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return models.filter((m) => {
      const p = fromPrice(m) ?? 0;
      const hay = `${m.brand} ${m.name} ${m.body}`.toLowerCase();
      return (body === "All" || m.body === body) && (brand === "All" || brandGroup(m.brand) === brand) && p >= budgets[bi][1] && p < budgets[bi][2] && (!term || term.split(/\s+/).every((w) => hay.includes(w)));
    });
  }, [models, body, brand, bi, q]);

  return (
    <>
      {/* Filter bar: tabs on the left, search circle on the far right. Search grows to fill the row. */}
      <div className="relative mt-10 h-12">
        <div role="tablist" aria-label="Category" aria-hidden={open} inert={open} className={`no-scrollbar flex h-full items-end gap-6 overflow-x-auto pr-16 transition-opacity duration-150 ease-out ${open ? "opacity-0" : "opacity-100 delay-200"}`}>
          {["All", ...bodies].map((b) => {
            const on = body === b;
            return (
              <button key={b} role="tab" aria-selected={on} onClick={() => setBody(b)} className={`shrink-0 border-b-[3px] pb-2 text-base transition-colors duration-200 ${on ? "border-accent font-semibold text-ink" : "border-transparent text-[#9a9a9f] hover:border-black/15 hover:text-ink"}`}>
                {tabName[b] ?? b}
              </button>
            );
          })}
        </div>

        <div
          data-open={open || undefined}
          className="absolute right-0 top-0 flex h-12 w-12 items-center overflow-hidden rounded-full border-[0.8px] border-[#494950] bg-white transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] data-[open]:w-full"
        >
          <button type="button" onClick={() => (open ? input.current?.focus() : setOpen(true))} aria-label="Search vehicles" aria-expanded={open} className="grid h-12 w-12 shrink-0 place-items-center transition-transform duration-150 active:scale-90">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg>
          </button>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            tabIndex={open ? 0 : -1}
            aria-label="Search by model or brand"
            placeholder="Search by model or brand"
            className={`min-w-0 flex-1 bg-transparent text-base text-[#494950] transition-opacity duration-200 ease-out placeholder:text-[#9a9a9f] !outline-none ${open ? "opacity-100 delay-150" : "pointer-events-none opacity-0"}`}
          />
          <button type="button" onClick={close} tabIndex={open ? 0 : -1} aria-label="Close search" className={`mr-3 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/[0.06] transition-[opacity,transform] duration-200 hover:bg-black/10 active:scale-90 ${open ? "opacity-100 delay-200" : "pointer-events-none opacity-0"}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="m2.5 2.5 7 7m0-7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <QuietSelect label="Brand" value={brand} onChange={setBrand} options={["All", ...brands].map((b) => [b, b === "All" ? "All brands" : b])} />
          <QuietSelect label="Budget" value={String(bi)} onChange={(v) => setBi(Number(v))} options={budgets.map((b, i) => [String(i), b[0]])} />
        </div>
      </div>

      <p className="mt-10 text-sm text-muted" role="status">{list.length} vehicle{list.length === 1 ? "" : "s"}</p>
      {list.length ? (
        <div className="mt-4 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{list.map((m, i) => <ModelCard key={m.slug} model={m} priority={i < 3} />)}</div>
      ) : (
        <div className="mt-10 py-16 text-center">
          <p className="display text-xl">Nothing matches that</p>
          <p className="mt-2 text-muted">Clear a filter, or tell us what you want and we will source it.</p>
          <button className="btn btn-ghost mt-6" onClick={() => { setBody("All"); setBrand("All"); setBi(0); close(); }}>Reset filters</button>
        </div>
      )}
    </>
  );
}
