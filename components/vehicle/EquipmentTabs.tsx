"use client";

import Image from "next/image";
import { useState } from "react";

type Item = { category: string; title: string; text: string; src?: string };

export default function EquipmentTabs({ items, categories }: { items: Item[]; categories: string[] }) {
  const [c, setC] = useState(categories[0]);
  const shown = items.filter((i) => i.category === c);
  return (
    <div>
      {categories.length > 1 && (
        <div role="tablist" aria-label="Equipment categories" className="no-scrollbar flex gap-2 overflow-x-auto">
          {categories.map((x) => (
            <button key={x} role="tab" aria-selected={x === c} onClick={() => setC(x)} className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-medium transition-colors ${x === c ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
              {x}
            </button>
          ))}
        </div>
      )}
      <ul key={c} className="panel-in mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((i) => (
          <li key={i.title} className="overflow-hidden rounded-2xl bg-soft">
            {i.src && <div className="relative aspect-[16/10]"><Image src={i.src} alt="" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" /></div>}
            <div className="p-5">
              <h3 className="display text-lg">{i.title}</h3>
              <p className="mt-2 text-sm text-muted">{i.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
