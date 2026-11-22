"use client";

import Image from "next/image";
import Link from "next/link";
import { useActiveBrand } from "@/lib/brand-store";
import type { BrandData, Pick } from "@/lib/prismic/home";

function Tile({ p, big, priority }: { p: Pick; big?: boolean; priority?: boolean }) {
  return (
    <Link href={p.href} className="group relative isolate block h-full min-h-[300px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1b2a36] to-[#0b1218] lg:min-h-[440px]">
      {p.image && <Image src={p.image.url} alt={p.image.alt} fill priority={priority} sizes={big ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 100vw"} className="-z-10 object-cover transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.03]" />}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
        {p.subtitle && <p className="text-sm text-white/80">{p.subtitle}</p>}
        <h3 className="display mt-1 text-[clamp(1.5rem,2.4vw,2.25rem)]">{p.title}</h3>
        <span className="mt-4 inline-flex items-center gap-2 text-[0.95rem] font-medium">{p.ctaLabel}<span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span></span>
      </div>
    </Link>
  );
}

export default function TopPicks({ brands, heading }: { brands: BrandData[]; heading: string }) {
  const uid = useActiveBrand(brands[0]?.uid ?? "");
  const brand = brands.find((b) => b.uid === uid) ?? brands[0];
  const picks = brand?.picks.slice(0, 5) ?? [];
  return (
    <section aria-labelledby="top-picks" className="bg-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-14 md:px-8">
        <h2 id="top-picks" className="display text-[clamp(1.8rem,3.4vw,3rem)]">{heading}</h2>
        <div key={uid} className="panel-in mt-8 grid gap-4 lg:grid-cols-3">
          {picks.map((p, i) => (
            <div key={i} className={i === 0 && picks.length > 1 ? "lg:col-span-2" : ""}><Tile p={p} big={i === 0} priority={i === 0} /></div>
          ))}
          {!picks.length && <p className="text-muted">No top picks for this brand yet.</p>}
        </div>
      </div>
    </section>
  );
}
