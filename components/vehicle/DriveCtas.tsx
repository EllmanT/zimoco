"use client";

import { useRfq } from "@/components/RfqProvider";

/** "Book a test drive" opens the quote modal as a viewing request; "Browse available vehicles" jumps to the versions. */
export default function DriveCtas({ modelSlug, versionId }: { modelSlug: string; versionId: string }) {
  const rfq = useRfq();
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button className="btn btn-accent" onClick={() => rfq.open({ type: "viewing", modelSlug, variantId: versionId, notes: "Test drive request" })}>Book a test drive</button>
      <a href="#available" className="btn btn-ghost">Browse available vehicles</a>
    </div>
  );
}
