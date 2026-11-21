"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { BUDGETS, leadInput, normalisePhone, type LeadType } from "@/lib/leads";
import { fullName } from "@/lib/catalogue";
import { useCatalogue } from "../CatalogueProvider";
import { getAttribution } from "@/lib/attribution";
import { viewingDays, type ViewingDay } from "@/lib/harare-time";
import { whatsappLink } from "@/lib/site";

const TOPICS = [
  { id: "buy", label: "Buy a vehicle", lead: "Tell us what you have in mind and we will confirm availability and a firm price.", type: "enquiry" as LeadType, vehicle: true, budget: true },
  { id: "source", label: "Source a car", lead: "Not in the showroom? Describe the vehicle and budget and we will search for it.", type: "enquiry" as LeadType, vehicle: true, budget: true },
  { id: "viewing", label: "Book a viewing", lead: "Choose a day and time to visit the Mount Pleasant showroom. We confirm by WhatsApp.", type: "viewing" as LeadType, vehicle: true, budget: false },
  { id: "finance", label: "Finance and trade-in", lead: "Ask about finance options or what your current vehicle is worth.", type: "enquiry" as LeadType, vehicle: false, budget: false },
];

type Method = "WhatsApp" | "Call" | "Email";
type Done = { id: string; name: string; topic: string; slot?: string; method: Method };

