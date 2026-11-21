import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Content, asLink, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type SplitFeatureProps = SliceComponentProps<Content.SplitFeatureSlice>;

/** Text on one side, image on the other. Variation "imageLeft" mirrors the default. */
const SplitFeature: FC<SplitFeatureProps> = ({ slice }) => {
  const left = slice.variation === "imageLeft";
  const href = isFilled.link(slice.primary.cta) ? asLink(slice.primary.cta) : null;
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className={left ? "bg-sunken" : "bg-white"}>
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-20 md:px-8 lg:grid-cols-2 lg:gap-16">
        <div className={left ? "lg:order-2" : ""}>
          {slice.primary.eyebrow && <p className="label text-accent-deep">{slice.primary.eyebrow}</p>}
          <h2 className="display mt-3 text-[clamp(1.8rem,3.4vw,3rem)]">{slice.primary.heading}</h2>
          <div className="measure mt-5 space-y-4 text-muted"><PrismicRichText field={slice.primary.body} /></div>
          {href && <Link href={href} className="btn btn-accent mt-8">{(slice.primary.cta as { text?: string }).text || "Learn more"}</Link>}
        </div>
        <div className={`relative aspect-[4/3] overflow-hidden rounded bg-gradient-to-br from-[#1b2a36] to-[#0b1218] ${left ? "lg:order-1" : ""}`}>
          {slice.primary.image.url && <Image src={slice.primary.image.url} alt={slice.primary.image.alt ?? ""} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />}
        </div>
      </div>
    </section>
  );
};

export default SplitFeature;
