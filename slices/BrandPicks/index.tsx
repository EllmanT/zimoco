import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import BrandBar from "@/components/home/BrandBar";
import TopPicks from "@/components/home/TopPicks";
import { getHomeBrands } from "@/lib/prismic/home";

export type BrandPicksProps = SliceComponentProps<Content.BrandPicksSlice>;

/** Brand pill bar (overlapping the hero, docking under the header on scroll) followed by the Top Picks bento. */
const BrandPicks: FC<BrandPicksProps> = async ({ slice }) => {
  const brands = await getHomeBrands();
  if (!brands.length) return null;
  return (
    <div data-slice-type={slice.slice_type}>
      <BrandBar brands={brands.map(({ uid, name }) => ({ uid, name }))} label={slice.primary.pills_label || "Brands"} />
      <TopPicks brands={brands} heading={slice.primary.heading || "Top picks"} />
    </div>
  );
};

export default BrandPicks;
