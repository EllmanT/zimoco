import type { Metadata } from "next";
import { Suspense } from "react";
import CompareView from "@/components/CompareView";

export const metadata: Metadata = {
  title: "Compare vehicles side by side",
  description: "Compare Hilux vs Ranger, Prado vs Fortuner, Aqua vs Vitz and more. See power, torque, economy, seats and price, then request a quote.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <Suspense>
      <CompareView />
    </Suspense>
  );
}
