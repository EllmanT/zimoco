// Seeds the Zimoco homepage content into a Prismic migration release (nothing goes live until it is published).
//   node --env-file=.env.local _tools/seed-homepage.mjs --dry      # show what would be written
//   node --env-file=.env.local _tools/seed-homepage.mjs            # write to the migration release
//   node --env-file=.env.local _tools/seed-homepage.mjs --publish  # write, then publish the release
// All copy is placeholder text. Images are left empty on purpose: upload real ones in Prismic.
import * as prismic from "@prismicio/client";
import fs from "node:fs";

const repo = JSON.parse(fs.readFileSync("prismic.config.json", "utf8")).repositoryName;
if (repo !== "xcgt84rk") throw new Error("Wrong repository: " + repo);
const dry = process.argv.includes("--dry");
const publish = process.argv.includes("--publish");
const SITE = "https://zimoco-demo.vercel.app"; // stripped to a relative path by lib/href.ts
const web = (path, text) => ({ link_type: "Web", url: SITE + path, text });
const q = (s) => encodeURIComponent(s);

const client = prismic.createClient(repo);
const existing = await client.dangerouslyGetAll();
const byUid = (type, uid) => existing.find((d) => d.type === type && d.uid === uid);

const migration = prismic.createMigration();

// --- Categories (reuse existing ones, create the new body types) ---
const catNames = { sedan: "Sedan", suv: "SUV", hatchback: "Hatchback", coupe: "Coupe", cabriolet: "Cabriolet", "people-carrier": "People carrier", pickup: "Pickup", commercial: "Commercial" };
const catRef = {};
for (const [uid, name] of Object.entries(catNames)) {
  const have = byUid("category", uid);
  if (have) catRef[uid] = () => ({ link_type: "Document", id: have.id });
  else {
    const d = migration.createDocument({ type: "category", uid, lang: "en-us", data: { name } }, name);
    catRef[uid] = () => d;
  }
}

// --- Brands ---
const brands = [
  { uid: "mercedes-benz", name: "Mercedes-Benz", cats: ["sedan", "suv", "hatchback", "coupe", "cabriolet", "people-carrier"], picks: [
    ["Mercedes-Benz", "The new GLC", "Dynamic luxury for every journey"], ["Mercedes-Benz", "C-Class", "Modern luxury, refined"], ["Mercedes-Benz", "A-Class", "Compact and connected"], ["Mercedes-Benz", "G-Class", "The icon, reinvented"], ["Mercedes-Benz", "V-Class", "Space for the whole team"]] },
  { uid: "jeep", name: "Jeep", cats: ["suv", "pickup"], picks: [["Jeep", "Wrangler", "Freedom to go anywhere"], ["Jeep", "Grand Cherokee", "Premium capability"], ["Jeep", "Gladiator", "The open-air pickup"], ["Jeep", "Compass", "Everyday adventure"]] },
  { uid: "mitsubishi", name: "Mitsubishi", cats: ["suv", "pickup"], picks: [["Mitsubishi", "Triton", "Built for work and weekends"], ["Mitsubishi", "Outlander Sport", "Smart, compact SUV"], ["Mitsubishi", "Pajero Sport", "Rugged family SUV"]] },
  { uid: "gwm", name: "GWM", cats: ["suv", "pickup", "hatchback"], picks: [["GWM", "Tank 500 HEV", "Hybrid flagship off-roader"], ["GWM", "Tank 300", "Go-anywhere character"], ["GWM", "P Series", "The tough, refined pickup"], ["GWM", "ORA", "Electric city hatchback"]] },
  { uid: "haval", name: "Haval", cats: ["suv"], picks: [["Haval", "Jolion", "Smart family SUV"], ["Haval", "Jolion Pro HEV", "Efficient hybrid power"], ["Haval", "H6", "Space and sophistication"]] },
  { uid: "fiat", name: "Fiat", cats: ["hatchback", "suv", "commercial"], picks: [["Fiat", "500", "Italian city icon"], ["Fiat", "Tipo", "Practical and stylish"], ["Fiat", "Doblo", "Room for business"]] },
  { uid: "alfa-romeo", name: "Alfa Romeo", cats: ["sedan", "suv", "coupe"], picks: [["Alfa Romeo", "Giulia", "Pure driving emotion"], ["Alfa Romeo", "Stelvio", "Sport SUV, Italian soul"], ["Alfa Romeo", "Tonale", "Compact and electrified"]] },
  { uid: "chrysler", name: "Chrysler", cats: ["sedan", "people-carrier"], picks: [["Chrysler", "300", "American executive style"], ["Chrysler", "Pacifica", "Family flexibility"]] },
  { uid: "dodge", name: "Dodge", cats: ["coupe", "suv", "pickup"], picks: [["Dodge", "Challenger", "American muscle"], ["Dodge", "Durango", "Powerful three-row SUV"], ["Dodge", "RAM", "Full-size capability"]] },
  { uid: "fuso", name: "FUSO", cats: ["commercial"], picks: [["FUSO", "Canter", "The light-duty workhorse"], ["FUSO", "Fighter", "Medium-duty strength"], ["FUSO", "Rosa", "Dependable people mover"]] },
  { uid: "freightliner", name: "Freightliner", cats: ["commercial"], picks: [["Freightliner", "Cascadia", "Long-haul efficiency"], ["Freightliner", "M2", "Versatile vocational truck"]] },
];
const brandDocs = {};
brands.forEach((b, i) => {
  const data = {
    name: b.name,
    order: i + 1,
    top_picks: b.picks.map(([brand, title, subtitle]) => ({ title: `${brand} ${title}`.replace(/^(\S+) \1/, "$1"), subtitle, cta: web(`/showroom?brand=${q(b.name)}`, "Discover") })),
    category_images: b.cats.map((c) => ({ category: catRef[c]() })),
  };
  const have = byUid("brand", b.uid);
  if (have) migration.updateDocument({ ...have, data: { ...have.data, ...data } }, b.name);
  else brandDocs[b.uid] = migration.createDocument({ type: "brand", uid: b.uid, lang: "en-us", data }, b.name);
});
const brandRel = (uid) => (byUid("brand", uid) ? { link_type: "Document", id: byUid("brand", uid).id } : brandDocs[uid]);

