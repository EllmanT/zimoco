# Plan: Models strip, compare removal, vehicle page redesign

Status: updated after reviewing the live Mercedes-Benz E-Class AMG Line page.

## Decisions (confirmed)
- Version pill re-themes the **whole page** via `?v=<version-id>` (hero, price bar, bento, colour views, specs, offers, form).
- Colour views modelled **per version, per colour, with repeatable angle views**; the arrows only step through uploaded views.
- Compare feature is **removed entirely**.
- Inline form reuses `/api/rfq`; offers are repeatable Prismic items that pre-select in the form.

## 1. Homepage Models strip (`components/home/ModelsGrid.tsx`)
- Card ratio `aspect-[5/2]` -> about `aspect-[3/1]` (roughly 40% shorter), with the label sitting in a slim 44px footer.
- Car "grows out" of the card: image wrapper `overflow-visible`, image `-mt-6 / -translate-y-4`, container gets `pt-8` so the car pokes above the card's top edge; card itself keeps `rounded-[2rem]` + border and `overflow-visible`. The sky gradient stays clipped inside an inner rounded layer.
- Hover: `translateY(-2px)` + image scale 1.03; reduced-motion safe. Check grid row gap so overflowing cars don't touch the heading.
- Mobile: single column, same overflow offset, verify no horizontal scroll.

## 2. Remove Compare
Delete: `app/compare/page.tsx`, `components/CompareProvider.tsx`, `CompareTray.tsx`, `CompareView.tsx`, `components/compare/*`, `customtypes/compare_preset`.
Edit: `app/layout.tsx` (provider/tray), `TopBar.tsx` (nav link + badge), `Footer.tsx`, `app/sitemap.ts`, `ModelCard.tsx`, `ShowroomGrid.tsx`, `ModelCta.tsx`, `Configurator.tsx`, `FloatingActions.tsx` (lift logic), `RfqProvider.tsx` (`isCompare` branch), `lib/catalogue.ts` (compare comments, `rivals` left in data for now), `app/about/page.tsx` mentions. Keep leads type `"comparison"` in `lib/leads.ts` so old leads still render. Add a redirect `/compare -> /showroom` in `next.config.ts`. Finish with `grep -ri compare` and `next build`.

## 3. Vehicle page redesign (`app/showroom/[slug]/page.tsx`)
Verified against mercedes-benz.co.za/.../e-class/overview.html/amg-line (reviewed in Chrome, 22 Nov 2026). URL stays `/showroom/[slug]`, `?v=` chooses the version (Mercedes uses a path suffix `/amg-line`; we use `?v=` per decision, optionally `/showroom/[slug]/[version]` later).

What the reference does, and what we do:
| Reference section | What it actually is | Our version |
|---|---|---|
| Hero | Centred model title over a grey studio with the car on a turntable ring; no video | Our homepage hero style (full-bleed, text bottom-left), version pills overlapping the bottom |
| Sticky configuration bar | After the hero, a pinned bar: "Model: E-Class Sedan / This configuration for: R 1 379 346 (i)" left; outline "Browse available cars" + filled blue "Configure your car" right. Inline copy of it sits under the hero | Price band (your spec) and also the sticky bar variant. Price has an info tooltip ("indicative, confirmed on quote"). Buttons: Browse available vehicles, Request a quote |
| Left dot rail + anchor nav | Highlights, Exterior, Interior, Equipment, Technical data, Offers; vertical progress line at the left | Keep `DotRail`, new item list |
| Highlights | Small kicker + large light heading, bento: one big image left, narrower image right, caption text under each | As planned: 2/3 + 1/3 row, then three equal tiles |
| Exterior | Pill toggle `Colours | Wheels`; big studio image with a single right chevron (left appears after the first); row of round colour swatches below; one angle set per colour | As planned, plus swatch row under the image; swatch selection shows the colour name; arrows only appear when the colour has 2+ views |
| Interior | Same pattern: pill toggle `Upholstery | Trims`, full-bleed interior photo, swatches, arrow | **Added**: interior also gets pills (Upholstery / Trims), swatches and arrows, not a single static image. Falls back to one big image when only one is uploaded |
| Equipment | Category pills (Multimedia, Assistance Systems, Security, Chassis, Exterior, Interior) filtering feature cards (title + text) | **New, optional section** "Equipment highlights", driven by a Prismic group (category, title, text, image). Skip if you don't want it |
| Technical data | Fuel-type toggle (petrol/diesel), engine tabs (E200...), 4 key rows (Performance, Displacement, Top speed, Acceleration) in a striped table, "All technical data" button | Spec sheet table: fuel and engine selector where a version has several, 4 to 6 key rows, "All technical data" expands the full grouped table (or downloads a spec PDF if supplied) |
| Offers & prices | Dark full-bleed photo with heading ("lease or finance"), line of copy, one "Make an enquiry" button | Same: full-width photo band, per-offer cards or one band; button scrolls to the form with the offer pre-selected |
| (not on reference) | Available vehicles list, inline form | Ours: available vehicles with overflow-image cards, then inline next-steps form |

