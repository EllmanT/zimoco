import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Zimoco",
  description: "Zimoco is a Harare vehicle dealer. See how we source, inspect, document and hand over vehicles, then explore the showroom and request a quote.",
  alternates: { canonical: "/about" },
};

// Chapter copy is draft wording based on the brief. Verify each claim with Zimoco before launch.
const chapters = [
  {
    n: "01", title: "Source",
    body: "We find vehicles through an international dealer network and bring them to Harare by sea and road. You tell us the model, budget and timing; we tell you honestly what is available and what it will cost.",
    images: [{ src: "/site/about/port-ship.jpg", alt: "A container ship docked beside port cranes under a clear sky", tall: false }],
  },
  {
    n: "02", title: "Inspect",
    body: "Before a vehicle is quoted, it goes on the lift. Engine, underbody, tyres and electronics are checked, and what we find is recorded, including the imperfections.",
    images: [
      { src: "/site/about/inspection-lift.jpg", alt: "An SUV raised on a workshop lift while a technician inspects the underside", tall: false },
      { src: "/site/about/inspection-engine.jpg", alt: "A mechanic checking an engine under the bonnet", tall: false },
    ],
  },
  {
    n: "03", title: "Document",
    body: "Paperwork should never be a surprise. We walk you through the documents for each vehicle, line by line, before you commit to anything.",
    images: [{ src: "/site/about/paperwork.jpg", alt: "A consultant and a customer reading a vehicle contract together in a showroom", tall: false }],
  },
  {
    n: "04", title: "Hand over",
    body: "Collect from our Mount Pleasant showroom, with a consultant beside you for the final walk-round. Then the road is yours.",
    images: [{ src: "/site/about/road-suv.jpg", alt: "An SUV driving fast along a sandy road", tall: false }],
  },
];

const points = [
  ["A showroom that is always open", "Browse every model, trim and colour any time, from your phone or your desk."],
  ["Compare before you commit", "Put vehicles side by side on price, power, economy and capacity, so you know what you are choosing."],
  ["One clear next step", "When you are ready, request a quote. We confirm availability and a firm price, and a consultant guides you from there."],
];

export default function About() {
  return (
    <>
      <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden bg-chrome text-white" aria-labelledby="about-h">
        <Image src="/site/about/harare-gardens.jpg" alt="A monument among tall trees in Harare Gardens" fill priority sizes="100vw" quality={80} className="hero-zoom -z-20 object-cover object-[50%_60%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="mx-auto w-full max-w-[1100px] px-5 pb-12 pt-32 md:px-10 md:pb-16">
          <h1 id="about-h" className="display rise rise-2 mt-3 max-w-3xl text-[clamp(2.4rem,5.4vw,4.4rem)]">Buying a vehicle, made clear.</h1>
          <p className="measure rise rise-3 mt-5 text-lg text-white/80">Zimoco is based on Norfolk Road in Mount Pleasant, Harare. Our digital showroom helps you explore, configure and compare, then request a quote when you are ready.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="label text-red">How we work</p>
          <h2 className="display mt-3 max-w-2xl text-[clamp(1.6rem,3.4vw,2.8rem)]">From a dealer overseas to your driveway.</h2>
        </Reveal>

        <ol className="mt-14 space-y-20 md:space-y-28">
          {chapters.map((c, i) => (
            <li key={c.n}>
              <Reveal>
                <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className={c.images.length > 1 ? "grid grid-cols-2 gap-3" : ""}>
                    {c.images.map((im, k) => (
                      <div key={im.src} className={`relative overflow-hidden rounded-3xl bg-sunken ${c.images.length > 1 ? "aspect-[3/4]" : "aspect-[4/3]"} ${c.images.length > 1 && k === 1 ? "mt-8" : ""}`}>
                        <Image src={im.src} alt={im.alt} fill sizes="(min-width:768px) 45vw, 100vw" quality={78} className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="display text-5xl text-red/90 tnum" aria-hidden>{c.n}</p>
                    <h3 className="display mt-4 text-3xl">{c.title}</h3>
                    <p className="measure mt-4 text-lg text-muted">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <section className="relative isolate overflow-hidden bg-chrome py-20 text-white md:py-28" aria-labelledby="about-cta">
        <Image src="/site/about/road-plains.jpg" alt="" fill sizes="100vw" quality={70} className="-z-20 object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto max-w-[1100px] px-5 md:px-10">
          <Reveal>
            <h2 id="about-cta" className="display max-w-2xl text-[clamp(1.8rem,4vw,3.2rem)]">Ready when you are.</h2>
            <p className="measure mt-4 text-lg text-white/80">Explore the showroom at your own pace. When something catches your eye, a consultant at {site.address} will take it from there.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/showroom" className="btn btn-red">Explore the showroom</Link><Link href="/contact" className="btn border-white/40 text-white hover:bg-white/10">Contact us</Link></div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-24">
        <ul className="grid gap-6 md:grid-cols-3">
          {points.map(([t, d], i) => (
            <li key={t}><Reveal delay={i * 80}><div className="h-full rounded-2xl bg-soft p-7"><h2 className="display text-lg">{t}</h2><p className="mt-3 text-muted">{d}</p></div></Reveal></li>
          ))}
        </ul>
      </div>
    </>
  );
}
