import type { MetadataRoute } from "next";
import { getCatalogue } from "@/lib/prismic/catalogue";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { models } = await getCatalogue();
  const pages = ["", "/showroom", "/find-my-car", "/about", "/contact"].map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const }));
  const cars = models.map((m) => ({ url: `${site.url}/showroom/${m.slug}`, changeFrequency: "weekly" as const }));
  return [...pages, ...cars];
}
