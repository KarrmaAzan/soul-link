import { Avatar, Box, Button, Card, Chip, Divider, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom";
import type { Persona, Moment, SoulLink } from "../types/models";

type SanctumProps = {
  activePersona: Persona | null;
  moments: Moment[];
  personas: Persona[];
  soulLinks: SoulLink[];
  onSwitchPersona: (id: number) => void;
  onOpenSoulLinks: () => void;
};

export default function Sanctum({ activePersona, moments, personas, soulLinks, onSwitchPersona, onOpenSoulLinks }: SanctumProps) {
  const navigate = useNavigate();
  const personaMoments = activePersona ? moments.filter((moment) => moment.personaId === activePersona.id) : [];
  const activeSoulLinks = activePersona
    ? soulLinks.filter((link) => link.status === "accepted" && (link.requesterPersonaId === activePersona.id || link.recipientPersonaId === activePersona.id))
    : [];

  if (!activePersona) {
    return (
      <Card sx={{ p: { xs: 4, md: 7 }, textAlign: "center", borderRadius: 4 }}>
        <Typography variant="overline" color="primary.light">Sanctum</Typography>
        <Typography variant="h3" sx={{ mt: 1 }}>Your inner space needs a voice.</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3 }}>Create a persona to begin shaping your presence.</Typography>
        <Button variant="contained" onClick={() => navigate("/persona-setup")}>Create a persona</Button>
      </Card>
    );
  }

  return (
    <Stack spacing={{ xs: 3.5, md: 4.5 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-end" }} spacing={2}>
        <Box>
          <Typography variant="overline" color="primary.light">Private identity space</Typography>
          <Typography variant="h2">Your Sanctum</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Shape the signal before you share it.</Typography>
        </Box>
        <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => navigate("/persona-setup")}>Create persona</Button>
      </Stack>

      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 5,
          p: { xs: 3, sm: 4.5, md: 5.5 },
          background: "radial-gradient(circle at 80% 20%, rgba(255,119,147,.24), transparent 22rem), radial-gradient(circle at 18% 100%, rgba(111,232,198,.12), transparent 24rem), linear-gradient(135deg, rgba(29,24,58,.98), rgba(12,14,28,.96))",
        }}
      >
        <Box aria-hidden="true" sx={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", border: "1px solid rgba(216,204,255,.15)", right: -55, top: -95, "&::after": { content: '""', position: "absolute", inset: "22%", borderRadius: "50%", border: "1px dashed rgba(255,255,255,.12)" } }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2.5, sm: 3.5 }} alignItems={{ sm: "center" }} sx={{ position: "relative" }}>
          <Box sx={{ position: "relative", width: "fit-content" }}>
            <Avatar sx={{ width: { xs: 84, sm: 104 }, height: { xs: 84, sm: 104 }, fontSize: { xs: "2rem", sm: "2.5rem" }, fontWeight: 760, background: "linear-gradient(145deg,#8062D7,#C66181)", border: "4px solid rgba(255,255,255,.1)", boxShadow: "0 0 0 8px rgba(169,139,255,.08), 0 18px 40px rgba(0,0,0,.28)" }}>
              {activePersona.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ position: "absolute", right: 0, bottom: 2, width: 21, height: 21, borderRadius: "50%", bgcolor: "info.main", border: "4px solid #18152f" }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Chip icon={<AutoAwesomeRoundedIcon />} label="Active persona" size="small" sx={{ mb: 1.5, background: "rgba(169,139,255,.13)", color: "primary.light" }} />
            <Typography variant="h3">{activePersona.name}</Typography>
            <Typography color="info.main" sx={{ mt: .65, fontWeight: 700 }}>{activePersona.niche}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 670 }}>{activePersona.bio || "This persona is still becoming. Add a bio when the words arrive."}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={{ xs: 3, sm: 6 }} sx={{ position: "relative", mt: 4, pt: 3, borderTop: "1px solid rgba(235,229,255,.1)" }}>
          <Box><Typography variant="h4">{personaMoments.length}</Typography><Typography variant="caption" color="text.secondary">Moments</Typography></Box>
          <Box component="button" onClick={onOpenSoulLinks} sx={{ p: 0, border: 0, color: "inherit", textAlign: "left", background: "transparent", cursor: "pointer" }}><Typography variant="h4">{activeSoulLinks.length}</Typography><Typography variant="caption" color="text.secondary">Soul Links</Typography></Box>
          <Box><Typography variant="h4">{personas.length}</Typography><Typography variant="caption" color="text.secondary">Personas</Typography></Box>
        </Stack>
      </Card>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 2 }}>
          <Box><Typography variant="overline" color="secondary.light">Shift perspective</Typography><Typography variant="h4">Your personas</Typography></Box>
          <Typography variant="body2" color="text.secondary">One account, many contexts</Typography>
        </Stack>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))", md: "repeat(3, minmax(0,1fr))" }, gap: 1.5 }}>
          {personas.map((persona, index) => {
            const active = persona.id === activePersona.id;
            const colors = [["#7559C8", "#BE5D7C"], ["#277C78", "#6B65CC"], ["#9B5A7A", "#D28B70"]][index % 3];
            return (
              <Card
                key={persona.id}
                onClick={() => onSwitchPersona(persona.id)}
                sx={{ p: 2.25, borderRadius: 3.5, cursor: active ? "default" : "pointer", borderColor: active ? "rgba(169,139,255,.42)" : undefined, background: active ? "linear-gradient(145deg,rgba(34,29,62,.96),rgba(16,17,32,.94))" : undefined, "&:hover": { borderColor: "rgba(169,139,255,.35)", transform: active ? "none" : "translateY(-2px)" }, transition: "180ms ease" }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ background: `linear-gradient(145deg,${colors[0]},${colors[1]})`, fontWeight: 750 }}>{persona.name.charAt(0).toUpperCase()}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontWeight: 750 }} noWrap>{persona.name}</Typography><Typography variant="caption" color="text.secondary" noWrap>{persona.niche}</Typography></Box>
                  {active ? <CheckCircleRoundedIcon color="primary" fontSize="small" /> : <ArrowForwardRoundedIcon sx={{ color: "text.secondary", fontSize: 18 }} />}
                </Stack>
              </Card>
            );
          })}
        </Box>
      </Box>

      <Box>
        <Typography variant="overline" color="info.main">From this identity</Typography>
        <Typography variant="h4" sx={{ mb: 2 }}>Recent moments</Typography>
        {personaMoments.length === 0 ? (
          <Card sx={{ p: 3.5, borderRadius: 3.5, borderStyle: "dashed" }}><Typography color="text.secondary">This persona has not shared a moment yet.</Typography></Card>
        ) : (
          <Stack spacing={1.25}>
            {personaMoments.slice(0, 4).map((moment) => (
              <Card key={moment.id} sx={{ p: 2.5, borderRadius: 3.5 }}>
                <Typography>{moment.text}</Typography>
                <Divider sx={{ my: 1.75 }} />
                <Stack direction="row" justifyContent="space-between"><Typography variant="caption" color="text.secondary">{new Date(moment.createdAt).toLocaleDateString([], { dateStyle: "medium" })}</Typography><Typography variant="caption" color="text.secondary">{moment.likes} appreciations · {moment.views} views</Typography></Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
