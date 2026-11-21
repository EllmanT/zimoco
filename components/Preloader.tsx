"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SEEN = "sb_loader_seen";
const HOLD = 1900;

/** Logo intro: the logo fades up from soft grey into full colour, then the sheet lifts away. Once per session. */
export default function Preloader() {
  const [phase, setPhase] = useState<"show" | "out" | "gone">("show");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      if (sessionStorage.getItem(SEEN)) { setPhase("gone"); return; }
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    const a = setTimeout(() => setPhase("out"), reduced ? 500 : HOLD);
    const b = setTimeout(() => setPhase("gone"), (reduced ? 500 : HOLD) + 750);
    const skip = () => setPhase("out");
    window.addEventListener("keydown", skip, { once: true });
    return () => { clearTimeout(a); clearTimeout(b); window.removeEventListener("keydown", skip); };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = phase === "show" ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [phase]);

  if (phase === "gone") return null;
  return (
    <div className={`sb-loader fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-white ${phase === "out" ? "loader-out" : ""}`} role="status" aria-label="Loading Zimoco" onClick={() => setPhase("out")}>
      <Image src="/starbell-auto-no-bg-logo.png" alt="" width={620} height={402} priority className="loader-logo h-44 w-auto" />
    </div>
  );
}
