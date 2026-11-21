import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { directionsUrl, site, whatsappLink } from "@/lib/site";
import OpenStatus from "@/components/contact/OpenStatus";
import EnquiryForm from "@/components/contact/EnquiryForm";
import MapEmbed from "@/components/contact/MapEmbed";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact Zimoco, Mount Pleasant, Harare",
  description: "Visit Zimoco on Norfolk Road, Mount Pleasant. Book a viewing, send an enquiry, call, email or message on WhatsApp.",
  alternates: { canonical: "/contact" },
};

const cards = [
  { Icon: Phone, label: "Call", value: site.phoneDisplay, href: `tel:${site.phoneTel}` },
  { Icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { Icon: MapPin, label: "Visit", value: site.address, href: directionsUrl, external: true },
];

export default function Contact() {
  return (
    <>
      <section className="relative isolate flex min-h-[68svh] items-end overflow-hidden bg-chrome text-white md:min-h-[72svh]" aria-labelledby="contact-h">
        <Image src="/site/contact/viewing-handover.jpg" alt="A consultant handing paperwork through a car window to a customer in a showroom" fill priority sizes="100vw" quality={80} className="hero-zoom -z-20 object-cover object-[50%_30%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        <div className="mx-auto w-full max-w-[1280px] px-5 pb-12 pt-32 md:px-10 md:pb-16">
          <p className="label rise text-white/80">Contact</p>
          <h1 id="contact-h" className="display rise rise-2 mt-3 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)]">Talk to a consultant</h1>
          <p className="rise rise-3 mt-4 max-w-xl text-lg text-white/80">Visit us in Mount Pleasant, or tell us what you are looking for and we will come back to you.</p>
          <div className="rise rise-3 mt-7 flex flex-wrap items-center gap-3">
            <a href={whatsappLink("Hello Zimoco, I would like to enquire about a vehicle.")} className="btn btn-red"><MessageCircle className="h-5 w-5" aria-hidden /> Message on WhatsApp</a>
            <a href={`tel:${site.phoneTel}`} className="btn border-white/40 text-white hover:bg-white/10"><Phone className="h-5 w-5" aria-hidden /> Call us</a>
            <OpenStatus />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12">
          <Reveal><EnquiryForm /></Reveal>

          <Reveal delay={80} className="flex flex-col gap-4">
            <ul className="grid gap-3">
              {cards.map(({ Icon, label, value, href, external }) => (
                <li key={label}>
                  <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-4 rounded-2xl bg-soft p-5 transition-[border-color,transform] duration-200 active:scale-[0.98] hover:border-ink">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-soft text-red transition-colors group-hover:bg-red group-hover:text-white"><Icon className="h-5 w-5" aria-hidden /></span>
                    <span><span className="label block text-muted">{label}</span><span className="text-lg">{value}</span></span>
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-4 rounded-2xl bg-soft p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-soft text-red"><Clock className="h-5 w-5" aria-hidden /></span>
                <span><span className="label block text-muted">Hours</span><span className="text-lg">{site.hours}</span></span>
              </li>
            </ul>
            <div className="relative min-h-60 flex-1 overflow-hidden rounded-2xl">
              <Image src="/site/contact/keys-handshake.jpg" alt="Handshake and key handover at a dealership" fill sizes="(min-width:1024px) 30vw, 100vw" quality={78} className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute inset-x-5 bottom-5 display text-lg text-white">Keys in your hand, paperwork in order.</p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <p className="label text-red">Find us</p>
          <h2 className="display mt-3 text-[clamp(1.6rem,3.2vw,2.6rem)]">Norfolk Road, Mount Pleasant</h2>
          <div className="mt-8"><MapEmbed /></div>
          <p className="mt-4 text-sm text-muted">Listing details as shown on our public profile. Please call before a long drive.</p>
        </Reveal>
      </div>
    </>
  );
}
