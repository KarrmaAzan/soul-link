import { Avatar, Box, Button, ButtonBase, Card, Chip, Divider, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Diversity2RoundedIcon from "@mui/icons-material/Diversity2Rounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import ExpressionComposer from "../components/ExpressionComposer";
import MomentsFeed from "../components/MomentsFeed";
import type { Moment, Persona, SoulLink } from "../types/models";

type HomeProps = {
  activePersona: Persona | null;
  personas: Persona[];
  soulLinks: SoulLink[];
  moments: Moment[];
  onDelete: (id: number) => void;
  onSwitchPersona: (id: number) => void;
  onCreateMoment: () => void;
  onCreatePersona: () => void;
};

export default function Home({
  activePersona,
  personas,
  soulLinks,
  moments,
  onDelete,
  onSwitchPersona,
  onCreateMoment,
  onCreatePersona,
}: HomeProps) {
  const navigate = useNavigate();
  const visibleMoments = activePersona ? moments.filter((moment) => moment.personaId === activePersona.id) : [];
  const connectionCount = activePersona
    ? soulLinks.filter((link) => link.status === "accepted" && (link.requesterPersonaId === activePersona.id || link.recipientPersonaId === activePersona.id)).length
    : 0;

  return (
    <Stack spacing={{ xs: 3.5, md: 4.5 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 335, md: 355 },
          borderRadius: { xs: 4, md: 5 },
          border: "1px solid rgba(235,229,255,.10)",
          background:
            "radial-gradient(circle at 78% 24%, rgba(255,113,143,.25), transparent 18rem), radial-gradient(circle at 20% 100%, rgba(98,221,191,.14), transparent 24rem), linear-gradient(135deg, rgba(29,24,57,.98), rgba(12,14,28,.96) 62%)",
          p: { xs: 3, sm: 4.5, md: 5.5 },
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: { xs: 220, md: 350 },
            height: { xs: 220, md: 350 },
            borderRadius: "50%",
            border: "1px solid rgba(213,201,255,.16)",
            right: { xs: -85, sm: 24 },
            top: { xs: -72, md: -52 },
            animation: "orbit 38s linear infinite",
            "&::before": { content: '""', position: "absolute", width: 16, height: 16, borderRadius: "50%", background: "#FF879A", top: "18%", left: "4%", boxShadow: "0 0 34px rgba(255,120,145,.85)" },
            "&::after": { content: '""', position: "absolute", inset: "24%", border: "1px dashed rgba(108,231,194,.22)", borderRadius: "50%" },
          }}
        />

        <Box sx={{ position: "relative", maxWidth: 760 }}>
          <Chip icon={<AutoAwesomeRoundedIcon />} label="A social space for every side of you" variant="outlined" sx={{ mb: 2.25, background: "rgba(8,9,20,.28)", borderColor: "rgba(255,255,255,.16)" }} />
          <Typography variant="h1" sx={{ fontSize: "clamp(2.7rem, 6.2vw, 5rem)" }}>
            Your voice. Your people. <Box component="span" sx={{ color: "primary.light" }}>Every you.</Box>
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 610, fontSize: { sm: "1.05rem" } }}>
            Express each part of who you are, then connect from a place that feels honest.
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2.5 }}>
            <Chip label={`${personas.length} ${personas.length === 1 ? "persona" : "personas"}`} size="small" sx={{ background: "rgba(169,139,255,.1)" }} />
            <Chip label={`${connectionCount} ${connectionCount === 1 ? "connection" : "connections"}`} size="small" sx={{ background: "rgba(108,231,194,.08)", color: "info.main" }} />
            <Chip label={`${visibleMoments.length} expressions`} size="small" sx={{ background: "rgba(255,131,149,.08)", color: "secondary.light" }} />
          </Stack>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.5fr) minmax(290px, .65fr)" }, gap: 3 }}>
        <Stack spacing={3}>
          <ExpressionComposer activePersona={activePersona} onCreateMoment={onCreateMoment} onCreatePersona={onCreatePersona} onGoLive={() => navigate("/world")} />

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.75 }}>
              <Box>
                <Typography variant="overline" color="primary.light">Your timeline</Typography>
                <Typography variant="h4">Latest expressions</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{visibleMoments.length} shared</Typography>
            </Stack>
            <MomentsFeed moments={visibleMoments} onDelete={onDelete} />
          </Box>
        </Stack>

        <Stack spacing={2.25}>
          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box><Typography variant="overline" color="secondary.light">Your voices</Typography><Typography variant="h6">Express as</Typography></Box>
              <ButtonBase onClick={onCreatePersona} aria-label="Create a new persona" sx={{ width: 36, height: 36, borderRadius: "50%", color: "primary.light", background: "rgba(169,139,255,.09)" }}><AddRoundedIcon /></ButtonBase>
            </Stack>
            <Stack spacing={1}>
              {personas.slice(0, 5).map((persona, index) => {
                const active = persona.id === activePersona?.id;
                const gradients = ["linear-gradient(145deg,#7659C9,#B85C7B)", "linear-gradient(145deg,#287C79,#6862CA)", "linear-gradient(145deg,#A15F75,#D08A6E)"];
                return (
                  <ButtonBase key={persona.id} onClick={() => onSwitchPersona(persona.id)} sx={{ width: "100%", p: 1, borderRadius: 2.5, justifyContent: "flex-start", textAlign: "left", border: "1px solid", borderColor: active ? "rgba(169,139,255,.32)" : "transparent", background: active ? "rgba(169,139,255,.08)" : "transparent" }}>
                    <Avatar sx={{ width: 40, height: 40, mr: 1.25, fontSize: ".9rem", fontWeight: 750, background: gradients[index % gradients.length], boxShadow: active ? "0 0 0 3px rgba(169,139,255,.15)" : "none" }}>{persona.name.charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" noWrap sx={{ fontWeight: 750 }}>{persona.name}</Typography><Typography variant="caption" color="text.secondary" noWrap>{persona.niche}</Typography></Box>
                    {active && <Typography variant="caption" color="primary.light" sx={{ fontWeight: 750 }}>Active</Typography>}
                  </ButtonBase>
                );
              })}
            </Stack>
          </Card>

          <Card sx={{ p: 2.75, borderRadius: 3.5, background: "linear-gradient(145deg, rgba(26,31,48,.95), rgba(13,16,28,.9))" }}>
            <Stack spacing={1.75}>
              <Box sx={{ width: 42, height: 42, borderRadius: 2.5, display: "grid", placeItems: "center", color: "info.main", background: "rgba(108,231,194,.09)" }}><Diversity2RoundedIcon /></Box>
              <Box><Typography variant="h6">Find your people</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Build a circle around who you are—not a follower count.</Typography></Box>
              <Button color="inherit" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate("/soul-links")} sx={{ alignSelf: "flex-start", px: 0 }}>Explore Soul Links</Button>
            </Stack>
          </Card>

          <Card sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.4}>
              <Avatar sx={{ width: 48, height: 48, background: "linear-gradient(145deg,#7658C9,#C35E7B)", fontWeight: 750 }}>{activePersona?.name.charAt(0).toUpperCase() || "?"}</Avatar>
              <Box sx={{ minWidth: 0 }}><Typography variant="caption" color="text.secondary">Currently visible as</Typography><Typography variant="body1" noWrap sx={{ fontWeight: 750 }}>{activePersona?.name || "No persona"}</Typography></Box>
            </Stack>
            <Divider sx={{ my: 1.75 }} />
            <Typography variant="body2" color="text.secondary">{activePersona?.bio || "Give this persona a story in your Sanctum."}</Typography>
            <Button variant="outlined" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate("/sanctum")} fullWidth sx={{ mt: 2 }}>Enter Sanctum</Button>
          </Card>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1, color: "text.secondary" }}><LockRoundedIcon sx={{ fontSize: 15 }} /><Typography variant="caption">You choose which version of you appears</Typography></Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
