"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { useCompare } from "./CompareProvider";

/** Floating WhatsApp (all sizes). Sits above the compare tray when it is showing. */
export default function FloatingActions() {
  const path = usePathname();
  const { slugs } = useCompare();
  if (path.startsWith("/admin")) return null;
  const lift = slugs.length > 0 && !path.startsWith("/compare");
  return (
    <a
      href={whatsappLink("Hello Zimoco, I would like to enquire about a vehicle.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg transition-[bottom,transform] duration-200 active:scale-95 md:right-6 ${lift ? "bottom-24" : "bottom-5"}`}
    >
      <MessageCircle size={26} aria-hidden />
    </a>
  );
}
