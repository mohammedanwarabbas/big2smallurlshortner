"use client"; // ✅ Make this a client component

// import type { Metadata } from "next";
import dynamic from "next/dynamic";

// export const metadata: Metadata = {
// 	title: "Dashboard | B2S",
// 	description: "Manage your short links and view analytics.",
// 	openGraph: {
// 		title: "B2S Dashboard",
// 		description: "Manage your short links and view analytics.",
// 		type: "website",
// 	},
// };

// ✅ Now this is allowed since it's inside a client component
const DashboardClient = dynamic(() => import("./DashboardClient"), { ssr: false });

export default function Page() {
	return <DashboardClient />;
}
