import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { linksCollection, ensureIndexes } from "@/lib/db";
import { z } from "zod";
import { ObjectId } from "mongodb";

const updateSchema = z.object({
	originalUrl: z.string().url().optional(),
	slug: z.string().min(3).max(64).regex(/^[a-zA-Z0-9-_]+$/).optional(),
	title: z.string().max(120).optional(),
});

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	await ensureIndexes();
	const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string; email?: string | null } | undefined)?.id;
    if (!session?.user?.email || !userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const resolved = await params;
	const _id = new ObjectId(resolved.id);

	const json = await _req.json();
	const parsed = updateSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const { originalUrl, slug, title } = parsed.data;
    const col = await linksCollection();
    const link = await col.findOne({ _id: _id as unknown as never, userId } as unknown as Record<string, unknown>);
	if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
	if (slug && slug !== link.slug) {
        const exists = await col.findOne({ slug } as unknown as Record<string, unknown>);
		if (exists) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
	}
	const now = new Date();
    await col.updateOne(
        { _id: _id as unknown as never, userId } as unknown as Record<string, unknown>,
        { $set: { originalUrl, slug, title, updatedAt: now } }
    );
    const updated = await col.findOne({ _id: _id as unknown as never, userId } as unknown as Record<string, unknown>);
	return NextResponse.json({ link: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	await ensureIndexes();
	const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string; email?: string | null } | undefined)?.id;
    if (!session?.user?.email || !userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const resolved = await params;
	const _id = new ObjectId(resolved.id);
	const col = await linksCollection();
    await col.deleteOne({ _id: _id as unknown as never, userId } as unknown as Record<string, unknown>);
	return NextResponse.json({ ok: true });
}
