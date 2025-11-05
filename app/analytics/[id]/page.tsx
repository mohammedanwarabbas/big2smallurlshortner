import type { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
	title: "Analytics | B2S",
	description: "View detailed click analytics for your short links.",
	openGraph: {
		title: "B2S Link Analytics",
		description: "View detailed click analytics for your short links.",
		type: "website",
	},
};

export default function Page() {
	return <AnalyticsClient />;
}
