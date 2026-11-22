"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { useRfq } from "./RfqProvider";

const nav = [
  { href: "/showroom", label: "Showroom" },
  { href: "/find-my-car", label: "Find my car" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function TopBar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const rfq = useRfq();
  // On the home page the bar floats over the hero video (transparent, dark at the top fading out) until you scroll past it.
  const [pastHero, setPastHero] = useState(false);
  const overlay = path === "/" && !pastHero && !open;
  useEffect(() => {
    const on = () => setPastHero(window.scrollY > window.innerHeight - 96);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  const active = (href: string) => (path === href || path.startsWith(href + "/") ? "page" : undefined);

  return (
    <>
      <header data-overlay={overlay} className={`fixed inset-x-0 top-0 z-50 h-14 transition-[background-color,color,border-color,box-shadow] duration-300 ease-out ${overlay ? "border-b border-transparent bg-transparent text-white" : "border-b border-white/10 bg-black text-white"}`}>
        {/* Eased scrim that fades out well below the bar, so there is no visible edge where the bar ends. */}
        <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-28 transition-opacity duration-300 ${overlay ? "opacity-100" : "opacity-0"}`} style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.42) 22%, rgba(0,0,0,0.26) 45%, rgba(0,0,0,0.11) 70%, rgba(0,0,0,0.03) 88%, rgba(0,0,0,0) 100%)" }} />
        <div className="relative mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 rounded-sm" aria-label="Zimoco home">
              <Image src="/zimoco-logo-white.png" alt="" width={333} height={152} className="h-9 w-auto" priority />
            </Link>
            <nav aria-label="Primary" className="label hidden items-center gap-8 lg:flex">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} aria-current={active(n.href)} className="nav-link">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href={whatsappLink("Hello Zimoco, I would like to enquire about a vehicle.")} className={`label hidden transition-colors hover:text-accent md:inline ${"text-white/90"}`}>WhatsApp</a>
            <button type="button" onClick={() => rfq.open()} className="btn btn-accent !min-h-10 !px-5 !text-sm">Request a quote</button>
            <button type="button" className="label inline-flex h-10 items-center lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" hidden={!open} className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-black px-5 pb-10 pt-6 text-white lg:hidden">
        <nav aria-label="Mobile">
          <ul>
            {nav.map((n) => (
              <li key={n.href} className="border-b border-white/15">
                <Link href={n.href} aria-current={active(n.href)} className="display flex items-center justify-between py-5 text-2xl aria-[current=page]:text-accent">
                  {n.label}
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 grid gap-4">
          <button className="btn btn-accent" onClick={() => { setOpen(false); rfq.open(); }}>Request a quote</button>
          <a className="btn btn-ghost !border-white/40 !text-white" href={whatsappLink("Hello Zimoco, I would like to enquire about a vehicle.")}>WhatsApp us</a>
          <a href={`tel:${site.phoneTel}`} className="text-center text-muted">{site.phoneDisplay}</a>
        </div>
      </div>
    </>
  );
}
