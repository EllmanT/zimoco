"use client";

export default function ScrollUp() {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
        className="group flex flex-col items-center gap-2 text-sm text-white"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
          <path d="M9 15V3M3.5 8.5 9 3l5.5 5.5" />
        </svg>
        Scroll up
      </button>
    </div>
  );
}
