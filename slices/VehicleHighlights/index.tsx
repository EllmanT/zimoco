import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Content, asLink, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { rel } from "@/lib/href";
import { createClient } from "@/prismicio";

export type VehicleHighlightsProps = SliceComponentProps<Content.VehicleHighlightsSlice>;

const VehicleHighlights: FC<VehicleHighlightsProps> = async ({ slice }) => {
  const client = createClient();
  const cards = await Promise.all(
    slice.primary.vehicles.map(async (v) => {
      if (!isFilled.contentRelationship(v.vehicle)) return null;
      try {
        const doc = await client.getByID<Content.VehicleDocument>(v.vehicle.id);
        const d = doc.data;
        const image = d.card_image?.url ? d.card_image : d.hero_image;
        return { uid: doc.uid ?? doc.id, label: v.label ?? "", name: d.model_name ?? "", tagline: d.tagline ?? "", image: image?.url ? { url: image.url, alt: image.alt ?? "" } : null };
      } catch { return null; }
    }),
  );
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
                  {c.image && <Image src={c.image.url} alt={c.image.alt || c.name} fill sizes="(min-width:768px) 33vw, 100vw" className="object-contain p-5 transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-[1.04]" />}
                </div>
                <div className="p-5">
                  {c.label && <p className="label text-accent-deep">{c.label}</p>}
                  <h3 className="display mt-1 text-2xl">{c.name}</h3>
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
