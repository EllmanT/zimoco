// Read-only dry run: proposes folder-file -> doc colour matches. Writes _tools/colour-proposal.json
import * as p from "@prismicio/client"; import fs from "node:fs"; import sharp from "sharp";
const dir = "C:/Users/Ropafadzo Muridzi/Downloads/mercedes";
const rows = JSON.parse(fs.readFileSync("_tools/image-map.json"));
const docs = await p.createClient("xcgt84rk").dangerouslyGetAll();
const KEY = { black: /black|obsidian|diamond/i, white: /white|opalite|polar/i, silver: /silver|high-tech|mojave|zynith|granite/i, grey: /gr[ae]y|selenite|granite|baltic|sting/i, blue: /blue|nautical|cavansite|spectral|ocean|hydro/i, red: /red|patagonia|velvet|firecracker/i, green: /green|olive|emerald/i, orange: /orange/i };
const word = (c) => /black/.test(c) ? "black" : /white|opalite|polar/.test(c) ? "white" : /silver/.test(c) ? "silver" : /gr[ae]y/.test(c) ? "grey" : /blue/.test(c) ? "blue" : /red/.test(c) ? "red" : /green/.test(c) ? "green" : /orange/.test(c) ? "orange" : "?";
const hex = (r,g,b) => "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
async function sample(f) { // dominant body colour: centre crop, drop near-white/near-grey background
  const img = sharp(path.join(dir, f)).ensureAlpha(); const m = await img.metadata();
  const { data } = await img.extract({ left: Math.floor(m.width*0.3), top: Math.floor(m.height*0.38), width: Math.floor(m.width*0.4), height: Math.floor(m.height*0.2) }).raw().toBuffer({ resolveWithObject: true });
  const px = []; for (let i = 0; i < data.length; i += 4) if (data[i+3] > 200) px.push([data[i],data[i+1],data[i+2]]);
  if (!px.length) return "#808080";
  const med = (k) => px.map(p => p[k]).sort((a,b)=>a-b)[Math.floor(px.length/2)];
  return hex(med(0), med(1), med(2)); }
import path from "node:path";
const dist = (a,b) => { const x=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16)), y=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16)); return Math.hypot(...x.map((v,i)=>v-y[i])); };
const out = {};
for (const uid of [...new Set(rows.map(r => r.model))]) {
  const v = docs.find(d => d.uid === uid); const files = rows.filter(r => r.model === uid && r.role === "colour"); if (!files.length) continue;
  const cols = v ? v.data.colour_options.map(c => ({ name: c.colour_name, hex: c.hex })) : [];
  const used = new Set(); const props = [];
  for (const f of files) {
    const w = word(f.colour); const hx = await sample(f.file);
    const cands = cols.map((c,i)=>({c,i})).filter(({c}) => KEY[w]?.test(c.name)).sort((a,b)=>dist(hx,a.c.hex||"#808080")-dist(hx,b.c.hex||"#808080"));
    const pick = cands.find(({i}) => !used.has(i)) ?? null;
    if (pick) used.add(pick.i);
    props.push({ file: f.file, fileColour: f.colour, sampled: hx, match: pick ? pick.c.name : null, docHex: pick?.c.hex ?? null, action: pick ? "attach" : "add new colour" });
  }
  out[uid] = { docExists: !!v, docColours: cols.map(c=>c.name), props };
}
fs.writeFileSync("_tools/colour-proposal.json", JSON.stringify(out, null, 1));
for (const [uid, o] of Object.entries(out)) { console.log(`\n${uid}${o.docExists ? "" : " (NEW DOC)"}  doc: ${o.docColours.join(", ")}`);
  for (const p of o.props) console.log(`  ${p.file.padEnd(38)} ${p.sampled}  -> ${p.match ?? "** ADD NEW **"}`); }
