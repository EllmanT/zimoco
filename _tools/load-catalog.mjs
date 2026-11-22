// Loads data/catalog/*.json (researched Zimoco models) into the Zimoco Prismic repo via a migration release.
//   node --env-file=.env.local _tools/load-catalog.mjs --dry      # validate and print what would be written
//   node --env-file=.env.local _tools/load-catalog.mjs            # write to the migration release
//   node --env-file=.env.local _tools/load-catalog.mjs --publish  # write, then publish the release
// Existing vehicles with the same uid or same brand + model name are overwritten (their images are kept).
import * as prismic from "@prismicio/client";
import fs from "node:fs";
import path from "node:path";

const repo = JSON.parse(fs.readFileSync("prismic.config.json", "utf8")).repositoryName;
if (repo !== "xcgt84rk") throw new Error("Wrong repository: " + repo);
const dry = process.argv.includes("--dry");
const publish = process.argv.includes("--publish");

const FUELS = ["Petrol", "Diesel", "Petrol Hybrid", "Diesel Hybrid", "Electric"];
const OFFER_TYPES = ["Leasing", "Finance", "Cash offer", "Trade-in", "Other"];
const TABS = ["Upholstery", "Trims"];
const warnings = [];
const warn = (m) => warnings.push(m);

const client = prismic.createClient(repo);
const existing = await client.dangerouslyGetAll();
const migration = prismic.createMigration();

const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const txt = (v) => (v === null || v === undefined || v === "" ? undefined : String(v));
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const para = (text) => [{ type: "paragraph", text: String(text ?? ""), spans: [] }];
const ids = (v) => (Array.isArray(v) ? v.join(",") : (v ?? "")) || undefined;

function longText(lines) {
  const arr = Array.isArray(lines) ? lines : String(lines ?? "").split("\n").filter(Boolean);
  return arr.map((l) => {
    if (l.startsWith("### ")) return { type: "heading3", text: l.slice(4), spans: [] };
    if (l.startsWith("- ")) return { type: "list-item", text: l.slice(2), spans: [] };
    return { type: "paragraph", text: l, spans: [] };
  });
}

// ---- categories ----
const catDocs = {};
const wantedCats = ["SUV", "Pickup", "Luxury SUV", "Hatchback", "Commercial", "People carrier", "Cabriolet", "Coupe", "Sedan", "Truck", "Bus"];
for (const name of wantedCats) {
  const have = existing.find((d) => d.type === "category" && d.data.name === name);
  if (have) catDocs[name] = { link_type: "Document", id: have.id };
  else catDocs[name] = migration.createDocument({ type: "category", uid: norm(name).replace(/(.)(?=.)/g, "$1"), lang: "en-us", data: { name } }, name);
}
// category uids: use hyphenated slugs
// (re-create with proper uid is not needed: uid above only used for new Truck and Bus, which are single words)

// ---- load files ----
const dir = "data/catalog";
const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
const brandOrderNext = { n: 12 };
const brandDocs = {};
const brandRef = (name) => {
  if (brandDocs[name]) return brandDocs[name];
  const have = existing.find((d) => d.type === "brand" && d.data.name === name);
  if (have) return (brandDocs[name] = { link_type: "Document", id: have.id });
  const uid = name.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (brandDocs[name] = migration.createDocument({ type: "brand", uid, lang: "en-us", data: { name, order: brandOrderNext.n++ } }, name));
};

const all = []; // {brand, m, doc, have}
const usedUids = new Set();
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const m of d.models) if (!only.length || only.includes(m.uid)) all.push({ brand: d.brand, m });
}

// rival resolution index
const index = new Map();
const addIdx = (key, ref) => key && !index.has(key) && index.set(key, ref);

