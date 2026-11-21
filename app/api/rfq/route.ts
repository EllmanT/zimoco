import { NextResponse } from "next/server";
import { leadInput, normalisePhone } from "@/lib/leads";
import { addLead } from "@/lib/leads-store";

// In-memory limiter for the demo. Swap for Upstash + Turnstile before launch.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a minute." }, { status: 429 });
  const text = await req.text();
  if (text.length > 20_000) return NextResponse.json({ ok: false, error: "Request too large" }, { status: 413 });
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const parsed = leadInput.safeParse(json);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0] ?? "form")] = i.message;
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 422 });
  }
  const { website, ...d } = parsed.data;
  if (website) return NextResponse.json({ ok: true, id: "RFQ-0000" }); // bot: pretend success
  const lead = await addLead({ ...d, phone: normalisePhone(d.phone) ?? d.phone });
  return NextResponse.json({ ok: true, id: lead.id, receivedAt: lead.createdAt });
}
