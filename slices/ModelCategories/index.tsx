import { FC } from "react";
import Link from "next/link";
import { Content, asLink, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { rel } from "@/lib/href";
import ModelsGrid from "@/components/home/ModelsGrid";
import { COMMERCIAL_BRANDS } from "@/lib/catalogue";
import { getHomeBrands } from "@/lib/prismic/home";

export type ModelCategoriesProps = SliceComponentProps<Content.ModelCategoriesSlice>;

/** "Our models": body types for the brand currently selected in the pill bar. */
const ModelCategories: FC<ModelCategoriesProps> = async ({ slice }) => {
  const brands = (await getHomeBrands()).filter((b) => !COMMERCIAL_BRANDS.has(b.name));
  const href = isFilled.link(slice.primary.cta) ? rel(asLink(slice.primary.cta)) : null;
  return (
    <section data-slice-type={slice.slice_type} data-brand-end className="bg-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">{slice.primary.heading || "Our models"}</h2>
          {href && <Link href={href} className="btn btn-accent">{(slice.primary.cta as { text?: string }).text || "Discover all models"}</Link>}
        </div>
        <ModelsGrid brands={brands} />
      </div>
    </section>
  );
};

export default ModelCategories;
