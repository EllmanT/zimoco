import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import DotRail from "@/components/DotRail";
import Reveal from "@/components/Reveal";
import { findModel, fromPrice, fullName, usd, visual } from "@/lib/catalogue";
import { getCatalogue } from "@/lib/prismic/catalogue";
import { buildVehiclePage } from "@/lib/vehicle-page";
import VersionPills from "@/components/vehicle/VersionPills";
import PriceBar from "@/components/vehicle/PriceBar";
import HighlightsBento from "@/components/vehicle/HighlightsBento";
import Viewer from "@/components/vehicle/Viewer";
import DriveCtas from "@/components/vehicle/DriveCtas";
import EquipmentTabs from "@/components/vehicle/EquipmentTabs";
import SpecTable from "@/components/vehicle/SpecTable";
import OffersBand from "@/components/vehicle/OffersBand";
import AvailableVehicles from "@/components/vehicle/AvailableVehicles";
import NextStepsForm from "@/components/vehicle/NextStepsForm";

export async function generateStaticParams() {
  const { models } = await getCatalogue();
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = findModel(await getCatalogue(), (await params).slug);
  if (!m) return {};
  return {
    // A title written in Prismic is used exactly as typed (no site-name suffix added).
    title: m.cms?.metaTitle ? { absolute: m.cms.metaTitle } : `${fullName(m)} for sale in Zimbabwe | Versions, specs and a quote`,
    description: m.cms?.metaDescription ?? `${m.summary} Indicative from ${usd(fromPrice(m))}. Explore versions, colours and specifications and request a quote from Zimoco.`,
    alternates: { canonical: `/showroom/${m.slug}` },
  };
}

const rail = [
  { id: "overview", label: "Overview" },
  { id: "highlights", label: "Highlights" },
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "equipment", label: "Equipment" },
  { id: "technical", label: "Technical data" },
  { id: "offers", label: "Offers and prices" },
  { id: "available", label: "Available vehicles" },
  { id: "next-steps", label: "Next steps" },
  { id: "faq", label: "FAQ" },
];

/** Each section's title is its heading (no small label above it). */
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

