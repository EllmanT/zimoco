// Read-only: lists all Zimoco Prismic assets (id, filename, size) into _tools/asset-inventory.json
import fs from "node:fs";
const repo = JSON.parse(fs.readFileSync("prismic.config.json", "utf8")).repositoryName;
if (repo !== "xcgt84rk") throw new Error("Wrong repository");
const out = []; let cursor;
do {
  const u = new URL("https://asset-api.prismic.io/assets"); u.searchParams.set("limit", "500"); if (cursor) u.searchParams.set("cursor", cursor);
  const r = await fetch(u, { headers: { Authorization: `Bearer ${process.env.PRISMIC_WRITE_TOKEN}`, repository: repo } });
  if (!r.ok) throw new Error(r.status + " " + await r.text());
  const j = await r.json(); out.push(...j.items.map(a => ({ id: a.id, filename: a.filename, width: a.width, height: a.height, url: a.url, created: a.created_at }))); cursor = j.cursor;
} while (cursor);
fs.writeFileSync("_tools/asset-inventory.json", JSON.stringify(out, null, 1));
console.log(out.length, "assets");
