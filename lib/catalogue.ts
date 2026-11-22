// Zimoco showroom catalogue.
// ALL specifications and "from" prices are INDICATIVE placeholders (typical figures for the model range, USD).
// Verify against manufacturer sheets and Zimoco's price list before launch. Availability is always confirmed on quote.
import generated from "./showroom.generated.json";

export type Body = "Pickup" | "SUV" | "Hatchback" | "Commercial";

export type Spec = {
  engine: string;
  fuel: string;
  /** null = not yet confirmed (shown as an em dash). */
  powerKw: number | null;
  torqueNm: number | null;
  transmission: string;
  drive: string;
  /** L/100 km, combined (indicative). */
  economy: number | null;
  seats: number;
  payloadKg?: number;
  towingKg?: number;
  lengthMm?: number;
  safety?: string;
};

export type Variant = {
  id: string; // matches the folder name under public/showroom/<folder>/<id>/
  name: string;
  from: number | null; // indicative USD, null = price on request
  blurb?: string;
  spec?: Partial<Spec>;
};

/** `colour` is the lowercase key (e.g. "sulfur metallic"); `hex` is the swatch colour when Prismic supplies one. */
export type ColourOption = { colour: string; src: string; hex?: string };

/** Rows authored in Prismic for the vehicle page. `ids` = versions the row applies to (empty = every version). */
type Scoped = { ids: string[] };
export type PageGroups = {
  highlights: (Scoped & { title: string; text: string; src?: string })[];
  exterior: (Scoped & { name: string; hex?: string; angle: string; src: string })[];
  wheels: (Scoped & { name: string; angle: string; src: string })[];
  interior: (Scoped & { tab: string; name: string; hex?: string; src: string })[];
  equipment: (Scoped & { category: string; title: string; text: string; src?: string })[];
  specs: (Scoped & { section: string; label: string; value: string; key: boolean })[];
  offers: (Scoped & { type: string; title: string; text: string; cta: string; src?: string })[];
  heroByVersion: Record<string, string>;
};

/** Content that comes from Prismic (set by lib/prismic/mapVehicle.ts). Takes priority over the local scan manifest. */
export type Cms = {
  hero?: string;
  card?: string;
  /** Vehicle-page groups (highlights, views, specs, offers). */
  page?: PageGroups;
  /** Studio colour images per variant id. */
  colours: Record<string, ColourOption[]>;
  exterior: string[];
  interior: string[];
  longDescription?: string[];
  metaTitle?: string;
  metaDescription?: string;
  /** Photo credits written on the images in Prismic (shown on /credits). */
  credits?: string[];
};

export type Model = {
  /** Present when this model is served from Prismic. */
  cms?: Cms;
  slug: string;
  folder: string; // folder under public/showroom
  brand: string;
  name: string;
  body: Body;
  tagline: string;
  summary: string;
  spec: Spec;
  variants: Variant[];
  /** Existing photographs used until the owner drops in showroom images. */
  legacy?: { hero?: string; heroFocus?: string; exterior?: string[]; interior?: string[] };
  rivals: string[]; // slugs
  faq?: [string, string][];
};

const D = "Diesel";
const P = "Petrol";

