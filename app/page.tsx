import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
	title: "B2S - Big 2 Small URL Shortener | Shorten URLs with Analytics",
	description: "Transform long URLs into short, shareable links with powerful analytics. Track every click, understand your audience, and manage your links effortlessly. Developed by Mohammed Anwar.",
	keywords: ["URL shortener", "link shortener", "analytics", "URL tracker", "short links", "B2S"],
	authors: [{ name: "Mohammed Anwar" }],
	openGraph: {
		title: "B2S - Big 2 Small URL Shortener",
		description: "Transform long URLs into short, shareable links with powerful analytics.",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "B2S - Big 2 Small URL Shortener",
		description: "Transform long URLs into short, shareable links with powerful analytics.",
	},
};

export default function Home() {
	return <HomeClient />;
}
