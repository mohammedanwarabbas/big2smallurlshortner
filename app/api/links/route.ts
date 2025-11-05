import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { linksCollection, ensureIndexes } from "@/lib/db";
import type { Link } from "@/lib/db";
import { z } from "zod";
import { generateSlug } from "@/lib/slug";

const createSchema = z.object({
	originalUrl: z.string().url(),
	slug: z.string().min(3).max(64).regex(/^[a-zA-Z0-9-_]+$/).optional(),
	title: z.string().max(120).optional(),
});

const DAILY_LIMIT = 100;

export async function GET() {
	await ensureIndexes();
	const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string; email?: string | null } | undefined)?.id;
    if (!session?.user?.email || !userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const links = await (await linksCollection())
		.find({ userId })
		.sort({ createdAt: -1 })
		.toArray();
	return NextResponse.json({ links });
}

export async function POST(req: Request) {
	await ensureIndexes();
	const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string; email?: string | null } | undefined)?.id;
    if (!session?.user?.email || !userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const json = await req.json();
	const parsed = createSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const { originalUrl, slug: customSlug, title } = parsed.data;

	const col = await linksCollection();
	// Daily rate limit
	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);
	const createdToday = await col.countDocuments({ userId, createdAt: { $gte: startOfDay } });
	if (createdToday >= DAILY_LIMIT) {
		return NextResponse.json({ error: "Daily create limit reached" }, { status: 429 });
	}

	// Determine unique slug
	let slug = customSlug?.trim() || generateSlug();
	let attempts = 0;
	while (await col.findOne({ slug })) {
		attempts += 1;
		if (customSlug) {
			return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
		}
		slug = generateSlug();
		if (attempts > 10) break;
	}

    const now = new Date();
    const doc: Link = {
		userId,
		originalUrl,
		slug,
		title: title?.trim() || undefined,
		createdAt: now,
		updatedAt: now,
		clickCount: 0,
    };
    await col.insertOne(doc);
	return NextResponse.json({ link: doc }, { status: 201 });
}
