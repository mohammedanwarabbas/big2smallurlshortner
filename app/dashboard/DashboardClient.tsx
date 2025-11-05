"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	Stack,
	Snackbar,
	Alert,
	Typography,
} from "@mui/material";
import Spinner from "@/components/Spinner";

const LinkForm = dynamic(() => import("@/components/LinkForm"), { ssr: false });
const LinksTable = dynamic(() => import("@/components/LinksTable"), { ssr: false });

export default function DashboardClient() {
	const { data: session, status } = useSession();
	const [refreshKey, setRefreshKey] = useState(0);
	const [editOpen, setEditOpen] = useState(false);
    type EditData = {
        _id: string;
        slug: string;
        originalUrl: string;
        title?: string;
        _originalSlug?: string;
        _originalUrl?: string;
        _originalTitle?: string;
    } | null;
    const [editData, setEditData] = useState<EditData>(null);
	const [editError, setEditError] = useState<string | null>(null);
	const [editLoading, setEditLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});

    useEffect(() => {
        function onEdit(e: Event) {
            const link = (e as CustomEvent<NonNullable<EditData>>).detail;
			setEditData({
				...link,
				_originalSlug: link.slug,
				_originalUrl: link.originalUrl,
				_originalTitle: link.title,
			});
			setEditError(null);
			setEditOpen(true);
		}
        window.addEventListener("edit-link", onEdit as EventListener);
        return () => window.removeEventListener("edit-link", onEdit as EventListener);
	}, []);

	function getFirstName(name?: string | null) {
		if (!name) return "User";
		return name.split(" ")[0];
	}

	if (status === "loading") return <Spinner />;
	if (!session) {
		return (
			<div className="p-8">
				<p className="mb-4">You must sign in to view your dashboard.</p>
				<Button variant="contained" onClick={() => signIn("google")}>
					Sign in with Google
				</Button>
			</div>
		);
	}

    async function onSaveEdit() {
		if (!editData?._id) return;
        const originalSlug = editData._originalSlug;
		if (
			editData.slug === originalSlug &&
			editData.originalUrl === editData._originalUrl &&
			editData.title === editData._originalTitle
		) {
			setEditError("You didn't change anything");
			setSnackbar({
				open: true,
				message: "You didn't change anything",
				severity: "error",
			});
			return;
		}
		setEditLoading(true);
		setEditError(null);
		try {
			const res = await fetch(`/api/links/${editData._id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					originalUrl: editData.originalUrl,
					slug: editData.slug,
					title: editData.title,
				}),
			});
			if (!res.ok) {
				const data = await res.json();
				const errorMsg = data.error || "Failed to update link";
				setEditError(errorMsg);
				setSnackbar({
					open: true,
					message: errorMsg,
					severity: "error",
				});
			} else {
				setEditOpen(false);
				setEditData(null);
				setEditError(null);
				setSnackbar({
					open: true,
					message: "Link updated successfully",
					severity: "success",
				});
				setRefreshKey((k) => k + 1);
			}
		} catch {
			const errorMsg = "An error occurred while updating the link";
			setEditError(errorMsg);
			setSnackbar({ open: true, message: errorMsg, severity: "error" });
		} finally {
			setEditLoading(false);
		}
	}

	function handleCloseEdit() {
		setEditOpen(false);
		setEditData(null);
		setEditError(null);
	}

	return (
		<div className="mx-auto max-w-5xl p-6">
			<Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
				Hello, {getFirstName(session.user?.name)}!
			</Typography>
			<Typography
				variant="h6"
				sx={{ mb: 4, color: "text.secondary", fontWeight: 400 }}
			>
				Dashboard
			</Typography>

			<div className="mb-6 rounded border p-4">
				<h2 className="mb-2 text-lg font-medium">Create a new short link</h2>
				<LinkForm onCreated={() => setRefreshKey((k) => k + 1)} />
			</div>

			<Box sx={{ borderRadius: 1, border: "1px solid #e5e7eb", p: 2 }}>
				<LinksTable
					refreshKey={refreshKey}
					onEdited={() => setRefreshKey((k) => k + 1)}
				/>
			</Box>

			<Dialog open={editOpen} onClose={handleCloseEdit} fullWidth>
				<DialogTitle>Edit Link</DialogTitle>
				<DialogContent>
					<Stack spacing={2} className="mt-2">
                        <TextField
							label="Title"
							value={editData?.title || ""}
                            onChange={(e) => {
                                if (!editData) return;
                                setEditData({ ...editData, title: e.target.value });
                            }}
						/>
						<TextField
							label="Slug"
							value={editData?.slug || ""}
                            onChange={(e) => {
                                if (!editData) return;
                                setEditData({ ...editData, slug: e.target.value });
                                setEditError(null);
                            }}
							error={!!editError}
							helperText={editError || "Unique identifier for your short link"}
						/>
						<TextField
							label="Original URL"
							value={editData?.originalUrl || ""}
                            onChange={(e) => {
                                if (!editData) return;
                                setEditData({ ...editData, originalUrl: e.target.value });
                            }}
						/>
						{editError && (
							<Alert
								severity="error"
								onClose={() => setEditError(null)}
							>
								{editError}
							</Alert>
						)}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseEdit} disabled={editLoading}>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={onSaveEdit}
						disabled={editLoading}
					>
						{editLoading ? "Saving..." : "Save"}
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
