import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
/*
Config: Adjust these before running.
Run: npm run seed
*/

import { linksCollection, ensureIndexes } from "../lib/db";
import type { Link } from "../lib/db";
import clientPromise from "../lib/mongodb";
import { generateSlug } from "../lib/slug";

// ---------- Configuration ----------
const USER_ID = process.env.SEED_USER_ID || "690a3b8dfc512be540fc52dc"; // MongoDB _id string of a user
const COUNT = Number(process.env.SEED_COUNT || 7);
const BASE_ORIGINAL_URL = process.env.SEED_BASE_URL || "https://example.com/articles";
const TITLE_PREFIX = process.env.SEED_TITLE_PREFIX || "Seeded Link";
const CUSTOM_SLUG_PREFIX = process.env.SEED_SLUG_PREFIX || ""; // leave empty to use random slugs
// -----------------------------------

async function uniqueSlug(col: Awaited<ReturnType<typeof linksCollection>>, desired?: string): Promise<string> {
	let attempt = 0;
	let slug = desired || generateSlug();
	while (await col.findOne({ slug })) {
		attempt += 1;
		slug = desired ? `${desired}-${attempt}` : generateSlug();
		if (attempt > 20) throw new Error("Unable to generate unique slug after many attempts");
	}
	return slug;
}

async function main() {
	if (!process.env.MONGODB_URI) {
		throw new Error("MONGODB_URI not found; ensure .env.local is configured");
	}
	if (!USER_ID || USER_ID === "replace-with-userId") {
		console.error("Please set USER_ID (or SEED_USER_ID env) to a valid user id.");
		process.exit(1);
	}
	await clientPromise; // ensure connection
	await ensureIndexes();
	const col = await linksCollection();

	let inserted = 0;
	for (let i = 1; i <= COUNT; i += 1) {
		const baseSlug = CUSTOM_SLUG_PREFIX ? `${CUSTOM_SLUG_PREFIX}${i}` : undefined;
		const slug = await uniqueSlug(col, baseSlug);
		const now = new Date();
		const originalUrl = `${BASE_ORIGINAL_URL}/${i}-${now.getTime()}`;
        const title = `${TITLE_PREFIX} ${i}`;
        const doc: Link = {
            userId: USER_ID,
            originalUrl,
            slug,
            title,
            createdAt: now,
            updatedAt: now,
            clickCount: 0,
        };
        await col.insertOne(doc);
		inserted += 1;
		process.stdout.write(`Inserted ${slug}\n`);
	}
	console.log(`\nDone. Inserted ${inserted} links.`);
	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
