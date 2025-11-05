import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
const nanoid = customAlphabet(alphabet, 8);

export function generateSlug(length = 8): string {
	// If a different length is provided, create a sized generator on the fly
	return length === 8 ? nanoid() : customAlphabet(alphabet, length)();
}
