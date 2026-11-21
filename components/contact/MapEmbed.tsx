"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { directionsUrl, mapEmbedUrl, site } from "@/lib/site";

/** Photo placeholder first; the Google map only loads when asked, to save mobile data. */
export default function MapEmbed() {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sunken md:aspect-[16/10]">
      {on ? (
        <iframe title="Zimoco on Google Maps" src={mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <>
          <Image src="/site/contact/harare-avenue.jpg" alt="A Harare avenue in morning light" fill sizes="(min-width:1024px) 60vw, 100vw" quality={78} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 text-white sm:flex-row sm:items-end sm:justify-between md:p-7">
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0" aria-hidden />
              <span><span className="display block text-lg">Mount Pleasant, Harare</span><span className="text-white/80">{site.address}</span></span>
            </p>
            <button type="button" onClick={() => setOn(true)} className="btn bg-white text-ink">Load interactive map</button>
          </div>
        </>
      )}
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-red absolute right-4 top-4 !min-h-11 !text-sm shadow-lg">
        <Navigation className="h-4 w-4" aria-hidden /> Get directions
      </a>
    </div>
  );
}
