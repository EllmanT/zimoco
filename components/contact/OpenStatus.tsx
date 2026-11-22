"use client";

import { useEffect, useState } from "react";
import { openStatus, type OpenStatus as Status } from "@/lib/harare-time";

/** Live "open now / closed" chip, computed in Harare time and refreshed each minute. */
export default function OpenStatus({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [s, setS] = useState<Status | null>(null);
  useEffect(() => {
    const tick = () => setS(openStatus());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const base = tone === "dark" ? "chip-glass border-white/25 bg-black/35 text-white" : "border-line bg-white text-ink";
  return (
    <p className={`inline-flex min-h-10 items-center gap-3 rounded-full border px-4 text-sm ${base}`} role="status" aria-live="polite">
      {s ? (
        <>
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            {s.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70 motion-reduce:hidden" />}
            <span className={`relative h-2.5 w-2.5 rounded-full ${s.open ? "bg-emerald-400" : "bg-accent"}`} />
          </span>
          <span className="font-medium">{s.headline}</span>
          <span className={tone === "dark" ? "text-white/70" : "text-muted"}>{s.detail}</span>
        </>
      ) : (
        <span className="opacity-0">Checking opening hours</span>
      )}
    </p>
  );
}
