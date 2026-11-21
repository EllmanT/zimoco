"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setBusy(false);
    if (r.ok) router.refresh();
    else setErr("Incorrect password");
  }

  return (
    <div className="mx-auto grid min-h-[70svh] max-w-md place-items-center px-5 py-20">
      <form onSubmit={submit} className="w-full">
        <p className="label text-red">Demo admin</p>
        <h1 className="display mt-3 text-3xl">Leads</h1>
        <p className="mt-3 text-muted">Enter the demo password to see incoming quote requests.</p>
        <label className="mt-8 block text-sm font-medium" htmlFor="pw">Password</label>
        <input id="pw" type="password" autoComplete="current-password" className="field mt-2" value={pw} onChange={(e) => setPw(e.target.value)} aria-invalid={!!err} />
        {err && <p role="alert" className="mt-2 text-sm text-red">{err}</p>}
        <button className="btn btn-red mt-6 w-full" disabled={busy || !pw}>{busy ? "Checking…" : "Sign in"}</button>
      </form>
    </div>
  );
}
