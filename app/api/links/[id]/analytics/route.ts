import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { linksCollection, clicksCollection, ensureIndexes } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	await ensureIndexes();
	const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string; email?: string | null } | undefined)?.id;
    if (!session?.user?.email || !userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const resolved = await params;
	const _id = new ObjectId(resolved.id);

	const links = await linksCollection();
    const link = await links.findOne({ _id: _id as unknown as never, userId } as unknown as Record<string, unknown>);
	if (!link) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const clicks = await clicksCollection();
    const linkIdStr = ((link as { _id?: { toString(): string } })._id?.toString?.()) || resolved.id;
    const clickData = await clicks
        .find({ linkId: linkIdStr })
		.sort({ createdAt: -1 })
		.toArray();

	return NextResponse.json({ 
		link: {
			_id: link._id,
			slug: link.slug,
			originalUrl: link.originalUrl,
			title: link.title,
			clickCount: link.clickCount,
		},
		clicks: clickData.map(c => ({
			_id: c._id,
			userAgent: c.userAgent,
			ip: c.ip,
			createdAt: c.createdAt,
		})),
	});
}

