import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Configurator from "@/components/Configurator";
import DotRail from "@/components/DotRail";
import ModelGallery from "@/components/ModelGallery";
import SpecsPanel from "@/components/SpecsPanel";
import VariantCards from "@/components/VariantCards";
import FinanceEstimator from "@/components/FinanceEstimator";
import Reveal from "@/components/Reveal";
import { ModelCta } from "@/components/ModelCta";
import { configurableVariants, findModel, fromPrice, fullName, gallery, hasConfigurator, heroImage, kwLabel, nmLabel, specFor, usd, visual } from "@/lib/catalogue";
import { getCatalogue } from "@/lib/prismic/catalogue";

export async function generateStaticParams() {
  const { models } = await getCatalogue();
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = findModel(await getCatalogue(), (await params).slug);
  if (!m) return {};
  return {
    // A title written in Prismic is used exactly as typed (no site-name suffix added).
    title: m.cms?.metaTitle ? { absolute: m.cms.metaTitle } : `${fullName(m)} for sale in Zimbabwe | Configure and get a quote`,
    description: m.cms?.metaDescription ?? `${m.summary} Indicative from ${usd(fromPrice(m))}. Configure your trim and colour and request a quote from Zimoco.`,
    alternates: { canonical: `/showroom/${m.slug}` },
  };
}

const rail = [
  { id: "overview", label: "Overview" },
  { id: "configure", label: "Configure" },
  { id: "specs", label: "Specifications" },
  { id: "gallery", label: "Gallery" },
  { id: "variants", label: "Trims" },
  { id: "finance", label: "Finance" },
  { id: "faq", label: "FAQ" },
];

/** Each section's title is its heading (no small red label above it). */
const SECTION_H2 = "display text-[clamp(2.1rem,4.6vw,3.75rem)] leading-[1.04]";

