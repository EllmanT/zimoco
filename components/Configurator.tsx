"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { colourLabel, colourOptions, configurableVariants, kwLabel, nmLabel, specFor, swatchFor, usd, type Model } from "@/lib/catalogue";
import { useRfq } from "./RfqProvider";
import { useCompare } from "./CompareProvider";

/** Ferrari-style configurator, light edition. Variant owns its colour list; colour persists by name across variants. */
export default function Configurator({ model }: { model: Model }) {
  const variants = configurableVariants(model);
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const rfq = useRfq();
  const { has, toggle } = useCompare();

  const initialV = variants.find((v) => v.id === params.get("v"))?.id ?? variants[0]?.id;
  const [variantId, setVariantId] = useState(initialV);
  const [colourName, setColourName] = useState(params.get("c") ?? "");

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const colours = useMemo(() => (variant ? colourOptions(model, variant.id) : []), [model, variant]);
  const colour = colours.find((c) => c.colour === colourName) ?? colours.find((c) => c.colour === "white") ?? colours[0];
  const spec = specFor(model, variant?.id);

  // Keep the URL in step with the selection. Depends on plain strings and skips the write when the URL
  // already matches; depending on object identity re-fired on every server refresh and looped forever.
  const vid = variant?.id;
  const cname = colour?.colour;
  useEffect(() => {
    if (!vid || !cname) return;
    if (params.get("v") === vid && params.get("c") === cname) return;
    const q = new URLSearchParams({ v: vid, c: cname });
    router.replace(`${path}?${q}`, { scroll: false });
  }, [vid, cname, path, router, params]);

  // Idle-preload the other colours of the current variant so swaps are instant.
  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void) => void }).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 600));
    ric(() => colours.forEach((c) => { const i = new window.Image(); i.src = c.src; }));
  }, [colours]);

  if (!variant || !colour) return null;
  const facts: [string, string][] = [
    ["Engine", spec.engine],
    ["Power", kwLabel(spec)],
    ["Torque", nmLabel(spec)],
    ["Drive", spec.drive],
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative aspect-[16/8] w-full">
          <div aria-hidden className="absolute inset-x-[12%] bottom-[11%] h-6 rounded-[50%] bg-black/10 blur-xl" />
          <Image
            key={colour.src}
            src={colour.src}
            alt={`${model.brand} ${model.name} ${variant.name} in ${colourLabel(colour.colour)}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            quality={80}
            className="object-contain p-4 sm:p-8 cfg-fade"
            priority
          />
        </div>
        <p className="mt-2 text-center text-sm text-muted" aria-live="polite">{variant.name} · <span className="text-ink">{colourLabel(colour.colour)}</span></p>
        <p className="label mt-6 text-center text-muted">Choose your colour</p>
        <div role="radiogroup" aria-label="Colour" className="mt-2 flex flex-wrap justify-center gap-3">
          {colours.map((c) => {
            const on = c.colour === colour.colour;
            return (
              <button
                key={c.colour}
                role="radio"
                aria-checked={on}
                aria-label={colourLabel(c.colour)}
                title={colourLabel(c.colour)}
                onClick={() => { setColourName(c.colour); }}
                className={`grid h-12 w-12 place-items-center rounded-full ring-2 ring-offset-2 transition-shadow ${on ? "ring-red" : "ring-transparent hover:ring-black/20"}`}
              >
                <span className="h-9 w-9 rounded-full border border-black/15" style={{ background: swatchFor(c) ?? "var(--color-muted)" }} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="label text-muted">Choose your trim</p>
        <div role="radiogroup" aria-label="Trim" className="mt-3 flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              role="radio"
              aria-checked={v.id === variant.id}
              onClick={() => { setVariantId(v.id); }}
              className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${v.id === variant.id ? "border-red bg-red text-white" : "border-line hover:border-ink"}`}
            >
              {v.name}
            </button>
          ))}
        </div>
        {variant.blurb && <p className="mt-3 text-sm text-muted">{variant.blurb}</p>}

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
          {facts.map(([k, v]) => (
            <div key={k} className="py-2"><dt className="label text-muted">{k}</dt><dd className="mt-1 text-sm">{v}</dd></div>
          ))}
        </dl>

        <div className="mt-8 rounded-2xl bg-soft p-5">
          <p className="label text-muted">Your configuration</p>
          <p className="display mt-2 text-lg">{model.brand} {model.name} {variant.name}</p>
          <p className="text-sm text-muted">{colourLabel(colour.colour)}</p>
          <p className="mt-4"><span className="text-sm text-muted">Indicative from </span><span className="display tnum text-2xl">{usd(variant.from)}</span></p>
          <p className="mt-1 text-xs text-muted">Available. Final price and timing are confirmed in your quote.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn btn-red flex-1" onClick={() => rfq.open({ modelSlug: model.slug, variantId: variant.id, colour: colour.colour })}>Request a quote</button>
            <button className={`btn ${has(model.slug) ? "border-red bg-red/10 text-red-deep" : "btn-ghost"}`} aria-pressed={has(model.slug)} onClick={() => toggle(model.slug)}>{has(model.slug) ? "In compare ✓" : "Add to compare"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