// --- Three placeholder vehicles for the highlights row ---
const vehicles = [
  { uid: "mercedes-benz-a-class", name: "A-Class", tag: "Compact and connected", cat: "hatchback", label: "Hatchback", price: 45000 },
  { uid: "mercedes-benz-c-class", name: "C-Class", tag: "Modern luxury, refined", cat: "sedan", label: "Sedan", price: 62000 },
  { uid: "mercedes-benz-glc", name: "GLC", tag: "Dynamic luxury for every journey", cat: "suv", label: "SUV", price: 78000 },
];
const vehicleDocs = vehicles.map((v) => migration.createDocument({
  type: "vehicle", uid: v.uid, lang: "en-us",
  data: { model_name: v.name, tagline: v.tag, summary: "Placeholder vehicle for the demo. Replace with real details in Prismic.", brand: brandRel("mercedes-benz"), category: catRef[v.cat](), stock_status: "Available", base_price: v.price, featured: true, variants: [{ variant_id: "base", name: "Base", from_price: v.price }] },
}, `Mercedes-Benz ${v.name}`));

// --- Homepage ---
const para = (text) => [{ type: "paragraph", text, spans: [] }];
const slice = (slice_type, primary, variation = "default") => ({ slice_type, slice_label: null, variation, version: "initial", primary, items: [] });
const homepage = {
  meta_title: "Zimoco | Mercedes-Benz, Jeep, Mitsubishi, GWM, Haval and more in Zimbabwe",
  meta_description: "Zimoco is the official distributor of Mercedes-Benz, Jeep, Fiat, Alfa Romeo, GWM, Haval and Mitsubishi in Zimbabwe.",
  slices: [
    slice("hero_video", { slides: [
      { video_id: "", kicker: "Official distributor in Zimbabwe", headline: "Drive the brand you have been dreaming of", body: "Mercedes-Benz, Jeep, Mitsubishi, GWM, Haval and more, under one roof in Harare.", primary_cta: web("/showroom", "Explore vehicles"), secondary_cta: web("/contact", "Book a test drive") },
      { video_id: "", kicker: "Mercedes-Benz", headline: "Luxury, engineered for every road", body: "Discover the full Mercedes-Benz range at our Borrowdale showroom.", primary_cta: web("/showroom?brand=Mercedes-Benz", "View Mercedes-Benz"), secondary_cta: web("/contact", "Request a quote") },
    ] }),
    slice("brand_picks", { heading: "Top picks", pills_label: "Choose a brand" }),
    slice("model_categories", { heading: "Our models", cta: web("/showroom", "Discover all models") }),
    slice("vehicle_highlights", { heading: "Highlights", cta: web("/showroom", "View all vehicles"), vehicles: vehicles.map((v, i) => ({ label: v.label, vehicle: vehicleDocs[i] })) }),
    slice("browse_strip", { text: "Browse available vehicles", cta: web("/showroom", "Browse now") }),
    slice("split_feature", { eyebrow: "Why Zimoco", heading: "The only official distributor, with the service to match", body: para("Zimoco is the authorised distributor for Mercedes-Benz, Jeep, Fiat, Alfa Romeo, GWM, Haval and Mitsubishi in Zimbabwe, backed by genuine parts and a trained workshop team."), cta: web("/about", "About Zimoco"), image: {} }),
    slice("split_feature", { eyebrow: "Service and parts", heading: "Looked after by people who know your vehicle", body: para("Book a service at our Workington workshop or the Pomona Service Centre. Genuine parts, factory-trained technicians and a body repair centre in one place."), cta: web("/contact", "Book a service"), image: {} }, "imageLeft"),
    slice("service_tiles", { heading: "Everything in one place", tiles: [
      { title: "Online store", blurb: "Genuine parts and accessories, delivered.", icon: "store", link: web("/showroom", "Visit the store") },
      { title: "Test drive", blurb: "Book a drive at a showroom near you.", icon: "steering-wheel", link: web("/contact", "Book a test drive") },
      { title: "Finance", blurb: "Estimate your monthly payment.", icon: "banknote", link: web("/showroom", "Estimate finance") },
      { title: "Insurance", blurb: "Cover arranged with our partners.", icon: "shield", link: web("/contact", "Get cover") },
      { title: "Configurator", blurb: "Choose your trim and colour.", icon: "sliders", link: web("/showroom", "Configure yours") },
    ] }),
  ],
};
const home = byUid("homepage", null) ?? existing.find((d) => d.type === "homepage");
if (home) migration.updateDocument({ ...home, data: { ...home.data, ...homepage } }, "Homepage");
else migration.createDocument({ type: "homepage", uid: undefined, lang: "en-us", data: homepage }, "Homepage");

console.log(`Brands ${brands.length}, new vehicles ${vehicles.length}, homepage ${home ? "update" : "create"}`);
if (dry) process.exit(0);
const writeClient = prismic.createWriteClient(repo, { writeToken: process.env.PRISMIC_WRITE_TOKEN });
await writeClient.migrate(migration, { reporter: (e) => e.type === "end" && console.log(e) });
if (publish) console.log(await writeClient.publishMigrationRelease());
