import "server-only";
import { cache } from "react";
import { asLink, isFilled } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { rel } from "@/lib/href";
import { cutout } from "@/lib/catalogue";
import { getCatalogue } from "@/lib/prismic/catalogue";

export type Img = { url: string; alt: string };
export type Pick = { title: string; subtitle: string; image: Img | null; ctaLabel: string; href: string };
/** `flip`: the picture faces left and is mirrored so every vehicle points right. */
export type Cat = { name: string; image: (Img & { flip: boolean }) | null; href: string };
export type BrandData = { uid: string; name: string; logo: Img | null; picks: Pick[]; categories: Cat[] };

const img = (f: { url?: string | null; alt?: string | null } | undefined): Img | null =>
  f && f.url ? { url: f.url, alt: f.alt ?? "" } : null;

/** Brands (with their top picks and per-category images), ordered by the `order` field. All editable in Prismic. */
export const getHomeBrands = cache(async (): Promise<BrandData[]> => {
  try {
    const client = createClient();
    const [docs, { models }] = await Promise.all([client.getAllByType("brand", { fetchLinks: ["category.name"] }), getCatalogue()]);
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
              // The card shows a background-free colour image of a vehicle in this brand and category (never an editor-picked photo).
              const m = models.find((x) => x.brand === brandName && x.category === name && cutout(x));
              const co = m && cutout(m);
              const image = m && co ? { url: co.src, alt: `${m.brand} ${m.name}`, flip: co.flip } : null;
              return { name, image, href: `/showroom?brand=${encodeURIComponent(brandName)}&body=${encodeURIComponent(name)}` };
            })
            .filter((c) => c.name && c.image),
        };
      });
  } catch (e) {
    console.error("getHomeBrands failed", e);
    return [];
  }
});
