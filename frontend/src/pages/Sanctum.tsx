import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { Persona, Moment, SoulLink } from "../types/models";

type SanctumProps = {
  activePersona: Persona | null;
  moments: Moment[];
  personas: Persona[];
  soulLinks: SoulLink[];
  onSwitchPersona: (id: number) => void;
  onOpenSoulLinks: () => void;
};

function Sanctum({
  activePersona,
  moments,
  personas,
  soulLinks,
  onSwitchPersona,
  onOpenSoulLinks,
}: SanctumProps) {
  const personaMoments = activePersona
    ? moments.filter((moment) => moment.personaId === activePersona.id)
    : [];

  const activeSoulLinks = activePersona
    ? soulLinks.filter(
        (link) =>
          link.status === "accepted" &&
          (link.requesterPersonaId === activePersona.id ||
            link.recipientPersonaId === activePersona.id)
      )
    : [];

  if (!activePersona) {
    return (
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Sanctum
          </Typography>
          <Typography color="text.secondary">
            Create a persona to begin shaping your presence.
          </Typography>
        </Box>

        <Card sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No active persona selected yet.
          </Typography>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Sanctum
        </Typography>
        <Typography color="text.secondary">
          Your active persona, presence, and moments.
        </Typography>
      </Box>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(34,197,94,0.16) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {activePersona.name.charAt(0).toUpperCase()}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5">{activePersona.name}</Typography>
              <Typography color="primary.main" sx={{ fontWeight: 600 }}>
                {activePersona.niche}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {activePersona.bio}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              disableRipple
              sx={{
                flex: 1,
                p: 0,
                minWidth: 0,
                justifyContent: "flex-start",
                color: "text.primary",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <Stack spacing={0.25} alignItems="flex-start">
                <Typography variant="h6">{personaMoments.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Moments
                </Typography>
              </Stack>
            </Button>

            <Button
              variant="text"
              onClick={onOpenSoulLinks}
              sx={{
                flex: 1,
                p: 0,
                minWidth: 0,
                justifyContent: "flex-start",
                color: "text.primary",
              }}
            >
              <Stack spacing={0.25} alignItems="flex-start">
                <Typography variant="h6">{activeSoulLinks.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Soul Links
                </Typography>
              </Stack>
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Switch Persona</Typography>

          {personas.length === 0 ? (
            <Typography color="text.secondary">
              No personas created yet.
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {personas.map((persona) => {
                const isActive = activePersona.id === persona.id;

                return (
                  <Chip
                    key={persona.id}
                    label={isActive ? `${persona.name} • Active` : persona.name}
                    onClick={() => onSwitchPersona(persona.id)}
                    clickable={!isActive}
                    color={isActive ? "primary" : "default"}
                    variant={isActive ? "filled" : "outlined"}
                    sx={{
                      borderRadius: 999,
                      px: 0.5,
                    }}
                  />
                );
              })}
            </Stack>
          )}
        </Stack>
      </Card>

      <Stack spacing={2}>
        <Typography variant="h6">Moments</Typography>

        {personaMoments.length === 0 ? (
          <Card sx={{ p: 3 }}>
            <Typography color="text.secondary">
              This persona has not posted any moments yet.
            </Typography>
          </Card>
        ) : (
          personaMoments.map((moment) => (
            <Card key={moment.id} sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Typography variant="body1">{moment.text}</Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    {new Date(moment.createdAt).toLocaleString()}
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption" color="text.secondary">
                      {moment.likes} likes
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moment.views} views
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
}

export default Sanctum;