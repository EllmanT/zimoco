"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

type P = { versions: { id: string; name: string }[]; active: string; label: string };

/** Rounded pill bar that overlaps the bottom of the hero. Choosing a version re-renders the whole page for it (?v=). */
export default function VersionPills({ versions, active, label }: P) {
  const router = useRouter();
  const path = usePathname();
  const [pending, start] = useTransition();
  if (versions.length < 2) return <div className="h-8" />;
  const go = (id: string) => start(() => router.replace(id === versions[0].id ? path : `${path}?v=${id}`, { scroll: false }));
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (n == null) return;
    e.preventDefault();
    const idx = (n + versions.length) % versions.length;
    go(versions[idx].id);
    (e.currentTarget.parentElement?.children[idx] as HTMLElement | undefined)?.focus();
  };
  return (
    <div className="relative z-30 -mt-3 h-[3.75rem]" aria-busy={pending}>
      <div className="absolute inset-x-0 top-0 px-5 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div role="tablist" aria-label={label} className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,.35)]">
            {versions.map((v, i) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={v.id === active}
                tabIndex={v.id === active ? 0 : -1}
                onClick={() => go(v.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-5 text-[0.95rem] font-medium transition-colors duration-200 sm:flex-1 ${v.id === active ? "bg-sky text-black" : "text-ink/70 hover:bg-sky-soft hover:text-ink"}`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
