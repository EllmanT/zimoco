import "server-only";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import nodemailer from "nodemailer";

export type Subscriber = { email: string; createdAt: string; source: string };

// Storage: MongoDB when MONGODB_URI is set, otherwise a JSON file (read-only project dir on Vercel, so the OS temp dir there).
const dir = process.env.VERCEL ? path.join(os.tmpdir(), "zimoco") : path.join(process.cwd(), "data");
const file = path.join(dir, "subscribers.json");

async function mongoCollection() {
  const { MongoClient } = await import("mongodb");
  const g = globalThis as unknown as { _zmMongo?: Promise<InstanceType<typeof MongoClient>> };
  g._zmMongo ??= new MongoClient(process.env.MONGODB_URI!).connect();
  const col = (await g._zmMongo).db(process.env.MONGODB_DB ?? "zimoco").collection<Subscriber>("subscribers");
  await col.createIndex({ email: 1 }, { unique: true });
  return col;
}

/** Returns false when the address was already subscribed. */
export async function addSubscriber(email: string, source = "footer"): Promise<boolean> {
  const sub: Subscriber = { email: email.toLowerCase(), createdAt: new Date().toISOString(), source };
  if (process.env.MONGODB_URI) {
    const col = await mongoCollection();
    const r = await col.updateOne({ email: sub.email }, { $setOnInsert: sub }, { upsert: true });
    return r.upsertedCount === 1;
  }
  let all: Subscriber[] = [];
  try { all = JSON.parse(await fs.readFile(file, "utf8")); } catch {}
  if (all.some((s) => s.email === sub.email)) return false;
  all.push(sub);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(all, null, 2));
  return true;
}

/** Simple SMTP. Skipped (returns false) until SMTP_HOST is configured. Sends a welcome note and a copy to the team. */
export async function sendSubscribeMail(email: string): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, NEWSLETTER_NOTIFY_TO } = process.env;
  if (!SMTP_HOST) return false;
  const t = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT ?? 587), secure: Number(SMTP_PORT) === 465, auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined });
  const from = SMTP_FROM ?? SMTP_USER ?? "no-reply@zimoco.co.zw";
  await t.sendMail({ from, to: email, subject: "Welcome to Zimoco", text: "Thank you for subscribing. We will share new arrivals, offers and news from Zimoco.\n\nZimoco, Harare" });
  if (NEWSLETTER_NOTIFY_TO) await t.sendMail({ from, to: NEWSLETTER_NOTIFY_TO, subject: "New newsletter subscriber", text: email });
  return true;
}
