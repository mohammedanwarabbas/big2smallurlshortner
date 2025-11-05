"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

export default function LinkPopup({ open, onClose, url, title = "Full URL" }: { open: boolean; onClose: () => void; url: string; title?: string }) {
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				{title}
				<IconButton onClick={handleCopy} size="small" color={copied ? "success" : "default"}>
					<ContentCopyIcon fontSize="small" />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Typography
					variant="body2"
					sx={{
						wordBreak: "break-all",
						whiteSpace: "pre-wrap",
						overflowWrap: "break-word",
						maxHeight: "60vh",
						overflowY: "auto",
						p: 2,
						backgroundColor: "#f5f5f5",
						borderRadius: 1,
					}}
				>
					{url}
				</Typography>
				{copied && (
					<Typography variant="caption" sx={{ color: "success.main", mt: 1, display: "block" }}>
						Copied to clipboard!
					</Typography>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}

