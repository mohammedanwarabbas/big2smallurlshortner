import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
	title: "Dashboard | B2S",
	description: "Manage your short links and view analytics.",
	openGraph: {
		title: "B2S Dashboard",
		description: "Manage your short links and view analytics.",
		type: "website",
	},
};

export default function Page() {
	return <DashboardClient />;
}
