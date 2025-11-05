"use client";

import React, { useState } from "react";
import { Button, Stack, Alert } from "@mui/material";

type FieldErrors = {
	originalUrl?: string;
	slug?: string;
	title?: string;
	form?: string;
};

function isValidUrl(value: string): boolean {
	try {
		const u = new URL(value);
		return !!u.protocol && !!u.host;
	} catch {
		return false;
	}
}

function validateClient(values: { originalUrl: string; slug?: string; title?: string }): FieldErrors {
	const next: FieldErrors = {};
	if (!isValidUrl(values.originalUrl)) next.originalUrl = "Please enter a valid URL (including http/https)";
	if (values.slug) {
		if (!/^[a-zA-Z0-9-_]+$/.test(values.slug)) next.slug = "Only letters, numbers, hyphen and underscore are allowed";
		else if (values.slug.length < 3) next.slug = "Slug must be at least 3 characters";
		else if (values.slug.length > 64) next.slug = "Slug must be at most 64 characters";
	}
	if (values.title && values.title.length > 120) next.title = "Title must be at most 120 characters";
	return next;
}

export default function LinkForm({ onCreated }: { onCreated: () => void }) {
	const [originalUrl, setOriginalUrl] = useState("");
	const [slug, setSlug] = useState("");
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<FieldErrors>({});

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		const preErrors = validateClient({ originalUrl, slug, title });
		if (preErrors.originalUrl || preErrors.slug || preErrors.title) {
			setErrors(preErrors);
			return;
		}
		setLoading(true);
		setErrors({});

		try {
			const res = await fetch("/api/links", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					originalUrl,
					slug: slug || undefined,
					title: title || undefined,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				const nextErrors: FieldErrors = {};
				if (data?.error?.fieldErrors) {
					const fe = data.error.fieldErrors as Record<string, string[]>;
					if (fe.originalUrl?.length) nextErrors.originalUrl = fe.originalUrl.join(", ");
					if (fe.slug?.length) nextErrors.slug = fe.slug.join(", ");
					if (fe.title?.length) nextErrors.title = fe.title.join(", ");
				}
				if (!nextErrors.slug && res.status === 409 && typeof data?.error === "string") {
					nextErrors.slug = data.error;
				}
				if (!nextErrors.originalUrl && !nextErrors.slug && !nextErrors.title) {
					nextErrors.form = typeof data?.error === "string" ? data.error : data?.error?.message || "Failed to create link";
				}
				setErrors(nextErrors);
			} else {
				setOriginalUrl("");
				setSlug("");
				setTitle("");
				onCreated();
			}
        } catch (err: unknown) {
            const message = typeof err === "object" && err && "message" in err ? String((err as { message?: unknown }).message) : "An unexpected error occurred";
            setErrors({ form: message });
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={submit} className="w-full">
			<Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
				<div className="w-full">
					<input
						placeholder="Original URL"
						required
						value={originalUrl}
						onChange={(e) => {
							setOriginalUrl(e.target.value);
							if (errors.originalUrl) setErrors({ ...errors, originalUrl: undefined });
						}}
						aria-invalid={!!errors.originalUrl}
						className={`w-full rounded-md border px-3 py-2 outline-none ${errors.originalUrl ? "border-red-500 focus:border-red-500" : "border-zinc-300 focus:border-blue-500"}`}
					/>
					<div className="h-5">{errors.originalUrl && <p className="mt-1 text-xs text-red-600">{errors.originalUrl}</p>}</div>
				</div>

				<div>
					<input
						placeholder="Custom alias (optional)"
						value={slug}
						onChange={(e) => {
							setSlug(e.target.value);
							if (errors.slug) setErrors({ ...errors, slug: undefined });
						}}
						aria-invalid={!!errors.slug}
						className={`rounded-md border px-3 py-2 outline-none ${errors.slug ? "border-red-500 focus:border-red-500" : "border-zinc-300 focus:border-blue-500"}`}
					/>
					<div className="h-5">{errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}</div>
				</div>

				<div>
					<input
						placeholder="Title (optional)"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
							if (errors.title) setErrors({ ...errors, title: undefined });
						}}
						aria-invalid={!!errors.title}
						className={`rounded-md border px-3 py-2 outline-none ${errors.title ? "border-red-500 focus:border-red-500" : "border-zinc-300 focus:border-blue-500"}`}
					/>
					<div className="h-5">{errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}</div>
				</div>

				<Button type="submit" variant="contained" disabled={loading} className="self-start">
					{loading ? "Creating..." : "Shorten"}
				</Button>
			</Stack>

			{errors.form && (
				<Alert severity="error" sx={{ mt: 2, fontSize: "0.875rem", borderRadius: "8px", lineHeight: 1.4 }}>
					{errors.form}
				</Alert>
			)}
		</form>
	);
}
