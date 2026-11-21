import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads-store";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";

export const metadata: Metadata = { title: "Leads (demo admin)", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LeadsAdmin() {
  if (!(await isAdmin())) return <AdminLogin />;
  const leads = await listLeads();
  return <Dashboard leads={leads} />;
}
