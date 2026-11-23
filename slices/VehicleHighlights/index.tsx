import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Content, asLink, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { rel } from "@/lib/href";
import { cutout } from "@/lib/catalogue";
import { getCatalogue } from "@/lib/prismic/catalogue";

export type VehicleHighlightsProps = SliceComponentProps<Content.VehicleHighlightsSlice>;

const VehicleHighlights: FC<VehicleHighlightsProps> = async ({ slice }) => {
  const { models } = await getCatalogue();
  const cards = slice.primary.vehicles.map((v) => {
    if (!isFilled.contentRelationship(v.vehicle)) return null;
    const m = models.find((x) => x.slug === (v.vehicle as { uid?: string }).uid);
    const co = m && cutout(m);
    if (!m || !co) return null; // not on the site (hidden, or no background-free image yet)
    return { uid: m.slug, name: m.name, tagline: m.tagline, image: { url: co.src, alt: `${m.brand} ${m.name}`, flip: co.flip } };
  });
  const items = cards.filter((c): c is NonNullable<typeof c> => !!c);
  if (!items.length) return null;
  const href = isFilled.link(slice.primary.cta) ? rel(asLink(slice.primary.cta)) : null;
  return (
    <section data-slice-type={slice.slice_type} className="bg-sunken">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">{slice.primary.heading || "Highlights"}</h2>
          {href && <Link href={href} className="font-medium text-accent-deep underline">{(slice.primary.cta as { text?: string }).text || "View all vehicles"}</Link>}
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((c) => (
            <li key={c.uid}>
              <Link href={`/showroom/${c.uid}`} className="group block overflow-hidden rounded-[2rem] bg-white">
                <div className="relative aspect-[4/3] bg-gradient-to-b from-sky-soft to-sunken">
                  <Image src={c.image.url} alt={c.image.alt} fill sizes="(min-width:768px) 33vw, 100vw" style={c.image.flip ? { transform: "scaleX(-1)" } : undefined} className="object-contain p-5 transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-[1.04]" />
                </div>
                <div className="p-5">
                  <h3 className="display text-2xl">{c.name}</h3>
                  {c.tagline && <p className="mt-1 text-muted">{c.tagline}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default VehicleHighlights;
