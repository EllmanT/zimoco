import "server-only";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { Lead, LeadStatus } from "./leads";
import { seedLeads } from "./leads-seed";

// Demo store: JSON file. On Vercel the project dir is read-only, so fall back to the OS temp dir.
const dir = process.env.VERCEL ? path.join(os.tmpdir(), "zimoco") : path.join(process.cwd(), "data");
const file = path.join(dir, "leads.json");

async function readReal(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as Lead[];
  } catch {
    return [];
  }
}
async function write(all: Lead[]) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(all, null, 2));
}

export async function listLeads(): Promise<Lead[]> {
  const real = await readReal();
  return [...real, ...seedLeads()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(input: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead> {
  const all = await readReal();
  const year = new Date().getFullYear();
  const lead: Lead = { ...input, id: `RFQ-${year}-${String(all.length + 1).padStart(4, "0")}`, createdAt: new Date().toISOString(), status: "New" };
  all.push(lead);
  await write(all);
  return lead;
}

export async function setStatus(id: string, status: LeadStatus) {
  const all = await readReal();
  const l = all.find((x) => x.id === id);
  if (!l) return false;
  l.status = status;
  await write(all);
  return true;
}
