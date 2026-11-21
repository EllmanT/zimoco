import type { Lead, LeadStatus } from "./leads";

// Deterministic SAMPLE leads so the demo admin never looks empty. Weighted like real dealer enquiries:
// mostly quote requests, mostly Toyota pickups and SUVs. All names and numbers are fictional.
const people = ["Tendai Moyo", "Rudo Chikwanha", "Farai Ncube", "Nyasha Dube", "Kuda Mutasa", "Tafadzwa Sibanda", "Chipo Mlambo", "Blessing Zulu", "Simba Chigumba", "Memory Banda", "Tinashe Gumbo", "Anesu Ndlovu", "Lloyd Makoni", "Ruvimbo Hove", "Takunda Mpofu"];
const cars: [string, string, string, number, string][] = [
  ["Toyota Hilux", "Raider Double Cab", "white", 38500, "toyota-hilux"],
  ["Toyota Hilux", "Single Cab", "silver", 24500, "toyota-hilux"],
  ["Toyota Hilux", "Country", "grey", 41500, "toyota-hilux"],
  ["Toyota Hilux", "Raider Double Cab", "black", 38500, "toyota-hilux"],
  ["Toyota Fortuner", "2.8 GD-6", "pearl", 49500, "toyota-fortuner"],
  ["Toyota Land Cruiser Prado", "TX-L", "black", 62000, "toyota-land-cruiser-prado"],
  ["Ford Ranger", "Wildtrak", "orange", 42500, "ford-ranger"],
  ["Toyota Aqua", "S", "white", 8500, "toyota-aqua"],
  ["Toyota Land Cruiser 300", "GR Sport", "black", 138000, "toyota-land-cruiser-300"],
  ["Isuzu D-Max", "LS Double Cab", "white", 31500, "isuzu-d-max"],
  ["Honda CR-V", "2.4", "silver", 19500, "honda-cr-v"],
  ["Mazda CX-5", "2.5 SkyActiv", "red", 21000, "mazda-cx-5"],
];
const budgets = ["US$20k to 35k", "US$35k to 60k", "US$35k to 60k", "US$10k to 20k", "US$60k to 100k", "Flexible"];
const pages = ["/showroom/toyota-hilux", "/showroom/toyota-hilux", "/showroom/toyota-fortuner", "/compare", "/", "/showroom/toyota-land-cruiser-prado"];
const sources = ["google", "google", "facebook", "whatsapp", "direct", "instagram"];
const statuses: LeadStatus[] = ["New", "New", "Contacted", "Quoted", "Contacted", "Won", "Lost", "New"];

export function seedLeads(): Lead[] {
  const out: Lead[] = [];
  const now = Date.now();
  for (let i = 0; i < 42; i++) {
    const c = cars[(i * 7 + (i % 3)) % cars.length];
    const kind: Lead["type"] = i % 11 === 0 ? "comparison" : i % 9 === 0 ? "find-my-car" : "rfq";
    const cmp = kind === "comparison";
    const hoursAgo = 3 + i * 17 + (i % 5) * 4;
    out.push({
      id: `SAMPLE-${String(i + 1).padStart(3, "0")}`,
      createdAt: new Date(now - hoursAgo * 3600_000).toISOString(),
      status: statuses[i % statuses.length],
      sample: true,
      type: kind,
      name: people[i % people.length],
      phone: `+26377${String(2000000 + ((i * 7919) % 899999)).padStart(7, "0")}`,
      email: i % 3 === 0 ? `${people[i % people.length].split(" ")[0].toLowerCase()}@example.com` : "",
      contactMethod: i % 4 === 0 ? "Call" : "WhatsApp",
      model: cmp ? undefined : c[0],
      modelSlug: cmp ? undefined : c[4],
      variant: cmp ? undefined : c[1],
      colour: cmp ? undefined : c[2],
      indicativePrice: cmp ? null : c[3],
      compare: cmp ? ["Toyota Hilux", "Ford Ranger"] : undefined,
      requestKinds: i % 5 === 0 ? ["Purchase", "Finance"] : i % 7 === 0 ? ["Purchase", "Trade-in"] : ["Purchase"],
      condition: "Pre-owned",
      budget: budgets[i % budgets.length],
      notes: i % 4 === 0 ? "Need it before month end if possible." : "",
      attribution: {
        sourcePage: pages[i % pages.length],
        landingPage: pages[(i + 2) % pages.length],
        utmSource: sources[i % sources.length],
        utmMedium: sources[i % sources.length] === "google" ? "organic" : "social",
        device: i % 3 === 0 ? "desktop" : "mobile",
      },
    });
  }
  return out;
}
