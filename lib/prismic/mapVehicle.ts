import { asText, isFilled, type Content } from "@prismicio/client";
import type { Body, Cms, ColourOption, Model, PageGroups, Spec, Variant } from "@/lib/catalogue";

const BODIES: Body[] = ["Pickup", "SUV", "Hatchback", "Commercial"];
const TBC = "To be confirmed";

type Row = Content.VehicleDocument["data"]["variants"][number];

/** Name of a linked brand or category document (the link carries `data` for the fields chosen in the model). */
function linkedName(link: unknown): string {
  const l = link as { data?: { name?: string | null } } | undefined;
  return l?.data?.name?.trim() ?? "";
}

/** Only the fields a variant actually fills in. Blank means "same as the model's base spec". */
function rowSpec(v: Row): Partial<Spec> {
  const s: Partial<Spec> = {};
  if (v.engine) s.engine = v.engine;
  if (v.fuel) s.fuel = v.fuel;
  if (v.power_kw != null) s.powerKw = v.power_kw;
  if (v.torque_nm != null) s.torqueNm = v.torque_nm;
  if (v.transmission) s.transmission = v.transmission;
  if (v.drive) s.drive = v.drive;
  if (v.economy != null) s.economy = v.economy;
  if (v.seats != null) s.seats = v.seats;
  if (v.payload_kg != null) s.payloadKg = v.payload_kg;
  if (v.towing_kg != null) s.towingKg = v.towing_kg;
  if (v.length_mm != null) s.lengthMm = v.length_mm;
  if (v.safety) s.safety = v.safety;
  return s;
}

type Img = Content.VehicleDocument["data"]["hero_image"];
type Raw = { variant_id?: string | null } & Record<string, unknown>;
const ids = (r: Raw) => (r.variant_id ?? "").split(/[,\s]+/).filter(Boolean);
const txt = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const img = (v: unknown) => (isFilled.image(v as Img) ? ((v as Img).url as string) : undefined);

/** Reads the vehicle-page groups. Every group may be absent (older Prismic model), so each defaults to empty. */
function mapPage(d: unknown, rows: Row[]): PageGroups {
  const g = (k: string) => (((d as Record<string, unknown>)[k] as Raw[] | undefined) ?? []);
  const heroByVersion: Record<string, string> = {};
  for (const v of rows) { const u = img((v as unknown as Raw).hero_image); if (u && v.variant_id) heroByVersion[v.variant_id] = u; }
  return {
    heroByVersion,
    highlights: g("highlights").filter((r) => txt(r.title) || img(r.image)).map((r) => ({ ids: ids(r), title: txt(r.title), text: txt(r.text), src: img(r.image) })),
    exterior: g("exterior_views").flatMap((r) => { const src = img(r.image), name = txt(r.colour_name); return src && name ? [{ ids: ids(r), name, hex: txt(r.colour_hex) || undefined, angle: txt(r.angle) || "Front left", src }] : []; }),
    wheels: g("wheel_options").flatMap((r) => { const src = img(r.image), name = txt(r.name); return src && name ? [{ ids: ids(r), name, angle: txt(r.angle) || "Front left", src }] : []; }),
    interior: g("interior_views").flatMap((r) => { const src = img(r.image); return src ? [{ ids: ids(r), tab: txt(r.tab) || "Upholstery", name: txt(r.option_name) || "Interior", hex: txt(r.swatch_hex) || undefined, src }] : []; }),
    equipment: g("equipment").filter((r) => txt(r.title)).map((r) => ({ ids: ids(r), category: txt(r.category) || "Highlights", title: txt(r.title), text: txt(r.text), src: img(r.image) })),
    specs: g("spec_rows").filter((r) => txt(r.label) && txt(r.value)).map((r) => ({ ids: ids(r), section: txt(r.section) || "General", label: txt(r.label), value: txt(r.value), key: r.key_figure === true })),
    offers: g("offers").filter((r) => txt(r.title)).map((r) => ({ ids: ids(r), type: txt(r.type) || "Other", title: txt(r.title), text: txt(r.text), cta: txt(r.cta_label) || "Make an enquiry", src: img(r.image) })),
  };
}

