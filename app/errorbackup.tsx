"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
			<h1 className="text-3xl font-bold">Something went wrong</h1>
			<p className="mt-2 max-w-xl text-zinc-600">{error.message || "An unexpected error occurred."}</p>
			<button onClick={reset} className="mt-6 rounded-md bg-black px-5 py-2 text-white">Try again</button>
		</div>
	);
}
