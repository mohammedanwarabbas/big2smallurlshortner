"use client";

import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				backgroundColor: "#1a202c",
				borderTop: "1px solid #2d3748",
				py: 4,
				mt: "auto",
			}}
		>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: "center" }}>
					<Typography variant="body2" sx={{ color: "#cbd5e0", mb: 1 }}>
						© {new Date().getFullYear()} B2S URL Shortener. All rights reserved.
					</Typography>
					<Typography variant="body2" sx={{ color: "#a0aec0" }}>
						Developed by Mohammed Anwar
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}

