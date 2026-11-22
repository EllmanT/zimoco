import { NextResponse } from "next/server";
import { z } from "zod";
import { addSubscriber, sendSubscribeMail } from "@/lib/subscribers";

const hits = new Map<string, number[]>();
const schema = z.object({ email: z.string().trim().toLowerCase().email().max(120), website: z.string().optional() });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > 5) return NextResponse.json({ ok: false, error: "Too many attempts. Try again in a minute." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // honeypot
  try {
    const isNew = await addSubscriber(parsed.data.email);
    if (isNew) sendSubscribeMail(parsed.data.email).catch((e) => console.error("subscribe mail failed", e));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("subscribe failed", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
