import Link from "next/link";
import type { CSSProperties } from "react";

type RingProps = {
  size?: number;
  stroke?: number;
  /** 0..1, controlled progress (rails, scroll-linked). Ignored when `timerMs` is set. */
  progress?: number;
  /** Time-linked fill: the ring completes in this many ms. Remount (change `key`) to restart. */
  timerMs?: number;
  paused?: boolean;
  className?: string;
  trackClassName?: string;
};

/** Progress ring. Decorative: pair with real text for meaning. */
export function Ring({ size = 24, stroke = 1.5, progress = 0, timerMs, paused = false, className = "", trackClassName = "" }: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const style: CSSProperties & Record<string, string | number> = { "--c": c };
  if (timerMs) {
    style["--dur"] = `${timerMs}ms`;
    style["--play"] = paused ? "paused" : "running";
  }
  return (
    <svg className={`prog-ring ${className}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden focusable="false">
      <circle className={`prog-track ${trackClassName}`} cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} />
      <circle
        className={`prog-fill ${timerMs ? "prog-timer" : ""}`}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={timerMs ? undefined : c * (1 - Math.min(1, Math.max(0, progress)))}
        style={style}
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2.5 9.5 7 5 11.5" />
    </svg>
  );
}

/** Ferrari-style "DISCOVER (>)" link: uppercase label plus a circular chevron that fills on hover. */
export function RingButton({
  href,
  label,
  className = "",
  invert = "#fff",
  external = false,
}: {
  href: string;
  label: string;
  className?: string;
  /** Chevron colour once the disc fills on hover (set to the surface colour). */
  invert?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="label">{label}</span>
      <span className="ring-btn-disc" style={{ "--ring-invert": invert } as CSSProperties}>
        <Chevron />
      </span>
    </>
  );
  return external ? (
    <a href={href} className={`ring-btn ${className}`}>{inner}</a>
  ) : (
    <Link href={href} className={`ring-btn ${className}`}>{inner}</Link>
  );
}
