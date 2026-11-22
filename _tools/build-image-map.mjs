// Read-only: maps files in the Mercedes folder to Zimoco vehicle docs + Prismic assets. Writes _tools/image-map.json and prints a report.
import fs from "node:fs"; import path from "node:path";
const dir = "C:/Users/Ropafadzo Muridzi/Downloads/mercedes";
const inv = JSON.parse(fs.readFileSync("_tools/asset-inventory.json", "utf8"));
const files = fs.readdirSync(dir).filter(f => /\.(avif|webp|jpg|png)$/i.test(f));
// folder prefix -> vehicle uid (null = needs new doc)
const MODEL = [
 ["a-class","mercedes-benz-a-class"],["a-200","mercedes-benz-a-class"],["c-class","mercedes-benz-c-class"],["cla","mercedes-benz-cla"],["e-class","mercedes-benz-e-class"],
 ["g-class","mercedes-benz-g-class"],["gla","mercedes-benz-gla"],["glc-coupe","NEW:mercedes-benz-glc-coupe"],["glc","mercedes-benz-glc"],
 ["gle-coupe","NEW:mercedes-benz-gle-coupe"],["gle","mercedes-benz-gle"],["gls-maybach","NEW:mercedes-benz-gls-maybach"],["gls","mercedes-benz-gls"],["v-class","mercedes-benz-v-class"],
 ["chrisysler","chrysler-pacifica"],["chrysler","chrysler-pacifica"],["dodge-durango","dodge-durango"],
 ["jeep-grand-cherokee","jeep-grand-cherokee"],["jeep-cherokee","NEW:jeep-cherokee"],["jeep-chreokee","NEW:jeep-cherokee"],["jeep-wrangler","jeep-wrangler"],["jeepwrangler","jeep-wrangler"],
 ["mitsubish-triton","mitsubishi-triton"],["mitsubishi","mitsubishi-triton"]];
const rows = []; const unmatched = [];
for (const f of files) {
  const n = f.toLowerCase().replace(/\.[a-z]+$/, "");
  const m = MODEL.find(([p]) => n.startsWith(p + "-") || n.startsWith(p));
  if (!m) { unmatched.push(f); continue; }
  let role = "colour"; let idx = null;
  if (/main/.test(n)) role = "main"; else if (/highligh/.test(n)) { role = "highlight"; idx = +n.match(/(\d)$/)?.[1]; }
  else if (/inter\w*r/.test(n)) { role = "interior"; idx = +n.match(/(\d+)$/)?.[1] || null; }
  
  let colour = null;
  if (role === "colour") colour = n.replace(m[0], "").replace(/side[- ]?fron\w*/g, "").replace(/^-+|-+$/g, "").replace(/-+/g, " ").replace(/^(coupe|maybach|class|cherokee|wrangler|durango|triton|side) ?/g,"").trim()
    || n.split("-").filter(w=>!["side","front","fron"].includes(w)).slice(-1)[0];
  const assets = inv.filter(a => a.filename === f);
  rows.push({ file: f, model: m[1], role, idx, colour, assetIds: assets.map(a => a.id), assetId: assets.sort((a,b)=>String(a.created).localeCompare(b.created))[0]?.id ?? null, dup: assets.length > 1, w: assets[0]?.width, h: assets[0]?.height });
}
fs.writeFileSync("_tools/image-map.json", JSON.stringify(rows, null, 1));
const by = {}; for (const r of rows) (by[r.model] ??= []).push(r);
for (const [k, v] of Object.entries(by)) {
  console.log(`\n${k}`);
  console.log("  main:", v.filter(r=>r.role==="main").map(r=>r.file).join(", ")||"-");
  console.log("  hl:", v.filter(r=>r.role==="highlight").map(r=>r.file).join(", ")||"-");
  console.log("  int:", v.filter(r=>r.role==="interior").map(r=>r.file).join(", ")||"-");
  console.log("  col:", v.filter(r=>r.role==="colour").map(r=>r.colour).join(" | ")||"-");
}
console.log("\nNOT IN PRISMIC:", rows.filter(r=>!r.assetId).map(r=>r.file));
console.log("DUPLICATES:", rows.filter(r=>r.dup).length, "files");
console.log("UNMATCHED:", unmatched);
