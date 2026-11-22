"use client";

import Image from "next/image";
import Link from "next/link";
import { colourOptions, kwLabel, nmLabel, pickColour, specFor, usd, type Model } from "@/lib/catalogue";
import { useRfq } from "@/components/RfqProvider";

/**
 * One card per version. The car overflows the top of the card (it "grows out" of it), like the homepage Models strip.
 * Card image: the version's first colour view if it has one, else the model card photo.
 */
export default function AvailableVehicles({ model, active, fallbackSrc }: { model: Model; active: string; fallbackSrc?: string }) {
  const rfq = useRfq();
  const exteriorFor = (id: string) => model.cms?.page?.exterior.find((e) => !e.ids.length || e.ids.includes(id))?.src;
  return (
    <ul className="mt-20 grid gap-x-5 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
      {model.variants.map((v) => {
        const src = exteriorFor(v.id) ?? pickColour(model, v.id)?.src ?? fallbackSrc;
        const s = specFor(model, v.id);
        const on = v.id === active;
        return (
          <li key={v.id} className={`relative flex flex-col rounded-3xl bg-gradient-to-b from-sky-soft to-white pb-6 ring-1 ${on ? "ring-accent" : "ring-line"}`}>
            <div className="relative -mt-12 h-44 px-4">
              {src ? <Image src={src} alt={`${model.name} ${v.name}`} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-contain object-bottom drop-shadow-[0_10px_12px_rgba(0,0,0,0.16)]" /> : <div className="grid h-full place-items-center text-sm text-muted">Images coming soon</div>}
            </div>
            <div className="flex flex-1 flex-col px-6 pt-5">
              <h3 className="display text-xl">{v.name}</h3>
              {v.blurb && <p className="mt-1 text-sm text-muted">{v.blurb}</p>}
              <p className="mt-3 text-sm text-muted">{[s.engine, kwLabel(s) !== "—" && kwLabel(s), nmLabel(s) !== "—" && nmLabel(s)].filter(Boolean).join(" · ")}</p>
              <p className="mt-3"><span className="text-sm text-muted">From </span><span className="display tnum text-2xl">{usd(v.from)}</span></p>
              <div className="mt-auto flex gap-3 pt-5">
                <Link href={`?v=${v.id}`} scroll={false} replace className="btn btn-ghost !min-h-11 flex-1 !text-sm" aria-current={on ? "true" : undefined}>{on ? "Viewing" : "View version"}</Link>
                <button className="btn btn-accent !min-h-11 flex-1 !text-sm" onClick={() => rfq.open({ modelSlug: model.slug, variantId: v.id })}>Enquire</button>
              </div>
              {colourOptions(model, v.id).length > 0 && <p className="mt-3 text-xs text-muted">{colourOptions(model, v.id).length} colours available</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
