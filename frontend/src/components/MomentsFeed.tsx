import { Box, Card, Stack, Typography } from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import MomentCard from "./MomentCard";
import type { Moment } from "../types/models";

type MomentsFeedProps = {
  moments: Moment[];
  onDelete: (id: number) => void;
};

export default function MomentsFeed({ moments, onDelete }: MomentsFeedProps) {
  if (moments.length === 0) {
    return (
      <Card sx={{ p: { xs: 3.5, sm: 5 }, borderRadius: 4, textAlign: "center", borderStyle: "dashed" }}>
        <Stack alignItems="center" spacing={1.5}>
          <Box sx={{ width: 58, height: 58, borderRadius: "50%", display: "grid", placeItems: "center", color: "primary.light", background: "rgba(169,139,255,.09)", border: "1px solid rgba(169,139,255,.17)" }}>
            <EditNoteRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h6">Your orbit is quiet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: .4 }}>Tap the create button when something feels worth holding onto.</Typography>
          </Box>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack spacing={1.5}>
      {moments.map((moment) => <MomentCard key={moment.id} moment={moment} onDelete={onDelete} />)}
    </Stack>
  );
}
