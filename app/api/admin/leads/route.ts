import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { STATUSES, leadSummary, type LeadStatus } from "@/lib/leads";
import { listLeads, setStatus } from "@/lib/leads-store";

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id, status } = (await req.json().catch(() => ({}))) as { id?: string; status?: LeadStatus };
  if (!id || !status || !STATUSES.includes(status)) return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json({ ok: await setStatus(id, status) });
}

const csv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
export async function GET() {
  if (!(await isAdmin())) return new NextResponse("Unauthorised", { status: 401 });
  const rows = await listLeads();
  const head = ["id", "created", "status", "type", "name", "phone", "email", "vehicle", "indicative_price", "budget", "request", "source", "utm_medium", "page", "device", "notes", "sample"];
  const lines = rows.map((l) =>
    [l.id, l.createdAt, l.status, l.type, l.name, l.phone, l.email, leadSummary(l), l.indicativePrice, l.budget, l.requestKinds?.join("+"), l.attribution?.utmSource, l.attribution?.utmMedium, l.attribution?.sourcePage, l.attribution?.device, l.notes, l.sample ? "yes" : ""].map(csv).join(","),
  );
  return new NextResponse([head.join(","), ...lines].join("\n"), { headers: { "content-type": "text/csv", "content-disposition": 'attachment; filename="zimoco-leads.csv"' } });
}
