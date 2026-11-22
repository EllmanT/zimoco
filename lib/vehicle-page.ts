// Builds everything the vehicle page shows for ONE version of a model.
// Prismic rows tagged for a version win; older data (colour_options, exterior/interior shots, base spec) is the fallback,
// so existing vehicles keep working before anyone fills in the new groups.
import { colourHex, colourOptions, fromPrice, gallery, heroImage, kwLabel, nmLabel, specFor, type Model, type PageGroups, type Variant } from "@/lib/catalogue";

export type View = { angle: string; src: string };
export type ViewSet = { name: string; hex?: string; views: View[] };
export type InteriorTab = { tab: string; sets: ViewSet[] };
export type SpecGroup = { section: string; rows: [string, string][] };

const ANGLE_ORDER = ["Front", "Front left", "Left", "Rear left", "Rear", "Rear right", "Right", "Front right"];
const forVersion = <T extends { ids: string[] }>(rows: T[], id: string) => rows.filter((r) => !r.ids.length || r.ids.includes(id));

/** Rows that share a name become one set; the views inside are kept in the order authored (or by angle if all have one). */
function toSets(rows: { name: string; hex?: string; angle: string; src: string }[]): ViewSet[] {
  const map = new Map<string, ViewSet>();
  for (const r of rows) {
    const s = map.get(r.name) ?? { name: r.name, hex: r.hex ?? colourHex[r.name.toLowerCase()], views: [] };
    s.hex ??= r.hex;
    s.views.push({ angle: r.angle, src: r.src });
    map.set(r.name, s);
  }
  return [...map.values()].map((s) => ({ ...s, views: [...s.views].sort((a, b) => Math.max(0, ANGLE_ORDER.indexOf(a.angle)) - Math.max(0, ANGLE_ORDER.indexOf(b.angle))) }));
}

export function versionOf(m: Model, v?: string): Variant {
  return m.variants.find((x) => x.id === v) ?? m.variants[0];
}

export function buildVehiclePage(m: Model, versionId?: string) {
  const version = versionOf(m, versionId);
  const pg: PageGroups | undefined = m.cms?.page;
  const spec = specFor(m, version.id);

  const hero = (() => {
    const src = pg?.heroByVersion[version.id];
    return src ? { src, focus: "50% 50%", kind: "photo" as const } : heroImage(m);
  })();

  // Exterior
  let colours = toSets(forVersion(pg?.exterior ?? [], version.id));
  if (!colours.length) {
    colours = colourOptions(m, version.id).map((o) => ({ name: o.colour.replace(/\b\w/g, (c) => c.toUpperCase()), hex: o.hex ?? colourHex[o.colour], views: [{ angle: "Front left", src: o.src }] }));
  }
  const wheels = toSets(forVersion(pg?.wheels ?? [], version.id));

  // Interior
  const interiorRows = forVersion(pg?.interior ?? [], version.id);
  let interior: InteriorTab[] = [];
  if (interiorRows.length) {
    const tabs = [...new Set(interiorRows.map((r) => r.tab))];
    interior = tabs.map((tab) => ({ tab, sets: toSets(interiorRows.filter((r) => r.tab === tab).map((r) => ({ name: r.name, hex: r.hex, angle: "Interior", src: r.src }))) }));
  } else {
    const shots = gallery(m).interior;
    if (shots.length) interior = [{ tab: "Interior", sets: [{ name: "Interior", views: shots.map((src, i) => ({ angle: `View ${i + 1}`, src })) }] }];
  }

  // Highlights bento (max 5 tiles)
  let highlights = forVersion(pg?.highlights ?? [], version.id).map((h) => ({ title: h.title, text: h.text, src: h.src }));
  if (!highlights.length) {
    const g = gallery(m);
    const imgs = [...g.exterior.slice(0, 3), ...g.interior.slice(0, 2)];
    const titles: [string, string][] = [
      ["Design", m.tagline],
      ["Performance", `${kwLabel(spec)} and ${nmLabel(spec)} of torque.`],
      ["Drive", spec.drive || spec.transmission],
      ["Inside", `Seating for ${spec.seats}.`],
      ["Safety", spec.safety ?? "Confirmed on quote."],
    ];
    highlights = imgs.map((src, i) => ({ title: titles[i][0], text: titles[i][1], src }));
  }

  // Equipment
  const equipment = forVersion(pg?.equipment ?? [], version.id);
  const equipmentCategories = [...new Set(equipment.map((e) => e.category))];

  // Technical data
  const authored = forVersion(pg?.specs ?? [], version.id);
  const fallback: [string, string][] = [
    ["Engine", spec.engine], ["Fuel", spec.fuel], ["Power", kwLabel(spec)], ["Torque", nmLabel(spec)], ["Transmission", spec.transmission], ["Drive", spec.drive],
    ...(spec.economy ? ([["Economy", `${spec.economy} L/100 km`]] as [string, string][]) : []),
    ["Seats", String(spec.seats)],
    ...(spec.towingKg ? ([["Towing", `${spec.towingKg.toLocaleString("en-US")} kg`]] as [string, string][]) : []),
    ...(spec.payloadKg ? ([["Payload", `${spec.payloadKg.toLocaleString("en-US")} kg`]] as [string, string][]) : []),
    ...(spec.lengthMm ? ([["Length", `${spec.lengthMm.toLocaleString("en-US")} mm`]] as [string, string][]) : []),
  ].filter(([, v]) => v && v !== "—") as [string, string][];
  const keyRows: [string, string][] = authored.some((r) => r.key) ? authored.filter((r) => r.key).map((r) => [r.label, r.value]) : fallback.slice(0, 5);
  const groups: SpecGroup[] = authored.length
    ? [...new Set(authored.map((r) => r.section))].map((section) => ({ section, rows: authored.filter((r) => r.section === section).map((r) => [r.label, r.value] as [string, string]) }))
    : [{ section: "Specification", rows: fallback }];

  // Offers
  const offers = forVersion(pg?.offers ?? [], version.id);

  return { version, price: version.from ?? fromPrice(m), hero, colours, wheels, interior, highlights, equipment, equipmentCategories, keyRows, groups, offers };
}
export type VehiclePage = ReturnType<typeof buildVehiclePage>;
