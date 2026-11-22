// Sets the homepage hero video IDs (Bunny Stream library 483818) and publishes. Demo only: these are the Starbell clips.
//   node --env-file=.env.local _tools/set-hero-videos.mjs
import * as prismic from "@prismicio/client";
import fs from "node:fs";
const repo = JSON.parse(fs.readFileSync("prismic.config.json", "utf8")).repositoryName;
if (repo !== "xcgt84rk") throw new Error("Wrong repository");
const ids = ["4adf564d-c2e0-4db6-be54-72e95df12434", "1516422c-1e10-48e1-bdeb-aa7dfff91f14", "dedb2519-6b1a-487a-987f-a8ce95683ef8"];
const client = prismic.createClient(repo);
const home = (await client.dangerouslyGetAll()).find((d) => d.type === "homepage");
const slices = home.data.slices.map((s) => {
  if (s.slice_type !== "hero_video") return s;
  const slides = s.primary.slides.map((x, i) => ({ ...x, video_id: ids[i] ?? "" }));
  slides.push({ ...slides[0], video_id: ids[2], headline: "Built for Zimbabwe's roads", body: "Rugged pickups and SUVs from Mitsubishi, GWM and Jeep, ready to drive.", primary_cta: slides[0].primary_cta, secondary_cta: slides[0].secondary_cta });
  return { ...s, primary: { ...s.primary, slides } };
});
const migration = prismic.createMigration();
migration.updateDocument({ ...home, data: { ...home.data, slices } }, "Homepage");
const w = prismic.createWriteClient(repo, { writeToken: process.env.PRISMIC_WRITE_TOKEN });
await w.migrate(migration, { reporter: (e) => e.type === "end" && console.log(e) });
console.log(await w.publishMigrationRelease());