const built = [];
for (const { brand, m } of all) {
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(m.uid)) warn(`bad uid ${m.uid}`);
  if (usedUids.has(m.uid)) warn(`duplicate uid ${m.uid}`);
  usedUids.add(m.uid);
  if (!catDocs[m.category]) { warn(`${m.uid}: unknown category ${m.category}`); }
  const have = existing.find((d) => d.type === "vehicle" && (d.uid === m.uid || (norm(d.data.model_name) === norm(m.model_name) && existing.find((b) => b.id === d.data.brand?.id)?.data.name === brand)));
  const variants = (m.variants ?? []).map((v) => {
    if (!FUELS.includes(v.fuel)) warn(`${m.uid}/${v.variant_id}: fuel "${v.fuel}"`);
    return clean({ variant_id: txt(v.variant_id), name: txt(v.name), from_price: num(v.from_price_usd), blurb: txt(v.blurb), engine: txt(v.engine),
      fuel: FUELS.includes(v.fuel) ? v.fuel : undefined, power_kw: num(v.power_kw), torque_nm: num(v.torque_nm), transmission: txt(v.transmission),
      drive: txt(v.drive), economy: num(v.economy_l100), seats: num(v.seats), payload_kg: num(v.payload_kg), towing_kg: num(v.towing_kg),
      length_mm: num(v.length_mm), safety: txt(v.safety) });
  });
  const data = clean({
    model_name: m.model_name, tagline: txt(m.tagline), summary: txt(m.summary),
    short_description: para(m.short_description), long_description: longText(m.long_description),
    brand: brandRef(brand), category: catDocs[m.category], stock_status: "Available",
    base_price: num(m.base_price_usd), featured: have ? have.data.featured : false,
    variants,
    colour_options: (m.colours ?? []).map((c) => clean({ variant_id: ids(c.variant_ids), colour_name: txt(c.colour_name), hex: txt(c.hex) })),
    highlights: (m.highlights ?? []).map((h) => clean({ variant_id: ids(h.variant_ids), title: txt(h.title), text: txt(h.text) })),
    equipment: (m.equipment ?? []).map((e) => clean({ variant_id: ids(e.variant_ids), category: txt(e.category), title: txt(e.title), text: txt(e.text) })),
    spec_rows: (m.spec_rows ?? []).map((s) => clean({ variant_id: ids(s.variant_ids), section: txt(s.section), label: txt(s.label), value: txt(s.value), key_figure: !!s.key_figure })),
    interior_views: (m.interior_options ?? []).filter((i) => TABS.includes(i.tab)).map((i) => clean({ variant_id: ids(i.variant_ids), tab: i.tab, option_name: txt(i.option_name), swatch_hex: txt(i.swatch_hex) })),
    wheel_options: (m.wheel_options ?? []).map((w) => clean({ variant_id: ids(w.variant_ids), name: txt(w.name) })),
    offers: (m.offers ?? []).map((o) => {
      if (!OFFER_TYPES.includes(o.type)) warn(`${m.uid}: offer type "${o.type}"`);
      return clean({ variant_id: ids(o.variant_ids), type: OFFER_TYPES.includes(o.type) ? o.type : "Other", title: txt(o.title), text: txt(o.text), cta_label: txt(o.cta_label) });
    }),
    faq: (m.faq ?? []).map((q) => ({ question: q.question, answer: para(q.answer) })),
    meta_title: txt(m.meta_title), meta_description: txt(m.meta_description),
  });
  built.push({ brand, m, data, have });
}

// create/update docs
for (const b of built) {
  const title = `${b.brand} ${b.m.model_name}`;
  if (b.have) {
    // keep existing images, drop groups tied to old variant ids
    const keep = { ...b.have.data };
    for (const k of ["exterior_views", "colour_options", "variants", "interior_views", "wheel_options", "highlights", "equipment", "spec_rows", "offers", "faq", "rivals"]) delete keep[k];
    b.ref = migration.updateDocument({ ...b.have, data: { ...keep, ...b.data } }, title);
    b.refLink = { link_type: "Document", id: b.have.id };
  } else {
    b.ref = migration.createDocument({ type: "vehicle", uid: b.m.uid, lang: "en-us", data: b.data }, title);
    b.refLink = b.ref;
  }
  addIdx(norm(title), b.refLink); addIdx(norm(b.m.model_name), null);
}
// rivals: link to catalogue models only when we have them
const byTitle = new Map(built.map((b) => [norm(`${b.brand} ${b.m.model_name}`), b]));
let rivalLinks = 0;
for (const b of built) {
  const links = [];
  for (const r of b.m.rivals ?? []) {
    const t = byTitle.get(norm(r));
    if (t && t !== b) links.push({ vehicle: t.refLink });
  }
  rivalLinks += links.length;
  if (links.length) b.ref.document.data.rivals = links;
}

console.log(`Models: ${built.length} (${built.filter((b) => b.have).length} overwrite, ${built.filter((b) => !b.have).length} new). Rival links: ${rivalLinks}.`);
console.log(`New brands: ${Object.entries(brandDocs).filter(([, v]) => v.type === "brand" || v.data).map(([k]) => k).join(", ") || "none"}`);
console.log(`Overwriting: ${built.filter((b) => b.have).map((b) => b.m.uid).join(", ")}`);
if (warnings.length) console.log("WARNINGS:\n - " + warnings.join("\n - "));
if (dry) process.exit(0);
const writeClient = prismic.createWriteClient(repo, { writeToken: process.env.PRISMIC_WRITE_TOKEN });
await writeClient.migrate(migration, { reporter: (e) => e.type === "end" && console.log(e) });
if (publish) console.log(await writeClient.publishMigrationRelease());
