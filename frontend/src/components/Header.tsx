import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Header() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Soul Link
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          )}
        </Box>

        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;