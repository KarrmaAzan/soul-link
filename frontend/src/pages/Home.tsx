import { Box, Stack, Typography } from "@mui/material";
import MomentsFeed from "../components/MomentsFeed";
import type { Moment, Persona } from "../types/models";

type HomeProps = {
  activePersona: Persona | null;
  moments: Moment[];
  onDelete: (id: number) => void;
};

function Home({ activePersona, moments, onDelete }: HomeProps) {
  const visibleMoments = activePersona
    ? moments.filter((moment) => moment.personaId === activePersona.id)
    : [];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {activePersona ? `${activePersona.name}'s Moments` : "Moments"}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {activePersona
            ? `Viewing moments for ${activePersona.name}.`
            : "Select a persona to view moments."}
        </Typography>
      </Box>

      <MomentsFeed moments={visibleMoments} onDelete={onDelete} />
    </Stack>
  );
}

export default Home;