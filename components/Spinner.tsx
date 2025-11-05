"use client";

import { CircularProgress, Box } from "@mui/material";

export default function Spinner({ size = 40 }: { size?: number }) {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 2 }}>
			<CircularProgress size={size} sx={{ color: "#667eea" }} />
		</Box>
	);
}

