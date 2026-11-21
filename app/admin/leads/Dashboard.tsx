"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES, leadSummary, type Lead, type LeadStatus } from "@/lib/leads";

const fmt = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const usd = (n?: number | null) => (n ? `US$${n.toLocaleString("en-US")}` : "—");

function Bars({ data, label }: { data: [string, number][]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d[1]));
  return (
    <div>
      <h3 className="label text-muted">{label}</h3>
      <ul className="mt-4 space-y-2">
        {data.map(([k, v]) => (
          <li key={k} className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="truncate">{k}</span>
            <span className="h-2 rounded-full bg-sunken"><span className="block h-2 rounded-full bg-red" style={{ width: `${(v / max) * 100}%` }} /></span>
            <span className="tnum text-right text-muted">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Daily({ leads }: { leads: Lead[] }) {
  const days = 14;
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (days - 1 - i));
    return { d, n: 0 };
  });
  for (const l of leads) {
    const t = new Date(l.createdAt); t.setHours(0, 0, 0, 0);
    const b = buckets.find((x) => x.d.getTime() === t.getTime());
    if (b) b.n++;
  }
  const max = Math.max(1, ...buckets.map((b) => b.n));
  const pts = buckets.map((b, i) => `${(i / (days - 1)) * 300},${70 - (b.n / max) * 60}`).join(" ");
  return (
    <div>
      <h3 className="label text-muted">Leads per day (14 days)</h3>
      <svg viewBox="0 0 300 80" className="mt-4 w-full" role="img" aria-label="Leads per day">
        <polyline points={pts} fill="none" stroke="#d3202a" strokeWidth="2" strokeLinejoin="round" />
        {buckets.map((b, i) => <circle key={i} cx={(i / (days - 1)) * 300} cy={70 - (b.n / max) * 60} r="2.2" fill="#d3202a" />)}
      </svg>
    </div>
  );
}

const count = (arr: (string | undefined)[]) => Object.entries(arr.reduce<Record<string, number>>((m, k) => { const key = k || "unknown"; m[key] = (m[key] ?? 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6) as [string, number][];

export default function Dashboard({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<Lead | null>(null);

  const rows = useMemo(
    () => leads.filter((l) => (type === "all" || l.type === type) && (status === "all" || l.status === status) && (`${l.name} ${l.phone} ${l.email} ${leadSummary(l)}`.toLowerCase().includes(q.toLowerCase()))),
    [leads, q, type, status],
  );
  const live = leads.filter((l) => !l.sample).length;
  const week = leads.filter((l) => Date.now() - new Date(l.createdAt).getTime() < 7 * 864e5).length;
  const quotes = leads.filter((l) => l.type === "rfq").length;
  const won = leads.filter((l) => l.status === "Won").length;

  async function update(l: Lead, s: LeadStatus) {
    if (l.sample) { setOpen({ ...l, status: s }); return; }
    await fetch("/api/admin/leads", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: l.id, status: s }) });
    setOpen({ ...l, status: s });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-red">Demo admin</p>
          <h1 className="display mt-2 text-3xl">Leads</h1>
          <p className="mt-2 text-sm text-muted">{live} live submission{live === 1 ? "" : "s"} plus sample data. Sample rows are marked.</p>
        </div>
        <div className="flex gap-3">
          <a href="/api/admin/leads" className="btn btn-ghost">Export CSV</a>
          <button className="btn btn-ghost" onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); router.refresh(); }}>Sign out</button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Total leads", leads.length], ["Last 7 days", week], ["Quote requests", quotes], ["Won", won]].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-line p-5">
            <p className="label text-muted">{k}</p>
            <p className="display tnum mt-2 text-4xl">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 rounded-lg border border-line p-6 md:grid-cols-4">
        <Daily leads={leads} />
        <Bars label="By model" data={count(leads.map((l) => l.model))} />
        <Bars label="By source" data={count(leads.map((l) => l.attribution?.utmSource))} />
        <Bars label="By page" data={count(leads.map((l) => l.attribution?.sourcePage))} />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <input className="field max-w-xs" placeholder="Search name, phone, vehicle" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search leads" />
        <select className="field max-w-[11rem]" value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
          <option value="all">All types</option><option value="rfq">Quote requests</option><option value="comparison">Comparisons</option><option value="find-my-car">Find my car</option><option value="enquiry">Contact enquiries</option><option value="viewing">Viewing requests</option>
        </select>
        <select className="field max-w-[11rem]" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="text-sm text-muted">{rows.length} shown</span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-soft text-muted"><tr>{["Received", "Name", "Vehicle", "Budget", "Source", "Status"].map((h) => <th key={h} className="label px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} className="border-t border-line hover:bg-soft" onClick={() => setOpen(l)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpen(l)}>
                <td className="tnum px-4 py-3 whitespace-nowrap">{fmt(l.createdAt)}</td>
                <td className="px-4 py-3 font-medium">{l.name}{l.sample && <span className="ml-2 rounded bg-sunken px-1.5 py-0.5 text-xs uppercase text-muted">sample</span>}</td>
                <td className="px-4 py-3">{leadSummary(l)}</td>
                <td className="px-4 py-3">{l.budget || "—"}</td>
                <td className="px-4 py-3">{l.attribution?.utmSource ?? "direct"}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs ${l.status === "New" ? "bg-red text-white" : "bg-sunken"}`}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Lead details">
          <button className="absolute inset-0 bg-black/40" aria-label="Close" onClick={() => setOpen(null)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-7 shadow-2xl">
            <button className="label float-right text-muted" onClick={() => setOpen(null)}>Close</button>
            <p className="label text-red">{open.id}</p>
            <h2 className="display mt-2 text-2xl">{open.name}</h2>
            <p className="mt-1 text-sm text-muted">{fmt(open.createdAt)} · {open.type}</p>
            {open.image && <img src={open.image} alt="" className="mt-6 w-full rounded-lg bg-white" />}
            <dl className="mt-6 divide-y divide-line text-sm">
              {[["Vehicle", leadSummary(open)], ["Indicative price", usd(open.indicativePrice)], ["Budget", open.budget ?? "—"], ["Request", open.requestKinds?.join(", ") || "—"], ["Condition", open.condition ?? "—"], ["Phone", open.phone], ["Email", open.email || "—"], ["Preferred", open.contactMethod ?? "—"], ["Notes", open.notes || "—"], ["Source", `${open.attribution?.utmSource ?? "direct"} / ${open.attribution?.utmMedium ?? "none"}`], ["Landing page", open.attribution?.landingPage ?? "—"], ["Device", open.attribution?.device ?? "—"]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 py-2.5"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <label className="mt-6 block text-sm font-medium" htmlFor="st">Status</label>
            <select id="st" className="field mt-2" value={open.status} onChange={(e) => update(open, e.target.value as LeadStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            <div className="mt-6 flex gap-3">
              <a className="btn btn-red flex-1" href={`https://wa.me/${open.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${open.name.split(" ")[0]}, thank you for your enquiry about ${leadSummary(open)} at Zimoco.`)}`}>WhatsApp</a>
              <a className="btn btn-ghost flex-1" href={`tel:${open.phone}`}>Call</a>
            </div>
            {open.email && <a className="btn btn-ghost mt-3 w-full" href={`mailto:${open.email}`}>Email</a>}
            {open.sample && <p className="mt-4 text-xs text-muted">Sample lead. Status changes are not saved for sample rows.</p>}
          </aside>
        </div>
      )}
    </div>
  );
}
