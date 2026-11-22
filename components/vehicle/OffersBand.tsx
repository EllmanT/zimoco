"use client";

import Image from "next/image";

type Offer = { type: string; title: string; text: string; cta: string; src?: string };

/** Asks the next-steps form to pre-select an offer, then scrolls to it. */
function enquire(o: { type: string; title: string }) {
  window.dispatchEvent(new CustomEvent("zimoco:offer", { detail: o }));
  document.getElementById("next-steps")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

/** Full-width dark band. One offer = a single hero band; several = a band with a card per offer. */
export default function OffersBand({ offers, modelName }: { offers: Offer[]; modelName: string }) {
  const lead = offers[0];
  const bg = lead?.src;
  return (
    <section id="offers" className="relative isolate overflow-hidden bg-ink text-white">
      {bg && <Image src={bg} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-50" />}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-black/10" />
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28 xl:pl-24">
        <h2 className="display max-w-2xl text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05]">Your {modelName}, your choice: lease or finance.</h2>
        <p className="mt-5 max-w-xl text-lg text-white/85">Finance crafted around you, with flexible packages for individuals and companies. Tell us what suits you and a consultant will come back with a firm offer.</p>
        {offers.length > 1 ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {offers.map((o) => (
              <li key={o.title} className="flex flex-col rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                <p className="label text-white/70">{o.type}</p>
                <h3 className="display mt-2 text-xl">{o.title}</h3>
                <p className="mt-2 text-sm text-white/85">{o.text}</p>
                <button className="btn mt-6 !min-h-11 self-start border-white/60 text-white hover:bg-white/15" onClick={() => enquire(o)}>{o.cta}</button>
              </li>
            ))}
          </ul>
        ) : (
          <button className="btn mt-8 border-white/60 text-white hover:bg-white/15" onClick={() => enquire(lead ?? { type: "Finance", title: "Leasing or finance" })}>{lead?.cta ?? "Make an enquiry"}</button>
        )}
      </div>
    </section>
  );
}
