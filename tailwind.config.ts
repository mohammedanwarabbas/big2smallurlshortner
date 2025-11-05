import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f0f4ff",
					100: "#e0e9ff",
					200: "#c7d7fe",
					300: "#a4b9fc",
					400: "#818ef8",
					500: "#667eea",
					600: "#5568d3",
					700: "#4751ac",
					800: "#3d458a",
					900: "#363d70",
				},
				secondary: {
					50: "#faf5ff",
					100: "#f3e8ff",
					200: "#e9d5ff",
					300: "#d8b4fe",
					400: "#c084fc",
					500: "#764ba2",
					600: "#9333ea",
					700: "#7e22ce",
					800: "#6b21a8",
					900: "#581c87",
				},
			},
			backgroundImage: {
				"gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-up": "slideUp 0.5s ease-out",
				"pulse-slow": "pulse 3s ease-in-out infinite",
				"spin-slow": "spin 3s linear infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(20px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
		},
	},
	plugins: [],
};

export default config;

