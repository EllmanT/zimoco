// Replaces the homepage hero with the three promo videos (GLS, C-Class, Haval/GWM) and publishes.
//   node --env-file=.env.local _tools/set-hero-promos.mjs
import * as prismic from "@prismicio/client";
import fs from "node:fs";
const repo = JSON.parse(fs.readFileSync("prismic.config.json", "utf8")).repositoryName;
if (repo !== "xcgt84rk") throw new Error("Wrong repository");
const BASE = "https://zimoco-demo.vercel.app";
const link = (path, text) => ({ link_type: "Web", url: BASE + path, text });
const slide = (video_id, kicker, headline, body, path, cta) => ({
  video_id, kicker, headline, body,
  primary_cta: link(path, cta),
  secondary_cta: link("/contact", "Request a quote"),
});
const slides = [
  slide("0b5a56d1-deb7-4e38-92df-8b2ad34ca480", "Mercedes-Benz", "The GLS. First class, with room for seven.", "The S-Class of SUVs, at our Borrowdale showroom.", "/showroom/mercedes-benz-gls", "Explore the GLS"),
  slide("a16e143e-b806-4fe7-931c-73d46f41ad39", "Mercedes-Benz", "The C-Class. Everyday luxury, sharpened.", "Refined, efficient and unmistakably Mercedes-Benz.", "/showroom/mercedes-benz-c-class", "Explore the C-Class"),
  slide("bd49bada-9416-4cfe-a8aa-b5f80b3c5396", "Haval · GWM", "Tough, capable and ready for Zimbabwe's roads.", "Haval and GWM SUVs and pickups, ready to drive.", "/showroom?brand=Haval", "View Haval"),
];
const client = prismic.createClient(repo);
const home = (await client.dangerouslyGetAll()).find((d) => d.type === "homepage");
const out = home.data.slices.map((s) => (s.slice_type === "hero_video" ? { ...s, primary: { ...s.primary, slides } } : s));
const migration = prismic.createMigration();
migration.updateDocument({ ...home, data: { ...home.data, slices: out } }, "Homepage");
const w = prismic.createWriteClient(repo, { writeToken: process.env.PRISMIC_WRITE_TOKEN });
await w.migrate(migration, { reporter: (e) => e.type === "end" && console.log(e) });
console.log(await w.publishMigrationRelease());
