import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { register, getMe } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import AuthShell from "../components/AuthShell";

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await register(form);
      const me = await getMe(auth.token);
      setAuth(auth.token, me);
      navigate(me.hasPersona ? "/" : "/persona-setup", { replace: true });
    } catch (requestError) {
      console.error(requestError);
      setError("We couldn't create that account. Your email or username may already be in orbit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Begin here"
      title="Make space for every you."
      copy="Create one account, then shape the personas you want to bring into the world."
    >
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField label="First name" value={form.firstName} onChange={(event) => update("firstName", event.target.value)} autoComplete="given-name" required />
          <TextField label="Last name" value={form.lastName} onChange={(event) => update("lastName", event.target.value)} autoComplete="family-name" required />
        </Box>
        <TextField label="Username" value={form.username} onChange={(event) => update("username", event.target.value)} autoComplete="username" required fullWidth />
        <TextField label="Email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" required fullWidth />
        <TextField label="Password" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} autoComplete="new-password" required fullWidth helperText="Use at least 8 characters for a stronger account." />
        {error && <Alert severity="error" variant="outlined">{error}</Alert>}
        <Button type="submit" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} disabled={loading}>
          {loading ? "Creating your space…" : "Create my account"}
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already connected?{" "}
          <Link to="/login" style={{ color: "#C7B6FF", fontWeight: 700 }}>Log in</Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
