import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Chip, Stack, TextField } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useAuthStore } from "../store/authStore";
import { getMe } from "../api/authApi";
import { createPersona } from "../api/personaApi";
import AuthShell from "../components/AuthShell";

export default function PersonaSetup() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return setError("You must be logged in to create a persona.");
    if (!name.trim() || !niche.trim()) return setError("Give this persona a name and a purpose.");
    setLoading(true);
    setError("");
    try {
      await createPersona(token, { name: name.trim(), niche: niche.trim(), bio: bio.trim() });
      const me = await getMe(token);
      setAuth(token, me);
      navigate((me.personas?.length ?? 0) > 1 ? "/sanctum" : "/", { replace: true });
    } catch (requestError) {
      console.error(requestError);
      setError("That persona couldn't be created. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow={user?.hasPersona ? "Expand your identity" : "First light"}
      title={user?.hasPersona ? "Bring another side to life." : "Shape your first persona."}
      copy="A persona gives each part of your life its own voice, context, and circle."
    >
      <Stack spacing={2.25} component="form" onSubmit={handleSubmit}>
        <Chip icon={<AutoAwesomeRoundedIcon />} label="You can switch personas anytime" variant="outlined" sx={{ alignSelf: "flex-start" }} />
        <TextField label="Persona name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Karrma Creates" required fullWidth />
        <TextField label="World or niche" value={niche} onChange={(event) => setNiche(event.target.value)} placeholder="Music, wellness, design…" required fullWidth />
        <TextField label="Short bio" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="What does this version of you care about?" multiline minRows={4} fullWidth inputProps={{ maxLength: 280 }} helperText={`${bio.length}/280`} />
        {error && <Alert severity="error" variant="outlined">{error}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? "Opening the orbit…" : "Bring this persona to life"}
        </Button>
        {user?.hasPersona && (
          <Button variant="text" onClick={() => navigate("/sanctum")}>Return to Sanctum</Button>
        )}
      </Stack>
    </AuthShell>
  );
}
