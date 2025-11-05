import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
			<h1 className="text-4xl font-extrabold tracking-tight">Page Not Found</h1>
			<p className="mt-2 max-w-xl text-zinc-600">The page you’re looking for doesn’t exist or has been moved.</p>
            <Link href="/" className="mt-6 rounded-md bg-black px-5 py-2 text-white">Go Home</Link>
		</div>
	);
}
