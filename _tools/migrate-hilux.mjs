// One-off: move the supplied Hilux studio PNGs into public/showroom/toyota-hilux/<variant>/<colour>.png
import fs from "fs"; import path from "path";
const src = "public/vehicle-assets"; const out = "public/showroom/toyota-hilux";
const map = [
  [/^hilux-country-(\w+)\.png$/, "country"],
  [/^hilux-raider-(black|bronze|grey|orange|pearl|red|silver|white)\.png$/, "raider"],
  [/^hilux-single-cab-(black|grey|orange|red|white)\.png$/, "single-cab"],
  [/^hiux-single-cab-(green)\.png$/, "single-cab"],
  [/^hilux-single-cab-raider-(\w+)\.png$/, "single-cab-raider"],
  [/^hilux-sinlge-cab-raider-(red)\.png$/, "single-cab-raider"],
  [/^hilux-standard-single-(\w+)\.png$/, "standard"],
  [/^hilux-standard-(oxide-bronze)\.png$/, "standard"],
];
const fix = { "oxide-bronze": "bronze" };
let n = 0;
for (const f of fs.readdirSync(src)) {
  for (const [re, variant] of map) {
    const m = f.match(re); if (!m) continue;
    const colour = fix[m[1]] ?? m[1];
    const dir = path.join(out, variant); fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(path.join(src, f), path.join(dir, `${colour}.png`)); n++; break;
  }
}
fs.mkdirSync(path.join(out, "gallery"), { recursive: true });
if (fs.existsSync(path.join(src, "standard interior.jpg"))) fs.copyFileSync(path.join(src, "standard interior.jpg"), path.join(out, "gallery", "interior-01.jpg"));
console.log("copied", n);
