"use client";

import { useEffect, useState } from "react";
import { BUDGETS, REQUEST_KINDS, leadInput, normalisePhone } from "@/lib/leads";
import { getAttribution } from "@/lib/attribution";
import { whatsappLink } from "@/lib/site";

type P = { modelSlug: string; modelName: string; versionId: string; versionName: string; price: number | null };

/** Inline enquiry form shown on every vehicle page. Same schema and endpoint (/api/rfq) as the quote modal, with the vehicle pre-filled. */
export default function NextStepsForm({ modelSlug, modelName, versionId, versionName, price }: P) {
  const [kinds, setKinds] = useState<string[]>(["Purchase"]);
  const [offer, setOffer] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"WhatsApp" | "Call" | "Email">("WhatsApp");
  const [hp, setHp] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ id: string; first: string } | null>(null);

  // An offer's "Enquire" button pre-selects its type here.
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ type: string; title: string }>).detail;
      setOffer(d.title);
      const kind = /lease|financ/i.test(d.type) ? "Finance" : /trade/i.test(d.type) ? "Trade-in" : "Purchase";
      setKinds((k) => (k.includes(kind) ? k : [...k, kind]));
    };
    window.addEventListener("zimoco:offer", on);
    return () => window.removeEventListener("zimoco:offer", on);
  }, []);

  const live = {
    name: name.trim().length >= 2 ? "" : "Please enter your name",
    phone: normalisePhone(phone) ? "" : "Enter a valid phone number, e.g. 0772 589 624",
    email: !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "" : "Enter a valid email",
  };
  const shown = (k: keyof typeof live) => (touched[k] ? live[k] : "");
  const toggle = (k: string) => setKinds((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    if (live.name || live.phone || live.email) return;
    setBusy(true);
    setErr("");
    const payload = {
      type: "rfq" as const,
      name, phone, email,
      contactMethod: method,
      model: modelName, modelSlug, variant: versionName,
      indicativePrice: price,
      requestKinds: kinds as ("Purchase" | "Finance" | "Trade-in")[],
      condition: "Either" as const,
      budget: budget || undefined,
      notes: [offer && `Offer: ${offer}`, notes].filter(Boolean).join(". ") || undefined,
      attribution: getAttribution(),
      website: hp,
    };
    const parsed = leadInput.safeParse(payload);
    if (!parsed.success) { setBusy(false); setErr("Please check your details and try again."); return; }
    try {
      const r = await fetch("/api/rfq", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!r.ok || !j.ok) setErr(j.error ?? "Something went wrong. Please try again.");
      else { setDone({ id: j.id, first: name.split(" ")[0] }); window.dispatchEvent(new CustomEvent("sb:rfq-submitted")); }
    } catch {
      setErr("Network error. Please try again, or message us on WhatsApp.");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-white p-8 md:p-12" role="status">
        <h3 className="display text-3xl">Thank you, {done.first}</h3>
        <p className="mt-3 max-w-lg text-muted">Your request is in. A Zimoco consultant will contact you on {method === "Email" ? "email" : method} with availability and a firm quote. Reference <b className="tnum text-ink">{done.id}</b>.</p>
        <a className="btn btn-accent mt-6" target="_blank" rel="noreferrer" href={whatsappLink(`Hello Zimoco, my reference is ${done.id}. I enquired about the ${modelName} ${versionName}.`)}>Continue on WhatsApp</a>
      </div>
    );
  }

  const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" aria-pressed={on} onClick={onClick} className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${on ? "border-accent bg-accent text-white" : "border-line hover:border-ink"}`}>{children}</button>
  );
  const Err = ({ k }: { k: keyof typeof live }) => (shown(k) ? <p role="alert" className="mt-1 text-sm text-accent-deep">{shown(k)}</p> : null);

  return (
    <form onSubmit={submit} noValidate className="grid gap-x-10 gap-y-6 rounded-3xl bg-white p-6 md:grid-cols-2 md:p-10">
      <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-soft p-4 text-sm">
        <span className="font-medium">{modelName} · {versionName}</span>
        {offer && <span className="text-muted">Offer: {offer}</span>}
      </div>
      <div className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium">I am interested in</legend>
          <div className="mt-2 flex flex-wrap gap-2">{REQUEST_KINDS.map((k) => <Pill key={k} on={kinds.includes(k)} onClick={() => toggle(k)}>{k}</Pill>)}</div>
        </fieldset>
        <div>
          <label htmlFor="ns-budget" className="text-sm font-medium">Budget</label>
          <select id="ns-budget" className="field mt-2" value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">Select a range</option>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ns-notes" className="text-sm font-medium">Anything we should know? (optional)</label>
          <textarea id="ns-notes" rows={3} maxLength={400} className="field mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <label htmlFor="ns-name" className="text-sm font-medium">Full name</label>
          <input id="ns-name" className="field mt-2" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} aria-invalid={!!shown("name")} />
          <Err k="name" />
        </div>
        <div>
          <label htmlFor="ns-phone" className="text-sm font-medium">Phone or WhatsApp</label>
          <input id="ns-phone" className="field mt-2" type="tel" inputMode="tel" autoComplete="tel" placeholder="0772 589 624" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, phone: true }))} aria-invalid={!!shown("phone")} />
          <Err k="phone" />
        </div>
        <div>
          <label htmlFor="ns-email" className="text-sm font-medium">Email (optional)</label>
          <input id="ns-email" className="field mt-2" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} aria-invalid={!!shown("email")} />
          <Err k="email" />
        </div>
        <fieldset>
          <legend className="text-sm font-medium">Best way to reach you</legend>
          <div className="mt-2 flex gap-2">{(["WhatsApp", "Call", "Email"] as const).map((k) => <Pill key={k} on={method === k} onClick={() => setMethod(k)}>{k}</Pill>)}</div>
        </fieldset>
      </div>
      <input type="text" name="hp_extra" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" value={hp} onChange={(e) => setHp(e.target.value)} />
      <div className="md:col-span-2">
        {err && <p role="alert" className="mb-4 rounded-lg bg-accent/10 p-3 text-sm text-accent-deep">{err}</p>}
        <button type="submit" className="btn btn-accent w-full md:w-auto md:min-w-64" disabled={busy}>{busy ? "Sending…" : "Send my request"}</button>
        <p className="mt-3 text-xs text-muted">No obligation. Prices are indicative; we confirm availability and a firm price in your quote.</p>
      </div>
    </form>
  );
}
