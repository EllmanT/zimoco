// Scans public/showroom and writes lib/showroom.generated.json so dropped-in images appear automatically.
import fs from "fs"; import path from "path";
const root = "public/showroom"; const out = {};
const imgs = (d) => fs.existsSync(d) ? fs.readdirSync(d).filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f)).sort() : [];
if (fs.existsSync(root)) for (const folder of fs.readdirSync(root)) {
  const base = path.join(root, folder); if (!fs.statSync(base).isDirectory()) continue;
  const entry = { variants: {}, exterior: [], interior: [], hero: null };
  for (const sub of fs.readdirSync(base)) {
    const p = path.join(base, sub);
    if (fs.statSync(p).isDirectory()) {
      if (sub === "gallery") {
        for (const f of imgs(p)) (/^interior/i.test(f) ? entry.interior : entry.exterior).push(`/showroom/${folder}/gallery/${f}`);
      } else {
        const colours = imgs(p).map((f) => ({ colour: f.replace(/\.[^.]+$/, ""), src: `/showroom/${folder}/${sub}/${f}` }));
        if (colours.length) entry.variants[sub] = colours;
      }
    } else if (/^hero\./i.test(sub)) entry.hero = `/showroom/${folder}/${sub}`;
  }
  out[folder] = entry;
}
fs.writeFileSync("lib/showroom.generated.json", JSON.stringify(out, null, 2));
console.log("showroom manifest:", Object.keys(out).map((k) => `${k} (${Object.keys(out[k].variants).length} variants)`).join(", ") || "empty");
