import Image from "next/image";
import Link from "next/link";
import HeroSlideshow, { type Slide } from "@/components/HeroSlideshow";
import ExploreRange, { type RangeItem } from "@/components/ExploreRange";
import BrandMarquee from "@/components/BrandMarquee";
import Reveal from "@/components/Reveal";
import { RingButton } from "@/components/Ring";
import { HomeQuoteCta } from "@/components/ModelCta";
import { cardImage, findModel, fromPrice, heroImage, usd, type Model } from "@/lib/catalogue";
import { getCatalogue } from "@/lib/prismic/catalogue";

const logoFile: Record<string, string> = { Toyota: "toyota", Lexus: "lexus", Ford: "ford", Honda: "honda", Isuzu: "isuzu", "Land Rover": "land-rover", Mazda: "mazda" };

const steps = [
  ["Explore", "Browse pickups, SUVs, hatchbacks and commercial vehicles, with specs and trims for every model."],
  ["Configure", "Pick your trim and colour and see the vehicle change in front of you."],
  ["Compare", "Put up to three vehicles side by side and see which one wins on what matters."],
  ["Request a quote", "Send your configuration in under a minute. We confirm availability and a firm price."],
] as const;

/** Step title with one red letter: the 1st letter of the 1st step, the 2nd of the 2nd, and so on. */
function Accent({ text, at }: { text: string; at: number }) {
  return <>{text.slice(0, at)}<span className="text-red">{text[at]}</span>{text.slice(at + 1)}</>;
}

export default async function Home() {
  const cat = await getCatalogue();
  const { models, brands, comparePresets } = cat;
  const getModel = (slug: string): Model | undefined => findModel(cat, slug);

  const marqueeBrands = brands.map((b) => ({ name: b, logo: `/brands/${logoFile[b] ?? b.toLowerCase().replace(/\s+/g, "-")}.svg`, href: `/showroom?brand=${encodeURIComponent(b)}` }));

  // Hero: video only (Bunny Stream). Each slide links to its model page, when that model exists in the catalogue.
  const heroVideos = [
    { slug: "toyota-land-cruiser-300", video: "4adf564d-c2e0-4db6-be54-72e95df12434" },
    { slug: "lexus-lx-500d", video: "1516422c-1e10-48e1-bdeb-aa7dfff91f14" },
    { slug: "toyota-new-hilux-double-cab", video: "dedb2519-6b1a-487a-987f-a8ce95683ef8" },
  ];
  const heroSlides: Slide[] = heroVideos.flatMap(({ slug, video }) => {
    const m = getModel(slug) ?? (slug === "toyota-new-hilux-double-cab" ? getModel("toyota-hilux-double-cab") : undefined);
    return m
      ? [{ id: m.slug, video, alt: `${m.brand} ${m.name}`, kicker: m.brand, headline: `${m.name}. ${m.tagline.split(".")[0]}.`, href: `/showroom/${m.slug}`, cta: `Explore ${m.name}` } satisfies Slide]
      : [];
  });

  const rangeItems: RangeItem[] = models.map((m) => ({ slug: m.slug, brand: m.brand, name: m.name, body: m.body, price: usd(fromPrice(m)), image: cardImage(m) }));

  // The "configure" showcase uses the Hilux Double Cab (FM-based), or the local Hilux if Prismic is unavailable.
  const hilux = getModel("toyota-hilux-double-cab") ?? getModel("toyota-hilux")!;
  const lux = cardImage(hilux) ?? { src: "", studio: false };

  return (
    <>
      <HeroSlideshow slides={heroSlides} />

      <ExploreRange items={rangeItems} />

      <section className="bg-soft">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-24 md:px-8 lg:grid-cols-2">
          <Reveal>
            <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">See your Hilux in every colour</h2>
            <p className="measure mt-5 text-muted">Pick the cab, the trim and the colour. The vehicle updates instantly, and your configuration goes straight into your quote request.</p>
            <div className="mt-8"><RingButton href={`/showroom/${hilux.slug}#configure`} label="Configure the Hilux" invert="#fff" className="text-ink" /></div>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative aspect-[16/9]">
              {lux.src && <Image src={lux.src} alt="Toyota Hilux" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-6" />}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
          <Reveal>
            <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">The comparisons everyone asks for</h2>
          </Reveal>
          <ul className="mt-10 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {comparePresets.map((p) => (
              <li key={p.label}>
                <Link href={`/compare?m=${[p.a, p.b, p.c].filter(Boolean).join(",")}`} className="group flex items-center justify-between py-5 transition-colors">
                  <span className="display text-lg transition-colors group-hover:text-red">{p.label}</span>
                  <span className="text-red transition-transform duration-200 group-hover:translate-x-1" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-soft">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
          <Reveal>
            <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">From browsing to a quote in four steps</h2>
          </Reveal>
          <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t}>
                <h3 className="display text-[1.65rem] leading-tight"><Accent text={t} at={i} /></h3>
                <p className="mt-3 max-w-[30ch] text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BrandMarquee brands={marqueeBrands} />

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
          <HomeQuoteCta />
        </div>
      </section>
    </>
  );
}
