"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BUDGETS, REQUEST_KINDS, leadInput, leadSummary, normalisePhone, type LeadType } from "@/lib/leads";
import { colourLabel, colourOptions, findCompareModel, findModel, fromPrice, specFor, usd } from "@/lib/catalogue";
import { useCatalogue } from "./CatalogueProvider";
import { getAttribution } from "@/lib/attribution";
import { whatsappLink } from "@/lib/site";

export type RfqPrefill = {
  type?: LeadType;
  modelSlug?: string;
  variantId?: string;
  colour?: string;
  compare?: string[];
  notes?: string;
};
type Ctx = { open: (p?: RfqPrefill) => void; close: () => void };
const C = createContext<Ctx | null>(null);
export const useRfq = () => {
  const v = useContext(C);
  if (!v) throw new Error("useRfq outside provider");
  return v;
};

type Done = { id: string; name: string; summary: string; image?: string; price: number | null; contactMethod: string };

export function RfqProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RfqPrefill | null>(null);
  const open = useCallback((p?: RfqPrefill) => setState(p ?? {}), []);
  const close = useCallback(() => setState(null), []);
  const value = useMemo(() => ({ open, close }), [open, close]);
  return (
    <C.Provider value={value}>
      {children}
      {state && <RfqModal prefill={state} onClose={close} />}
    </C.Provider>
  );
}

type Errors = Record<string, string>;

