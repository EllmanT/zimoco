import "server-only";
import { createHash } from "crypto";
import { cookies } from "next/headers";

// DEMO gate only. Set ADMIN_DEMO_PASSWORD in the environment; the fallback below is for local demos.
export const DEMO_PASSWORD = process.env.ADMIN_DEMO_PASSWORD ?? "zimoco-demo";
export const COOKIE = "sb_admin";
export const token = () => createHash("sha256").update(`zimoco:${DEMO_PASSWORD}`).digest("hex");

export async function isAdmin() {
  return (await cookies()).get(COOKIE)?.value === token();
}
