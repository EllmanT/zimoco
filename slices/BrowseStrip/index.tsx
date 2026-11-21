import { FC } from "react";
import Link from "next/link";
import { Content, asLink, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type BrowseStripProps = SliceComponentProps<Content.BrowseStripSlice>;

const BrowseStrip: FC<BrowseStripProps> = ({ slice }) => {
  const href = isFilled.link(slice.primary.cta) ? asLink(slice.primary.cta) : null;
  return (
    <section data-slice-type={slice.slice_type} className="bg-black text-white">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-8">
        <p className="display text-[clamp(1.2rem,2vw,1.6rem)]">{slice.primary.text || "Browse available vehicles"}</p>
        {href && <Link href={href} className="btn btn-accent !min-h-10">{(slice.primary.cta as { text?: string }).text || "Browse"}</Link>}
      </div>
    </section>
  );
};

export default BrowseStrip;
