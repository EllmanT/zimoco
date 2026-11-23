"use client";

import Image from "next/image";
import Link from "next/link";
import { useActiveBrand } from "@/lib/brand-store";
import type { BrandData } from "@/lib/prismic/home";

export default function ModelsGrid({ brands }: { brands: BrandData[] }) {
  const uid = useActiveBrand(brands[0]?.uid ?? "");
  const brand = brands.find((b) => b.uid === uid) ?? brands[0];
  const cats = brand?.categories ?? [];
  return (
    <div key={uid} className="panel-in mt-16 grid gap-x-4 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {cats.map((c) => (
        <Link key={c.name} href={c.href} className="group relative block rounded-[1.75rem] border border-line bg-gradient-to-b from-sky-soft to-sunken transition-transform duration-300 ease-[var(--ease-out-strong)] [@media(hover:hover)]:hover:-translate-y-0.5">
          {/* Car sits higher than the card: it grows out of the top edge. */}
          <div className="relative -mt-9 h-[7.5rem] sm:-mt-11 sm:h-[8.5rem]">
            {c.image && <Image src={c.image.url} alt={c.image.alt || `${brand?.name} ${c.name}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" style={c.image.flip ? { transform: "scaleX(-1)" } : undefined} className="object-contain object-bottom drop-shadow-[0_8px_10px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-[var(--ease-out-strong)] [@media(hover:hover)]:group-hover:scale-[1.04]" />}
          </div>
          <p className="display rounded-b-[1.75rem] bg-white py-2.5 text-center text-base transition-colors group-hover:text-accent">{c.name}</p>
        </Link>
      ))}
      {!cats.length && <p className="text-muted">Models for this brand are coming soon.</p>}
    </div>
  );
}