/**
 * Turns a Prismic `vehicle` document into the site's Model. The first variant is the base spec.
 * A later variant that names a different engine is a different powertrain, so it does NOT inherit
 * the base power, torque, fuel, gearbox or drive (they show as unconfirmed instead of wrong).
 */
export function mapVehicle(doc: Content.VehicleDocument): Model | null {
  const d = doc.data;
  const slug = doc.uid;
  const rows = d.variants.filter((v) => v.variant_id && v.name);
  if (!slug || !rows.length) return null;

  const first = rows[0];
  const base: Spec = {
    engine: first.engine ?? "",
    fuel: first.fuel ?? "",
    powerKw: first.power_kw ?? null,
    torqueNm: first.torque_nm ?? null,
    transmission: first.transmission ?? "",
    drive: first.drive ?? "",
    economy: first.economy ?? null,
    seats: first.seats ?? 5,
    payloadKg: first.payload_kg ?? undefined,
    towingKg: first.towing_kg ?? undefined,
    lengthMm: first.length_mm ?? undefined,
    safety: first.safety ?? undefined,
  };

  const variants: Variant[] = rows.map((v, i) => {
    let spec = rowSpec(v);
    if (i > 0 && v.engine && v.engine !== first.engine) {
      spec = { powerKw: null, torqueNm: null, fuel: TBC, transmission: TBC, drive: TBC, ...spec };
    }
    return {
      id: v.variant_id as string,
      name: v.name as string,
      from: v.from_price ?? null,
      blurb: v.blurb ?? undefined,
      ...(i === 0 ? {} : { spec }),
    };
  });

  const colours: Record<string, ColourOption[]> = {};
  for (const c of d.colour_options) {
    if (!c.variant_id || !c.colour_name || !isFilled.image(c.image)) continue;
    const option: ColourOption = { colour: c.colour_name.trim().toLowerCase(), src: c.image.url, hex: c.hex?.trim() || undefined };
    // One entry may list several trims (comma-separated) that share this colour.
    for (const id of c.variant_id.split(/[,\s]+/).filter(Boolean)) (colours[id] ??= []).push(option);
  }

  const shots = (g: { image: Content.VehicleDocument["data"]["exterior_shots"][number]["image"] }[]) =>
    g.filter((s) => isFilled.image(s.image)).map((s) => s.image.url as string);

  const credits = [
    ...new Set(
      [d.hero_image, d.card_image, ...d.exterior_shots.map((s) => s.image), ...d.interior_shots.map((s) => s.image)]
        .map((i) => (isFilled.image(i) ? i.copyright?.trim() : ""))
        .filter((c): c is string => !!c),
    ),
  ];
  const cms: Cms = {
    credits: credits.length ? credits : undefined,
    hero: isFilled.image(d.hero_image) ? d.hero_image.url : undefined,
    card: isFilled.image(d.card_image) ? d.card_image.url : undefined,
    page: mapPage(d, rows),
    colours,
    exterior: shots(d.exterior_shots),
    interior: shots(d.interior_shots),
    longDescription: isFilled.richText(d.long_description) ? asText(d.long_description, "\n").split("\n").filter(Boolean) : undefined,
    metaTitle: d.meta_title ?? undefined,
    metaDescription: d.meta_description ?? undefined,
  };

  const categoryName = linkedName(d.category);
  const rivals = d.rivals
    .map((r) => (isFilled.contentRelationship(r.vehicle) ? r.vehicle.uid : undefined))
    .filter((x): x is string => !!x);
  const faq = d.faq
    .filter((f) => f.question && isFilled.richText(f.answer))
    .map((f) => [f.question as string, asText(f.answer)] as [string, string]);

  return {
    cms,
    slug,
    folder: slug,
    brand: linkedName(d.brand),
    name: d.model_name ?? doc.id,
    body: (BODIES as string[]).includes(categoryName) ? (categoryName as Body) : "SUV",
    tagline: d.tagline ?? "",
    summary: d.summary ?? "",
    spec: base,
    variants,
    rivals,
    faq: faq.length ? faq : undefined,
  };
}
