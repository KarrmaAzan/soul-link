import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { register, getMe } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const auth = await register(form);
      const me = await getMe(auth.token);
      setAuth(auth.token, me);

      navigate(me.hasPersona ? "/" : "/persona-setup", { replace: true });
    } catch (err) {
      setError("Registration failed");
      console.error(err);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4">Register</Typography>
          <TextField label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <TextField label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <TextField label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained">Create Account</Button>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}