// Safety guard: this project may only ever talk to the Prismic repo "xcgt84rk".
// It refuses to continue if the config, an env var, or a leftover Slice Machine
// config points anywhere else (in particular the live FM repo "fmmotors").
// Runs before dev and build. Run it by hand before any `npx prismic push`.
import fs from "node:fs";
import path from "node:path";

const EXPECTED = "xcgt84rk";
const root = process.cwd();
const problems = [];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return null;
  }
}

const cfg = readJson("prismic.config.json");
if (!cfg) problems.push("prismic.config.json is missing or unreadable.");
else if (cfg.repositoryName !== EXPECTED)
  problems.push(`prismic.config.json repositoryName is "${cfg.repositoryName}", expected "${EXPECTED}".`);

const sm = readJson("slicemachine.config.json");
if (sm) problems.push(`A root slicemachine.config.json exists (repo "${sm.repositoryName}"). Remove it; this project uses prismic.config.json.`);

const KEYS = ["NEXT_PUBLIC_PRISMIC_ENVIRONMENT", "NEXT_PUBLIC_PRISMIC_REPO", "PRISMIC_REPOSITORY_NAME"];

for (const key of KEYS) {
  const v = process.env[key];
  if (v && v !== EXPECTED) problems.push(`Environment variable ${key}="${v}" must be unset or "${EXPECTED}".`);
}

for (const file of fs.readdirSync(root).filter((f) => f.startsWith(".env"))) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*["']?([^"'#\s]*)/);
    if (m && KEYS.includes(m[1]) && m[2] && m[2] !== EXPECTED)
      problems.push(`${file}: ${m[1]}="${m[2]}" must be unset or "${EXPECTED}".`);
  }
}

if (problems.length) {
  console.error("\nPRISMIC REPO GUARD FAILED. Refusing to continue.\n");
  for (const p of problems) console.error(" - " + p);
  console.error(`\nThis project must only use the Prismic repo "${EXPECTED}". Never fmmotors (live FM site).\n`);
  process.exit(1);
}
console.log(`Prismic repo guard OK (${EXPECTED}).`);
