import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { login, getMe } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const auth = await login({ identifier, password });
      const me = await getMe(auth.token);
      setAuth(auth.token, me);

      navigate(me.hasPersona ? "/" : "/persona-setup", { replace: true });
    } catch (err) {
      setError("Login failed");
      console.error(err);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4">Login</Typography>
          <TextField
            label="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained">Login</Button>
          <Typography variant="body2">
            No account? <Link to="/register">Register</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}