Final section order: Hero -> version pills -> price band (+ sticky copy) -> Highlights bento -> Exterior (Colours | Wheels) -> Interior (Upholstery | Trims) -> test drive + browse CTAs -> Equipment (optional) -> Technical data -> Offers and prices -> Available vehicles -> Next steps form -> FAQ.

Components in `components/vehicle/`: `VehicleHero`, `VersionPills`, `PriceBar` (static + sticky), `HighlightsBento`, `ViewerPills` (shared by exterior and interior: tabs + stage + swatches + arrows + swipe + keyboard), `EquipmentTabs`, `SpecTable`, `OffersBand`, `AvailableVehicles`, `NextStepsForm`.
Viewer behaviour: crossfade 200ms ease-out, preload adjacent images, `aria-live` caption of colour/angle, reduced-motion = instant.
Reference code to port: `asia-mobility/components/vehicle/{VariantPricing,ColorCustomizer,VehicleQuoteSection,VehicleDetailNav}.tsx`.

## 4. Prismic changes (`customtypes/vehicle/index.json` + `lib/prismic/mapVehicle.ts` + `lib/catalogue.ts` types)
Existing `variants` group (id, name, price, engine, power, ...) becomes the **version** list, so new fields go on it or on new linked groups. Prismic groups cannot nest, so the per-version images use a slice zone or flat tagged groups:

| Field | Type | Purpose |
|---|---|---|
| `variants` (existing) | Group | add `hero_image`, `price_note` |
| `highlights` | Group | bento tiles: `variant_id` (optional), `image`, `title`, `text`, `size` |
| `exterior_views` | Group | `variant_id`, `colour_name`, `colour_hex`, `angle` (Select: Front, Front left, Left, Rear left, Rear, Rear right, Right, Front right), `image`, `order` |
| `wheel_options` | Group | `variant_id`, `name`, `image`, `order` |
| `interior_views` | Group | `variant_id`, `tab` (Upholstery/Trims), `option_name`, `swatch_hex` or `swatch_image`, `image`, `order` (replaces `interior_shots`, which is migrated) |
| `equipment` | Group | `variant_id` (optional), `category`, `title`, `text`, `image` |
| `engines` | Group | `variant_id`, `fuel`, `engine_name`, key figures (performance, displacement, top speed, 0-100) |
| `spec_rows` | Group | `variant_id`, `section`, `label`, `value` (optional, falls back to built-in fields) |
| `offers` | Group | `variant_id` (optional), `type`, `title`, `text`, `cta_label` |
| `top_things_heading` | Text | optional override |

The editor flow is: add a row, pick the version id, colour and angle, upload the image. Existing `colour_options` and `exterior_shots` are migrated once by a script (`_tools/migrate-vehicle-views.mjs`) so current Mercedes data keeps working. Run `slice-machine`/prismic CLI model push, then update the Prismic MCP seed, then regenerate `prismicio-types.d.ts`.

## 5. Build order
1. (Done) Reviewed the Mercedes reference page.
2. Section 1 (Models strip), quick win, commit.
3. Section 2 (compare removal), `next build`, commit.
4. Prismic model changes + migration script + mapper + types.
5. Page shell with `?v=` state, hero, pill bar, price band.
6. Bento, exterior viewer (client), interior, CTA row.
7. Spec table, offers band, available vehicles, shared `RfqForm` + inline form.
8. Motion pass (emil-design-eng), `impeccable` audit/polish, responsive and a11y pass (tablist, arrow-key navigation, alt text, contrast), Lighthouse.
9. Update `DESIGN.md`.

## 6. Risks and assumptions
- Image availability: angle sets exist for few models. The UI degrades by showing only what is uploaded. Seed a full set for 1 to 2 Mercedes models for the demo.
- Prismic groups can't nest, hence the flat `variant_id`-tagged groups.
- Mercedes' own images/copyright: use only owned or licensed images (existing `credits` flow).
- `?v=` pages share one canonical URL; add `?v=` handling to metadata only if SEO per version is wanted later.
