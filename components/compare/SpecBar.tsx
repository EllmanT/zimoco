"use client";

import { useEffect, useRef, useState } from "react";

/** Proportional bar that grows once when scrolled into view. Decorative: the value is always printed beside it. */
export default function SpecBar({ ratio, best, delay = 0 }: { ratio: number; best: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} aria-hidden className="mt-2 block h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
      <span
        className={`block h-full origin-left rounded-full transition-transform duration-[600ms] ease-[var(--ease-out-strong)] ${best ? "bg-red" : "bg-ink/35"}`}
        style={{ width: `${Math.max(4, Math.min(100, ratio * 100))}%`, transform: on ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${delay}ms` }}
      />
    </span>
  );
}
