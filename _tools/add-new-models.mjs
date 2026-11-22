// Adds GLC Coupe, GLE Coupe, GLS Maybach (mercedes-benz.json) and Cherokee (jeep.json) to data/catalog. Idempotent.
import fs from "node:fs";
const patches = JSON.parse(fs.readFileSync("_tools/image-patches.json"));
const load = (f) => JSON.parse(fs.readFileSync(`data/catalog/${f}.json`, "utf8"));
const mb = load("mercedes-benz"), jeep = load("jeep");
const par = (uid) => mb.models.find((m) => m.uid === uid);
const SAFETY = "Airbags, Active Brake Assist, blind-spot assist, Attention Assist; details to be confirmed per specification";
const colours = (uid, ids) => patches[uid].colours.map((c) => ({ colour_name: c.name, hex: c.hex, variant_ids: ids }));
function specRows(variants) {
  const rows = [];
  for (const v of variants) {
    const id = v.variant_id;
    if (v.power_kw) rows.push({ variant_ids: id, section: "Engine", label: "Power", value: `${v.power_kw} kW`, key_figure: true });
    if (v.torque_nm) rows.push({ variant_ids: id, section: "Engine", label: "Torque", value: `${v.torque_nm} Nm`, key_figure: true });
    rows.push({ variant_ids: id, section: "Engine", label: "Engine", value: v.engine, key_figure: false });
    rows.push({ variant_ids: id, section: "Transmission", label: "Gearbox and drive", value: `${v.transmission}, ${v.drive}`, key_figure: false });
    rows.push({ variant_ids: id, section: "Dimensions", label: "Seats", value: String(v.seats), key_figure: false });
  }
  return rows;
}
const offers = (name) => [
  { variant_ids: "", type: "Finance", title: "Finance and instalment options", text: `Ask Zimoco about structured finance for the ${name}, including deposit and term options to suit your budget.`, cta_label: "Enquire now" },
  { variant_ids: "", type: "Trade-in", title: "Trade in your current car", text: `Tell us what you drive now and Zimoco will advise whether a trade-in can go towards the ${name}.`, cta_label: "Enquire now" },
];
const v = (o) => ({ economy_l100: null, payload_kg: null, towing_kg: null, length_mm: null, safety: SAFETY, ...o });
const est = (r) => Math.round(((r / 18) * 1.2) / 500) * 500;
const mk = (o) => ({ featured: false, source_urls: [], rivals: [], image_needs: [], data_confidence: "low", ...o });

