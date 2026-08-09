import { useState } from "react";
import { Avatar, Box, Button, Card, Chip, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Diversity2RoundedIcon from "@mui/icons-material/Diversity2Rounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import type { Persona, SoulLink } from "../types/models";

type SoulLinkProps = {
  activePersona: Persona | null;
  personas: Persona[];
  soulLinks: SoulLink[];
  onSendSoulLinkRequest: (recipientId: number) => void;
  onAcceptSoulLinkRequest: (linkId: number) => void;
};

export default function SoulLinks({ activePersona, personas, soulLinks, onSendSoulLinkRequest, onAcceptSoulLinkRequest }: SoulLinkProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchablePersonas = activePersona ? personas.filter((persona) => persona.id !== activePersona.id) : [];
  const query = searchTerm.trim().toLowerCase();
  const filteredPersonas = searchablePersonas.filter((persona) => !query || `${persona.name} ${persona.niche} ${persona.bio}`.toLowerCase().includes(query));
  const pendingRequests = activePersona ? soulLinks.filter((link) => link.recipientPersonaId === activePersona.id && link.status === "pending") : [];
  const acceptedLinks = activePersona ? soulLinks.filter((link) => link.status === "accepted" && (link.requesterPersonaId === activePersona.id || link.recipientPersonaId === activePersona.id)) : [];

  function getOtherPersona(link: SoulLink) {
    if (!activePersona) return null;
    const id = link.requesterPersonaId === activePersona.id ? link.recipientPersonaId : link.requesterPersonaId;
    return personas.find((persona) => persona.id === id) || null;
  }

  function hasExistingSoulLink(targetId: number) {
    if (!activePersona) return false;
    return soulLinks.some((link) => (link.requesterPersonaId === activePersona.id && link.recipientPersonaId === targetId) || (link.requesterPersonaId === targetId && link.recipientPersonaId === activePersona.id));
  }

  if (!activePersona) {
    return <Card sx={{ p: 5, textAlign: "center" }}><Typography variant="h4">Select a persona first</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Soul Links are always created from a specific identity.</Typography></Card>;
  }

  return (
    <Stack spacing={{ xs: 3.5, md: 4.5 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr auto" }, alignItems: "end", gap: 2 }}>
        <Box>
          <Typography variant="overline" color="secondary.light">Intentional connections</Typography>
          <Typography variant="h2">Soul Links</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 660 }}>Connect the people who belong in this persona’s world—without turning your relationships into a popularity contest.</Typography>
        </Box>
        <Chip avatar={<Avatar>{activePersona.name.charAt(0).toUpperCase()}</Avatar>} label={`Connecting as ${activePersona.name}`} variant="outlined" sx={{ px: .5, height: 44 }} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1.35fr) minmax(310px,.65fr)" }, gap: 3 }}>
        <Stack spacing={2.25}>
          <TextField
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, niche, or energy…"
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: "text.secondary" }} /></InputAdornment> }}
          />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))" }, gap: 1.5 }}>
            {filteredPersonas.length === 0 ? (
              <Card sx={{ gridColumn: "1/-1", p: 4, borderRadius: 3.5, textAlign: "center", borderStyle: "dashed" }}><Typography variant="h6">No new signals found</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Try another search or invite more people into your network.</Typography></Card>
            ) : filteredPersonas.map((persona, index) => {
              const linked = hasExistingSoulLink(persona.id);
              const gradients = ["linear-gradient(145deg,#7659C9,#B85C7B)", "linear-gradient(145deg,#287C79,#6862CA)", "linear-gradient(145deg,#A15F75,#D08A6E)"];
              return (
                <Card key={persona.id} sx={{ p: 2.5, borderRadius: 3.5, transition: "180ms ease", "&:hover": { transform: "translateY(-2px)", borderColor: "rgba(169,139,255,.24)" } }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ width: 48, height: 48, background: gradients[index % gradients.length], fontWeight: 750 }}>{persona.name.charAt(0).toUpperCase()}</Avatar><Box sx={{ minWidth: 0 }}><Typography variant="h6" noWrap>{persona.name}</Typography><Typography variant="caption" color="info.main">{persona.niche}</Typography></Box></Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 45 }}>{persona.bio || "A new presence in the Soul Link network."}</Typography>
                    <Button variant={linked ? "outlined" : "contained"} startIcon={linked ? <CheckRoundedIcon /> : <PersonAddAlt1RoundedIcon />} disabled={linked} onClick={() => onSendSoulLinkRequest(persona.id)} fullWidth>{linked ? "Link in motion" : "Send Soul Link"}</Button>
                  </Stack>
                </Card>
              );
            })}
          </Box>
        </Stack>

        <Stack spacing={2}>
          <Card sx={{ p: 2.75, borderRadius: 3.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}><Box><Typography variant="overline" color="secondary.light">Awaiting you</Typography><Typography variant="h5">Requests</Typography></Box><Chip label={pendingRequests.length} size="small" color="secondary" /></Stack>
            {pendingRequests.length === 0 ? <Stack alignItems="center" spacing={1} sx={{ py: 3, textAlign: "center" }}><HourglassTopRoundedIcon sx={{ color: "text.secondary" }} /><Typography variant="body2" color="text.secondary">No requests waiting right now.</Typography></Stack> : <Stack spacing={1.25}>{pendingRequests.map((link) => { const requester = personas.find((persona) => persona.id === link.requesterPersonaId); return <Box key={link.id} sx={{ p: 1.5, borderRadius: 2.5, background: "rgba(255,255,255,.025)", border: "1px solid rgba(235,229,255,.07)" }}><Stack direction="row" spacing={1.25} alignItems="center"><Avatar sx={{ width: 38, height: 38, fontSize: ".9rem" }}>{requester?.name.charAt(0).toUpperCase() || "?"}</Avatar><Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{requester?.name || "Unknown persona"}</Typography><Typography variant="caption" color="text.secondary">wants to connect</Typography></Box><Button size="small" onClick={() => onAcceptSoulLinkRequest(link.id)}>Accept</Button></Stack></Box>; })}</Stack>}
          </Card>

          <Card sx={{ p: 2.75, borderRadius: 3.5, background: "linear-gradient(145deg,rgba(24,29,44,.96),rgba(13,15,28,.92))" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}><Box><Typography variant="overline" color="info.main">Your circle</Typography><Typography variant="h5">Connected</Typography></Box><Diversity2RoundedIcon sx={{ color: "info.main" }} /></Stack>
            {acceptedLinks.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No accepted links yet. The best circles begin small.</Typography> : <Stack spacing={1.1}>{acceptedLinks.map((link) => { const persona = getOtherPersona(link); return <Stack key={link.id} direction="row" spacing={1.25} alignItems="center" sx={{ py: .8 }}><Avatar sx={{ width: 39, height: 39, background: "linear-gradient(145deg,#287C79,#6862CA)", fontSize: ".9rem" }}>{persona?.name.charAt(0).toUpperCase() || "?"}</Avatar><Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{persona?.name || "Unknown persona"}</Typography><Typography variant="caption" color="text.secondary" noWrap>{persona?.niche || "Soul linked"}</Typography></Box><CheckRoundedIcon sx={{ color: "info.main", fontSize: 18 }} /></Stack>; })}</Stack>}
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
