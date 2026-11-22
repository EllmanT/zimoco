import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle, Phone, Youtube } from "lucide-react";
import ScrollUp from "./ScrollUp";
import NewsletterForm from "./NewsletterForm";
import { site, whatsappLink } from "@/lib/site";
import { getHomeBrands } from "@/lib/prismic/home";

const makeColumns = (brands: string[]) => [
  { title: "Showroom", links: [{ href: "/showroom", label: "All vehicles" }, { href: "/find-my-car", label: "Find my car" }] },
  { title: "Brands", links: brands.slice(0, 9).map((b) => ({ href: `/showroom?brand=${encodeURIComponent(b)}`, label: b })) },
  { title: "Company", links: [{ href: "/about", label: "About Zimoco" }, { href: "/contact", label: "Contact and showroom" }, { href: "/credits", label: "Image credits" }] },
];

const social = [
  { href: site.social.facebook, label: "Facebook", Icon: Facebook },
  { href: site.social.instagram, label: "Instagram", Icon: Instagram },
  { href: site.social.youtube, label: "YouTube", Icon: Youtube },
  { href: whatsappLink("Hello Zimoco"), label: "WhatsApp", Icon: MessageCircle },
  { href: `mailto:${site.email}`, label: "Email", Icon: Mail },
  { href: `tel:${site.phoneTel}`, label: "Call", Icon: Phone },
];

export default async function Footer() {
  const columns = makeColumns((await getHomeBrands()).map((b) => b.name));
  return (
    <footer className="bg-black pb-24 text-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-8 pt-14 md:px-8">
        <div className="grid gap-8 border-b border-white/15 pb-12 md:grid-cols-2 md:items-end">
          <div>
            <h2 className="display text-[clamp(1.6rem,3vw,2.6rem)]">Stay in the loop</h2>
            <p className="mt-3 max-w-md text-white/70">New arrivals, offers and news from Zimoco, straight to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>
        <ScrollUp />
        <div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <Image src="/zimoco-logo-white.png" alt="Zimoco" width={333} height={152} className="h-16 w-auto" />
            <p className="mt-5 max-w-xs text-white/65">Official distributor of Mercedes-Benz, Jeep, Fiat, Alfa Romeo, GWM, Haval, Mitsubishi, FUSO and Freightliner in Zimbabwe.</p>
            <p className="mt-5 text-white/65">{site.address}<br />{site.phoneDisplay}<br />{site.hours}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-base text-white/60">{col.title}</h2>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-[1.05rem] transition-colors hover:text-sky">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ul className="mt-14 flex flex-wrap items-center gap-4" aria-label="Contact channels">
          {social.map(({ href, label, Icon }) => (
            <li key={label}>
              <a href={href} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-colors hover:border-sky hover:bg-sky hover:text-black"><Icon size={18} aria-hidden /></a>
            </li>
          ))}
        </ul>
        <div className="mt-12 border-t border-white/15 pt-6 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Zimoco. All rights reserved.</p>
          <p className="mt-3 max-w-3xl">Prices and specifications shown are indicative. Availability and final pricing are confirmed in your quote. Images are illustrative and may show vehicles or options that differ from the unit supplied.</p>
        </div>
      </div>
    </footer>
  );
}
