import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { getMe } from "../api/authApi";

export default function PersonaSetup() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in");
      return;
    }

    if (!name.trim() || !niche.trim()) {
      setError("Name and niche are required");
      return;
    }

    try {
      setError("");

      await axios.post(
        "http://localhost:4000/api/personas",
        {
          name: name.trim(),
          niche: niche.trim(),
          bio: bio.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const me = await getMe(token);
      setAuth(token, me);

      const personaCount = me.personas?.length ?? 0;

      navigate(personaCount > 1 ? "/sanctum" : "/", { replace: true });
    } catch (err) {
      setError("Failed to create persona");
      console.error(err);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4">
            {user?.hasPersona ? "Create Another Persona" : "Create Your Persona"}
          </Typography>

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            fullWidth
          />

          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          {error && <Typography color="error">{error}</Typography>}

          <Button type="submit" variant="contained">
            Continue
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}