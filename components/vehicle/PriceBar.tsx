"use client";

import { useRfq } from "@/components/RfqProvider";

type P = { modelSlug: string; modelName: string; versionId: string; versionName: string; priceLabel: string };

/** Full-width configuration bar, pinned under the header while the page scrolls. */
export default function PriceBar({ modelSlug, modelName, versionId, versionName, priceLabel }: P) {
  const rfq = useRfq();
  return (
    <div className="sticky top-14 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 md:px-8 xl:pl-24">
        <div className="flex items-center gap-x-8 gap-y-1">
          <div className="hidden sm:block">
            <p className="label text-muted">Model</p>
            <p className="text-sm font-semibold">{modelName} {versionName}</p>
          </div>
          <div>
            <p className="label text-muted">This configuration · indicative from</p>
            <p className="display tnum text-xl" title="Indicative price. Final price and timing are confirmed in your quote.">{priceLabel}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="#available" className="btn btn-ghost !min-h-11 !text-sm">Browse available vehicles</a>
          <button className="btn btn-accent !min-h-11 !text-sm" onClick={() => rfq.open({ modelSlug, variantId: versionId })}>Request a quote</button>
        </div>
      </div>
    </div>
  );
}