const glcc = (() => {
  const variants = [
    v({ variant_id: "glc220d-coupe-amg-line", name: "GLC 220 d Coupe 4Matic AMG Line", from_price_usd: est(1474943), blurb: "Diesel coupe for long-distance driving", engine: "2.0L turbo-diesel, 48V mild hybrid", fuel: "Diesel Hybrid", power_kw: 145, torque_nm: 440, transmission: "9-speed automatic", drive: "AWD", seats: 5 }),
    v({ variant_id: "glc300d-coupe-amg-line", name: "GLC 300 d Coupe 4Matic AMG Line", from_price_usd: est(1529943), blurb: "More power from the diesel", engine: "2.0L turbo-diesel, 48V mild hybrid", fuel: "Diesel Hybrid", power_kw: 195, torque_nm: 550, transmission: "9-speed automatic", drive: "AWD", seats: 5 }),
    v({ variant_id: "amg-glc43-coupe-4matic", name: "AMG GLC 43 Coupe 4Matic", from_price_usd: est(1911750), blurb: "Performance coupe with 310 kW", engine: "2.0L turbo petrol, 48V mild hybrid", fuel: "Petrol Hybrid", power_kw: 310, torque_nm: 500, transmission: "9-speed multi-clutch", drive: "AWD", seats: 5 }),
  ];
  const ids = variants.map((x) => x.variant_id).join(",");
  return mk({
    model_name: "GLC Coupe", uid: "mercedes-benz-glc-coupe", category: "SUV", tagline: "The GLC with a sloping coupe roofline",
    summary: "The GLC Coupe is a five-seat SUV coupe with mild-hybrid diesel or AMG petrol power and standard 4Matic all-wheel drive.",
    short_description: "The GLC Coupe takes the GLC mechanicals and adds a sloping roofline and a sportier stance. All versions use 4Matic all-wheel drive. The diesel GLC 220 d suits long-distance driving, and the AMG GLC 43 is the performance option.",
    long_description: [
      "The GLC Coupe shares its platform, engines and cabin technology with the GLC SUV, but the roofline slopes towards the rear for a more dramatic profile. Standard all-wheel drive and a raised ride height keep it practical on rough tar and gravel.",
      "### What you get",
      "Local range as listed by Mercedes-Benz South Africa: the GLC 220 d and GLC 300 d diesels in AMG Line trim, plus the AMG GLC 43 with 310 kW. All use a nine-speed automatic and mild-hybrid assistance. The cabin has a portrait central screen and a digital driver display.",
      "### Running it in Zimbabwe",
      "Diesel suits long trips and widely available fuel. Zimoco can quote this model as a duty-paid import. Prices shown are indicative estimates; confirm the exact specification before you commit.",
      "- GLC 220 d Coupe 4Matic AMG Line: diesel coupe for long-distance driving",
      "- GLC 300 d Coupe 4Matic AMG Line: more power from the diesel",
      "- AMG GLC 43 Coupe 4Matic: performance coupe with 310 kW",
      "Ask Zimoco for a current duty-paid quote.",
    ],
    meta_title: "Mercedes-Benz GLC Coupe | Zimoco", meta_description: "Mercedes-Benz GLC Coupe: GLC 220 d, GLC 300 d and AMG GLC 43 with 4Matic. Indicative USD pricing for Zimbabwe from Zimoco.",
    base_price_usd: variants[0].from_price_usd, price_basis: "SA list prices from cars.co.za / citizen.co.za (R1,474,943 / R1,529,943 / R1,911,750) / 18 + 20% import uplift, rounded to $500; ESTIMATE.",
    variants, colours: colours("mercedes-benz-glc-coupe", ids),
    highlights: [
      { variant_ids: "", title: "Coupe roofline", text: "Sloping rear roof for a sportier look than the GLC SUV." },
      { variant_ids: "", title: "4Matic as standard", text: "All-wheel drive on every GLC Coupe." },
      { variant_ids: "", title: "Diesel choice", text: "GLC 220 d and GLC 300 d suit long-distance use." },
      { variant_ids: "", title: "AMG GLC 43", text: "310 kW from a 2.0-litre turbo." },
    ],
    equipment: par("mercedes-benz-glc").equipment, spec_rows: specRows(variants), interior_options: par("mercedes-benz-glc").interior_options, wheel_options: par("mercedes-benz-glc").wheel_options,
    offers: offers("GLC Coupe"),
    faq: [{ question: "How is it different from the GLC?", answer: "Same engines and technology, with a sloping roofline and a sportier look. Rear headroom is a little lower." }, { question: "Is it all-wheel drive?", answer: "Yes, every GLC Coupe uses 4Matic." }],
    notes: "Specs from Mercedes-Benz SA via press listings. Torque for 300 d and 43 from global data. Prices estimated.",
  });
})();

const glec = (() => {
  const variants = [
    v({ variant_id: "gle450d-coupe-amg-line", name: "GLE 450 d Coupe 4Matic AMG Line", from_price_usd: est(2340500), blurb: "Six-cylinder diesel coupe", engine: "3.0L turbo-diesel inline-six, mild hybrid", fuel: "Diesel Hybrid", power_kw: 270, torque_nm: 750, transmission: "9-speed automatic", drive: "AWD", seats: 5 }),
    v({ variant_id: "amg-gle53-coupe-4matic", name: "AMG GLE 53 Coupe 4Matic+", from_price_usd: est(2581243), blurb: "Performance six-cylinder coupe", engine: "3.0L turbo petrol inline-six, mild hybrid", fuel: "Petrol Hybrid", power_kw: 320, torque_nm: null, transmission: "9-speed automatic", drive: "AWD", seats: 5 }),
  ];
  const ids = variants.map((x) => x.variant_id).join(",");
  return mk({
    model_name: "GLE Coupe", uid: "mercedes-benz-gle-coupe", category: "SUV", tagline: "Large SUV with a coupe roofline",
    summary: "The GLE Coupe is a five-seat luxury SUV coupe with six-cylinder diesel or AMG petrol power and 4Matic all-wheel drive.",
    short_description: "The GLE Coupe gives the GLE a sloping roofline and a sportier presence. The GLE 450 d is the diesel choice and the AMG GLE 53 adds performance. All-wheel drive is standard.",
    long_description: [
      "The GLE Coupe is a large luxury SUV with a coupe-style roofline. It uses the same mechanical package as the GLE but trades some rear headroom for a more athletic shape.",
      "### What you get",
      "Both versions use an inline-six engine with mild-hybrid assistance, a nine-speed automatic and 4Matic all-wheel drive. The GLE 450 d makes 270 kW and 750 Nm. The AMG GLE 53 makes 320 kW. Air suspension and the MBUX infotainment system are part of the package.",
      "### Running it in Zimbabwe",
      "Diesel suits long trips. Zimoco can quote this model as a duty-paid import. Prices shown are indicative estimates; confirm the exact specification before you commit.",
      "- GLE 450 d Coupe 4Matic AMG Line: six-cylinder diesel coupe",
      "- AMG GLE 53 Coupe 4Matic+: performance six-cylinder coupe",
      "Ask Zimoco for a current duty-paid quote.",
    ],
    meta_title: "Mercedes-Benz GLE Coupe | Zimoco", meta_description: "Mercedes-Benz GLE Coupe: GLE 450 d and AMG GLE 53 with 4Matic. Indicative USD pricing for Zimbabwe from Zimoco.",
    base_price_usd: variants[0].from_price_usd, price_basis: "SA list prices from citizen.co.za (R2,340,500 / R2,581,243) / 18 + 20% import uplift, rounded to $500; ESTIMATE.",
    variants, colours: colours("mercedes-benz-gle-coupe", ids),
    highlights: [
      { variant_ids: "", title: "Coupe roofline", text: "A sportier shape than the GLE SUV." },
      { variant_ids: "", title: "4Matic all-wheel drive", text: "Standard on every version." },
      { variant_ids: "", title: "Six-cylinder power", text: "270 kW diesel or 320 kW AMG petrol." },
    ],
    equipment: par("mercedes-benz-gle").equipment, spec_rows: specRows(variants), interior_options: par("mercedes-benz-gle").interior_options, wheel_options: par("mercedes-benz-gle").wheel_options,
    offers: offers("GLE Coupe"),
    faq: [{ question: "How is it different from the GLE?", answer: "Same mechanicals with a sloping roofline. Rear headroom and boot space are a little lower." }, { question: "Is it all-wheel drive?", answer: "Yes, 4Matic is standard." }],
    notes: "Specs from SA press listings. AMG GLE 53 torque not confirmed (sources conflict). Prices estimated; current SA range may be limited.",
  });
})();

