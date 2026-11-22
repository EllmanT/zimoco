"use client";

import Link from "next/link";
import { useRfq } from "./RfqProvider";

export function ModelCta({ slug, configurable, onPhoto = false }: { slug: string; configurable: boolean; onPhoto?: boolean }) {
  const rfq = useRfq();
  return (
    <>
      <button className="btn btn-accent" onClick={() => rfq.open({ modelSlug: slug })}>Request a quote</button>
      {configurable && <a href="#configure" className={`btn ${onPhoto ? "border-white/60 text-white hover:bg-white/15" : "btn-ghost"}`}>Configure</a>}
    </>
  );
}

export function HomeQuoteCta() {
  const rfq = useRfq();
  return (
    <div className="mt-16 rounded-3xl bg-soft px-6 py-14 text-center md:py-20">
      <h2 className="display text-[clamp(1.6rem,3vw,2.6rem)]">Don&apos;t see exactly what you want?</h2>
      <p className="mx-auto mt-4 max-w-md text-muted">Every model here is available to order. Tell us the trim, colour and budget and we will confirm a firm price.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button className="btn btn-accent" onClick={() => rfq.open()}>Request a quote</button>
        <Link href="/find-my-car" className="btn btn-ghost">Help me choose</Link>
      </div>
    </div>
  );
}
