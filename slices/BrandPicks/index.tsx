import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import BrandBar from "@/components/home/BrandBar";
import TopPicks from "@/components/home/TopPicks";
import { COMMERCIAL_BRANDS } from "@/lib/catalogue";
import { getHomeBrands } from "@/lib/prismic/home";

export type BrandPicksProps = SliceComponentProps<Content.BrandPicksSlice>;

/** Brand pill bar (overlapping the hero, docking under the header on scroll) followed by the Top Picks bento. */
const BrandPicks: FC<BrandPicksProps> = async ({ slice }) => {
  const all = await getHomeBrands();
  // Trucks and buses are not on the homepage grids yet: they appear as a single "Commercial" pill that does nothing.
  const brands = all.filter((b) => !COMMERCIAL_BRANDS.has(b.name));
  if (!brands.length) return null;
  const pills = [
    ...brands.map(({ uid, name }) => ({ uid, name })),
    ...(all.length > brands.length ? [{ uid: "commercial", name: "Commercial", inert: true }] : []),
  ];
  return (
    <div data-slice-type={slice.slice_type}>
      <BrandBar brands={pills} label={slice.primary.pills_label || "Brands"} />
      <TopPicks brands={brands} heading={slice.primary.heading || "Top picks"} />
    </div>
  );
};

export default BrandPicks;