export const models: Model[] = [
  {
    slug: "toyota-hilux",
    folder: "toyota-hilux",
    brand: "Toyota",
    name: "Hilux",
    body: "Pickup",
    tagline: "The workhorse everyone wants. Seven trims, nine colours.",
    summary: "Zimbabwe's favourite bakkie: tough, easy to maintain and easy to resell. Choose your cab, trim and colour, then request a quote.",
    spec: { engine: "2.4 L GD-6 turbo diesel", fuel: D, powerKw: 110, torqueNm: 400, transmission: "6-speed manual or automatic", drive: "4x2 or 4x4", economy: 7.6, seats: 5, payloadKg: 1000, towingKg: 3500, lengthMm: 5330, safety: "ABS, up to 7 airbags on higher trims" },
    variants: [
      { id: "standard", name: "Standard", from: 19500, blurb: "Single cab, steel wheels. Built for the job." },
      { id: "single-cab", name: "Single Cab", from: 24500, blurb: "Single cab with comfort and convenience upgrades." },
      { id: "single-cab-raider", name: "Single Cab Raider", from: 28500, blurb: "Single cab in Raider trim with alloys and chrome." },
      { id: "raider", name: "Raider Double Cab", from: 38500, blurb: "Five seats, alloys, touchscreen and more.", spec: { powerKw: 110, drive: "4x2 or 4x4" } },
      { id: "country", name: "Country", from: 41500, blurb: "Double cab with the rugged, outdoor look.", spec: { powerKw: 130, torqueNm: 450, engine: "2.8 L GD-6 turbo diesel" } },
      { id: "gr-sport", name: "GR Sport", from: 52500, blurb: "Sport suspension and GR styling.", spec: { powerKw: 165, torqueNm: 500, engine: "2.8 L GD-6 turbo diesel", transmission: "6-speed automatic", drive: "4x4" } },
    ],
    legacy: {},
    rivals: ["ford-ranger", "isuzu-d-max"],
    faq: [
      ["Is the Hilux available right now?", "Every Hilux in the showroom is shown as available. If the exact trim and colour you want is not on the floor, our team sources it and confirms timing on your quote."],
      ["Which Hilux trim should I choose?", "Standard and Single Cab suit fleet and work duty. Raider and Country add comfort and a more premium look. GR Sport is the performance-styled flagship."],
      ["Is the price final?", "The price shown is an indicative starting price. The final price depends on year, mileage, specification and colour, and is confirmed in your quote."],
    ],
  },
  {
    slug: "ford-ranger",
    folder: "ford-ranger",
    brand: "Ford",
    name: "Ranger",
    body: "Pickup",
    tagline: "Strong, refined and comfortable on every road.",
    summary: "A confident double cab with car-like comfort and serious towing ability.",
    spec: { engine: "2.2 L or 3.2 L TDCi diesel", fuel: D, powerKw: 147, torqueNm: 470, transmission: "6-speed manual or automatic", drive: "4x2 or 4x4", economy: 8.0, seats: 5, payloadKg: 1000, towingKg: 3500, lengthMm: 5360, safety: "5-star Euro NCAP" },
    variants: [
      { id: "xlt", name: "XLT Double Cab", from: 34500 },
      { id: "wildtrak", name: "Wildtrak", from: 42500, spec: { powerKw: 157 } },
    ],
    rivals: ["toyota-hilux", "isuzu-d-max"],
  },
  {
    slug: "isuzu-d-max",
    folder: "isuzu-d-max",
    brand: "Isuzu",
    name: "D-Max",
    body: "Pickup",
    tagline: "Famously durable, famously frugal.",
    summary: "A reliable diesel workhorse with a reputation for long life and low running costs.",
    spec: { engine: "3.0 L or 1.9 L turbo diesel", fuel: D, powerKw: 130, torqueNm: 380, transmission: "6-speed manual or automatic", drive: "4x2 or 4x4", economy: 8.2, seats: 5, payloadKg: 1000, towingKg: 3500, lengthMm: 5295, safety: "ABS, EBD, airbags" },
    variants: [
      { id: "ls", name: "LS Double Cab", from: 31500 },
      { id: "single-cab", name: "Single Cab", from: 22500 },
    ],
    rivals: ["toyota-hilux", "ford-ranger"],
  },
  {
    slug: "toyota-land-cruiser-prado",
    folder: "toyota-land-cruiser-prado",
    brand: "Toyota",
    name: "Land Cruiser Prado",
    body: "SUV",
    tagline: "Go anywhere, seat seven, arrive in comfort.",
    summary: "The family adventure SUV: legendary four-wheel-drive ability with a refined cabin.",
    spec: { engine: "2.8 L or 4.0 L V6", fuel: "Diesel or petrol", powerKw: 150, torqueNm: 500, transmission: "6-speed automatic", drive: "Full-time 4x4", economy: 9.5, seats: 7, towingKg: 3000, lengthMm: 4825, safety: "Multi-terrain monitor, up to 7 airbags" },
    variants: [
      { id: "tx", name: "TX", from: 52000 },
      { id: "tx-l", name: "TX-L", from: 62000 },
    ],
    legacy: { hero: "/cars/prado-1.jpg", heroFocus: "50% 60%", exterior: ["/cars/prado-1.jpg", "/cars/prado-2.jpg", "/cars/prado-eng.jpg"], interior: ["/cars/prado-int.jpg"] },
    rivals: ["toyota-fortuner", "toyota-land-cruiser-300"],
  },
  {
    slug: "toyota-land-cruiser-300",
    folder: "toyota-land-cruiser-300",
    brand: "Toyota",
    name: "Land Cruiser 300",
    body: "SUV",
    tagline: "The new benchmark. ZX and GR Sport.",
    summary: "Twin-turbo V6 power, full-time four-wheel drive and a flagship cabin.",
    spec: { engine: "3.3 L twin-turbo V6 diesel", fuel: D, powerKw: 227, torqueNm: 700, transmission: "10-speed automatic", drive: "Full-time 4x4", economy: 9.6, seats: 7, towingKg: 3500, lengthMm: 4985, safety: "Toyota Safety Sense, 10 airbags" },
    variants: [
      { id: "zx", name: "ZX", from: 125000 },
      { id: "gr-sport", name: "GR Sport", from: 138000, spec: { seats: 5 } },
    ],
    legacy: { hero: "/cars/lc300-zx-1.jpg", heroFocus: "50% 42%", exterior: ["/cars/lc300-zx-1.jpg", "/cars/zx-rear.jpg", "/cars/gr-1.jpg", "/cars/gr-rear.jpg"], interior: ["/cars/zx-int.jpg"] },
    rivals: ["lexus-lx-600", "toyota-land-cruiser-prado"],
  },
  {
    slug: "lexus-lx-600",
    folder: "lexus-lx-600",
    brand: "Lexus",
    name: "LX 600",
    body: "SUV",
    tagline: "Flagship luxury with Land Cruiser strength.",
    summary: "A twin-turbo V6 luxury SUV with a hand-finished cabin and executive-class comfort.",
    spec: { engine: "3.5 L twin-turbo V6", fuel: P, powerKw: 305, torqueNm: 650, transmission: "10-speed automatic", drive: "Full-time 4x4", economy: 12.0, seats: 7, towingKg: 3500, lengthMm: 5100, safety: "Lexus Safety System+ 3.0" },
    variants: [{ id: "luxury", name: "Luxury", from: 165000 }],
    legacy: { hero: "/cars/lx600-1.jpg", heroFocus: "50% 55%", exterior: ["/cars/lx600-1.jpg", "/cars/lx600-side.jpg", "/cars/lx600-rear.jpg"], interior: ["/cars/lx600-int.jpg"] },
    rivals: ["toyota-land-cruiser-300", "land-rover-defender"],
  },
  {
    slug: "land-rover-defender",
    folder: "land-rover-defender",
    brand: "Land Rover",
    name: "Defender 110",
    body: "SUV",
    tagline: "An icon, rebuilt.",
    summary: "Modern capability with unmistakable character. Five to seven seats.",
    spec: { engine: "3.0 L mild-hybrid diesel", fuel: D, powerKw: 183, torqueNm: 570, transmission: "8-speed automatic", drive: "Permanent AWD", economy: 9.0, seats: 5, towingKg: 3500, lengthMm: 5018, safety: "5-star Euro NCAP" },
    variants: [{ id: "110", name: "110", from: 98000 }],
    legacy: { hero: "/cars/defender-1.jpg", heroFocus: "50% 60%", exterior: ["/cars/defender-1.jpg", "/cars/defender-2.jpg"] },
    rivals: ["lexus-lx-600", "toyota-land-cruiser-300"],
  },
  {
    slug: "toyota-fortuner",
    folder: "toyota-fortuner",
    brand: "Toyota",
    name: "Fortuner",
    body: "SUV",
    tagline: "Hilux toughness with seven seats.",
    summary: "A rugged, family-sized SUV on the Hilux platform. Popular, dependable and easy to resell.",
    spec: { engine: "2.4 L or 2.8 L GD-6 turbo diesel", fuel: D, powerKw: 130, torqueNm: 450, transmission: "6-speed manual or automatic", drive: "4x2 or 4x4", economy: 8.0, seats: 7, towingKg: 3000, lengthMm: 4795, safety: "7 airbags, ABS, stability control" },
    variants: [
      { id: "2-4", name: "2.4 GD-6", from: 42000, spec: { powerKw: 110, torqueNm: 400, engine: "2.4 L GD-6 turbo diesel" } },
      { id: "2-8", name: "2.8 GD-6", from: 49500 },
    ],
    rivals: ["toyota-land-cruiser-prado", "toyota-rav4"],
  },
  {
    slug: "toyota-rav4",
    folder: "toyota-rav4",
    brand: "Toyota",
    name: "RAV4",
    body: "SUV",
    tagline: "The compact SUV that does it all.",
    summary: "Comfortable, efficient and dependable. A smart family and commuter SUV.",
    spec: { engine: "2.0 L or 2.5 L", fuel: P, powerKw: 126, torqueNm: 207, transmission: "CVT or 6-speed automatic", drive: "FWD or AWD", economy: 7.5, seats: 5, lengthMm: 4600, safety: "Toyota Safety Sense (on later models)" },
    variants: [
      { id: "gx", name: "GX", from: 18500 },
      { id: "adventure", name: "Adventure", from: 24000, spec: { drive: "AWD", powerKw: 151 } },
    ],
    rivals: ["honda-cr-v", "mazda-cx-5"],
  },
  {
    slug: "mazda-cx-5",
    folder: "mazda-cx-5",
    brand: "Mazda",
    name: "CX-5",
    body: "SUV",
    tagline: "Sharp to drive, premium to sit in.",
    summary: "Refined SkyActiv engines and a upmarket interior in a compact SUV.",
    spec: { engine: "2.0 L or 2.5 L SkyActiv", fuel: P, powerKw: 143, torqueNm: 252, transmission: "6-speed automatic", drive: "FWD or AWD", economy: 7.2, seats: 5, lengthMm: 4550, safety: "i-Activsense safety (on later models)" },
    variants: [
      { id: "2-0", name: "2.0 SkyActiv", from: 16500, spec: { powerKw: 115, torqueNm: 200, engine: "2.0 L SkyActiv-G" } },
      { id: "2-5", name: "2.5 SkyActiv", from: 21000 },
    ],
    rivals: ["honda-cr-v", "toyota-rav4"],
  },
  {
    slug: "honda-cr-v",
    folder: "honda-cr-v",
    brand: "Honda",
    name: "CR-V",
    body: "SUV",
    tagline: "Space, comfort and Honda reliability.",
    summary: "A roomy, comfortable family SUV with a deserved reputation for dependability.",
    spec: { engine: "2.0 L or 2.4 L i-VTEC", fuel: P, powerKw: 140, torqueNm: 244, transmission: "CVT or 5-speed automatic", drive: "FWD or AWD", economy: 8.0, seats: 5, lengthMm: 4600, safety: "Honda Sensing (on later models)" },
    variants: [
      { id: "2-0", name: "2.0", from: 15500, spec: { powerKw: 114, torqueNm: 190 } },
      { id: "2-4", name: "2.4", from: 19500 },
    ],
    rivals: ["mazda-cx-5", "toyota-rav4"],
  },
  {
    slug: "toyota-aqua",
    folder: "toyota-aqua",
    brand: "Toyota",
    name: "Aqua",
    body: "Hatchback",
    tagline: "Hybrid efficiency that keeps fuel bills low.",
    summary: "One of Zimbabwe's most popular hybrids: very frugal, easy to park and cheap to run.",
    spec: { engine: "1.5 L petrol hybrid", fuel: "Hybrid", powerKw: 54, torqueNm: 111, transmission: "CVT", drive: "FWD", economy: 4.5, seats: 5, lengthMm: 3995, safety: "ABS, airbags" },
    variants: [
      { id: "s", name: "S", from: 8500 },
      { id: "g", name: "G", from: 9800 },
    ],
    rivals: ["toyota-vitz", "honda-fit"],
  },
  {
    slug: "toyota-vitz",
    folder: "toyota-vitz",
    brand: "Toyota",
    name: "Vitz",
    body: "Hatchback",
    tagline: "Small car, big on value.",
    summary: "A light, simple and affordable city car that is cheap to run and keeps its value.",
    spec: { engine: "1.0 L or 1.3 L petrol", fuel: P, powerKw: 69, torqueNm: 121, transmission: "CVT or 4-speed automatic", drive: "FWD", economy: 5.5, seats: 5, lengthMm: 3885, safety: "ABS, airbags" },
    variants: [
      { id: "f", name: "F", from: 5900, spec: { powerKw: 51, torqueNm: 95, engine: "1.0 L petrol" } },
      { id: "u", name: "U", from: 6900 },
    ],
    rivals: ["toyota-aqua", "honda-fit"],
  },
  {
    slug: "honda-fit",
    folder: "honda-fit",
    brand: "Honda",
    name: "Fit",
    body: "Hatchback",
    tagline: "Surprisingly spacious, wonderfully economical.",
    summary: "Clever packaging gives this compact hatch the cabin and boot space of a larger car.",
    spec: { engine: "1.3 L or 1.5 L petrol", fuel: P, powerKw: 88, torqueNm: 145, transmission: "CVT", drive: "FWD", economy: 5.3, seats: 5, lengthMm: 3995, safety: "ABS, airbags" },
    variants: [
      { id: "13g", name: "13G", from: 6500, spec: { powerKw: 73, torqueNm: 119, engine: "1.3 L i-VTEC" } },
      { id: "15x", name: "15X", from: 8200 },
    ],
    rivals: ["toyota-vitz", "toyota-aqua"],
  },
];

