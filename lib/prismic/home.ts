import "server-only";
import { cache } from "react";
import { asLink, isFilled } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { rel } from "@/lib/href";

export type Img = { url: string; alt: string };
export type Pick = { title: string; subtitle: string; image: Img | null; ctaLabel: string; href: string };
export type Cat = { name: string; image: Img | null; href: string };
export type BrandData = { uid: string; name: string; logo: Img | null; picks: Pick[]; categories: Cat[] };

const img = (f: { url?: string | null; alt?: string | null } | undefined): Img | null =>
  f && f.url ? { url: f.url, alt: f.alt ?? "" } : null;

/** Brands (with their top picks and per-category images), ordered by the `order` field. All editable in Prismic. */
export const getHomeBrands = cache(async (): Promise<BrandData[]> => {
  try {
    const client = createClient();
    const docs = await client.getAllByType("brand", { fetchLinks: ["category.name"] });
    return docs
      .filter((d) => d.data.order != null) // brands without an order (leftover Starbell brands) stay off the homepage
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
      .map((d) => {
        const brandName = d.data.name ?? d.uid ?? "";
        return {
          uid: d.uid ?? d.id,
          name: brandName,
          logo: img(d.data.logo),
          picks: d.data.top_picks.map((p) => ({
            title: p.title ?? "",
            subtitle: p.subtitle ?? "",
            image: img(p.image),
            ctaLabel: isFilled.link(p.cta) ? ((p.cta as { text?: string }).text ?? "Discover") : "Discover",
            href: rel(asLink(p.cta)) ?? `/showroom?brand=${encodeURIComponent(brandName)}`,
          })),
          categories: d.data.category_images
            .map((c) => {
              const cat = c.category as { data?: { name?: string } } | undefined;
              const name = cat?.data?.name ?? "";
              return { name, image: img(c.image), href: `/showroom?brand=${encodeURIComponent(brandName)}&body=${encodeURIComponent(name)}` };
            })
            .filter((c) => c.name),
        };
      });
  } catch (e) {
    console.error("getHomeBrands failed", e);
    return [];
  }
});