const Section = ({ id, title, children, tone = "white" }: { id: string; title: string; children: React.ReactNode; tone?: "white" | "soft" }) => (
  <section id={id} className={tone === "soft" ? "bg-soft" : "bg-white"}>
    <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24 xl:pl-24">
      <Reveal>
        <h2 className={SECTION_H2}>{title}</h2>
      </Reveal>
      <div className="mt-10">{children}</div>
    </div>
  </section>
);

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const m = findModel(await getCatalogue(), (await params).slug);
  if (!m) notFound();
  const hero = heroImage(m);
  const s = specFor(m);
  const gal = gallery(m);
  const price = fromPrice(m);
  const side = visual(m, configurableVariants(m)[0]?.id) ?? visual(m);
  const highlights: [string, string][] = [
    ["Power", kwLabel(s)],
    ["Torque", nmLabel(s)],
    ["Drive", s.drive],
    ["Seats", String(s.seats)],
    ...(s.economy ? ([["Economy", `${s.economy} L/100 km`]] as [string, string][]) : []),
    ...(s.towingKg ? ([["Towing", `${s.towingKg.toLocaleString("en-US")} kg`]] as [string, string][]) : []),
  ];
  const faq = [
    ...(m.faq ?? [
      [`Is the ${m.name} available?`, "Every vehicle in the showroom is shown as available. If the exact trim and colour you want is not on the floor, our team sources it and confirms timing on your quote."],
      ["Is the price final?", "The price shown is an indicative starting price. The final price depends on year, mileage, specification and colour, and is confirmed in your quote."],
    ]),
    ["How do I get a quote?", "Choose your trim and colour, then press Request a quote. Tell us your budget and how to reach you. A consultant will respond on WhatsApp, by phone or email."],
  ] as [string, string][];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Product", name: fullName(m), brand: { "@type": "Brand", name: m.brand }, description: m.summary, category: m.body, ...(price ? { offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: price, availability: "https://schema.org/InStock" } } : {}) },
      { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  };
  const photo = hero.kind === "photo";

  return (
    <>
      <DotRail items={rail.filter((r) => r.id !== "configure" || hasConfigurator(m))} />

      {/* Big hero: full-bleed photo when we have one, otherwise a large studio car on a showroom backdrop */}
      <section id="overview" className={`relative isolate min-h-[calc(100svh-7rem)] overflow-hidden ${photo ? "bg-black text-white" : "bg-gradient-to-b from-white via-white to-soft text-ink"}`}>
        {hero.src ? (
          <Image
            src={hero.src}
            alt={fullName(m)}
            fill
            priority
            quality={85}
            sizes="100vw"
            className={photo ? "-z-10 object-cover" : "-z-10 object-contain object-center px-[3vw] pb-64 pt-48 md:pb-52 md:pt-48"}
            style={photo ? { objectPosition: hero.focus } : undefined}
          />
        ) : (
          <div className="absolute inset-0 -z-10 grid place-items-center text-muted">Images coming soon</div>
        )}
        {photo && <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-black/45" />}
        <div className="mx-auto flex min-h-[inherit] max-w-[1400px] flex-col justify-between px-5 py-12 md:px-8 xl:pl-24">
          <div>
            <p className={`label ${photo ? "text-white/85" : "text-red"}`}>{m.brand}</p>
            <h1 className="display mt-3 text-[clamp(2.8rem,8vw,7rem)] leading-[0.95]">{m.name}</h1>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className={`max-w-xl text-lg md:text-xl ${photo ? "text-white/90" : "text-ink/80"}`}>{m.tagline}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3"><ModelCta slug={m.slug} configurable={hasConfigurator(m)} onPhoto={photo} /></div>
            <ul className={`mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm ${photo ? "text-white/90" : ""}`}>
              <li className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-red" aria-hidden />Available</li>
              <li>Indicative from <b className="tnum">{usd(price)}</b></li>
              <li className={photo ? "text-white/70" : "text-muted"}>Final price and timing confirmed on quote</li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="Key figures" className="bg-white">
        <dl className="mx-auto grid max-w-[1400px] grid-cols-2 px-5 py-8 md:grid-cols-3 md:px-8 lg:grid-cols-6 xl:pl-24">
          {highlights.map(([k, v]) => (
            <div key={k} className="px-2 py-3 lg:px-6"><dt className="label text-muted">{k}</dt><dd className="display mt-2 text-lg">{v}</dd></div>
          ))}
        </dl>
      </section>

      {hasConfigurator(m) && (
        <Section id="configure" title="Make it yours">
          <Suspense fallback={<div className="aspect-[16/8] rounded-3xl bg-soft" />}>
            <Configurator model={m} />
          </Suspense>
        </Section>
      )}

      <Section id="specs" title="The detail" tone="soft">
        <SpecsPanel model={m} />
      </Section>

      <Section id="gallery" title="Inside and out">
        <ModelGallery exterior={gal.exterior} interior={gal.interior} name={fullName(m)} />
      </Section>

      <Section id="variants" title={`Find your ${m.name}`} tone="soft">
        <VariantCards model={m} />
      </Section>

      <Section id="finance" title="Estimate your instalment">
        <FinanceEstimator model={m} />
      </Section>

      <section id="faq" className="bg-soft">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] xl:pl-24">
          <div>
            <Reveal>
              <h2 className={SECTION_H2}>Questions, answered</h2>
            </Reveal>
            <div className="mt-10 divide-y divide-line border-y border-line">
              {faq.map(([q, a]) => (
                <details key={q} className="group py-5">
                  <summary className="flex list-none items-center justify-between gap-6 text-lg font-medium">{q}<span aria-hidden className="text-red transition-transform group-open:rotate-45">+</span></summary>
                  <p className="mt-3 text-muted">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3"><ModelCta slug={m.slug} configurable={false} /></div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-gradient-to-b from-white to-soft lg:sticky lg:top-40 lg:self-start lg:aspect-[4/5]">
            {side ? <Image src={side.src} alt={fullName(m)} fill sizes="(min-width:1024px) 40vw, 100vw" className={side.studio ? "object-contain p-6" : "object-cover"} /> : <div className="grid h-full place-items-center text-muted">Images coming soon</div>}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
