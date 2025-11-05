"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel, GridRowId } from "@mui/x-data-grid";
import {
	IconButton,
	Stack,
	Tooltip,
	Card,
	CardContent,
	Typography,
	Box,
	useMediaQuery,
	useTheme,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	NoSsr,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LinkPopup from "./LinkPopup";

export type LinkRow = {
	_id?: string;
	originalUrl: string;
	slug: string;
	title?: string;
	clickCount: number;
	createdAt: string | Date;
};

export default function LinksTable({
	refreshKey,
	onEdited,
}: {
	refreshKey: number;
	onEdited: () => void;
}) {
	const router = useRouter();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });

	const [rows, setRows] = useState<LinkRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [popupOpen, setPopupOpen] = useState(false);
	const [popupUrl, setPopupUrl] = useState("");
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [toDelete, setToDelete] = useState<LinkRow | null>(null);
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 25,
	});

	// mapping of row IDs to their global indices
	const rowIdToIndexMap = React.useMemo(() => {
		const map = new Map<GridRowId, number>();
		rows.forEach((row, index) => {
			if (row._id) {
				map.set(row._id, index);
			}
		});
		return map;
	}, [rows]);

	function truncateUrl(url: string, maxLength = 40) {
		if (url.length <= maxLength) return url;
		return url.substring(0, maxLength) + "...";
	}

	function showFullUrl(url: string) {
		setPopupUrl(url);
		setPopupOpen(true);
	}

	async function load() {
		setLoading(true);
		try {
			const res = await fetch("/api/links", { cache: "no-store" });
			const data = await res.json();
			setRows(data.links || []);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refreshKey]);

	function askDelete(row: LinkRow) {
		setToDelete(row);
		setConfirmOpen(true);
	}

	async function confirmDelete() {
		if (!toDelete?._id) return;
		await fetch(`/api/links/${toDelete._id}`, { method: "DELETE" });
		setConfirmOpen(false);
		setToDelete(null);
		onEdited();
	}

	const columns: GridColDef[] = [
		{
			field: "sn",
			headerName: "#",
			width: 70,
			sortable: false,
			renderCell: (params) => {
				const globalIndex = rowIdToIndexMap.get(params.id);
				
				if (globalIndex !== undefined && globalIndex !== -1) {
					return (globalIndex + 1).toString();
				}
				
				// Fallback: try to calculate based on current visible rows
				try {
					const page = paginationModel.page;
					const pageSize = paginationModel.pageSize;
					const visibleIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
					
					if (visibleIndex !== undefined && visibleIndex !== -1) {
						return (page * pageSize + visibleIndex + 1).toString();
					}
				} catch (error) {
					console.log("sn error in visible index calc");
				}
				
				return "—";
			},
		},
		{
			field: "title",
			headerName: "Title",
			flex: 1,
			valueGetter: (v, r) => r.title || "—",
		},
		{
			field: "slug",
			headerName: "Short URL",
			flex: 1,
			renderCell: (p) => (
				<Link href={`/go/${p.row.slug}`} target="_blank" className="underline">
					/go/{p.row.slug}
				</Link>
			),
		},
		{
			field: "originalUrl",
			headerName: "Destination",
			flex: 2,
			renderCell: (p) => (
				<button
					onClick={() => showFullUrl(p.row.originalUrl)}
					className="text-left text-blue-600 underline hover:text-blue-800"
				>
					{truncateUrl(p.row.originalUrl, 60)}
				</button>
			),
		},
		{
			field: "clickCount",
			headerName: "Clicks",
			width: 100,
			renderCell: (p) => (
				<button
					onClick={() => router.push(`/analytics/${p.row._id}`)}
					className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800 hover:underline"
				>
					{p.row.clickCount}
				</button>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			sortable: false,
			renderCell: (p) => (
				<Stack direction="row" spacing={1}>
					<Tooltip title="Analytics">
						<IconButton
							size="small"
							onClick={() => router.push(`/analytics/${p.row._id}`)}
						>
							<AnalyticsIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Edit">
						<IconButton
							size="small"
							onClick={() =>
								window.dispatchEvent(
									new CustomEvent("edit-link", { detail: p.row })
								)
							}
						>
							<EditIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete">
						<IconButton
							size="small"
							color="error"
							onClick={() => askDelete(p.row)}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	// 📱 Mobile view - fix serial number calculation
	if (isMobile) {
		return (
			<>
				{rows.map((row, idx) => {
					const globalIndex = idx + 1;
					
					return (
						<Card key={row._id} sx={{ mb: 2 }}>
							<CardContent>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
									<Typography variant="overline" sx={{ fontWeight: 700 }}>
										#{globalIndex}
									</Typography>
									<Typography variant="h6" sx={{ mb: 0, fontWeight: 600 }}>
										{row.title || "Untitled Link"}
									</Typography>
								</Box>
								<Box sx={{ mb: 1 }}>
									<Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
										Short URL:
									</Typography>
									<Link
										href={`/go/${row.slug}`}
										target="_blank"
										className="text-blue-600 underline"
									>
										/go/{row.slug}
									</Link>
								</Box>
								<Box sx={{ mb: 1 }}>
									<Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
										Destination:
									</Typography>
									<Typography
										variant="body2"
										onClick={() => showFullUrl(row.originalUrl)}
										sx={{
											cursor: "pointer",
											color: "primary.main",
											textDecoration: "underline",
											wordBreak: "break-word",
										}}
									>
										{truncateUrl(row.originalUrl)}
									</Typography>
								</Box>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mt: 2,
									}}
								>
									<Box sx={{ display: "flex", gap: 1 }}>
										<IconButton size="small" onClick={() => router.push(`/analytics/${row._id}`)}>
											<AnalyticsIcon fontSize="small" />
										</IconButton>
										<IconButton
											size="small"
											onClick={() =>
												window.dispatchEvent(new CustomEvent("edit-link", { detail: row }))
											}
										>
											<EditIcon fontSize="small" />
										</IconButton>
										<IconButton size="small" color="error" onClick={() => askDelete(row)}>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Box>
									<button
										onClick={() => router.push(`/analytics/${row._id}`)}
										className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
									>
										{row.clickCount} clicks
									</button>
								</Box>
							</CardContent>
						</Card>
					);
				})}
				{rows.length === 0 && !loading && (
					<Typography sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
						No links yet
					</Typography>
				)}
				<LinkPopup open={popupOpen} onClose={() => setPopupOpen(false)} url={popupUrl} title="Full URL" />
				<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
					<DialogTitle>Delete Link</DialogTitle>
					<DialogContent>
						<Typography>Are you sure you want to delete this link?</Typography>
						{toDelete && (
							<Typography sx={{ mt: 1 }} color="text.secondary">
								Slug: <strong>/{toDelete.slug}</strong>
							</Typography>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
						<Button color="error" variant="contained" onClick={confirmDelete}>
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}

	// 💻 Desktop DataGrid with virtualization disabled
	return (
		<>
			<div style={{ width: "100%" }}>
				<div style={{ height: 520, width: "100%" }}>
					<NoSsr defer>
						<DataGrid
							getRowId={(r) => r._id as string}
							rows={rows}
							columns={columns}
							loading={loading}
							disableRowSelectionOnClick
							localeText={{ noRowsLabel: "No links yet" }}
							paginationModel={paginationModel}
							onPaginationModelChange={(m) => setPaginationModel(m)}
							disableVirtualization // to stop insertBefore crash
							pageSizeOptions={[10, 25, 50, 100]}
						/>
					</NoSsr>
				</div>
			</div>

			<LinkPopup open={popupOpen} onClose={() => setPopupOpen(false)} url={popupUrl} title="Full URL" />
			<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
				<DialogTitle>Delete Link</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to delete this link?</Typography>
					{toDelete && (
						<Typography sx={{ mt: 1 }} color="text.secondary">
							Slug: <strong>/{toDelete.slug}</strong>
						</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
					<Button color="error" variant="contained" onClick={confirmDelete}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}