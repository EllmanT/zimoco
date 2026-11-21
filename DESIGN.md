---
name: Starbell Auto
description: A Harare dealer site that shows its working. Pure white pages, black chrome, extended uppercase display type, and progress rings as the one signature device.
colors:
  canvas: "#ffffff"
  sunken: "#f5f5f5"
  ink: "#111111"
  chrome: "#0d0d0d"
  footer-black: "#000000"
  muted: "#5a5a5a"
  brass: "#b08d57"
  brass-deep: "#84652f"
  line: "rgb(0 0 0 / 0.12)"
  error: "#b4472f"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "0"
    fontVariation: "wdth 118"
  display-hero:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.9vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "0"
    fontVariation: "wdth 118"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.08
    fontVariation: "wdth 118"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    letterSpacing: "0.1em"
    fontVariation: "wdth 112"
rounded:
  photo: "4px"
  field: "6px"
  panel: "6px"
  pill: "999px"
spacing:
  topbar: "40px"
  gutter-sm: "20px"
  gutter-md: "32px"
  section-sm: "96px"
  section-md: "128px"
  rail-inset: "128px"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "0 25.6px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 25.6px"
    height: "48px"
  field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
    height: "50px"
  top-bar:
    backgroundColor: "{colors.chrome}"
    textColor: "{colors.canvas}"
    height: "40px"
  footer:
    backgroundColor: "{colors.footer-black}"
    textColor: "{colors.canvas}"
  provenance-sheet:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  carousel-photo:
    backgroundColor: "{colors.sunken}"
    rounded: "{rounded.photo}"
---

# Design System: Starbell Auto

## Overview

**Creative North Star: "The Open File"**

Starbell shows its working. The system is a white page under a thin black bar, with large photography, extended uppercase headlines, and a single repeated gesture: a thin circle that fills. The ring marks time on the hero slideshow, progress through a chapter on the left rail, the current card in a carousel, and the disc on every text link. Nothing else competes with it for the role of signature.

The build is a Persuade surface for a dealer. It borrows structure from Ferrari (numbered chapters, a model bar, a left dot rail, "Discover (>)" links), Joe Macari (a peeking carousel of studio photographs) and Porsche (black footer link columns), and drops their ornament. Colour is almost absent: white, a near-black, one grey for secondary text, and brass in four narrow places. Photography carries the warmth.

The vehicle page is a sequence of numbered chapters: Provenance, Design, Interior, Performance, Import journey, Gallery, Enquire. The home page is a full-screen ring-timer slideshow, a peeking carousel, two photographic tiles, a five-stage journey and a list of previous sales. Both alternate white, black and photographic bands.

