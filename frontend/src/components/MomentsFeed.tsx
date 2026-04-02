import { Stack, Typography, Card } from "@mui/material";
import MomentCard from "./MomentCard";
import type { Moment } from "../types/models";

type MomentsFeedProps = {
  moments: Moment[];
  onDelete: (id: number) => void;
};

function MomentsFeed({ moments, onDelete }: MomentsFeedProps) {
  if (moments.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography color="text.secondary">
          No moments yet. Create your first one.
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={1.5}>
      {moments.map((moment) => (
        <MomentCard key={moment.id} moment={moment} onDelete={onDelete} />
      ))}
    </Stack>
  );
}

export default MomentsFeed;