# Plan: Zimoco demo site (separate from Starbell)

Status: planning only. Starts after the Starbell Prismic migration (`starbell-auto/PLAN_PRISMIC_MIGRATION.md`) is stable. Not a priority for the Starbell work.

## 1. Goal

A demo dealer site for **Zimoco** (the correct spelling, zimoco.co.zw), built from the same template and Prismic schema as Starbell, in its **own Prismic repo** (suggested name `zimoco-demo`), with **all** the models Zimoco offers.

## 2. What Zimoco is (from public sources, to verify)

- Official distributor for Mercedes-Benz, Jeep, Chrysler, Dodge, Fiat, Alfa Romeo, HAVAL and GWM passenger vehicles in Zimbabwe, and the Mitsubishi dealership.
- Also handles Daimler trucks and buses (Freightliner, FUSO) and used trucks through SelecTrucks.
- Models seen in press: Mitsubishi Triton and Outlander Sport, GWM Tank 500 HEV, GWM Ora 3, Haval Jolion (HEV, Pro HEV).
- No current public price list was found, so models and specs need to be collected from the Zimoco site and brand sites.

## 3. Approach

- **Fork the Starbell codebase** after it is Prismic-driven (not before), so Zimoco gets the finished mapper, schema and seed tooling.
- **Same data structures, different repo and different vehicles.** No shared Prismic content with Starbell or FM.
- **Content source is not FM,** so the seed input is a hand-built dataset (`zimoco-models.json`), not an FM mapping.
- **Demo status:** use indicative prices and clearly mark it as a demo, so nobody mistakes it for Zimoco's own site.

## 4. Steps

**Tapiwa**
1. Create the Prismic repo `zimoco-demo` and a write token (same steps as Starbell).
2. Decide how Zimoco's brand is handled for the demo: use their logo and name (they are a prospect) or a neutral demo identity. This affects the design pass.
3. Review the model list I produce and trim anything not worth showing.

**Claude**
1. **Discovery:** crawl zimoco.co.zw and the brand pages to list every brand, model, body type and variant. Output `zimoco-models.json` and a coverage report.
2. **Dataset:** enrich each model with specs and images where publicly available. Record the source URL for each image and spec so rights can be checked.
3. **Fork and rename:** copy Starbell into `zimoco-demo`, change `site.ts`, brand list, theme tokens and the repo env var.
4. **Schema:** reuse the Starbell custom types unchanged. Add a `division` select (Passenger, Commercial) only if the commercial vehicles need separate navigation.
5. **Seed:** reuse the seed script's write path with the Zimoco dataset (dry run, then release, then review).
6. **Pages:** home, about, contact, settings in Prismic, same as Starbell.
7. **Design:** pass through the design skills for a distinct look, so it isn't a recolour of Starbell.

## 5. Risks

| Risk | Handling |
|---|---|
| Large catalogue (many brands, plus trucks and buses) | Seed in batches by brand. |
| Images and specs from brand sites may be copyrighted | Record sources, use official press images where possible, and keep it labelled as a demo. |
| Commercial vehicles have different specs (payload, axle, GVM) | Use the optional spec fields already in the schema, and add commercial fields only if needed. |
| Using Zimoco's name and logo without permission | Decide in Tapiwa's step 2 before publishing anything publicly. |

## 6. Open items

- Use Zimoco's real branding for the demo, or a neutral identity?
- Include trucks and buses (Freightliner, FUSO) or passenger vehicles only? (You said "all", so the default is to include them.)
- Where will the demo be hosted, and who will see it?
