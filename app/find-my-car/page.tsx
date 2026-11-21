import type { Metadata } from "next";
import FindMyCar from "@/components/FindMyCar";

export const metadata: Metadata = {
  title: "Find my car",
  description: "Tell us your budget, body type and needs. We match you with the right vehicles and quote them.",
  alternates: { canonical: "/find-my-car" },
};

export default function Page() {
  return <FindMyCar />;
}
