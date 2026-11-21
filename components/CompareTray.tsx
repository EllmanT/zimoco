"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAX_COMPARE, useCompare } from "./CompareProvider";
import { cardImage, findCompareModel } from "@/lib/catalogue";
import { useCatalogue } from "./CatalogueProvider";

export default function CompareTray() {
  const { slugs, remove, clear } = useCompare();
  const cat = useCatalogue();
  const path = usePathname();
  if (!slugs.length || path.startsWith("/compare") || path.startsWith("/admin")) return null;
  const items = slugs.map((s) => findCompareModel(cat, s)).filter(Boolean);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 shadow-[0_-12px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-5 py-3 md:px-8">
        <ul className="flex flex-1 items-center gap-3">
          {Array.from({ length: MAX_COMPARE }).map((_, i) => {
            const m = items[i];
            const img = m && cardImage(m);
            return (
              <li key={i} className="relative h-14 w-24 overflow-hidden rounded-lg bg-black/[0.05] sm:w-32">
                {m ? (
                  <>
                    {img && <Image src={img.src} alt={m.name} fill sizes="128px" className={img.studio ? "object-contain p-1" : "object-cover"} />}
                    <button onClick={() => remove(m.slug)} aria-label={`Remove ${m.name} from comparison`} className="absolute right-0.5 top-0.5 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-xs text-white">×</button>
                  </>
                ) : (
                  <span className="grid h-full place-items-center text-xs text-muted">Add</span>
                )}
              </li>
            );
          })}
        </ul>
        <button onClick={clear} className="label hidden text-muted hover:text-ink sm:inline">Clear</button>
        <Link href={`/compare?m=${slugs.join(",")}`} className={`btn btn-red !min-h-11 ${slugs.length < 2 ? "pointer-events-none opacity-50" : ""}`} aria-disabled={slugs.length < 2}>
          Compare {slugs.length}/{MAX_COMPARE}
        </Link>
      </div>
    </div>
  );
}