export const comparePresets: { a: string; b: string; c?: string; label: string }[] = [
  { a: "toyota-hilux", b: "ford-ranger", label: "Hilux vs Ranger" },
  { a: "toyota-hilux", b: "isuzu-d-max", label: "Hilux vs D-Max" },
  { a: "ford-ranger", b: "isuzu-d-max", label: "Ranger vs D-Max" },
  { a: "toyota-land-cruiser-prado", b: "toyota-fortuner", label: "Prado vs Fortuner" },
  { a: "toyota-aqua", b: "toyota-vitz", label: "Aqua vs Vitz" },
  { a: "honda-fit", b: "toyota-vitz", label: "Fit vs Vitz" },
  { a: "mazda-cx-5", b: "honda-cr-v", label: "CX-5 vs CR-V" },
  { a: "toyota-rav4", b: "honda-cr-v", label: "RAV4 vs CR-V" },
  { a: "toyota-land-cruiser-300", b: "lexus-lx-600", label: "LC300 vs LX 600" },
];

// ---- helpers ----
type Manifest = Record<string, { variants: Record<string, { colour: string; src: string }[]>; exterior: string[]; interior: string[]; hero: string | null }>;
const manifest = generated as Manifest;

export const colourHex: Record<string, string> = {
  white: "#f2f2f0", pearl: "#e9e6dc", silver: "#bfc3c7", grey: "#6e7479", black: "#16171a",
  red: "#a3202a", orange: "#d8651f", green: "#46553f", bronze: "#8b6a49", blue: "#2c4a78", brown: "#5a4331",
};
export const colourLabel = (c: string) => (c === "pearl" ? "Pearl White" : c.replace(/\b\w/g, (ch) => ch.toUpperCase()));
/** Swatch colour for a colour option: Prismic's hex first, then the built-in table. */
export const swatchFor = (o: { colour: string; hex?: string }) => o.hex ?? colourHex[o.colour];

