"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    setState("busy");
    try {
      const r = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, website }) });
      const j = await r.json();
      if (j.ok) { setState("done"); setMsg("Thank you. You are on the list."); setEmail(""); }
      else { setState("error"); setMsg(j.error ?? "Something went wrong."); }
    } catch { setState("error"); setMsg("Network error. Please try again."); }
  }

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-md">
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <div className="flex border-b border-white/40 focus-within:border-sky">
        <input id="nl-email" type="email" autoComplete="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-12 w-full bg-transparent text-white outline-none placeholder:text-white/50" aria-describedby="nl-msg" />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button type="submit" disabled={state === "busy"} className="btn btn-accent !min-h-10 my-1 shrink-0">{state === "busy" ? "Sending" : "Subscribe"}</button>
      </div>
      <p id="nl-msg" role="status" className={`mt-2 min-h-5 text-sm ${state === "error" ? "text-[#ff8b7a]" : "text-white/70"}`}>{msg}</p>
    </form>
  );
}
