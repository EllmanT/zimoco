// node _tools/build-payload.mjs <uid> <versionId> <keys.json>   keys.json = {"colours":{"Bright White":"<key>"},"highlights":["<key0>","<key1>"]}
// Prints one entry for mcp update_documents (read-only helper).
import fs from "node:fs";
const [uid, versionId, keyFile] = process.argv.slice(2);
const patch = JSON.parse(fs.readFileSync("_tools/image-patches.json"))[uid];
const inv = Object.fromEntries(JSON.parse(fs.readFileSync("_tools/asset-inventory.json")).map(a => [a.id, a]));
const keys = JSON.parse(fs.readFileSync(keyFile));
if (!patch.hero_image && process.env.HERO_FROM) { const c = patch.colours.find((x) => x.name === process.env.HERO_FROM); patch.hero_image = patch.card_image = { id: c.id }; patch.exterior_shots = [{ image: { id: c.id } }]; }
const img = (id, alt) => { const a = inv[id]; return { __TYPE__: "ImageContent", origin: { id, url: a.url.split("?")[0], width: a.width, height: a.height }, width: a.width, height: a.height }; };
const T = (v) => ({ __TYPE__: "FieldContent", type: "Text", value: v });
const item = (fields) => ({ __TYPE__: "GroupItemContent", value: fields });
const label = (uid) => uid.replace(/-/g, " ");
const updates = {}, inserts = [], whole = { exterior_views: [], exterior_shots: [], interior_shots: [] };
const add = (container, it) => (whole[container] ? whole[container].push(it) : inserts.push({ container, item: it }));
if (patch.hero_image) { updates.hero_image = img(patch.hero_image.id, label(uid)); updates.card_image = img(patch.card_image.id, label(uid)); }
for (const h of patch.highlights) { const k = keys.highlights?.[h.index]; if (!k) throw new Error("no highlight key " + h.index); updates[`highlights[${k}].image`] = img(h.id, h.title); }
for (const c of patch.colours) {
  if (keys.colours[c.name]) { const k = keys.colours[c.name]; if (!k) throw new Error("no colour key " + c.name); updates[`colour_options[${k}].image`] = img(c.id, c.name); }
  else add("colour_options", item([["variant_id", T(c.variant_id)], ["colour_name", T(c.name)], ["hex", T(c.hex)], ["image", img(c.id, c.name)]]));
  add("exterior_views", item([["colour_name", T(c.name)], ["colour_hex", T(c.hex)], ["angle", { __TYPE__: "FieldContent", type: "Select", value: "Front left" }], ["image", img(c.id, c.name)]]));
}
for (const s of patch.exterior_shots) add("exterior_shots", item([["image", img(s.image.id, label(uid))]]));
for (const s of patch.interior_shots) add("interior_shots", item([["image", img(s.image.id, label(uid) + " interior")]]));
for (const [k, v] of Object.entries(whole)) if (v.length) updates[k] = { __TYPE__: "GroupContentType", value: v };
console.log(JSON.stringify({ documentId: process.argv[5], baseVersionId: versionId, updates, inserts }));
