import { Avatar, Box, Card, IconButton, Stack, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { Moment } from "../types/models";

type MomentCardProps = {
  moment: Moment;
  onDelete: (id: number) => void;
};

function MomentCard({ moment, onDelete }: MomentCardProps) {
  const initial = moment.personaName?.charAt(0).toUpperCase() || "?";

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar sx={{ width: 42, height: 42, fontWeight: 700 }}>
            {initial}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {moment.personaName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(moment.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <IconButton size="small" onClick={() => onDelete(moment.id)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Typography
              variant="body1"
              sx={{
                mt: 1,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.55,
              }}
            >
              {moment.text}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 1.5, color: "text.secondary" }}
            >
              <Stack direction="row" spacing={0.75} alignItems="center">
                <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption">{moment.likes}</Typography>
              </Stack>

              <Stack direction="row" spacing={0.75} alignItems="center">
                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption">{moment.views}</Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

export default MomentCard;