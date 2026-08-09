import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { login, getMe } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import AuthShell from "../components/AuthShell";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await login({ identifier, password });
      const me = await getMe(auth.token);
      setAuth(auth.token, me);
      navigate(me.hasPersona ? "/" : "/persona-setup", { replace: true });
    } catch (requestError) {
      console.error(requestError);
      setError("We couldn't open your orbit. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Return to your orbit."
      copy="Your personas, moments, and private connections are waiting."
    >
      <Stack spacing={2.25} component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email or username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          autoComplete="username"
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          fullWidth
        />
        {error && <Alert severity="error" variant="outlined">{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<ArrowForwardRoundedIcon />}
          disabled={loading}
          sx={{ mt: .5 }}
        >
          {loading ? "Entering…" : "Enter Soul Link"}
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          New to the network?{" "}
          <Link to="/register" style={{ color: "#C7B6FF", fontWeight: 700 }}>
            Create your account
          </Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