**Key Characteristics:**
- Pure white body (#ffffff) with black chrome; the only off-white is a neutral grey (#f5f5f5) used as a sunken band and photo placeholder.
- Extended, uppercase, medium-weight Archivo for every headline; Hanken Grotesk for everything read.
- Progress rings are the one signature device; brass is a rare accent.
- Pill buttons, 4px photographs, 6px document cards.
- Motion is slow and eased out; every animation has a reduced-motion fallback.

## Colors

A white-and-black palette with neutral greys and one restrained brass accent. Restrained strategy: tinted neutrals do not exist here; the neutrals are true greys.

### Primary
- **Ink** (#111111): body text, headlines on white, solid button fill, selection background.
- **Chrome Black** (#0d0d0d): the 40px top bar and the mobile menu sheet; also the browser theme colour.
- **Footer Black** (#000000): the footer, photographic tiles and slide backdrops.

### Secondary
- **Brass** (#b08d57): chapter numbers, the active nav underline (22px by 2px), and the keyboard focus outline (2px, 3px offset). Also the current-step halo (35% alpha) in the journey.
- **Brass Deep** (#84652f): the verified check mark in the provenance file and the text caret. The darker value exists because brass fails contrast as small text on white.

### Neutral
- **Canvas White** (#ffffff): page background, field fill, provenance sheet.
- **Sunken Grey** (#f5f5f5): the gallery and home journey bands, photo placeholders, form success panel.
- **Muted Grey** (#5a5a5a): secondary copy, statuses, labels on white.
- **Hairline** (rgb(0 0 0 / 0.12)): dividers, panel borders. Raised to 45% under `prefers-contrast: more`.
- **Error Rust** (#b4472f; text variant #a8402c): invalid field border and error text.

### Named Rules
**The Brass Budget Rule.** Brass appears only as chapter numbers, the nav underline, focus outlines, journey current-step halo and (as brass-deep) verified checks. It never fills a button, a background or a headline.

**The True White Rule.** Pages are #ffffff. No cream, no warm off-white; the one lighter-than-ink band is neutral grey (#f5f5f5).

## Typography

**Display Font:** Archivo variable with the width axis (with system-ui fallback)
**Body Font:** Hanken Grotesk (with system-ui fallback)
**Label Font:** Archivo at a narrower stretch, tracked

**Character:** Archivo stretched to 118% width in uppercase reads as engineered and calm, not shouty, because weight stays at 500 and letter-spacing at 0. Hanken Grotesk keeps long copy plain and legible.

### Hierarchy
- **Display hero** (500, clamp(2rem, 4.9vw, 4.5rem), 1.08): the slideshow headline only. Vehicle cover title is a step down at clamp(1.7rem, 4.2vw, 3.6rem).
- **Display section** (500, clamp(1.6rem, 3.2vw, 2.8rem), 1.08): every section h2 on home and vehicle pages.
- **Tile headline** (500, clamp(1.5rem, 2.8vw, 2.4rem)): the two-up tiles.
- **Title** (500, 0.95rem to 1rem uppercase, snug): carousel card names; 1.125rem to 1.5rem for previous-sales and journey stage names.
- **Body** (400, 1.0625rem, 1.55): running copy, capped at 62ch via the measure class. Secondary copy is Muted Grey at 1rem to 1.125rem.
- **Label** (500, 0.8rem, 0.1em tracking, uppercase, 112% width): nav, button text on ring links, fact keys, chapter tags, model bar actions.
- **Wordmark**: Archivo uppercase, "Starbell" semibold plus "Auto" light at 70% opacity; tracking 0.2em at 0.8rem in the bar, 0.16em at 1.7rem in the footer.

### Named Rules
**The Stretch Rule.** Display type is always Archivo at width 112 to 118, uppercase, weight 500, tracking 0 (labels excepted). Mixed-case display is available only through an explicit opt-out class and is not used on a page today.

**The Lining Numerals Rule.** Body sets lining numerals; prices, kilometres, dates and facts use tabular lining numerals.

## Layout

Content sits in a 1600px maximum container with 20px side gutters, 32px from the medium breakpoint. On large screens, section content on the home and vehicle pages is indented (96px or 128px left) to clear the fixed left dot rail. Vertical rhythm is generous and repeated: sections pad 96px (mobile) or 112 to 128px (desktop) top and bottom, with 56px gaps inside stacked grids and 96px between two-column halves at large widths. Two-column chapter layouts use unequal fractions (0.9/1.1, 1.25/0.75, 0.8/1.2) and alternate which side carries the image.

The top bar is fixed at 40px and the page body starts under it. The vehicle page adds a sticky 56px model bar below the bar. The home hero fills the viewport minus the bar (minimum 560px); the vehicle cover fills the viewport minus bar and model bar (minimum 520px). Responsive behaviour: nav collapses to a Menu button and a full-height black sheet below 768px; the left rail appears from 1024px; the carousel shows 78%, 44% and 29% card widths at the three breakpoints so the next card always peeks.

## Elevation & Depth

Flat by default, with tonal bands (white, grey, black, photograph) doing the separating work. Hairline borders define panels. Depth appears in three places only.

### Shadow Vocabulary
- **Document sheet** (`0 30px 70px -40px rgb(17 18 20 / 0.35), 0 1px 2px rgb(17 18 20 / 0.05)`): the provenance sheet on white.
- **Glass card** (`0 1px 0 rgb(255 255 255 / 0.9) inset, 0 24px 60px -24px rgb(0 0 0 / 0.35), 0 2px 6px rgb(0 0 0 / 0.06)`): the translucent provenance variant over photography (backdrop blur 28px, saturate 180%).
- **Material bar** (white at 78%, blur 22px, saturate 180%): the sticky model bar. Both materials fall back to solid white under `prefers-reduced-transparency`.

### Named Rules
**The Flat Page Rule.** Cards on white get a hairline, not a shadow; only the provenance sheet is lifted, because it is the product.

**The Scrim Rule.** Text over photography sits on a bottom-weighted black gradient scrim (to-top, black 70 to 90% fading to 10 to 20%), never on a flat overlay.

## Shapes

Round things are circles, photographs are nearly square, documents are soft. Buttons are full pills (999px). Ring discs, rail dots, arrow buttons and social icons are circles (40 to 44px). Carousel and chapter photographs have a 4px radius, as does the enquiry form container. Fields have a 6px radius, matching the document cards. Document and form cards (provenance sheet, glass variant, form success panel) have a 6px radius. Photographs are 4px everywhere, including the stock listing. Selection chips on the source form are full pills.

## Components

### Buttons
- **Shape:** full pill (999px), 48px minimum height, 25.6px horizontal padding, 500 weight, 0.97rem.
- **Solid:** Ink fill with white text; hover lightens to #2b2b2b.
- **Ghost:** transparent, 25% black border; hover darkens the border to ink and adds a 4% black tint.
- **States:** press scales to 0.97 in 140ms; disabled drops to 55% opacity; hover rules only apply on hover-capable pointers.
- Solid buttons are used for form submit and success actions. Navigation and enquiry links on content surfaces use the ring link, not a button.

### Ring Link (signature)
A tracked uppercase label followed by a 40px circular disc (1.5px current-colour border) holding a 14px chevron. On hover the disc fills with the text colour and the chevron flips to the surface colour (set per use: #fff on white, #000 or #0d0d0d on dark). Used for every "Discover", "Read the file", "WhatsApp us" and "View all stock" link. Inside tiles and slides the link stretches an invisible pseudo-element across the whole card.

### Progress Ring
SVG circle, 1.5 to 1.6px stroke, round caps, track at 28% opacity, fill starting at 12 o'clock. Three modes: timer (hero slideshow, 30px, 7s linear, pauses with the slideshow), scroll-linked (rail, 26px), static full (current carousel card, 24px). Always decorative; real text carries meaning. A 4px dot sits in the middle of the active ring.

### Top Bar and Navigation
Fixed 40px Chrome Black strip with the wordmark left and labels in white at 82% opacity. The nav link has a 22px by 2px brass underline that grows from the left over 300ms on hover and stays on for the current page. WhatsApp and phone sit right. Below 768px a Menu or Close label opens a full-height black sheet whose items are display type 1.5rem with hairline dividers.

### Dot Rail
Fixed left rail (1024px and up) of 4px dots, 26px rows. The current section becomes a ring that fills with scroll progress; its number, a short rule and its title slide out for 2.6 seconds after a change, or on hover and focus. It uses mix-blend-mode difference so it reads on white, black and photography, and fades out as the footer approaches.

### Chapter Tag
A number in brass, a 56px hairline rule, and an uppercase label ("2 ---- DESIGN"). Used only above chapter headings on the vehicle page, in step with the rail. It is the single permitted eyebrow, and only because the chapter number is real navigation.

### Hero Slideshow
Full-bleed photograph, 9s slow zoom (1 to 1.07), 700ms crossfade, uppercase headline at the lower left with a ring link, ring indicators and a pause control at the bottom. Swipe and arrow keys move slides. Slide kickers exist in markup as screen-reader text only.

### Peeking Carousel
Snap-scrolling track of 4:3 photographs at 4px radius, uppercase name, price (500 weight) and Muted Grey status beneath. Controls are ring indicators plus two 44px circular arrow buttons that fill ink on hover. Images scale to 1.04 over 700ms on hover.

### Provenance Sheet (signature)
A definition list in a 6px-radius bordered sheet: label (Muted Grey), value, and a status that reads "Verified" with a brass-deep check or "Pending" in muted text. Ends with a "Noted on inspection" line naming one imperfection. A glass variant floats over photography with four lines.

### Fields
50px minimum height, 1px 20% black border, 6px radius, white fill. Focus replaces the border with ink and adds a 4px 8% black ring (the global brass outline is suppressed on fields). Invalid fields take the rust border with an inline alert message below. Labels sit above in small Muted Grey type.

### Footer
Solid black. A scroll-up control, region line, three link columns (grey 60% column title, 1.05rem white links that dim to 65% on hover), an address block, four 44px circular contact icons with a 25% white border, legal line, a demonstration-build disclaimer, and a large wordmark closing the page. Icons are Lucide line icons at 1.6 stroke.

### Journey
Five stages as an ordered list: a 14px dot (filled ink when reached, hollow at 25% when not), a hairline connector, display-type stage name and a muted place line. The current stage gains a brass halo. Vertical on mobile, horizontal at 768px.

## Do's and Don'ts

### Do:
- **Do** use the ring for anything that tracks time, position or progress, and as the disc on text links. It is the one signature device.
- **Do** keep pages #ffffff with black bands (#0d0d0d bar, #000 footer and tiles) and photography doing the colour.
- **Do** set every headline in Archivo at 118% width, uppercase, 500 weight, tracking 0.
- **Do** use pill buttons (999px) and 4px radius on photographs; use 6px only for document and form cards (provenance sheet, success panel).
- **Do** place text over photography on a bottom-weighted black gradient scrim.
- **Do** use `--ease-out-strong` (cubic-bezier(0.23, 1, 0.32, 1)) for entrances and hovers: 140ms press, 200 to 300ms state changes, 700ms reveal and image scale, 800 to 900ms rise and float-in, 1.6s settle.
- **Do** give every animation a `prefers-reduced-motion` branch, and gate hover effects behind `(hover: hover) and (pointer: fine)`.
- **Do** keep real text next to every ring and icon so meaning never depends on the graphic.

### Don't:
- **Don't** use gradient text, glass cards on white, or coloured shadows.
- **Don't** use a warm or cream off-white anywhere; the lighter band is neutral grey.
- **Don't** put an eyebrow above a headline that is not a numbered chapter. Chapter tags are tied to the rail; home-page and listing headlines have none.
- **Don't** fill buttons, backgrounds or headlines with brass, and don't use brass as small text on white (use brass-deep).
- **Don't** introduce a second signature device (dividing ornaments, badges, bespoke icons) beside the ring.
- **Don't** use a classifieds grid of equal cards with price badges; stock is shown through the peeking carousel and the chapters.
- **Don't** use mixed-case display type, positive display tracking or weights above 500 on headlines.

### Known limits and carried defects (not canonized)
- All vehicle details, prices and provenance entries are sample content, and the photographs are illustrative images of the models, not the cars described. The footer, gallery and provenance sheet say so.
- No video exists yet; the slideshow supports an optional muted looping MP4 with the image as poster, and none is supplied.
- Chapter numbers use brass (#b08d57) as 0.8rem text on white, which is roughly 3:1 contrast; this is a defect the build carries. On black it is acceptable; on white, move to brass-deep.
- The mobile menu shows a typed arrow character as a link glyph; new surfaces should use the SVG chevron used elsewhere.
- Slide kickers are retained as screen-reader-only text; the visible kicker pattern is not part of the system.
- Hero and vehicle cover use a Tailwind gradient scrim, and the `rise`, `settle` and `float-in` classes remain from an earlier hero; they are in use on the vehicle cover but should not be extended.
