---
name: Zimoco
description: A multi-brand Harare distributor site. Black chrome, white pages, light headlines, and one light-blue accent. A pill brand selector steers the page.
colors:
  canvas: "#ffffff"
  sunken: "#f5f5f5"
  ink: "#111111"
  chrome: "#000000"
  muted: "#5a5a5a"
  accent: "#0078d6"
  accent-deep: "#0260ab"
  sky: "#00adef"
  sky-soft: "#e6f6fd"
  line: "rgb(0 0 0 / 0.12)"
  error: "#b4472f"
typography:
  display:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3.4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  display-hero:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.6vw, 5rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.97rem"
    fontWeight: 500
rounded:
  card: "32px"
  button: "999px"
  field: "6px"
  focus: "4px"
  pill: "999px"
spacing:
  topbar: "56px"
  gutter-sm: "20px"
  gutter-md: "32px"
  section: "80px"
components:
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.button}"
    height: "48px"
  brand-pill:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
  top-bar:
    backgroundColor: "{colors.chrome}"
    textColor: "{colors.canvas}"
    height: "56px"
  footer:
    backgroundColor: "{colors.chrome}"
    textColor: "{colors.canvas}"
---

# Design System: Zimoco

## Overview

**Creative North Star: "One House, Many Marques"**

Zimoco distributes many brands, so the page lets the visitor pick one and then reshapes itself around that choice. A wide white pill bar sits over the bottom of the hero video, then docks under the header as you scroll. It drives two sections: Top Picks (a bento grid) and Our Models (body types with that brand's images). The look borrows from the Mercedes-Benz retail site: black chrome, white pages, large photography, light display type and fully round buttons and soft 2rem cards. The licensed MBCorpo face is replaced by Inter Tight and Inter.

## Colors

- **Chrome Black** (#000000): header, footer, browse strip, hero scrims.
- **Canvas** (#ffffff) and **Sunken** (#f5f5f5): page and alternating bands. True neutrals.
- **Ink** (#111111) and **Muted** (#5a5a5a): text.
- **Accent** (#0078d6): button fill and links on white (white text on it passes contrast). **Accent Deep** (#0260ab): link text, eyebrows, hover.
- **Sky** (#00adef): the light blue highlight. Used for the active brand pill, nav hover, kicker text on dark and focus rings. Always paired with black or ink text, never white (fails contrast).
- **Sky Soft** (#e6f6fd): image placeholder tint and tile hover.

**The One Blue Rule.** Blue is the only chromatic colour. Red and brass from the earlier build are gone.

## Typography

- **Display:** Inter Tight, weight 400 (hero 300), tracking -0.02em, sentence case. Light headlines are the Mercedes signature.
- **Body:** Inter, 17px, 1.55, capped at 62ch.
- **Label:** Inter 600, 0.78rem, uppercase, 0.08em tracking, for kickers, eyebrows and the nav.
- **Button:** Inter 500, 0.97rem, sentence case.

## Layout

1600px maximum container, 20px gutters (32px from md), 80px section padding. Header is a fixed 56px black bar; the home hero fills the viewport behind it with copy and buttons on the left. Top Picks is a 3-column bento: the first tile spans two columns, the rest one each, giving a 2/3 + 1/3 row then three-up. Our Models is a three-up grid of 16:9 cards (image top, name centred beneath). Home sections alternate white, sunken, black.

## Elevation & Depth

Flat with tonal bands. Only the brand pill bar is lifted (soft shadow, stronger once docked). Text over photography always sits on a bottom-weighted black gradient (to-top, black 85% to 0%).

## Shapes

Buttons and the brand pill bar are fully round (999px). Cards, bento tiles and image panels use a large 2rem radius for a soft, clean look. Fields: 6px. Keyboard focus outlines: 4px.

## Components

- **Accent button:** #0078d6 fill, white text, 48px high, fully round. Press scales to 0.97 in 140ms. Hover deepens to Accent Deep.
- **Secondary on dark:** transparent with a 70% white border.
- **Brand pill bar:** `role=tablist`; selected pill is Sky with black text, others ink at 70% with a Sky Soft hover. Scrolls sideways on small screens. Active brand is shared via `lib/brand-store.ts`.
- **Bento tile:** image fills the tile, scrim at the bottom 60%, subtitle, light 24 to 36px title and a "→" link line; image scales 3% on hover over 700ms.
- **Category card:** hairline border, image on a Sky Soft to Sunken gradient, name centred beneath.
- **Service tile:** hairline card, 28px line icon, title and blurb; hover tints Sky Soft.
- **Newsletter field:** underline only on black, Subscribe as an accent button.

## Motion

Eased out (cubic-bezier(.23,1,.32,1)); panel swaps use a 220ms fade-up (`panel-in`); hero slides cross-fade over 700ms and pause on hover; every animation falls back under `prefers-reduced-motion`.

## Do's and Don'ts

- Do keep all copy, CTAs, images and order in Prismic.
- Do pair Sky with dark text; use Accent for anything with white text.
- Don't add a second hue, rings or circular progress devices (the old Starbell signature).
- Don't put text over photography without the gradient scrim.
