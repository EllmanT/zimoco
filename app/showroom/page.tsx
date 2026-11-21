import type { Metadata } from "next";
import { Suspense } from "react";
import ShowroomGrid from "@/components/ShowroomGrid";

export const metadata: Metadata = {
  title: "Showroom: pickups, SUVs and hatchbacks",
  description: "Browse the Zimoco digital showroom. Filter by body type, brand and budget, compare vehicles and request a quote.",
  alternates: { canonical: "/showroom" },
};

export default function Showroom() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-14 md:px-8">
      <h1 className="display text-[clamp(2.2rem,4.5vw,3.5rem)]">Explore our range</h1>
      <p className="measure mt-3 text-muted">Pick a category, search by name, or narrow by brand and budget. Add up to three vehicles to compare, or get a quote on any of them.</p>
      <Suspense>
        <ShowroomGrid />
      </Suspense>
    </div>
  );
}