function RfqModal({ prefill, onClose }: { prefill: RfqPrefill; onClose: () => void }) {
  const known = !!prefill.modelSlug || !!prefill.compare?.length;
  const [step, setStep] = useState(known ? 2 : 1);
  const [modelSlug, setModelSlug] = useState(prefill.modelSlug ?? "");
  const [variantId, setVariantId] = useState(prefill.variantId ?? "");
  const [colour, setColour] = useState(prefill.colour ?? "");
  const [kinds, setKinds] = useState<string[]>(["Purchase"]);
  const [condition, setCondition] = useState<"Brand new" | "Pre-owned" | "Either">("Either");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState(prefill.notes ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"WhatsApp" | "Call" | "Email">("WhatsApp");
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const cat = useCatalogue();
  const { models } = cat;
  const model = findModel(cat, modelSlug);
  const variant = model?.variants.find((v) => v.id === variantId);
  const isCompare = !!prefill.compare?.length;
  const compareNames = (prefill.compare ?? []).map((s) => { const m = findCompareModel(cat, s); return m ? `${m.brand} ${m.name}` : s; });
  const colours = model && variantId ? colourOptions(model, variantId) : [];
  const image = model && variantId && colour ? colours.find((c) => c.colour === colour)?.src : undefined;
  const price = variant?.from ?? (model ? fromPrice(model) : null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    panel.current?.focus();
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", esc);
      prev?.focus?.();
    };
  }, [onClose]);

  function validatePhone(v: string) {
    return normalisePhone(v) ? "" : "Enter a valid phone number, e.g. 0772 589 624";
  }
  function validateEmail(v: string) {
    return !v || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? "" : "Enter a valid email";
  }
  const live: Errors = {
    name: name.trim().length >= 2 ? "" : "Please enter your name",
    phone: validatePhone(phone),
    email: validateEmail(email),
  };
  const shown = (k: string) => (touched[k] || errors[k] ? live[k] || errors[k] : "");

  function next() {
    if (step === 1 && !modelSlug) { setErrors({ model: "Choose a vehicle" }); return; }
    setErrors({});
    setStep((s) => s + 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    if (live.name || live.phone || live.email) return;
    setBusy(true);
    setServerErr("");
    const type: LeadType = prefill.type ?? (isCompare ? "comparison" : "rfq");
    const payload = {
      type,
      name, phone, email,
      contactMethod: method,
      model: model ? `${model.brand} ${model.name}` : undefined,
      modelSlug: model?.slug,
      variant: variant?.name,
      colour: colour ? colourLabel(colour) : undefined,
      indicativePrice: model ? price : null,
      image,
      compare: isCompare ? compareNames : undefined,
      requestKinds: kinds as ("Purchase" | "Finance" | "Trade-in")[],
      condition, budget: budget || undefined, notes: notes || undefined,
      attribution: getAttribution(),
      website: hp,
    };
    const parsed = leadInput.safeParse(payload);
    if (!parsed.success) { setBusy(false); setServerErr(`Please check your details (${[...new Set(parsed.error.issues.map((i) => i.path.join(".") || "form"))].join(", ")}).`); return; }
    try {
      const r = await fetch("/api/rfq", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setErrors(j.fields ?? {});
        setServerErr(j.error ?? "Something went wrong. Please try again.");
      } else {
        setDone({ id: j.id, name: name.split(" ")[0], summary: leadSummary({ model: payload.model, variant: payload.variant, colour: payload.colour, compare: payload.compare }), image, price: payload.indicativePrice ?? null, contactMethod: method });
        window.dispatchEvent(new CustomEvent("sb:rfq-submitted"));
      }
    } catch {
      setServerErr("Network error. Please try again, or message us on WhatsApp.");
    }
    setBusy(false);
  }

  const toggleKind = (k: string) => setKinds((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="rfq-title">
      <button className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} tabIndex={-1} />
      <div ref={panel} tabIndex={-1} className="relative max-h-[94svh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl outline-none sm:rounded-2xl sm:p-9">
        <button onClick={onClose} className="label absolute right-5 top-5 text-muted hover:text-ink">Close</button>

        {done ? (
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </div>
            <h2 id="rfq-title" className="display mt-5 text-2xl">Thank you, {done.name}</h2>
            <p className="mt-2 text-muted">Your request is in. A Zimoco consultant will contact you on {done.contactMethod === "Email" ? "email" : done.contactMethod} shortly with availability and a firm quote.</p>
            <div className="mt-6 rounded-xl border border-line p-4">
              <p className="label text-muted">Reference</p>
              <p className="display tnum mt-1 text-xl">{done.id}</p>
              <div className="mt-4 flex items-center gap-4">
                {done.image && <Image src={done.image} alt="" width={140} height={64} className="h-16 w-auto object-contain" />}
                <div className="text-sm">
                  <p className="font-medium">{done.summary}</p>
                  {done.price != null && <p className="text-muted">Indicative from {usd(done.price)}</p>}
                </div>
              </div>
            </div>
            <a className="btn btn-accent mt-6 w-full" href={whatsappLink(`Hello Zimoco, my reference is ${done.id}. I enquired about: ${done.summary}.`)} target="_blank" rel="noreferrer">Continue on WhatsApp</a>
            <button className="btn btn-ghost mt-3 w-full" onClick={onClose}>Back to the showroom</button>
            <p className="mt-4 text-center text-xs text-muted">Demo build: this request is saved to the demo admin at /admin/leads.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="label text-accent">Request a quote · step {step} of 3</p>
            <h2 id="rfq-title" className="display mt-2 text-2xl">{step === 1 ? "Which vehicle?" : step === 2 ? "What do you need?" : "How do we reach you?"}</h2>
            <div className="mt-3 flex gap-1.5" aria-hidden>{[1, 2, 3].map((n) => <span key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-accent" : "bg-sunken"}`} />)}</div>

            {step === 1 && (
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="rq-model" className="text-sm font-medium">Model</label>
                  <select id="rq-model" className="field mt-2" value={modelSlug} onChange={(e) => { setModelSlug(e.target.value); setVariantId(""); setColour(""); }} aria-invalid={!!errors.model}>
                    <option value="">Select a vehicle…</option>
                    {models.map((m) => <option key={m.slug} value={m.slug}>{m.brand} {m.name}</option>)}
                  </select>
                  {errors.model && <p role="alert" className="mt-1 text-sm text-accent">{errors.model}</p>}
                </div>
                {model && (
                  <div>
                    <label htmlFor="rq-variant" className="text-sm font-medium">Variant (optional)</label>
                    <select id="rq-variant" className="field mt-2" value={variantId} onChange={(e) => { setVariantId(e.target.value); setColour(""); }}>
                      <option value="">Not sure yet</option>
                      {model.variants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                )}
                {colours.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Colour (optional)</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {colours.map((c) => (
                        <button type="button" key={c.colour} onClick={() => setColour(c.colour === colour ? "" : c.colour)} aria-pressed={c.colour === colour} className={`rounded-full border px-3.5 py-2 text-sm ${c.colour === colour ? "border-accent bg-accent text-white" : "border-line"}`}>{colourLabel(c.colour)}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 space-y-5">
                {(model || isCompare) && (
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-soft p-3.5 text-sm">
                    <div className="flex min-w-0 items-center gap-3">
                      {image && <Image src={image} alt="" width={96} height={44} className="h-11 w-auto object-contain" />}
                      <span className="truncate font-medium">{isCompare ? compareNames.join(" vs ") : [model && `${model.brand} ${model.name}`, variant?.name, colour && colourLabel(colour)].filter(Boolean).join(" · ")}</span>
                    </div>
                    {!isCompare && <button type="button" className="label shrink-0 text-accent" onClick={() => setStep(1)}>Change</button>}
                  </div>
                )}
                <fieldset>
                  <legend className="text-sm font-medium">I am interested in</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {REQUEST_KINDS.map((k) => (
                      <button type="button" key={k} aria-pressed={kinds.includes(k)} onClick={() => toggleKind(k)} className={`rounded-full border px-4 py-2.5 text-sm ${kinds.includes(k) ? "border-accent bg-accent text-white" : "border-line"}`}>{k}</button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-medium">Condition</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(["Brand new", "Pre-owned", "Either"] as const).map((k) => (
                      <button type="button" key={k} aria-pressed={condition === k} onClick={() => setCondition(k)} className={`rounded-full border px-4 py-2.5 text-sm ${condition === k ? "border-ink bg-ink text-white" : "border-line"}`}>{k}</button>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="rq-budget" className="text-sm font-medium">Budget</label>
                  <select id="rq-budget" className="field mt-2" value={budget} onChange={(e) => setBudget(e.target.value)}>
                    <option value="">Select a range</option>
                    {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="rq-notes" className="text-sm font-medium">Anything we should know? (optional)</label>
                  <textarea id="rq-notes" rows={3} maxLength={500} className="field mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <p className="mt-1 text-right text-xs text-muted">{notes.length}/500</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="rq-name" className="text-sm font-medium">Full name</label>
                  <input id="rq-name" className="field mt-2" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} aria-invalid={!!shown("name")} />
                  {shown("name") && <p role="alert" className="mt-1 text-sm text-accent">{shown("name")}</p>}
                </div>
                <div>
                  <label htmlFor="rq-phone" className="text-sm font-medium">Phone or WhatsApp</label>
                  <input id="rq-phone" className="field mt-2" type="tel" inputMode="tel" autoComplete="tel" placeholder="0772 589 624" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, phone: true }))} aria-invalid={!!shown("phone")} />
                  {shown("phone") && <p role="alert" className="mt-1 text-sm text-accent">{shown("phone")}</p>}
                </div>
                <div>
                  <label htmlFor="rq-email" className="text-sm font-medium">Email (optional)</label>
                  <input id="rq-email" className="field mt-2" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} aria-invalid={!!shown("email")} />
                  {shown("email") && <p role="alert" className="mt-1 text-sm text-accent">{shown("email")}</p>}
                </div>
                <fieldset>
                  <legend className="text-sm font-medium">Best way to reach you</legend>
                  <div className="mt-2 flex gap-2">
                    {(["WhatsApp", "Call", "Email"] as const).map((k) => (
                      <button type="button" key={k} aria-pressed={method === k} onClick={() => setMethod(k)} className={`flex-1 rounded-full border px-3 py-2.5 text-sm ${method === k ? "border-ink bg-ink text-white" : "border-line"}`}>{k}</button>
                    ))}
                  </div>
                </fieldset>
                <input type="text" name="hp_extra" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" value={hp} onChange={(e) => setHp(e.target.value)} />
                {serverErr && <p role="alert" className="rounded-lg bg-accent/10 p-3 text-sm text-accent-deep">{serverErr}</p>}
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              {step > (known ? 2 : 1) && <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>Back</button>}
              {step < 3 ? (
                <button type="button" className="btn btn-accent flex-1" onClick={next}>Continue</button>
              ) : (
                <button type="submit" className="btn btn-accent flex-1" disabled={busy}>{busy ? "Sending…" : "Send my request"}</button>
              )}
            </div>
            <p className="mt-4 text-xs text-muted">No obligation. Prices shown on the site are indicative; we confirm availability and a firm price in your quote.</p>
          </form>
        )}
      </div>
    </div>
  );
}

// Re-export for convenience
export { specFor };
