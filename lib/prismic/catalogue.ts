import { cache } from "react";
import { createClient } from "@/prismicio";
import { comparePresets, localCatalogue, makeCatalogue, models as localModels, type Catalogue, type Model } from "@/lib/catalogue";
import { mapVehicle } from "./mapVehicle";

/**
 * A local model that is replaced by a different Prismic model (different slug) once that exists.
 * The old Hilux is retired when its FM-based replacement (Hilux Double Cab) is in Prismic.
 */
const SUPERSEDED_BY: Record<string, string> = { "toyota-hilux": "toyota-hilux-double-cab" };

/**
 * Server-side catalogue: Prismic first, local fallback.
 * - A vehicle published in Prismic replaces the local model with the same slug.
 * - A superseded local model is dropped when its replacement is in Prismic (and links to it are redirected).
 * - Vehicles that exist only in Prismic are added next to models of the same brand and body (Hilux variants stay together).
 * - Local models not yet in Prismic stay as they are.
 * - If Prismic is unreachable, the local catalogue is returned so the site keeps working.
 * `cache` de-duplicates the call within one request (layout, page and footer all ask for it).
 */
export const getCatalogue = cache(async (): Promise<Catalogue> => {
  try {
    const client = createClient();
    const docs = await client.getAllByType("vehicle");
    const mapped = docs.map(mapVehicle).filter((m): m is Model => m !== null);
    if (!mapped.length) return localCatalogue;
    const bySlug = new Map(mapped.map((m) => [m.slug, m]));

    const redirect = (slug: string) => (SUPERSEDED_BY[slug] && bySlug.has(SUPERSEDED_BY[slug]) ? SUPERSEDED_BY[slug] : slug);

    // Start from the local order, swapping in Prismic versions and dropping superseded models.
    const merged: Model[] = [];
    for (const m of localModels) {
      const to = redirect(m.slug);
      if (to !== m.slug) { merged.push(bySlug.get(to)!); continue; } // the replacement takes the old model's place
      merged.push(bySlug.get(m.slug) ?? m);
    }
    // Add Prismic-only models next to their closest relatives.
    for (const m of mapped) {
      if (merged.some((x) => x.slug === m.slug)) continue;
      let at = -1;
      merged.forEach((x, i) => { if (x.brand === m.brand && x.body === m.body) at = i; });
      if (at === -1) merged.push(m); else merged.splice(at + 1, 0, m);
    }

    // Point rivals and compare presets at replacement slugs.
    const fixed = merged.map((m) => ({ ...m, rivals: m.rivals.map(redirect) }));
    const presets = comparePresets.map((p) => ({ ...p, a: redirect(p.a), b: redirect(p.b), c: p.c ? redirect(p.c) : undefined }));
    return makeCatalogue(fixed, presets);
  } catch (err) {
    console.error("[catalogue] Prismic unavailable, using the local catalogue.", err);
    return localCatalogue;
  }
});
