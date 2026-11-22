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
    <div key={uid} className="panel-in mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cats.map((c) => (
        <Link key={c.name} href={c.href} className="group block overflow-hidden rounded-[2rem] border border-line">
          <div className="relative aspect-[5/2] bg-gradient-to-b from-sky-soft to-sunken">
            {c.image && <Image src={c.image.url} alt={c.image.alt || `${brand?.name} ${c.name}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-contain p-3 transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-[1.04]" />}
          </div>
          <p className="display bg-white py-3 text-center text-lg transition-colors group-hover:text-accent">{c.name}</p>
        </Link>
      ))}
      {!cats.length && <p className="text-muted">Models for this brand are coming soon.</p>}
    </div>
  );
}
