import clientPromise from "./mongodb";
import type { Collection, Db } from "mongodb";

export type Link = {
	_id?: string;
	userId: string;
	originalUrl: string;
	slug: string;
	title?: string;
	createdAt: Date;
	updatedAt: Date;
	clickCount: number;
};

export type Click = {
	_id?: string;
	linkId: string;
	userAgent?: string;
	ip?: string;
	createdAt: Date;
};

export async function getDb(): Promise<Db> {
	const client = await clientPromise;
	return client.db();
}

export async function linksCollection(): Promise<Collection<Link>> {
	const db = await getDb();
	return db.collection<Link>("links");
}

export async function clicksCollection(): Promise<Collection<Click>> {
	const db = await getDb();
	return db.collection<Click>("clicks");
}

export async function ensureIndexes(): Promise<void> {
	const links = await linksCollection();
	await links.createIndex({ slug: 1 }, { unique: true });
	await links.createIndex({ userId: 1, createdAt: 1 });
	const clicks = await clicksCollection();
	await clicks.createIndex({ linkId: 1, createdAt: 1 });
}
