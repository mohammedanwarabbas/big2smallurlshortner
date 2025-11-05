"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography, Button, Paper, Chip, Card, CardContent, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format } from "date-fns";
import Spinner from "@/components/Spinner";
import LinkPopup from "@/components/LinkPopup";

type ClickData = {
	_id?: string;
	userAgent?: string;
	ip?: string;
	createdAt: string | Date;
};

type LinkData = {
	_id?: string;
	slug: string;
	originalUrl: string;
	title?: string;
	clickCount: number;
};

export default function AnalyticsClient() {
	const params = useParams();
	const router = useRouter();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { data: session } = useSession();
	const [loading, setLoading] = useState(true);
	const [link, setLink] = useState<LinkData | null>(null);
	const [clicks, setClicks] = useState<ClickData[]>([]);
	const [userAgentPopup, setUserAgentPopup] = useState(false);
	const [selectedUserAgent, setSelectedUserAgent] = useState("");

	useEffect(() => {
		if (!session) return;
		async function load() {
			setLoading(true);
			try {
				const res = await fetch(`/api/links/${params.id}/analytics`);
				if (!res.ok) {
					if (res.status === 401 || res.status === 404) {
						router.push("/dashboard");
						return;
					}
				}
				const data = await res.json();
				setLink(data.link);
				setClicks(data.clicks || []);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [params.id, session, router]);

	function showUserAgent(ua: string) {
		setSelectedUserAgent(ua);
		setUserAgentPopup(true);
	}

	function truncateUserAgent(ua: string, maxLength = 50) {
		if (!ua) return "—";
		if (ua.length <= maxLength) return ua;
		return ua.substring(0, maxLength) + "...";
	}

	const columns: GridColDef[] = [
		{ field: "sn", headerName: "#", width: 70, sortable: false, renderCell: (params) => (params.api.getRowIndexRelativeToVisibleRows(params.id) + 1).toString() },
		{ field: "createdAt", headerName: "Date & Time", minWidth: 180, flex: 1, valueFormatter: (value) => { if (!value) return "—"; try { return format(new Date(value), "PPpp"); } catch { return String(value); } } },
		{ field: "ip", headerName: "IP Address", minWidth: 120, flex: 0.8, valueGetter: (v) => v || "—" },
		{ field: "userAgent", headerName: "User Agent / Browser", minWidth: 200, flex: 2, valueGetter: (v) => v || "—", renderCell: (params) => { const ua = params.value || "—"; return (
			<Typography onClick={() => ua !== "—" && showUserAgent(ua)} sx={{ cursor: ua !== "—" ? "pointer" : "default", color: ua !== "—" ? "primary.main" : "text.secondary", textDecoration: ua !== "—" ? "underline" : "none", wordBreak: "break-word" }}>{truncateUserAgent(ua)}</Typography>
		);} },
	];

	if (loading) {
		return (
			<div className="w-full px-2 sm:px-4 md:px-6">
				<div className="mx-auto w-full max-w-6xl py-4 sm:py-6">
					<Spinner />
				</div>
			</div>
		);
	}

	if (!link) {
		return (
			<div className="w-full px-2 sm:px-4 md:px-6">
				<div className="mx-auto w-full max-w-6xl py-4 sm:py-6">
					<p>Link not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full px-2 sm:px-4 md:px-6">
			<div className="mx-auto w-full max-w-6xl py-4 sm:py-6">
				<Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/dashboard")} className="mb-4">
					Back to Dashboard
				</Button>

				<Paper className="mb-4 w-full p-3 sm:p-4">
					<Typography variant="h5" className="mb-2 break-words font-semibold">
						{link.title || "Untitled Link"}
					</Typography>
					<div className="flex flex-wrap justify-center gap-2">
						<Chip label={`Slug: /go/${link.slug}`} size="small" className="break-all" />
						<Chip label={`Total Clicks: ${link.clickCount}`} color="primary" size="small" />
						<Chip label={`Analytics Records: ${clicks.length}`} size="small" />
					</div>
					{link.originalUrl && (
						<Box sx={{ mt: 2 }}>
							<Typography variant="body2" className="mb-2 text-zinc-600">
								Destination: <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="break-all text-blue-600 underline">{link.originalUrl}</a>
							</Typography>
						</Box>
					)}
				</Paper>

				<Paper className="w-full p-3 sm:p-4">
					<Typography variant="h6" className="mb:3 font-medium">
						Click Analytics
					</Typography>
					{clicks.length === 0 ? (
						<Typography className="py-8 text-center text-zinc-500">No clicks recorded yet</Typography>
					) : isMobile ? (
						<Box>
							{clicks.map((click, idx) => (
								<Card key={click._id} sx={{ mb: 2 }}>
									<CardContent>
										<Typography variant="overline" sx={{ fontWeight: 700 }}>#{idx + 1}</Typography>
										<Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
											<strong>Date:</strong> {format(new Date(click.createdAt), "PPpp")}
										</Typography>
										<Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
											<strong>IP:</strong> {click.ip || "—"}
										</Typography>
										<Typography variant="body2" onClick={() => click.userAgent && showUserAgent(click.userAgent)} sx={{ color: click.userAgent ? "primary.main" : "text.secondary", cursor: click.userAgent ? "pointer" : "default", textDecoration: click.userAgent ? "underline" : "none", wordBreak: "break-word" }}>
											<strong>User Agent:</strong> {truncateUserAgent(click.userAgent || "")}
										</Typography>
									</CardContent>
								</Card>
							))}
						</Box>
					) : (
						<Box sx={{ width: "100%", overflow: "auto" }}>
							<div style={{ minWidth: 600, height: 600, width: "100%" }}>
								<DataGrid getRowId={(r) => r._id as string} rows={clicks} columns={columns} loading={loading} disableRowSelectionOnClick initialState={{ pagination: { paginationModel: { pageSize: 25 } } }} sx={{ "& .MuiDataGrid-cell": { wordBreak: "break-word" } }} localeText={{ noRowsLabel: "No clicks yet" }} />
							</div>
						</Box>
					)}
				</Paper>

				<LinkPopup open={userAgentPopup} onClose={() => setUserAgentPopup(false)} url={selectedUserAgent} title="Full User Agent" />
			</div>
		</div>
	);
}