const maybach = (() => {
  const variants = [v({ variant_id: "maybach-gls-600-4matic", name: "Mercedes-Maybach GLS 600 4Matic", from_price_usd: est(4500000), blurb: "Flagship luxury SUV", engine: "4.0L twin-turbo V8, mild hybrid", fuel: "Petrol Hybrid", power_kw: 410, torque_nm: 770, transmission: "9-speed automatic", drive: "AWD", seats: 4 })];
  const ids = variants[0].variant_id;
  return mk({
    model_name: "GLS Maybach", uid: "mercedes-benz-gls-maybach", category: "Luxury SUV", tagline: "The flagship Mercedes SUV",
    summary: "The Mercedes-Maybach GLS 600 is a four-seat luxury SUV with a twin-turbo V8 and an executive rear cabin.",
    short_description: "The Mercedes-Maybach GLS 600 is the most luxurious GLS, with a 4.0-litre twin-turbo V8 producing 410 kW, four individual seats and Maybach detailing inside and out.",
    long_description: [
      "The Mercedes-Maybach GLS 600 sits above the standard GLS as a chauffeur-style luxury SUV. South African specification lists four seats, with a refined rear cabin.",
      "### What you get",
      "A 4.0-litre twin-turbo V8 with mild-hybrid assistance delivers about 410 kW and 770 Nm through a nine-speed automatic and 4Matic all-wheel drive. Air suspension, Maybach styling and a high-end interior come as standard.",
      "### Running it in Zimbabwe",
      "This is a special-order import. Zimoco can explain duty-paid pricing and delivery. The price shown is an indicative estimate; confirm the exact specification before you commit.",
      "Ask Zimoco for a current duty-paid quote.",
    ],
    meta_title: "Mercedes-Maybach GLS 600 | Zimoco", meta_description: "Mercedes-Maybach GLS 600 4Matic: 410 kW V8 luxury SUV. Special-order pricing for Zimbabwe from Zimoco.",
    base_price_usd: variants[0].from_price_usd, price_basis: "SA list approx R4,500,000 (topauto / citizen) / 18 + 20% import uplift, rounded to $500; ESTIMATE.",
    variants, colours: colours("mercedes-benz-gls-maybach", ids),
    highlights: [
      { variant_ids: "", title: "Maybach luxury", text: "Executive rear cabin and unique styling." },
      { variant_ids: "", title: "4.0 V8", text: "About 410 kW from a twin-turbo V8." },
      { variant_ids: "", title: "Four seats", text: "Individual seats in South African specification." },
    ],
    equipment: par("mercedes-benz-gls").equipment, spec_rows: specRows(variants), interior_options: par("mercedes-benz-gls").interior_options, wheel_options: par("mercedes-benz-gls").wheel_options,
    offers: offers("Maybach GLS 600"),
    faq: [{ question: "How many seats?", answer: "South African specification lists four seats." }, { question: "Is it a special order?", answer: "Yes, ask Zimoco for availability and a duty-paid quote." }],
    notes: "Power 410 kW confirmed; torque reported as 770 Nm (one source 730). Price estimated.",
  });
})();

