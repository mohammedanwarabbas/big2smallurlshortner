import { NextResponse, NextRequest } from "next/server";
import { clicksCollection, linksCollection, ensureIndexes } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
	await ensureIndexes();
	const { slug } = await params;
	const col = await linksCollection();
	const link = await col.findOne({ slug });
	if (!link) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const ua = req.headers.get("user-agent") || undefined;
	let ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	if (!ip || ip === "::1" || ip === "127.0.0.1") {
		try {
			const resp = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
			const data = await resp.json().catch(() => null);
			if (data?.ip) ip = data.ip as string;
		} catch {
			// ignore
		}
	}
	if (ip === "::1" || ip === "127.0.0.1") {
		ip = "localhost";
	}
    const clicks = await clicksCollection();
    const linkId = (typeof (link as { _id?: unknown })._id === "string")
        ? ((link as { _id?: string })._id as string)
        : ((link as { _id?: { toString(): string } })._id?.toString?.() || "");
    await clicks.insertOne({
        linkId,
		userAgent: ua,
		ip,
		createdAt: new Date(),
	});
    await col.updateOne({ slug }, { $inc: { clickCount: 1 } });

	return NextResponse.redirect(link.originalUrl, 302);
}
