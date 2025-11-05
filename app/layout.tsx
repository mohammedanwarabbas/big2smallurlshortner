import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "b2s - big2small URL shortener",
	description: "Shorten URLs with analytics and Google login",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
				<Providers>
					<main style={{ flex: 1 }}>{children}</main>
				</Providers>
			</body>
		</html>
	);
}
