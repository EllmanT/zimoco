"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FLIPPED_CARD_SLUGS, cardImage, fromPrice, usd, type Model } from "@/lib/catalogue";
import { useCompare } from "./CompareProvider";
import { useRfq } from "./RfqProvider";

/** Borderless card: image, name, "From" price. The whole card is the link (Toyota SA pattern). */
export default function ModelCard({ model, priority = false }: { model: Model; priority?: boolean }) {
  const img = cardImage(model);
  const { has, toggle, full } = useCompare();
  const rfq = useRfq();
  const [warn, setWarn] = useState(false);
  const picked = has(model.slug);
  const price = fromPrice(model);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3]">
        {img ? (
          <Image
            src={img.src}
            alt={`${model.brand} ${model.name}`}
            fill
            priority={priority}
            style={FLIPPED_CARD_SLUGS.has(model.slug) ? { transform: "scaleX(-1)" } : undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={img.studio
              ? "object-contain p-2 drop-shadow-[0_14px_16px_rgba(0,0,0,0.14)] transition-transform duration-300 ease-[var(--ease-out-strong)] [@media(hover:hover)]:group-hover:scale-[1.03]"
              : "object-cover [mask-image:radial-gradient(ellipse_at_center,#000_50%,transparent_76%)] transition-transform duration-300 [@media(hover:hover)]:group-hover:scale-[1.03]"}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">Images coming soon</div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{model.brand}</p>
        <h3 className="display mt-1 text-xl"><Link href={`/showroom/${model.slug}`} className="after:absolute after:inset-0 after:content-['']">{model.name}</Link></h3>
        <p className="tnum mt-1 text-base"><span className="text-muted">From </span><span className="font-bold">{usd(price)}</span></p>
        <div className="relative z-10 mt-3 flex items-center gap-6 text-sm font-semibold">
          <button type="button" onClick={() => rfq.open({ modelSlug: model.slug })} className="text-red transition-colors hover:text-red-deep">Get a quote</button>
          <button
            type="button"
            aria-pressed={picked}
            aria-label={picked ? `Remove ${model.name} from compare` : `Add ${model.name} to compare`}
            onClick={() => { if (!toggle(model.slug)) { setWarn(true); setTimeout(() => setWarn(false), 2200); } }}
            className={`inline-flex items-center gap-1.5 transition-colors ${picked ? "text-ink" : "text-muted hover:text-ink"} ${full && !picked ? "opacity-60" : ""}`}
          >
            {picked ? (
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3.5 8.5 3 3 6-7" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>
            )}
            {picked ? "Added to compare" : "Compare"}
          </button>
        </div>
        {warn && <p role="status" className="relative z-10 mt-2 text-xs text-red">You can compare up to 3 vehicles.</p>}
      </div>
    </article>
  );
}
