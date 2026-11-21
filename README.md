# Starbell Auto (demo build)

Next.js 15 + Tailwind 4. Local seed data in `lib/vehicles.ts` (all SAMPLE). Reference templates from the Asia Mobility site are in `_template-asia/` (not built; copy pieces from it, e.g. `lib/security`, Prismic slices).

    npm install
    npm run dev        # http://localhost:3000
    npm run build

Leads post to `/api/leads` and append to `data/leads.jsonl` locally (logged on read-only hosts). Replace with MongoDB + Turnstile + rate limiting before launch.
Contact details in `lib/site.ts` come from public listings: verify with Starbell.
See `../INSPIRATION.md`, `STRATEGY.md`, `PRODUCT.md`.
