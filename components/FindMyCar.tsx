"use client";

import { useId, useMemo, useState } from "react";
import ModelCard from "./ModelCard";
import { useRfq } from "./RfqProvider";
import { fromPrice, fullName, specFor, type Model } from "@/lib/catalogue";
import { useCatalogue } from "./CatalogueProvider";

const budgets: [string, number][] = [["Up to US$15k", 15000], ["Up to US$35k", 35000], ["Up to US$60k", 60000], ["No limit", Infinity]];
const uses = ["Family and daily driving", "Work, loads and towing", "Fuel economy first", "Rough roads and travel"] as const;

function score(use: string, m: Model) {
  const s = specFor(m);
  if (use === uses[0]) return (s.seats >= 5 ? 2 : 0) + (m.body === "SUV" || m.body === "Hatchback" ? 2 : 0);
  if (use === uses[1]) return (m.body === "Pickup" ? 4 : 0) + (s.towingKg ? 2 : 0);
  if (use === uses[2]) return s.economy ? Math.max(0, 8 - s.economy) : 0;
  return (s.drive.includes("4x4") || s.drive.includes("AWD") ? 3 : 0) + (m.body === "Pickup" || m.body === "SUV" ? 2 : 0);
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label text-muted">{label}</label>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 w-full appearance-none rounded-2xl border border-line bg-white pl-5 pr-12 text-base transition-[border-color,box-shadow] duration-200 hover:border-ink focus-visible:border-ink focus-visible:shadow-[0_0_0_4px_rgba(0,0,0,0.06)] focus-visible:outline-none"
        >
          {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted"><path d="M2.5 5 7 9.5 11.5 5" /></svg>
      </div>
    </div>
  );
}

export default function FindMyCar() {
  const rfq = useRfq();
  const { models, bodies } = useCatalogue();
  const [budget, setBudget] = useState(1);
  const [body, setBody] = useState("Any");
  const [use, setUse] = useState<string>(uses[0]);

  const matches = useMemo(
    () => models
      .filter((m) => (fromPrice(m) ?? 0) <= budgets[budget][1] && (body === "Any" || m.body === body))
      .map((m) => ({ m, n: score(use, m) }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 3)
      .map((x) => x.m),
    [models, budget, body, use],
  );

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-14 md:px-8">
      <h1 className="display text-[clamp(2.2rem,5vw,4rem)]">Three questions, three matches</h1>
      <p className="measure mt-4 text-muted">Choose a budget, a body type and what you will mostly use it for. Your matches update as you go.</p>
      <div className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Select label="Budget" value={String(budget)} onChange={(v) => setBudget(Number(v))} options={budgets.map((b, i) => [String(i), b[0]])} />
        <Select label="Body type" value={body} onChange={setBody} options={["Any", ...bodies].map((b) => [b, b])} />
        <Select label="Mostly for" value={use} onChange={setUse} options={uses.map((u) => [u, u])} />
      </div>

      <h2 className="display mt-14 text-2xl">Your matches</h2>
      {matches.length ? (
        <>
          <div key={matches.map((m) => m.slug).join()} className="panel-in mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{matches.map((m) => <ModelCard key={m.slug} model={m} />)}</div>
          <button className="btn btn-red mt-8" onClick={() => rfq.open({ type: "find-my-car", notes: `Find my car. Budget: ${budgets[budget][0]}. Body: ${body}. Use: ${use}. Matches: ${matches.map(fullName).join(", ")}.` })}>Quote all my matches</button>
        </>
      ) : (
        <div className="mt-6 rounded-2xl bg-soft p-10 text-center">
          <p className="display text-xl">No exact match, but we can find it</p>
          <p className="mt-2 text-muted">Tell us what you want and the team will source it.</p>
          <button className="btn btn-red mt-6" onClick={() => rfq.open({ type: "find-my-car", notes: `Find my car, no catalogue match. Budget: ${budgets[budget][0]}. Body: ${body}. Use: ${use}.` })}>Tell us what you need</button>
        </div>
      )}
    </div>
  );
}
