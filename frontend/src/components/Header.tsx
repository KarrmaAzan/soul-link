import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { Persona } from "../types/models";
import BrandMark from "./BrandMark";

type HeaderProps = {
  activePersona: Persona | null;
  onCreateMoment: () => void;
  onCreatePersona: () => void;
};

const navItems = [
  { label: "Feed", path: "/" },
  { label: "Soul Links", path: "/soul-links" },
  { label: "World", path: "/world" },
  { label: "Inbox", path: "/inbox" },
  { label: "Sanctum", path: "/sanctum" },
];

export default function Header({ activePersona, onCreateMoment, onCreatePersona }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        top: 12,
        zIndex: 1100,
        borderRadius: 999,
        border: "1px solid rgba(235,229,255,.1)",
        background: "rgba(11,12,25,.76)",
        backdropFilter: "blur(26px)",
        boxShadow: "0 14px 45px rgba(0,0,0,.22)",
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ minHeight: 68, px: { xs: 1.25, sm: 2 } }}>
        <Box
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer", display: "flex", alignItems: "center", mr: { md: 3.5 } }}
        >
          <BrandMark compact />
        </Box>

        <Stack
          component="nav"
          direction="row"
          spacing={0.25}
          sx={{ display: { xs: "none", md: "flex" }, flex: 1 }}
        >
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                size="small"
                sx={{
                  color: active ? "text.primary" : "text.secondary",
                  minHeight: 38,
                  px: 1.5,
                  background: active ? "rgba(169,139,255,.12)" : "transparent",
                  "&:hover": { background: "rgba(169,139,255,.09)", color: "text.primary" },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>

        <Box sx={{ flex: { xs: 1, md: 0 }, minWidth: 0, px: 1, display: { xs: "block", md: "none" } }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.1 }}>
            In orbit as
          </Typography>
          <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
            {activePersona?.name || user?.username || "Yourself"}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Tooltip title="Create a persona">
            <IconButton
              onClick={onCreatePersona}
              sx={{ display: { xs: "none", md: "inline-flex" }, color: "text.secondary" }}
            >
              <PersonAddAlt1RoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={onCreateMoment}
            sx={{ display: { xs: "none", md: "inline-flex" }, minHeight: 40, px: 2 }}
          >
            New moment
          </Button>
          <Tooltip title={`@${user?.username || "account"} — log out`}>
            <IconButton onClick={handleLogout} aria-label="Log out" sx={{ p: .5 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  fontSize: ".82rem",
                  fontWeight: 750,
                  color: "#F8F6FF",
                  background: "linear-gradient(145deg, #7458C8, #C45E7C)",
                  border: "1px solid rgba(255,255,255,.17)",
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || <LogoutRoundedIcon fontSize="small" />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </AppBar>
  );
}
