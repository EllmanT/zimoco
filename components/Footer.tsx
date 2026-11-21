import Image from "next/image";
import Link from "next/link";
import { Facebook, Mail, MessageCircle, Phone } from "lucide-react";
import ScrollUp from "./ScrollUp";
import { site, whatsappLink } from "@/lib/site";
import { getCatalogue } from "@/lib/prismic/catalogue";

const makeColumns = (brands: string[]) => [
  { title: "Showroom", links: [{ href: "/showroom", label: "All vehicles" }, { href: "/compare", label: "Compare vehicles" }, { href: "/find-my-car", label: "Find my car" }] },
  { title: "Brands", links: brands.slice(0, 5).map((b) => ({ href: `/showroom?brand=${encodeURIComponent(b)}`, label: b })) },
  { title: "Company", links: [{ href: "/about", label: "About Zimoco" }, { href: "/contact", label: "Contact and showroom" }, { href: "/credits", label: "Image credits" }] },
];

const social = [
  { href: "https://www.facebook.com/starbellselect/", label: "Facebook", Icon: Facebook },
  { href: whatsappLink("Hello Zimoco"), label: "WhatsApp", Icon: MessageCircle },
  { href: `mailto:${site.email}`, label: "Email", Icon: Mail },
  { href: `tel:${site.phoneTel}`, label: "Call", Icon: Phone },
];

export default async function Footer() {
  const { brands } = await getCatalogue();
  const columns = makeColumns(brands);
  return (
    <footer className="bg-black pb-24 text-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-8 pt-14 md:px-8">
        <ScrollUp />
        <div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <Image src="/starbell-auto-logo-footer-v2.png" alt="Zimoco" width={620} height={402} className="h-28 w-auto" />
            <p className="mt-5 max-w-xs text-white/65">Your digital showroom. Explore, configure, compare, and request a quote.</p>
            <p className="mt-5 text-white/65">{site.address}<br />{site.hours}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-base text-white/60">{col.title}</h2>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-[1.05rem] transition-colors hover:text-red">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ul className="mt-14 flex flex-wrap items-center gap-4" aria-label="Contact channels">
          {social.map(({ href, label, Icon }) => (
            <li key={label}>
              <a href={href} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-colors hover:border-red hover:bg-red"><Icon size={18} aria-hidden /></a>
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
