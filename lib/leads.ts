import { z } from "zod";

export const LEAD_TYPES = ["rfq", "comparison", "find-my-car", "enquiry", "viewing"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];
export const STATUSES = ["New", "Contacted", "Quoted", "Won", "Lost"] as const;
export type LeadStatus = (typeof STATUSES)[number];

export const REQUEST_KINDS = ["Purchase", "Finance", "Trade-in"] as const;
export const BUDGETS = ["Under US$10k", "US$10k to 20k", "US$20k to 35k", "US$35k to 60k", "US$60k to 100k", "Over US$100k", "Flexible"] as const;

/** Accepts Zimbabwean mobiles (077..., +26377..., 26377...) and general international numbers. */
export function normalisePhone(raw: string) {
  const d = raw.replace(/[^\d+]/g, "");
  if (/^0[7][1-9]\d{7}$/.test(d)) return "+263" + d.slice(1);
  if (/^263[7][1-9]\d{7}$/.test(d)) return "+" + d;
  if (/^\+\d{8,15}$/.test(d)) return d;
  return null;
}

/** Optional free-form text: cut to length instead of rejecting the whole request (long ad-click URLs used to block quotes). */
const cap = (n: number) => z.string().transform((v) => v.slice(0, n)).optional();

export const attributionSchema = z.object({
  landingPage: cap(300),
  sourcePage: cap(300),
  referrer: cap(300),
  utmSource: cap(100),
  utmMedium: cap(100),
  utmCampaign: cap(100),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
  returning: z.boolean().optional(),
});
export type Attribution = z.infer<typeof attributionSchema>;

export const leadInput = z.object({
  type: z.enum(LEAD_TYPES),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().max(24).refine((v) => normalisePhone(v) !== null, "Enter a valid phone number, e.g. 077 226 2946"),
  email: z.union([z.literal(""), z.email("Enter a valid email")]).optional(),
  contactMethod: z.enum(["WhatsApp", "Call", "Email"]).optional(),
  // vehicle / configuration
  model: z.string().max(80).optional(),
  modelSlug: z.string().max(80).optional(),
  variant: z.string().max(80).optional(),
  colour: z.string().max(40).optional(),
  indicativePrice: z.number().nullable().optional(),
  image: cap(600),
  compare: z.array(z.string().max(80)).max(3).optional(),
  // needs
  requestKinds: z.array(z.enum(REQUEST_KINDS)).max(3).optional(),
  condition: z.enum(["Brand new", "Pre-owned", "Either"]).optional(),
  budget: z.string().max(40).optional(),
  notes: cap(500),
  attribution: attributionSchema.optional(),
  website: z.string().max(0).optional(), // honeypot
});
export type LeadInput = z.infer<typeof leadInput>;

export type Lead = Omit<LeadInput, "website"> & {
  id: string;
  createdAt: string;
  status: LeadStatus;
  sample?: boolean;
};

export function leadSummary(l: Pick<Lead, "model" | "variant" | "colour" | "compare">) {
  const parts = [l.model, l.variant, l.colour].filter(Boolean).join(" · ");
  return parts || (l.compare?.length ? `Comparison: ${l.compare.join(" vs ")}` : "General enquiry");
}
