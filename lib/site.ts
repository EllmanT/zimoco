// Public details come from listings found online (2 Nov 2026) and MUST be verified with the client.
export const site = {
  name: "Zimoco",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zimoco-demo.vercel.app",
  email: "zim@starbellauto.com",
  phoneDisplay: "+263 77 226 2946",
  phoneTel: "+263772262946",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "263772262946",
  address: "Norfolk Road, Mount Pleasant, Harare",
  hours: "Monday to Friday, 08:30 to 16:30",
};

/** Opening times in Africa/Harare (UTC+2, no daylight saving). Keep in step with `site.hours`. */
export const openingHours = { timeZone: "Africa/Harare", days: [1, 2, 3, 4, 5], open: "08:30", close: "16:30", slotMinutes: 30 } as const;

export const mapQuery = "Zimoco, Norfolk Road, Mount Pleasant, Harare, Zimbabwe";
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
