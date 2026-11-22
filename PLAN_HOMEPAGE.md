# Plan: Zimoco homepage redesign (Mercedes-Benz SA inspired, multi-brand)

Decisions confirmed: real Zimoco brands, placeholder images (uploaded in Prismic), hero slideshow with video IDs in Prismic, homepage as a Prismic slice zone, light-blue theme and new font applied site-wide.

## 0. Current state
- `app/page.tsx` is hard-coded (Starbell copy, Toyota/Lexus videos, red accents). Prismic `homepage` type has an empty slice zone and `slices/index.ts` is empty.
- Catalogue is Starbell's (Toyota, Lexus, Ford...). Prismic types exist: `vehicle`, `brand`, `category`, `settings`, etc. `vehicle` has `brand` and `category` links, `card_image`, `hero_image`, `featured`.
- Theme tokens live in `app/globals.css` (`--color-red*`, `--color-brass*`), font is Figtree in `app/layout.tsx`.

## 1. Design language (research caveat)
mercedes-benz.co.za blocks automated fetches (403), so values below come from third-party reconstructions of the .com site. Step 1 of build: verify live values in Chrome (fonts, sizes, hover, pill nav) before locking tokens.
- Font: MBCorpo is licensed, so substitute. Headings: light/regular weight (400), tight tracking, large. Body/UI: clean grotesque. Proposal: `Inter_Tight` (headings, 400) + `Inter` (body, 400/500/700); fallback option `Albert_Sans`.
- Colour: white pages, near-black (#0a0a0a) header/footer/hero scrims, light-blue accent. Proposed accent `#00adef` family (hover `#0095d0`, active `#007fb3`) for light blue; text-safe link blue `#0260ab`. Hairlines `#e8e8e8`, muted `#919191`.
- Shape: 4px radii on buttons and cards, 48px-high buttons, pill radius only for the brand nav. 96px section rhythm, container max ~1440-1680, 12-col grid.
- Motion: 200ms colour transitions, reveals 400ms with `cubic-bezier(.3,0,0,1)`, `prefers-reduced-motion` respected.

## 2. Page structure (each = one Prismic slice)
1. **Hero** (`hero_video`): remove ring indicators/centred layout. Text bottom-left, CTA buttons left, bottom scrim. Slides with Bunny video ID, kicker, headline, 1-2 CTAs (label + link), all in Prismic. Slideshow dots become a small minimal indicator.
2. **Brand pills + Top Picks** (`brand_picks`): rounded wide pill bar at the bottom of the hero (overlapping it), Mercedes-Benz selected by default. Becomes sticky under the header once scrolled. Pills come from `brand` documents (ordered by a new `order` field). Top Picks is a bento grid: row 1 = 2/3 + 1/3, row 2 = three equal tiles. Each tile is a repeatable item: vehicle link, image override, title, subtitle, CTA label/link; dark bottom gradient (`from-black/70 to-transparent`) for text legibility. Top picks are per brand (selected pill filters the bento).
3. **Our Models** (`model_categories`): heading, "Discover all models" button, grid of 3-per-row landscape cards (image top, name bottom-centre). Body types: Sedan, SUV, Hatchback, Coupe, Cabriolet, People carrier, Bakkie. Driven by the active pill: only categories the brand has vehicles in, with that brand's image for each. Image comes from `brand_category` image mapping (see section 3).
4. **Highlight vehicles** (`vehicle_highlights`): "View all vehicles" link + 3 vehicle cards (e.g. hatchback, sedan, SUV) chosen via vehicle links.
5. **Browse strip** (`browse_strip`): thin full-width band, "Browse available vehicles" + link.
6. **Split features** (`split_feature`, variant `imageRight` / `imageLeft`): text + image, alternating.
7. **Service tiles** (`service_tiles`): Online store, Test drive, Finance, Insurance, Configurator (repeatable tile: icon/title/blurb/link).
8. **Footer**: newsletter subscribe (email field + button, endpoint TBD, see questions), link columns from `settings.navigation`, contact, hours. Black, 4 columns.

Shared behaviour: active brand state lives in a small client context (`BrandFilterProvider`) so the pill bar, Top Picks and Models grid stay in sync; pill bar sticks beneath the header after the hero via `position: sticky` + IntersectionObserver for the "docked" style.

## 3. Prismic changes (update models, `npx slice-machine` / prismic CLI sync, then seed)
- New slices (above) in `slices/`, registered in `homepage` slice zone; run Slice Simulator for each.
- `brand`: add `order` (Number), `short_label`, `accent_image` optional.
- `category`: add `icon`/default `image`.
- New `brand_category_image` mechanism: either a group on `brand` (category link + image) or fields in the Models slice items. Recommended: group on `brand`, so editors manage each brand's body-type images in one place.
- `vehicle`: ensure `featured` and a `top_pick_rank`/`pick_image` field exist for bento ordering.
- `settings`: add footer newsletter copy, social links, footer link groups.
- Seed script (reuse `_tools` write path): create brands (Mercedes-Benz, Jeep, Chrysler, Dodge, Fiat, Alfa Romeo, Haval, GWM, Mitsubishi), categories, ~3 placeholder vehicles per brand, homepage doc. Placeholder images: neutral gradient SVGs in `public/placeholders`, replaced as editors upload.
- Slice data is fetched via `PrismicNextLink` for all CTAs, so button labels and URLs are editable.

## 4. Code changes
- `app/layout.tsx`: swap Figtree for Inter_Tight + Inter; meta theme colour; update copy (no more "Hilux, Ranger, Prado").
- `app/globals.css`: replace `--color-red*`/`--color-brass*` with `--color-accent*` (light blue); keep old names as aliases in the first commit so the other pages do not break, then sweep `text-red`/`bg-red`/`btn-red` usages site-wide (`grep` count first). Update `.display` weight to 400 and tracking.
- `components/TopBar.tsx`, `Footer.tsx`, `Preloader.tsx`, logo: black header, blue CTA, Zimoco logo assets.
- Replace `HeroSlideshow` ring UI; delete or retire `Ring.tsx` usages on the homepage.
- `app/page.tsx`: fetch homepage via Prismic, render `<SliceZone>`; fetch brands/categories/vehicles on the server and pass to the client filter.
- Remove Starbell content from the homepage (Hilux configurator, four-steps, brand marquee).
- `DESIGN.md` / `PRODUCT.md`: rewrite for the new system.

## 5. Build order
1. Verify Mercedes tokens in Chrome; finalise font + blue.
2. Tokens, fonts, header, footer (site-wide theme).
3. Prismic model changes + sync + seed brands/categories/vehicles with placeholders.
4. Hero slice.
5. Brand pills + Top Picks (bento) with sticky docking.
6. Models grid with brand filtering.
7. Highlights, browse strip, split features, service tiles.
8. Newsletter + footer.
9. Motion pass (emil-design-eng), impeccable audit/polish, responsive pass (mobile pills scroll horizontally, bento stacks), a11y (pill bar is a `tablist`, contrast on the gradient), Lighthouse.

## 6. Open questions
- Newsletter: where do sign-ups go (Mailchimp, email, Prismic-less API route storing to MongoDB)? Default: API route that stores/forwards, to be wired later.
- Light-blue: confirm the `#00adef` family, or send a reference.
- Do the pills filter Top Picks as well, or only the Models grid? (Plan assumes both.)
- Zimoco logo: use the existing `Zimoco-white1-logo.png` in the black header?
- Do commercial brands (Freightliner, FUSO) appear in the pills? Plan assumes no.