export function getModel(slug: string) { return models.find((m) => m.slug === slug); }
export function specFor(m: Model, variantId?: string): Spec {
  const v = m.variants.find((x) => x.id === variantId);
  return { ...m.spec, ...(v?.spec ?? {}) };
}
export function colourOptions(m: Model, variantId: string): ColourOption[] { return m.cms?.colours[variantId] ?? manifest[m.folder]?.variants[variantId] ?? []; }
function hashStr(s: string) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; }
/**
 * A varied colour for a trim, so cards and previews are not all white.
 * Deterministic (no Math.random): the same trim always gets the same colour, so server and browser agree
 * and the page does not change between visits. Neighbouring trims get different colours.
 */
export function pickColour(m: Model, variantId: string): ColourOption | undefined {
  const opts = colourOptions(m, variantId);
  if (!opts.length) return undefined;
  const i = Math.max(0, m.variants.findIndex((v) => v.id === variantId));
  return opts[(hashStr(m.slug) + i) % opts.length];
}
export const kwLabel = (s: Spec) => (s.powerKw == null ? "—" : `${s.powerKw} kW`);
export const nmLabel = (s: Spec) => (s.torqueNm == null ? "—" : `${s.torqueNm} Nm`);
/** Variants that have at least one studio image (shown in the configurator). */
export function configurableVariants(m: Model) { return m.variants.filter((v) => colourOptions(m, v.id).length > 0); }
export function hasConfigurator(m: Model) { return configurableVariants(m).length > 0; }
export function gallery(m: Model) {
  if (m.cms && (m.cms.exterior.length || m.cms.interior.length)) return { exterior: m.cms.exterior, interior: m.cms.interior };
  const g = manifest[m.folder];
  const exterior = [...(g?.exterior ?? []), ...(m.legacy?.exterior ?? [])];
  const interior = [...(g?.interior ?? []), ...(m.legacy?.interior ?? [])];
  return { exterior, interior };
}
export function heroImage(m: Model): { src: string; focus: string; kind: "photo" | "studio" | "none" } {
  if (m.cms?.hero) return { src: m.cms.hero, focus: "50% 50%", kind: "photo" };
  const g = manifest[m.folder];
  if (g?.hero) return { src: g.hero, focus: "50% 50%", kind: "photo" };
  if (m.legacy?.hero) return { src: m.legacy.hero, focus: m.legacy.heroFocus ?? "50% 50%", kind: "photo" };
  const first = configurableVariants(m)[0];
  const c = first && (colourOptions(m, first.id).find((x) => x.colour === "white") ?? colourOptions(m, first.id)[0]);
  return c ? { src: c.src, focus: "50% 50%", kind: "studio" } : { src: "", focus: "50% 50%", kind: "none" };
}
/** Card image: studio cut-out (preferred, white background) or the photo. */
export function cardImage(m: Model) {
  const first = configurableVariants(m)[0];
  const c = first && (colourOptions(m, first.id).find((x) => x.colour === "white") ?? colourOptions(m, first.id)[0]);
  if (c) return { src: c.src, studio: true };
  // A card that is just the hero photo is a photograph, not a studio cut-out.
  if (m.cms?.card) return { src: m.cms.card, studio: m.cms.card !== m.cms.hero };
  const h = heroImage(m);
  return h.src ? { src: h.src, studio: false } : null;
}
export function fromPrice(m: Model) {
  const p = m.variants.map((v) => v.from).filter((x): x is number => x != null);
  return p.length ? Math.min(...p) : null;
}
export const usd = (n: number | null) => (n == null ? "Price on request" : `US$ ${n.toLocaleString("en-US").replace(/,/g, " ")}`);
export const brands = [...new Set(models.map((m) => m.brand))];
export const bodies = [...new Set(models.map((m) => m.body))];
export const fullName = (m: Model) => `${m.brand} ${m.name}`;

