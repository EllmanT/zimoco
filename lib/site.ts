// Details come from zimoco.co.zw (contact page, checked 21 Nov 2026). Email is not published there: confirm with the client.
export const site = {
  name: "Zimoco",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zimoco-demo.vercel.app",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@zimoco.co.zw",
  phoneDisplay: "+263 8677 010153",
  phoneTel: "+2638677010153",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "263772589624",
  address: "24 Douglas Road, Workington, Harare",
  hours: "Monday to Thursday 08:00 to 17:00, Friday 08:00 to 16:00",
  social: {
    facebook: "https://www.facebook.com/ZIMOCOzimbabwe",
    twitter: "https://twitter.com/Zimoco_Zimbabwe",
    instagram: "https://www.instagram.com/zimoco_zimbabwe/",
    youtube: "https://www.youtube.com/@ZIMOCO_Zimbabwe",
  },
};

export const locations = [
  { name: "Harare Showgrounds", detail: "ZIMOCO Gate 4, Rekayi Tangwena Ave, Harare", note: "Commercial and passenger vehicle sales, parts, service" },
  { name: "Borrowdale Showroom", detail: "Sam Levy's Village, Design Quarter 131, ED Mnangagwa Road, Highlands, Harare", note: "Passenger vehicle showroom" },
  { name: "Head Office and Workshop", detail: "24 Douglas Road, Workington, Harare", note: "Head office, workshop and body repair centre" },
  { name: "Pomona Service Centre", detail: "Stand 489 Vainona, Pomona Commercial Centre Unit 1, Pomona, Harare", note: "Service (Mon to Fri 08:00 to 17:00, Sat 08:00 to 13:00)" },
] as const;

/** Opening times in Africa/Harare (UTC+2, no daylight saving). Sales: Mon to Thu 08:00 to 17:00, Fri 08:00 to 16:00. The booking slots use the shorter, safe window. */
export const openingHours = { timeZone: "Africa/Harare", days: [1, 2, 3, 4, 5], open: "08:00", close: "16:00", slotMinutes: 30 } as const;

export const mapQuery = "Zimoco, 24 Douglas Road, Workington, Harare, Zimbabwe";
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
