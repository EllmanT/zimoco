// Uploads the demo images in _tools/images/** to Prismic and attaches them to brands, highlight vehicles and the homepage.
//   node --env-file=.env.local _tools/upload-images.mjs --dry
//   node --env-file=.env.local _tools/upload-images.mjs --publish
// Slugs: <brand>--pick-<n> (top pick n, 1-based), <brand>--cat-<category uid>, site--split-<n>.
// Vehicle cards reuse the Mercedes-Benz picks. Credits are stored on each asset (Prismic "credits") and in public/image-credits.json.
import * as prismic from "@prismicio/client";
import fs from "node:fs";
import path from "node:path";

const repo = JSON.parse(fs.readFileSync("prismic.config.json", "utf8")).repositoryName;
if (repo !== "xcgt84rk") throw new Error("Wrong repository: " + repo);
const dry = process.argv.includes("--dry");
const publish = process.argv.includes("--publish");
const root = "_tools/images";

// Load manifests
const entries = {}; // slug -> {file (abs), meta}
for (const dir of fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const mf = path.join(root, dir.name, "manifest.json");
  if (!fs.existsSync(mf)) continue;
  for (const m of JSON.parse(fs.readFileSync(mf, "utf8"))) {
    const f = m.file && path.join(root, dir.name, path.basename(m.file));
    if (f && fs.existsSync(f)) entries[m.slug] = { file: f, meta: m };
  }
}
console.log(`${Object.keys(entries).length} images found`);

const client = prismic.createClient(repo);
const docs = await client.dangerouslyGetAll();
const migration = prismic.createMigration();
const assets = new Map();
const used = [];

function asset(slug, alt) {
  const e = entries[slug];
  if (!e) return undefined;
  if (!assets.has(slug)) {
    const credits = `${e.meta.author ?? "Unknown"}, ${e.meta.license ?? ""}, via Wikimedia Commons`.slice(0, 200);
    assets.set(slug, migration.createAsset(fs.readFileSync(e.file), path.basename(e.file), { alt, credits, notes: e.meta.source_url ?? "" }));
    used.push({ slug, title: e.meta.title, source_url: e.meta.source_url, author: e.meta.author, license: e.meta.license, license_url: e.meta.license_url });
  }
  return assets.get(slug);
}

// Brands: top picks by index, categories by uid
for (const b of docs.filter((d) => d.type === "brand" && d.data.order != null)) {
  const data = { ...b.data };
  data.top_picks = b.data.top_picks.map((p, i) => ({ ...p, image: asset(`${b.uid}--pick-${i + 1}`, p.title ?? "") ?? p.image }));
  data.category_images = b.data.category_images.map((c) => ({ ...c, image: asset(`${b.uid}--cat-${c.category.uid}`, `${b.data.name} ${c.category.uid}`) ?? c.image }));
  migration.updateDocument({ ...b, data }, b.data.name);
}

// Highlight vehicles (reuse the Mercedes-Benz picks)
const veh = { "mercedes-benz-glc": ["mercedes-benz--pick-1", "Mercedes-Benz GLC"], "mercedes-benz-c-class": ["mercedes-benz--pick-2", "Mercedes-Benz C-Class"], "mercedes-benz-a-class": ["mercedes-benz--pick-3", "Mercedes-Benz A-Class"] };
for (const v of docs.filter((d) => d.type === "vehicle" && veh[d.uid])) {
  const [slug, alt] = veh[v.uid];
  const img = asset(slug, alt);
  if (img) migration.updateDocument({ ...v, data: { ...v.data, card_image: img, hero_image: img } }, alt);
}

// Homepage split features
const home = docs.find((d) => d.type === "homepage");
let n = 0;
const slices = home.data.slices.map((s) => {
  if (s.slice_type !== "split_feature") return s;
  n += 1;
  const img = asset(`site--split-${n}`, s.primary.heading ?? "");
  return img ? { ...s, primary: { ...s.primary, image: img } } : s;
});
migration.updateDocument({ ...home, data: { ...home.data, slices } }, "Homepage");

console.log(`Attaching ${used.length} images`);
if (dry) process.exit(0);
const writeClient = prismic.createWriteClient(repo, { writeToken: process.env.PRISMIC_WRITE_TOKEN });
await writeClient.migrate(migration, { reporter: (e) => e.type === "end" && console.log(e) });
fs.writeFileSync("public/image-credits.json", JSON.stringify(used, null, 2));
if (publish) console.log(await writeClient.publishMigrationRelease());
