"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button, Box, Typography, Container, Card, CardContent, Chip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LinkIcon from "@mui/icons-material/Link";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SecurityIcon from "@mui/icons-material/Security";
import { SiReact, SiNextdotjs, SiMongodb, SiNodedotjs, SiTypescript, SiTailwindcss, SiRedux, SiMui } from "react-icons/si";
import GoogleIcon from "@/components/GoogleIcon";
import Spinner from "@/components/Spinner";

export default function HomeClient() {
	const { data: session, status } = useSession();

	const features = [
		{
			icon: <LinkIcon sx={{ fontSize: 40, color: "#6366f1" }} />,
			title: "Shorten URLs",
			description: "Create short, memorable links for any URL with optional custom aliases.",
		},
		{
			icon: <AnalyticsIcon sx={{ fontSize: 40, color: "#6366f1" }} />,
			title: "Detailed Analytics",
			description: "Track every click with date, time, browser info, and IP address (when available).",
		},
		{
			icon: <SecurityIcon sx={{ fontSize: 40, color: "#6366f1" }} />,
			title: "Secure & Private",
			description: "Google OAuth authentication ensures your links are private and secure.",
		},
	];

	const techStack = [
		{ name: "React", icon: <SiReact size={32} />, color: "#61DAFB" },
		{ name: "Next.js", icon: <SiNextdotjs size={32} />, color: "#000000" },
		{ name: "TypeScript", icon: <SiTypescript size={32} />, color: "#3178C6" },
		{ name: "MongoDB", icon: <SiMongodb size={32} />, color: "#47A248" },
		{ name: "Node.js", icon: <SiNodedotjs size={32} />, color: "#339933" },
		{ name: "Tailwind CSS", icon: <SiTailwindcss size={32} />, color: "#06B6D4" },
		{ name: "Redux", icon: <SiRedux size={32} />, color: "#764ABC" },
		{ name: "Material-UI", icon: <SiMui size={32} />, color: "#007FFF" },
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
			{/* Hero Section */}
			<Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
				<Box sx={{ textAlign: "center", mb: 8 }}>
					<Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
						<Image src="/logo.png" alt="b2s Logo" width={120} height={120} className="object-contain" />
					</Box>
					<Typography
						variant="h2"
						component="h1"
						sx={{
							fontWeight: 800,
							fontSize: { xs: "2.5rem", md: "3.5rem" },
							mb: 2,
							background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						Big 2 Small URL Shortener
					</Typography>
					<Typography variant="body1" sx={{ color: "text.secondary", mb: 4, maxWidth: 600, mx: "auto" }}>
						Transform long URLs into short, shareable links with powerful analytics. Track every click,
						understand your audience, and manage your links effortlessly.
					</Typography>
					<Typography variant="body2" sx={{ color: "text.secondary", mb: 4, fontStyle: "italic" }}>
						Developed by Mohammed Anwar
					</Typography>

					{status === "loading" ? (
						<Spinner />
					) : session ? (
						<Link href="/dashboard" className="no-underline">
							<Button variant="contained" size="large" startIcon={<DashboardIcon />} sx={{ px: 4, py: 1.5 }}>
								Go to Dashboard
							</Button>
						</Link>
					) : null}
				</Box>

				{/* Vector/Illustration Section */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						mb: 8,
						position: "relative",
					}}
				>
					<Box
						sx={{
							width: { xs: "100%", sm: "80%", md: "60%" },
							maxWidth: 500,
							height: 300,
							background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
							borderRadius: 4,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							position: "relative",
							overflow: "hidden",
							"&::before": {
								content: '""',
								position: "absolute",
								width: "150%",
								height: "150%",
								background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
								animation: "pulse 3s ease-in-out infinite",
							},
						}}
					>
						<LinkIcon sx={{ fontSize: 120, color: "white", opacity: 0.9, zIndex: 1, position: "relative" }} />
					</Box>
				</Box>

				{/* Features Section */}
				<Box sx={{ mb: 10 }}>
					<Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}>
						Features
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
						{features.map((feature, index) => (
							<Box key={index} sx={{ width: { xs: "100%", md: "30%" }, minWidth: { md: 280 } }}>
								<Card sx={{ height: "100%", textAlign: "center", p: 3, boxShadow: 2 }}>
									<CardContent>
										<Box sx={{ mb: 2 }}>{feature.icon}</Box>
										<Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
											{feature.title}
										</Typography>
										<Typography variant="body2" sx={{ color: "text.secondary" }}>
											{feature.description}
										</Typography>
									</CardContent>
								</Card>
							</Box>
						))}
					</Box>
				</Box>

				{/* Stats Section */}
				<Box sx={{ mb: 10, textAlign: "center" }}>
					<Card sx={{ p: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
						<Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
							100 Links Per Day
						</Typography>
						<Typography variant="body1" sx={{ opacity: 0.9 }}>
							Create up to 100 short links per day with detailed analytics for each click
						</Typography>
					</Card>
				</Box>

				{/* Analytics Preview */}
				<Box sx={{ mb: 10 }}>
					<Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}>
						Powerful Analytics
					</Typography>
					<Card sx={{ p: 4, boxShadow: 3 }}>
						<Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
							Get detailed insights into every click:
						</Typography>
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
							<Chip label="Date & Time" color="primary" />
							<Chip label="Browser Info" color="primary" />
							<Chip label="User Agent" color="primary" />
							<Chip label="IP Address" color="primary" />
						</Box>
						<Typography variant="caption" sx={{ display: "block", mt: 2, color: "text.secondary", textAlign: "center" }}>
							*IP address availability depends on browser settings and privacy configurations
						</Typography>
					</Card>
				</Box>

				{/* Technology Stack */}
				<Box sx={{ mb: 6 }}>
					<Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}>
						Built With Modern Technology
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
						{techStack.map((tech, index) => (
							<Box key={index} sx={{ width: { xs: "45%", sm: "22%", md: "18%" }, minWidth: { xs: 120 } }}>
								<Card
									sx={{
										p: 3,
										textAlign: "center",
										height: "100%",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										transition: "transform 0.2s, box-shadow 0.2s",
										"&:hover": {
											transform: "translateY(-4px)",
											boxShadow: 4,
										},
									}}
								>
									<Box sx={{ mb: 1, color: tech.color }}>{tech.icon}</Box>
									<Typography variant="body2" sx={{ fontWeight: 500 }}>
										{tech.name}
									</Typography>
								</Card>
							</Box>
						))}
					</Box>
				</Box>

				{/* CTA Section */}
				{!session && (
					<Box sx={{ textAlign: "center", py: 4 }}>
						<Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
							Ready to Get Started?
						</Typography>
						<Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
							Sign in with Google to start shortening your URLs today
						</Typography>
						<Button
							variant="contained"
							size="large"
							onClick={() => signIn("google")}
							startIcon={<Box sx={{ bgcolor: "white", p: 0.75, borderRadius: 1.5, display: "flex" }}><GoogleIcon size={20} /></Box>}
							sx={{
								px: 4,
								py: 1.5,
								background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
								"&:hover": {
									background: "linear-gradient(135deg, #5568d3 0%, #5a3780 100%)",
								},
							}}
						>
							Sign in with Google
						</Button>
					</Box>
				)}
			</Container>
		</div>
	);
}

