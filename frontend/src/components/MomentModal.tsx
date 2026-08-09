import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import type { Persona } from "../types/models";

type MomentModalProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onPost: () => void;
  onClose: () => void;
  activePersona: Persona | null;
};

export default function MomentModal({ open, value, onChange, onPost, onClose, activePersona }: MomentModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="overline" color="primary.light">Share your signal</Typography>
            <Typography variant="h5">Create a moment</Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close"><CloseRoundedIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.25}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Avatar sx={{ width: 38, height: 38, background: "linear-gradient(145deg,#7458C8,#C45E7C)", fontWeight: 750 }}>
              {activePersona?.name.charAt(0).toUpperCase() || "?"}
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">Posting to the orbit as</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{activePersona?.name || "No active persona"}</Typography>
            </Box>
          </Stack>
          <TextField
            autoFocus
            multiline
            minRows={6}
            placeholder="What's moving through your world?"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            inputProps={{ maxLength: 600 }}
            fullWidth
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={.75} color="text.secondary">
              <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: "info.main" }} />
              <Typography variant="caption">Moments belong to this persona</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">{value.length}/600</Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} color="inherit">Keep private</Button>
        <Button onClick={onPost} variant="contained" disabled={!activePersona || !value.trim()}>Share moment</Button>
      </DialogActions>
    </Dialog>
  );
}
