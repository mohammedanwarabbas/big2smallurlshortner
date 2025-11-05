import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		primary: {
			main: "#667eea",
			light: "#8fa3f0",
			dark: "#4a5fb8",
		},
		secondary: {
			main: "#764ba2",
			light: "#9a6bc4",
			dark: "#5a3780",
		},
		background: {
			default: "#ffffff",
			paper: "#ffffff",
		},
		text: {
			primary: "#1a202c",
			secondary: "#718096",
		},
	},
	shape: {
		borderRadius: 8,
	},
	typography: {
		fontFamily: "var(--font-geist-sans), Arial, sans-serif",
		h1: {
			fontWeight: 800,
		},
		h2: {
			fontWeight: 700,
		},
		h3: {
			fontWeight: 600,
		},
		h4: {
			fontWeight: 600,
		},
		h5: {
			fontWeight: 600,
		},
		h6: {
			fontWeight: 600,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 8,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 8,
				},
			},
		},
	},
});