export default async function ModelPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ v?: string }> }) {
  const m = findModel(await getCatalogue(), (await params).slug);
  if (!m) notFound();
  const { v } = await searchParams;
  const d = buildVehiclePage(m, v);
  const hero = d.hero;
  const price = d.price;
  const side = visual(m);
  const photo = hero.kind === "photo";
  const exteriorTabs = [
    ...(d.colours.length ? [{ label: "Colours", sets: d.colours }] : []),
    ...(d.wheels.length ? [{ label: "Wheels", sets: d.wheels }] : []),
  ];
  const interiorTabs = d.interior.map((t) => ({ label: t.tab, sets: t.sets }));
  const items = rail.filter((r) => {
    if (r.id === "highlights") return d.highlights.length > 0;
    if (r.id === "exterior") return exteriorTabs.length > 0;
    if (r.id === "interior") return interiorTabs.length > 0;
    if (r.id === "equipment") return d.equipment.length > 0;
    return true;
  });
  const faq = [
    ...(m.faq ?? [
      [`Is the ${m.name} available?`, "Every vehicle in the showroom is shown as available. If the exact version and colour you want is not on the floor, our team sources it and confirms timing on your quote."],
      ["Is the price final?", "The price shown is an indicative starting price. The final price depends on year, mileage, specification and colour, and is confirmed in your quote."],
    ]),
    ["How do I get a quote?", "Choose your version, then press Request a quote or fill in the form at the bottom of the page. A consultant will respond on WhatsApp, by phone or email."],
  ] as [string, string][];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Product", name: fullName(m), brand: { "@type": "Brand", name: m.brand }, description: m.summary, category: m.body, ...(price ? { offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: price, availability: "https://schema.org/InStock" } } : {}) },
      { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  };

  return (
    <>
      <DotRail items={items} />

      <section id="overview" className={`relative isolate min-h-[calc(100svh-10rem)] overflow-hidden ${photo ? "bg-black text-white" : "bg-gradient-to-b from-white via-white to-soft text-ink"}`}>
        {hero.src ? (
          <Image src={hero.src} alt={fullName(m)} fill priority quality={85} sizes="100vw" className={photo ? "-z-10 object-cover" : "-z-10 object-contain object-center px-[3vw] pb-48 pt-40 md:pb-40 md:pt-40"} style={photo ? { objectPosition: hero.focus } : undefined} />
        ) : (
          <div className="absolute inset-0 -z-10 grid place-items-center text-muted">Images coming soon</div>
        )}
        {photo && <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-black/45" />}
        <div className="mx-auto flex min-h-[inherit] max-w-[1400px] flex-col justify-between px-5 pb-16 pt-12 md:px-8 xl:pl-24">
          <div>
            <p className={`label ${photo ? "text-white/85" : "text-accent"}`}>{m.brand}</p>
            <h1 className="display mt-3 text-[clamp(2.8rem,8vw,7rem)] leading-[0.95]">{m.name}</h1>
          </div>
          <p className={`max-w-xl text-lg md:text-xl ${photo ? "text-white/90" : "text-ink/80"}`}>{m.tagline}</p>
        </div>
      </section>

      <VersionPills versions={m.variants.map((x) => ({ id: x.id, name: x.name }))} active={d.version.id} label={`${m.name} versions`} />
      <div className="h-6" />
      <PriceBar modelSlug={m.slug} modelName={m.name} versionId={d.version.id} versionName={d.version.name} priceLabel={usd(price)} />

      {d.highlights.length > 0 && (
        <Section id="highlights" title={`Top things about the ${m.name}`}>
          <HighlightsBento tiles={d.highlights} />
        </Section>
      )}

      {exteriorTabs.length > 0 && (
        <Section id="exterior" title={`The exterior of the ${m.name}`} tone="soft">
          <Viewer key={d.version.id} tabs={exteriorTabs} name={`${fullName(m)} ${d.version.name}`} studio />
        </Section>
      )}

      {interiorTabs.length > 0 && (
        <Section id="interior" title={`The interior of the ${m.name}`}>
          <Viewer key={d.version.id} tabs={interiorTabs} name={`${fullName(m)} interior`} studio={false} />
          <div className="mt-12">
            <DriveCtas modelSlug={m.slug} versionId={d.version.id} />
          </div>
        </Section>
      )}

      {d.equipment.length > 0 && (
        <Section id="equipment" title={`Equipment highlights of the ${m.name}`} tone="soft">
          <EquipmentTabs key={d.version.id} items={d.equipment} categories={d.equipmentCategories} />
        </Section>
      )}

      <Section id="technical" title="Technical data" tone={d.equipment.length > 0 ? "white" : "soft"}>
        <SpecTable keyRows={d.keyRows} groups={d.groups} />
      </Section>

      <OffersBand offers={d.offers} modelName={m.name} />

      <Section id="available" title={`Available ${m.name} vehicles`}>
        <AvailableVehicles model={m} active={d.version.id} fallbackSrc={side?.src} />
      </Section>

      <section id="next-steps" className="bg-soft">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24 xl:pl-24">
          <Reveal>
            <h2 className={SECTION_H2}>Your next steps to a {m.name}</h2>
            <p className="mt-4 max-w-xl text-muted">Tell us a little about what you need. We confirm availability and a firm price, and a consultant guides you from there.</p>
          </Reveal>
          <div className="mt-10">
            <NextStepsForm key={d.version.id} modelSlug={m.slug} modelName={fullName(m)} versionId={d.version.id} versionName={d.version.name} price={price} />
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24 xl:pl-24">
          <Reveal>
            <h2 className={SECTION_H2}>Questions, answered</h2>
          </Reveal>
          <div className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
            {faq.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex list-none items-center justify-between gap-6 text-lg font-medium">
                  {q}
                  <span aria-hidden className="text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
