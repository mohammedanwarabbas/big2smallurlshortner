"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { CssBaseline, ThemeProvider, StyledEngineProvider } from "@mui/material";
import React from "react";
import { theme } from "@/lib/theme";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const muiCache = createCache({ key: "mui", prepend: true });

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<Provider store={store}>
				<CacheProvider value={muiCache}>
					<StyledEngineProvider injectFirst>
						<ThemeProvider theme={theme}>
							<CssBaseline />
                            <Navbar />
                            {children}
							<Footer />
						</ThemeProvider>
					</StyledEngineProvider>
				</CacheProvider>
			</Provider>
		</SessionProvider>
	);
}
