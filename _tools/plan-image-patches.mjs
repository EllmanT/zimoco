// DRY RUN ONLY. Builds per-document image patches from _tools/image-map.json and prints/writes the diff. Writes nothing to Prismic.
//   node _tools/plan-image-patches.mjs   -> _tools/image-patches.json + _tools/dry-run-diff.md
import * as p from "@prismicio/client"; import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync("_tools/image-map.json"));
const sampled = Object.fromEntries(Object.values(JSON.parse(fs.readFileSync("_tools/colour-proposal.json"))).flatMap(o => o.props.map(x => [x.file, x.sampled])));
const docs = await p.createClient("xcgt84rk").dangerouslyGetAll();
const WORD = { black: /black|obsidian|diamond/i, white: /white|opalite|polar/i, silver: /silver|high-tech|mojave|zynith/i, grey: /gr[ae]y|selenite|granite|baltic|sting/i, blue: /blue|nautical|cavansite|spectral|ocean|hydro/i, red: /red|patagonia|velvet|firecracker/i, green: /green|olive|emerald/i };
const QUAL = /alpine|night|mettalic|metallic|opalite|amg|light/;
const FIX = { mettalic: "Metallic", whit: "White", polarwhite: "Polar White", amg: "AMG" };
const tc = (s) => s.split(/\s+/).map(w => FIX[w] ?? w[0].toUpperCase() + w.slice(1)).join(" ");
const wordOf = (c) => Object.keys(WORD).find(k => new RegExp(k).test(c.replace(/polarwhite/, "white"))) ?? (/orange/.test(c) ? "orange" : "?");
const dist = (a,b) => { const x=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16)), y=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16)); return Math.hypot(...x.map((v,i)=>v-y[i])); };
const FILE_PRIMARY = (f) => /-white-side-front|^cla-white/.test(f) ? 0 : 1; // canonical <model>-white-side-front wins; the odd-named twin becomes "White (alt)"
const out = {}; let md = "# Dry-run diff: image patches (nothing written)\n";
for (const uid of [...new Set(rows.map(r => r.model))]) {
  const rs = rows.filter(r => r.model === uid); const v = docs.find(d => d.uid === uid.replace("NEW:", ""));
  const isNew = uid.startsWith("NEW:"); const d = v?.data;
  const A = (r) => ({ id: r.assetId, file: r.file });
  const patch = { uid: uid.replace("NEW:", ""), isNew, hero_image: null, card_image: null, exterior_shots: [], interior_shots: [], highlights: [], colours: [] };
  const main = rs.find(r => r.role === "main"); if (main) { patch.hero_image = A(main); patch.card_image = A(main); patch.exterior_shots = [{ image: A(main), caption: "" }]; }
  for (const r of rs.filter(r => r.role === "highlight").sort((a,b)=>a.idx-b.idx)) patch.highlights.push({ index: r.idx - 1, ...A(r), title: d?.highlights?.[r.idx - 1]?.title ?? "(new doc)" });
  for (const r of rs.filter(r => r.role === "interior").sort((a,b)=>(a.file.includes("side-front-interior")?99:(a.idx??9))-(b.file.includes("side-front-interior")?99:(b.idx??9)))) patch.interior_shots.push({ image: A(r), caption: "" });
  const used = new Set(); const files = rs.filter(r => r.role === "colour").sort((a,b)=>FILE_PRIMARY(a.file)-FILE_PRIMARY(b.file));
  const docCols = d?.colour_options ?? [];
  for (const f of files) {
    const c = f.colour === "whit" ? "white" : f.colour; const w = wordOf(c);
    const generic = !QUAL.test(c) && !used.has(`dup:${w}`);
    const cands = generic ? docCols.map((x,i)=>({x,i})).filter(({x,i}) => WORD[w]?.test(x.colour_name) && !used.has(i)).sort((a,b)=>dist(sampled[f.file], a.x.hex||"#808080")-dist(sampled[f.file], b.x.hex||"#808080")) : [];
    const hit = cands[0];
    if (hit) { used.add(hit.i); patch.colours.push({ action: "attach", name: hit.x.colour_name, hex: hit.x.hex, variant_id: hit.x.variant_id, ...A(f) }); }
    else { const dup = patch.colours.some(x => x.action === "attach" && wordOf(x.name.toLowerCase()) === w) && /^(white)$/.test(c) && !QUAL.test(c) && docCols.length;
      const name = dup ? "White (alt)" : tc(c.replace(/^(amg) /, "AMG ").replace(/(grey|black|blue) (mettalic)/, "$2 $1"));
      patch.colours.push({ action: "add", name, hex: sampled[f.file], variant_id: (d?.variants ?? []).map(x => x.variant_id).join(","), ...A(f) }); }
  }
  out[patch.uid] = patch;
  md += `\n## ${patch.uid}${isNew ? "  (NEW DOC - created in phase 2)" : ""}\n`;
  if (d) md += `Current: hero=${!!d.hero_image?.url} card=${!!d.card_image?.url} exterior_shots=${d.exterior_shots.length} interior_shots=${d.interior_shots.length} (existing exterior/interior shots ${d.exterior_shots.length||d.interior_shots.length ? "REPLACED" : "none"})\n`;
  md += `- hero_image + card_image + exterior_shots[0]: ${main?.file ?? "none"}\n`;
  md += `- highlights: ${patch.highlights.map(h => `#${h.index+1} "${h.title}" <- ${h.file}`).join("; ") || "none"}\n`;
  if (d && patch.highlights.some(h => h.index >= d.highlights.length)) md += `  !! more highlight images than highlight rows\n`;
  md += `- interior_shots: ${patch.interior_shots.map(i => i.image.file).join(", ") || "none"}\n`;
  md += `- colours: ${patch.colours.map(c => `${c.action === "add" ? "+NEW " : ""}${c.name} <- ${c.file}`).join("; ") || "none"}\n`;
}
fs.writeFileSync("_tools/image-patches.json", JSON.stringify(out, null, 1)); fs.writeFileSync("_tools/dry-run-diff.md", md); console.log(md);
