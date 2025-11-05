"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Typography, Box, IconButton, NoSsr } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GoogleIcon from "@/components/GoogleIcon";

export default function Navbar() {
	const { data: session } = useSession();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	function getFirstName(name?: string | null) {
		if (!name) return "User";
		return name.split(" ")[0];
	}

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<NoSsr>
			<AppBar position="sticky" elevation={0} sx={{ backgroundColor: "white", color: "black", borderBottom: "1px solid #e5e7eb" }}>
				<Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
					<Link href="/" className="flex items-center no-underline">
						<Image src="/logo.png" alt="b2s Logo" width={40} height={40} className="object-contain" />
					</Link>

					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						{session?.user ? (
							<>
								<Typography variant="body1" sx={{ color: "black", fontWeight: 500, display: { xs: "none", sm: "block" } }}>
									Hello, {getFirstName(session.user.name)}
								</Typography>
								<IconButton onClick={handleClick} size="small" sx={{ ml: 1 }} aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
									<Avatar sx={{ width: 32, height: 32, bgcolor: "#6366f1" }} src={session.user.image || undefined} alt={session.user.name || "User"}>
										{!session.user.image && (session.user.name?.[0] || session.user.email?.[0] || "U")}
									</Avatar>
								</IconButton>
								<Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} PaperProps={{ elevation: 3, sx: { overflow: "visible", filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))", mt: 1.5, minWidth: 200, maxWidth: 320, "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 } } }}>
									<MenuItem disabled>
										<Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, width: "100%", overflow: "hidden" }}>
											<Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", wordBreak: "break-word", whiteSpace: "normal" }}>
												{session.user.name || "User"}
											</Typography>
											<Typography variant="caption" sx={{ color: "text.secondary", wordBreak: "break-word", whiteSpace: "normal" }}>
												{session.user.email}
											</Typography>
										</Box>
									</MenuItem>
									<MenuItem component={Link} href="/dashboard" sx={{ textDecoration: "none", color: "inherit" }}>
										<DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
										Dashboard
									</MenuItem>
									<MenuItem onClick={async () => { handleClose(); await signOut({ redirect: false }); router.push("/"); }} sx={{ color: "error.main" }}>
										<LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
										Logout
									</MenuItem>
								</Menu>
							</>
						) : (
							<Button startIcon={<Box sx={{ bgcolor: "white", p: 0.5, borderRadius: 1, display: "flex" }}><GoogleIcon size={18} /></Box>} variant="contained" onClick={() => signIn("google")} sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", textTransform: "none", px: 2.5, py: 1, borderRadius: 2, "&:hover": { background: "linear-gradient(135deg, #5568d3 0%, #5a3780 100%)" } }}>
								<span className="hidden sm:inline">Sign in with Google</span>
								<span className="sm:hidden">Sign in</span>
							</Button>
						)}
					</Box>
				</Toolbar>
			</AppBar>
		</NoSsr>
	);
}

