"use client";

import dynamic from "next/dynamic";

// ✅ Client-only dynamic import for the heavy component
const DashboardClient = dynamic(() => import("./DashboardClient"), { ssr: false });

export default function DashboardWrapper() {
	return <DashboardClient />;
}