const cherokee = (() => {
  const variants = [
    v({ variant_id: "cherokee-2-4-longitude", name: "Cherokee 2.4 Longitude", from_price_usd: null, blurb: "Four-cylinder, front-wheel drive", engine: "2.4L petrol four-cylinder", fuel: "Petrol", power_kw: 130, torque_nm: 229, transmission: "9-speed automatic", drive: "FWD", seats: 5 }),
    v({ variant_id: "cherokee-3-2-trailhawk", name: "Cherokee 3.2 Trailhawk", from_price_usd: null, blurb: "V6 with four-wheel drive", engine: "3.2L Pentastar V6", fuel: "Petrol", power_kw: 200, torque_nm: 315, transmission: "9-speed automatic", drive: "4WD", seats: 5, towing_kg: 2200 }),
  ];
  const ids = variants.map((x) => x.variant_id).join(",");
  return mk({
    model_name: "Cherokee", uid: "jeep-cherokee", category: "SUV", tagline: "Mid-size Jeep SUV with V6 or four-cylinder power",
    summary: "The Jeep Cherokee is a five-seat mid-size SUV offered with a 2.4 four-cylinder or a 3.2 V6, with front- or four-wheel drive.",
    short_description: "The Jeep Cherokee is a comfortable mid-size SUV. The 2.4 Longitude is front-wheel drive, and the 3.2 V6 Trailhawk adds four-wheel drive and a 2,200 kg towing rating.",
    long_description: [
      "The Cherokee is Jeep's mid-size family SUV, positioned below the Grand Cherokee. It has a car-like ride on tar and Jeep four-wheel-drive hardware on the V6 Trailhawk.",
      "### Availability",
      "Jeep South Africa's current range is led by the Wrangler, Gladiator and Grand Cherokee, so Cherokee availability depends on stock. Zimoco can check supply and quote a duty-paid price. Pricing is on request.",
      "### Powertrains",
      "The 2.4-litre four-cylinder makes about 130 kW and 229 Nm. The 3.2-litre Pentastar V6 makes about 200 kW and 315 Nm. Both use a nine-speed automatic.",
      "- Cherokee 2.4 Longitude: front-wheel drive",
      "- Cherokee 3.2 Trailhawk: V6 with four-wheel drive",
      "Ask Zimoco for stock availability and a duty-paid quote.",
    ],
    meta_title: "Jeep Cherokee | Zimoco", meta_description: "Jeep Cherokee mid-size SUV with 2.4 or 3.2 V6 power. Availability and pricing on request from Zimoco.",
    base_price_usd: null, price_basis: "No current SA price found; pricing on request.",
    variants, colours: colours("jeep-cherokee", ids),
    highlights: [
      { variant_ids: "", title: "3.2 V6", text: "About 200 kW and 315 Nm on the Trailhawk." },
      { variant_ids: "", title: "Trailhawk 4x4", text: "Four-wheel drive with a 2,200 kg towing rating." },
    ],
    equipment: [
      { variant_ids: "", category: "Multimedia", title: "Touchscreen", text: "Uconnect infotainment." },
      { variant_ids: "", category: "Safety", title: "Airbags and stability control", text: "Details unverified for this market." },
    ],
    spec_rows: specRows(variants), interior_options: [], wheel_options: [],
    offers: offers("Cherokee"),
    faq: [{ question: "Is the Cherokee sold new in South Africa?", answer: "Jeep South Africa's current range focuses on other models, so ask Zimoco about stock." }, { question: "What does it cost?", answer: "Pricing is on request. Ask Zimoco for a duty-paid quote." }],
    notes: "Engines from the 2014 SA launch; no current SA price found. Availability to confirm.",
  });
})();

const put = (file, models) => {
  for (const m of models) {
    const i = file.models.findIndex((x) => x.uid === m.uid);
    if (i >= 0) file.models[i] = m; else file.models.push(m);
  }
};
put(mb, [glcc, glec, maybach]);
put(jeep, [cherokee]);
fs.writeFileSync("data/catalog/mercedes-benz.json", JSON.stringify(mb, null, 2) + "\n");
fs.writeFileSync("data/catalog/jeep.json", JSON.stringify(jeep, null, 2) + "\n");
console.log("ok", mb.models.length, jeep.models.length);
