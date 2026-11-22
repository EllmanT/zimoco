"use client";

import { useState } from "react";
import type { SpecGroup } from "@/lib/vehicle-page";

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="overflow-hidden rounded-2xl border border-line bg-white">
      {rows.map(([k, v], i) => (
        <div key={k + i} className={`flex items-baseline justify-between gap-6 px-5 py-4 ${i % 2 ? "" : "bg-soft"}`}>
          <dt className="font-medium">{k}</dt>
          <dd className="tnum text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Key figures in a striped table; "All technical data" expands the grouped sheet. */
export default function SpecTable({ keyRows, groups }: { keyRows: [string, string][]; groups: SpecGroup[] }) {
  const [all, setAll] = useState(false);
  return (
    <div className="mx-auto max-w-4xl">
      <Rows rows={keyRows} />
      {all && (
        <div className="panel-in mt-8 space-y-8">
          {groups.map((g) => (
            <section key={g.section}>
              <h3 className="display mb-3 text-xl">{g.section}</h3>
              <Rows rows={g.rows} />
            </section>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <button className="btn btn-ghost" aria-expanded={all} onClick={() => setAll((x) => !x)}>{all ? "Show key figures only" : "All technical data"}</button>
      </div>
    </div>
  );
}
