// One-off: copy every document (and its assets) from the public Starbell repo into the Zimoco repo.
// Read-only against Starbell (public Content API, no token). Writes only to the repo in prismic.config.json,
// into a migration release, so nothing goes live until it is reviewed and published in Prismic.
//
//   node --env-file=.env.local _tools/clone-from-starbell.mjs --dry   # list what would be copied
//   node --env-file=.env.local _tools/clone-from-starbell.mjs         # copy into the migration release
import * as prismic from "@prismicio/client";
import fs from "node:fs";

const SOURCE = "starbell-auto";
const target = JSON.parse(fs.readFileSync("prismic.config.json", "utf8")).repositoryName;
if (target === SOURCE) throw new Error("Target repo is the source repo. Refusing.");
const dry = process.argv.includes("--dry");

const source = prismic.createClient(SOURCE);
const docs = await source.dangerouslyGetAll();

// Referenced documents first: brand, category, then everything else (vehicles link to them).
const rank = (d) => ({ brand: 0, category: 1 })[d.type] ?? 2;
docs.sort((a, b) => rank(a) - rank(b));

const counts = {};
for (const d of docs) counts[d.type] = (counts[d.type] ?? 0) + 1;
console.log(`Source ${SOURCE}: ${docs.length} documents`, counts, `-> target ${target}`);
if (dry) process.exit(0);

if (!process.env.PRISMIC_WRITE_TOKEN) throw new Error("PRISMIC_WRITE_TOKEN is missing from .env.local");

const writeClient = prismic.createWriteClient(target, { writeToken: process.env.PRISMIC_WRITE_TOKEN });
const migration = prismic.createMigration();

for (const d of docs) {
  const title = d.data?.name ?? d.data?.model_name ?? d.data?.title ?? d.uid ?? d.type;
  migration.createDocumentFromPrismic(d, String(title));
}

// Retry on flaky connections. Migrate skips assets and documents already created.
for (let attempt = 1; ; attempt++) {
  try {
    await writeClient.migrate(migration, {
      reporter: (e) => console.log(e.type, e.data?.current ? `${e.data.current}/${e.data.remaining + e.data.current}` : ""),
    });
    break;
  } catch (err) {
    console.error(`Attempt ${attempt} failed:`, err?.cause?.code ?? err?.message);
    if (attempt >= 5) throw err;
    await new Promise((r) => setTimeout(r, 5000 * attempt));
  }
}
console.log("Done. Review the migration release in Prismic, then publish it.");
