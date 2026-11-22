# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js 15 (App Router), React 19, Tailwind 4, TypeScript. Content is Prismic-driven (repository `xcgt84rk`, locked in `prismicio.ts`): the homepage is a slice zone, brands carry their own top picks and per-body-type images. Newsletter sign-ups go to MongoDB (or `data/subscribers.json` when `MONGODB_URI` is unset) and a simple SMTP welcome mail. Deploy target: Vercel.

## Users
Vehicle buyers in Zimbabwe, mostly Harare: private buyers, executives and fleet or business customers choosing between several brands (premium Mercedes-Benz, Jeep and Alfa Romeo; value and tech brands GWM, Haval and Mitsubishi; commercial FUSO, Freightliner and Mercedes-Benz Trucks). They arrive from search, social media and WhatsApp, mostly on a phone, and want to find the right brand and body type quickly, then talk to a person.

## Product Purpose
Zimoco is the official distributor of Mercedes-Benz, Jeep, Chrysler, Dodge, Fiat, Alfa Romeo, GWM, Haval, Mitsubishi, FUSO and Freightliner in Zimbabwe. The site's job is to let a visitor pick a brand, see its best vehicles and body types, and move to a quote, test drive or WhatsApp conversation. Success: quote requests, test-drive bookings, newsletter sign-ups and WhatsApp clicks.

## Positioning
One multi-brand house, presented with the calm, premium clarity of a Mercedes-Benz retail site: a brand selector in the page flow, big photography, light type. Zimoco is the sole authorised distributor, so the site leads with official range and service rather than discounts.

## Operating Context
Details from zimoco.co.zw (checked 21 Nov 2026), kept in `lib/site.ts`:
- Head office and workshop: 24 Douglas Road, Workington, Harare.
- Showrooms: Sam Levy's Village, Borrowdale; Harare Showgrounds (Gate 4, Rekayi Tangwena Ave). Service: Pomona Service Centre.
- Phone +263 8677 010153 (also +263 867 701 0545); WhatsApp +263 772 589 624. Sales hours Mon to Thu 08:00 to 17:00, Fri 08:00 to 16:00.
- No public email on the site: `info@zimoco.co.zw` is a placeholder to confirm.
- Social: Facebook ZIMOCOzimbabwe, Instagram zimoco_zimbabwe, YouTube @ZIMOCO_Zimbabwe, X Zimoco_Zimbabwe.

## Capabilities and Constraints
- Demo build: vehicles, prices and images are placeholders until Zimoco supplies real stock and press images. Editors replace them in Prismic.
- Brand imagery and the Mercedes-Benz-inspired layout are for demonstration; MBCorpo is licensed, so Inter Tight and Inter are used.
- Lead capture: WhatsApp click-to-chat, quote and enquiry forms stored server-side, newsletter list.
- Using Zimoco's name and logo for a prospect demo: confirm with the client before any public launch.

## Brand Commitments
Name: Zimoco. Logo: `public/zimoco-logo-white.png` (white on black). Accent: light blue. Voice: confident, clear, helpful, plain English; never hype.

## Evidence on Hand
No testimonials, sales counts or awards supplied. The zimoco.co.zw testimonial and team sections are template placeholders: do not reuse them.

## Product Principles
1. Brand first: the pill bar steers Top Picks and Our Models, so a buyer sees only what applies to the brand they chose.
2. Everything editable: copy, CTAs, images and order live in Prismic, not in code.
3. One next step on every screen: quote, test drive or WhatsApp.
4. Fast on a phone over mobile data first.
