"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { colourOptions, kwLabel, nmLabel, pickColour, specFor, usd, visual, type Model } from "@/lib/catalogue";
import { useRfq } from "./RfqProvider";

/** One swipeable row of trims: scroll-snap, arrows on desktop. */
export default function VariantCards({ model }: { model: Model }) {
  const rfq = useRfq();
  const row = useRef<HTMLUListElement>(null);
  const by = (dir: number) => row.current?.scrollBy({ left: dir * Math.min(row.current.clientWidth * 0.8, 420), behavior: "smooth" });

  return (
    <div className="relative">
      <div className="mb-5 hidden justify-end gap-2 md:flex">
        <button aria-label="Scroll trims left" onClick={() => by(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-lg transition-colors hover:border-accent hover:text-accent">‹</button>
        <button aria-label="Scroll trims right" onClick={() => by(1)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-lg transition-colors hover:border-accent hover:text-accent">›</button>
      </div>
      <ul ref={row} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8" tabIndex={0} aria-label={`${model.name} trims, swipe to see more`}>
        {model.variants.map((v) => {
          const opts = colourOptions(model, v.id);
          const picked = pickColour(model, v.id);
          const img = picked ? { src: picked.src, studio: true } : visual(model);
          const s = specFor(model, v.id);
          return (
            <li key={v.id} className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-soft sm:w-[340px] lg:w-[380px]">
              <div className="relative aspect-[16/10] bg-gradient-to-b from-soft to-white">
                {img ? <Image src={img.src} alt={`${model.name} ${v.name}`} fill sizes="380px" className={img.studio ? "object-contain p-4" : "object-cover"} /> : <div className="grid h-full place-items-center text-sm text-muted">Images coming soon</div>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="display text-lg">{v.name}</h3>
                {v.blurb && <p className="mt-1 text-sm text-muted">{v.blurb}</p>}
                <p className="mt-3 text-sm text-muted">{kwLabel(s)} · {nmLabel(s)} · {s.drive}</p>
                <p className="mt-3"><span className="text-sm text-muted">From </span><span className="display tnum text-xl">{usd(v.from)}</span><span className="text-sm text-muted"> indicative</span></p>
                <div className="mt-auto flex gap-3 pt-5">
                  {opts.length > 0 && <Link href={`?v=${v.id}#configure`} className="btn btn-ghost !min-h-11 flex-1 !text-sm">Configure</Link>}
                  <button className="btn btn-accent !min-h-11 flex-1 !text-sm" onClick={() => rfq.open({ modelSlug: model.slug, variantId: v.id })}>Quote</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