export type ComparePreset = { a: string; b: string; c?: string; label: string };

/** Everything pages need from the catalogue, built from any list of models (local, or local merged with Prismic). Plain data, safe to pass to client components. */
export type Catalogue = { models: Model[]; compareModels: Model[]; brands: string[]; bodies: Body[]; comparePresets: ComparePreset[] };

/**
 * Models kept out of the site for now (content stays in Prismic / the local data, so showing one again is just removing it here).
 * CR-V, Fit and Aqua are paused; the Lexus shown is the LX 500d, so the LX 600 is hidden.
 */
export const HIDDEN_SLUGS = new Set(["honda-cr-v", "honda-fit", "toyota-aqua", "lexus-lx-600"]);

/**
 * Brands we do not sell (not on the dealership's own channels): kept out of the showroom, homepage range, Find my car and quotes,
 * but still comparable on /compare. To show one again, remove its slug here.
 */
export const COMPARE_ONLY_SLUGS = new Set(["ford-ranger", "ford-ranger-raptor", "isuzu-d-max", "mazda-cx-5"]);

/** Card photos that face the opposite way to the rest of the range; mirrored so every vehicle points the same direction. */
export const FLIPPED_CARD_SLUGS = new Set(["toyota-coaster", "toyota-hiace"]);

/** Brands Zimoco sells. Anything else left in Prismic (old Starbell brands) stays hidden on the site. */
export const ZIMOCO_BRANDS = new Set([
  "Mercedes-Benz", "Jeep", "Chrysler", "Dodge", "Fiat", "Alfa Romeo", "Mitsubishi", "Haval", "GWM",
  "Mercedes-Benz Trucks & Buses", "FUSO", "Freightliner",
]);

