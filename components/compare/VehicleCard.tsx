"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cardImage, fullName, gallery, type Model } from "@/lib/catalogue";
import { comparePhotos } from "@/lib/site-images";

type View = "exterior" | "interior";

/** Large photo card with an exterior / interior cross-fade toggle. */
export default function VehicleCard({ m, onRemove, onQuote, priority }: { m: Model; onRemove: () => void; onQuote: () => void; priority?: boolean }) {
  const [view, setView] = useState<View>("exterior");
  const photo = comparePhotos[m.slug];
  const studio = cardImage(m);
  const exterior = photo ? { src: photo.src, alt: photo.alt, contain: false, focus: photo.focus } : studio ? { src: studio.src, alt: fullName(m), contain: studio.studio, focus: undefined } : null;
  const interiorSrc = gallery(m).interior[0];
  const hasInterior = !!interiorSrc;
  const shown: View = hasInterior ? view : "exterior";

  return (
    <article className="relative overflow-hidden rounded-3xl bg-soft">
      <div className="relative aspect-[4/3] bg-gradient-to-b from-soft to-white sm:aspect-[16/11]">
        {exterior && (
          <Image src={exterior.src} alt={exterior.alt} fill priority={priority} sizes="(min-width:1024px) 420px, 82vw" quality={80}
            className={`transition-opacity duration-300 ${exterior.contain ? "object-contain p-4" : "object-cover"} ${shown === "exterior" ? "opacity-100" : "opacity-0"}`}
            style={exterior.focus ? { objectPosition: exterior.focus } : undefined} />
        )}
        {hasInterior && (
          <Image src={interiorSrc} alt={`${fullName(m)} interior`} fill sizes="(min-width:1024px) 420px, 82vw" quality={80}
            className={`object-cover transition-opacity duration-300 ${shown === "interior" ? "opacity-100" : "opacity-0"}`} />
        )}
        <button onClick={onRemove} aria-label={`Remove ${m.name}`} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lg shadow transition-transform active:scale-95 hover:bg-white">×</button>
        {hasInterior && (
          <div role="group" aria-label={`${m.name} view`} className="absolute bottom-3 left-3 inline-flex chip-glass chip-glass-light rounded-full bg-white/90 p-1 text-xs shadow">
            {(["exterior", "interior"] as View[]).map((v) => (
              <button key={v} aria-pressed={shown === v} onClick={() => setView(v)}
                className={`min-h-9 rounded-full px-3.5 capitalize transition-colors duration-200 ${shown === v ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}>{v}</button>
            ))}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="label text-muted">{m.brand}</p>
        <Link href={`/showroom/${m.slug}`} className="display mt-1 block text-xl hover:text-red">{m.name}</Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{m.tagline}</p>
        <button className="btn btn-red mt-4 w-full !min-h-11 !text-sm" onClick={onQuote}>Request a quote</button>
      </div>
    </article>
  );
}
