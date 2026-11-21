import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { PRISMIC_CACHE_TAG } from "@/prismicio";

function safeEqual(a: string, b: string) {
	const ab = Buffer.from(a);
	const bb = Buffer.from(b);
	return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Prismic webhook target. Requires REVALIDATE_SECRET. Accepts the secret either
 * as the `secret` field in the JSON body (how Prismic webhooks send it) or as an
 * `Authorization: Bearer <secret>` header.
 */
export async function POST(request: Request) {
	const expected = process.env.REVALIDATE_SECRET;
	if (!expected) {
		return NextResponse.json(
			{ error: "REVALIDATE_SECRET is not configured" },
			{ status: 500 },
		);
	}

	let provided = "";
	const auth = request.headers.get("authorization");
	if (auth?.startsWith("Bearer ")) provided = auth.slice(7);
	if (!provided) {
		try {
			const body = await request.json();
			if (typeof body?.secret === "string") provided = body.secret;
		} catch {
			// no JSON body
		}
	}

	if (!provided || !safeEqual(provided, expected)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	revalidateTag(PRISMIC_CACHE_TAG);

	return NextResponse.json({ revalidated: true, now: Date.now() });
}