/** Vehicles loaded from Prismic that have no hero or card image yet stay off the site until photos are added. Set to false to show them. */
export const HIDE_MODELS_WITHOUT_IMAGES = true;
const lacksImages = (m: Model) => HIDE_MODELS_WITHOUT_IMAGES && !!m.cms && !m.cms.hero && !m.cms.card;

export function makeCatalogue(all: Model[], presets: ComparePreset[] = comparePresets): Catalogue {
  const list = all
    .filter((m) => ZIMOCO_BRANDS.has(m.brand) && !HIDDEN_SLUGS.has(m.slug) && !lacksImages(m))
    .map((m) => ({ ...m, rivals: m.rivals.filter((r) => !HIDDEN_SLUGS.has(r)) }));
  const known = new Set(list.map((m) => m.slug));
  const selling = list.filter((m) => !COMPARE_ONLY_SLUGS.has(m.slug));
  return {
    models: selling,
    compareModels: list,
    brands: [...new Set(selling.map((m) => m.brand))],
    bodies: [...new Set(selling.map((m) => m.body))],
    comparePresets: presets.filter((p) => known.has(p.a) && known.has(p.b) && (!p.c || known.has(p.c))),
  };
}
export const findModel = (cat: Catalogue, slug: string) => cat.models.find((m) => m.slug === slug);
/** Like findModel, but also finds compare-only vehicles (Ranger, D-Max, CX-5). */
export const findCompareModel = (cat: Catalogue, slug: string) => cat.compareModels.find((m) => m.slug === slug);
export const localCatalogue: Catalogue = makeCatalogue(models);

/** Best available image of this model (optionally a given trim): studio cut-out, else hero photo, else a gallery shot. */
export function visual(m: Model, variantId?: string): { src: string; studio: boolean } | null {
  if (variantId) {
    const c = pickColour(m, variantId);
    if (c) return { src: c.src, studio: true };
  }
  const h = heroImage(m);
  if (h.src) return { src: h.src, studio: h.kind === "studio" };
  const g = gallery(m);
  const any = g.exterior[0] ?? g.interior[0];
  return any ? { src: any, studio: false } : null;
}
