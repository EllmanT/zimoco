"use client";

import Image from "next/image";
import { useState } from "react";
import { usd, visual, type Model } from "@/lib/catalogue";
import { useRfq } from "./RfqProvider";

/** Light, indicative instalment estimate. Feeds the RFQ; not an offer of credit. */
export default function FinanceEstimator({ model }: { model: Model }) {
  const rfq = useRfq();
  const [vid, setVid] = useState(model.variants[0].id);
  const [dep, setDep] = useState(30);
  const [term, setTerm] = useState(48);
  const price = model.variants.find((v) => v.id === vid)?.from ?? 0;
  const principal = price * (1 - dep / 100);
  const r = 0.12 / 12; // illustrative 12% p.a.
  const monthly = principal > 0 ? (principal * r) / (1 - Math.pow(1 + r, -term)) : 0;
  const v = model.variants.find((x) => x.id === vid)!;
  const img = visual(model, vid);

  return (
    <div className="overflow-hidden rounded-3xl bg-soft">
      {/* Studio renders are ~1000px wide, so they are shown at a capped width (sharp), not stretched across the card. */}
      <div className="bg-gradient-to-b from-white to-soft">
        {img?.studio ? (
          <div className="relative mx-auto aspect-[974/382] w-full max-w-[640px] px-4 py-6 md:py-8">
            <Image key={img.src} src={img.src} alt={`${model.name} ${v.name}`} fill quality={85} sizes="(min-width:768px) 640px, 100vw" className="cfg-fade object-contain" />
          </div>
        ) : (
          <div className="relative aspect-[16/6]">
            {img && <Image key={img.src} src={img.src} alt={`${model.name} ${v.name}`} fill sizes="(min-width:1400px) 1300px, 100vw" className="cfg-fade object-cover" />}
          </div>
        )}
      </div>
      <div className="grid gap-10 p-6 md:grid-cols-[1fr_1fr] md:p-10">
      <div className="space-y-6">
        <div>
          <label htmlFor="fe-v" className="label text-muted">Trim</label>
          <select id="fe-v" className="field mt-2" value={vid} onChange={(e) => setVid(e.target.value)}>
            {model.variants.map((x) => <option key={x.id} value={x.id}>{x.name} · from {usd(x.from)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fe-d" className="label text-muted">Deposit · {dep}%</label>
          <input id="fe-d" type="range" min={10} max={70} step={5} value={dep} onChange={(e) => setDep(+e.target.value)} className="mt-3 w-full accent-[var(--color-red)]" />
        </div>
        <div>
          <label htmlFor="fe-t" className="label text-muted">Term · {term} months</label>
          <input id="fe-t" type="range" min={12} max={72} step={12} value={term} onChange={(e) => setTerm(+e.target.value)} className="mt-3 w-full accent-[var(--color-red)]" />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <p className="label text-muted">Estimated instalment</p>
          <p className="display tnum mt-2 text-5xl text-red">{usd(Math.round(monthly))}<span className="text-lg text-muted"> /mo</span></p>
          <p className="mt-3 text-sm text-muted">Deposit {usd(Math.round(price * (dep / 100)))} on an indicative {usd(price)}. Illustrative at 12% a year. Final terms depend on the finance provider.</p>
        </div>
        <button className="btn btn-red mt-6" onClick={() => rfq.open({ modelSlug: model.slug, variantId: vid, notes: `Finance enquiry: ${v.name}, ${dep}% deposit, ${term} months, estimate ${usd(Math.round(monthly))}/month.` })}>Send me this quote</button>
      </div>
      </div>
    </div>
  );
}