export default function EnquiryForm() {
  const uid = useId();
  const { models } = useCatalogue();
  const [topicId, setTopicId] = useState("buy");
  const topic = TOPICS.find((t) => t.id === topicId)!;
  const [days, setDays] = useState<ViewingDay[]>([]);
  const [dayIso, setDayIso] = useState("");
  const [time, setTime] = useState("");
  const [model, setModel] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<Method>("WhatsApp");
  const [hp, setHp] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [serverErr, setServerErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  // Slots depend on the Harare clock, so compute after mount to avoid a hydration mismatch.
  useEffect(() => {
    const d = viewingDays();
    setDays(d);
    if (d[0]) setDayIso(d[0].iso);
    // Deep link: /contact?topic=viewing&model=toyota-hilux
    const p = new URLSearchParams(location.search);
    const t = p.get("topic");
    if (t && TOPICS.some((x) => x.id === t)) setTopicId(t);
    const m = p.get("model");
    if (m && models.some((x) => x.slug === m)) setModel(m);
  }, [models]);

  const day = days.find((d) => d.iso === dayIso);
  useEffect(() => { if (time && day && !day.slots.includes(time)) setTime(""); }, [day, time]);

  const live: Record<string, string> = {
    name: name.trim().length >= 2 ? "" : "Please enter your name",
    phone: normalisePhone(phone) ? "" : "Enter a valid phone number, e.g. 077 226 2946",
    email: !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "" : "Enter a valid email",
    slot: topic.id === "viewing" && (!dayIso || !time) ? "Pick a day and a time" : "",
    message: topic.id !== "viewing" && message.trim().length < 5 ? "Add a short message so we can help" : "",
  };
  const err = (k: string) => (touched[k] ? live[k] || serverErrors[k] : serverErrors[k]) ?? "";

  const slotLabel = useMemo(() => (day && time ? `${day.long}, ${time}` : ""), [day, time]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, slot: true, message: true });
    if (Object.values(live).some(Boolean)) return;
    setBusy(true);
    setServerErr("");
    setServerErrors({});
    const m = models.find((x) => x.slug === model);
    const notes = [`Topic: ${topic.label}`, slotLabel && `Preferred slot: ${slotLabel} (Harare time)`, message.trim()].filter(Boolean).join("\n").slice(0, 500);
    const payload = {
      type: topic.type, name, phone, email, contactMethod: method,
      model: m ? fullName(m) : undefined, modelSlug: m?.slug,
      budget: topic.budget && budget ? budget : undefined,
      notes, attribution: getAttribution(), website: hp,
    };
    if (!leadInput.safeParse(payload).success) { setBusy(false); setServerErr("Please check your details."); return; }
    try {
      const r = await fetch("/api/rfq", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!r.ok || !j.ok) { setServerErrors(j.fields ?? {}); setServerErr(j.error ?? "Something went wrong. Please try again."); }
      else setDone({ id: j.id, name: name.trim().split(" ")[0], topic: topic.label, slot: slotLabel || undefined, method });
    } catch {
      setServerErr("Network problem. Please try again, or message us on WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="panel-in rounded-3xl bg-soft p-8 md:p-12" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-red text-white"><Check className="h-6 w-6" aria-hidden /></span>
        <h2 className="display mt-6 text-2xl md:text-3xl">Thank you, {done.name}</h2>
        <p className="measure mt-3 text-muted">
          {done.slot ? <>We have your viewing request for <strong className="text-ink">{done.slot}</strong>. A consultant will confirm it by {done.method === "Call" ? "phone" : done.method.toLowerCase()} shortly.</> : <>A consultant will reply by {done.method === "Call" ? "phone" : done.method.toLowerCase()} on the next working day at the latest.</>}
        </p>
        <p className="label mt-6 text-muted">Reference {done.id}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="btn btn-red" href={whatsappLink(`Hello Zimoco, I just sent a request (${done.id}): ${done.topic}${done.slot ? `, ${done.slot}` : ""}.`)}>Message us on WhatsApp too</a>
          <button className="btn btn-ghost" onClick={() => { setDone(null); setMessage(""); setTime(""); setTouched({}); }}>Send another</button>
        </div>
      </div>
    );
  }

  const fid = (k: string) => `${uid}-${k}`;
  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-soft p-5 sm:p-8 md:p-10" aria-labelledby={fid("h")}>
      <h2 id={fid("h")} className="display text-2xl md:text-3xl">How can we help?</h2>

      <div role="tablist" aria-label="Enquiry topic" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        {TOPICS.map((t) => (
          <button key={t.id} type="button" role="tab" id={fid(`tab-${t.id}`)} aria-selected={t.id === topicId} aria-controls={fid("panel")} onClick={() => setTopicId(t.id)}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-sm transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97] ${t.id === topicId ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div id={fid("panel")} role="tabpanel" aria-labelledby={fid(`tab-${topicId}`)} key={topicId} className="panel-in mt-6">
        <p className="measure text-muted">{topic.lead}</p>

        {topic.id === "viewing" && (
          <fieldset className="mt-6 min-w-0">
            <legend className="label text-muted">Day</legend>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {days.map((d) => (
                <button key={d.iso} type="button" aria-pressed={d.iso === dayIso} onClick={() => setDayIso(d.iso)}
                  className={`min-h-14 min-w-[5.5rem] shrink-0 rounded-xl border px-3 py-2 text-left transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97] ${d.iso === dayIso ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
                  <span className="label block opacity-70">{d.short}</span>
                  <span className="text-sm">{d.long.split(" ").slice(1).join(" ")}</span>
                </button>
              ))}
              {!days.length && <p className="text-sm text-muted">Loading available days…</p>}
            </div>
            <p className="label mt-6 text-muted">Time (Harare)</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {day?.slots.map((s) => (
                <button key={s} type="button" aria-pressed={s === time} onClick={() => setTime(s)}
                  className={`tnum min-h-11 rounded-lg border text-sm transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97] ${s === time ? "border-red bg-red text-white" : "border-line hover:border-ink"}`}>{s}</button>
              ))}
            </div>
            {err("slot") && <p className="mt-2 text-sm text-[#b4472f]" role="alert">{err("slot")}</p>}
          </fieldset>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {topic.vehicle && (
            <div className={topic.budget ? "" : "sm:col-span-2"}>
              <label className="label text-muted" htmlFor={fid("model")}>Vehicle of interest</label>
              <select id={fid("model")} className="field mt-2" value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="">Not sure yet</option>
                {models.map((m) => <option key={m.slug} value={m.slug}>{fullName(m)}</option>)}
              </select>
            </div>
          )}
          {topic.budget && (
            <div>
              <label className="label text-muted" htmlFor={fid("budget")}>Budget</label>
              <select id={fid("budget")} className="field mt-2" value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="">Prefer to discuss</option>
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="label text-muted" htmlFor={fid("name")}>Full name</label>
            <input id={fid("name")} className="field mt-2" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} aria-invalid={!!err("name")} aria-describedby={err("name") ? fid("name-e") : undefined} />
            {err("name") && <p id={fid("name-e")} className="mt-1.5 text-sm text-[#b4472f]">{err("name")}</p>}
          </div>
          <div>
            <label className="label text-muted" htmlFor={fid("phone")}>Phone or WhatsApp</label>
            <input id={fid("phone")} className="field mt-2" type="tel" inputMode="tel" autoComplete="tel" placeholder="077 226 2946" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, phone: true }))} aria-invalid={!!err("phone")} aria-describedby={err("phone") ? fid("phone-e") : undefined} />
            {err("phone") && <p id={fid("phone-e")} className="mt-1.5 text-sm text-[#b4472f]">{err("phone")}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label text-muted" htmlFor={fid("email")}>Email <span className="normal-case tracking-normal">(optional)</span></label>
            <input id={fid("email")} className="field mt-2" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} aria-invalid={!!err("email")} aria-describedby={err("email") ? fid("email-e") : undefined} />
            {err("email") && <p id={fid("email-e")} className="mt-1.5 text-sm text-[#b4472f]">{err("email")}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label text-muted" htmlFor={fid("msg")}>{topic.id === "viewing" ? "Anything we should prepare? (optional)" : "Your message"}</label>
            <textarea id={fid("msg")} className="field mt-2 min-h-28 resize-y" maxLength={380} value={message} onChange={(e) => setMessage(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, message: true }))} aria-invalid={!!err("message")} />
            {err("message") && <p className="mt-1.5 text-sm text-[#b4472f]">{err("message")}</p>}
          </div>
        </div>

        <fieldset className="mt-6 min-w-0">
          <legend className="label text-muted">Reply by</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["WhatsApp", "Call", "Email"] as Method[]).map((m) => (
              <label key={m} className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${method === m ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
                <input type="radio" name={fid("method")} className="sr-only" checked={method === m} onChange={() => setMethod(m)} />{m}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="absolute -left-[9999px]" aria-hidden><label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label></div>

        {serverErr && <p className="mt-6 rounded-lg bg-[#b4472f]/10 p-3 text-sm text-[#8f3722]" role="alert">{serverErr}</p>}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-red" disabled={busy}>{busy ? "Sending…" : topic.id === "viewing" ? "Request this viewing" : "Send enquiry"}</button>
          <p className="text-sm text-muted">We only use your details to reply to this request.</p>
        </div>
      </div>
    </form>
  );
}
