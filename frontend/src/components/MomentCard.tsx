import { useState } from "react";
import { Avatar, Box, Card, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import type { Moment } from "../types/models";

type MomentCardProps = {
  moment: Moment;
  onDelete: (id: number) => void;
};

export default function MomentCard({ moment, onDelete }: MomentCardProps) {
  const [copied, setCopied] = useState(false);
  const initial = moment.personaName?.charAt(0).toUpperCase() || "?";

  async function copyMoment() {
    try {
      await navigator.clipboard.writeText(`${moment.personaName} on Soul Link:\n\n${moment.text}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Could not copy moment:", error);
    }
  }

  return (
    <Card
      component="article"
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 2.25, sm: 2.75 },
        borderRadius: 3.5,
        transition: "transform 200ms ease, border-color 200ms ease, background 200ms ease",
        "&::before": {
          content: '""',
          position: "absolute",
          width: 3,
          left: 0,
          top: 24,
          bottom: 24,
          borderRadius: 999,
          background: "linear-gradient(#B49CFF,#FF8395,#6CE7C2)",
          opacity: .78,
        },
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "rgba(169,139,255,.22)",
          background: "linear-gradient(145deg, rgba(24,25,44,.96), rgba(14,16,29,.92))",
        },
      }}
    >
      <Stack direction="row" spacing={1.75} alignItems="flex-start">
        <Box sx={{ position: "relative" }}>
          <Avatar sx={{ width: 48, height: 48, background: "linear-gradient(145deg,#7659C9,#B85C7B)", fontWeight: 760 }}>{initial}</Avatar>
          <AutoAwesomeRoundedIcon sx={{ position: "absolute", right: -4, bottom: -3, fontSize: 15, color: "info.main", background: "#111321", borderRadius: "50%", p: .2 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
            <Box>
              <Stack direction="row" spacing={.75} alignItems="center" useFlexGap flexWrap="wrap">
                <Typography variant="subtitle2" sx={{ fontWeight: 760 }}>{moment.personaName}</Typography>
                <Chip label="Expression" size="small" sx={{ height: 20, fontSize: ".6rem", color: "primary.light", background: "rgba(169,139,255,.08)" }} />
              </Stack>
              <Typography variant="caption" color="text.secondary">{new Date(moment.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</Typography>
            </Box>
            <Tooltip title="Remove this expression">
              <IconButton size="small" onClick={() => onDelete(moment.id)} aria-label="Remove expression" sx={{ color: "text.secondary" }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
            </Tooltip>
          </Stack>

          <Typography variant="body1" sx={{ mt: 1.5, whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.74, fontSize: { sm: "1.02rem" } }}>{moment.text}</Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2.25, pt: 1.75, borderTop: "1px solid rgba(235,229,255,.07)" }}>
            <Stack direction="row" spacing={{ xs: 1.25, sm: 2 }} alignItems="center" sx={{ color: "text.secondary" }}>
              <Stack direction="row" spacing={.6} alignItems="center"><FavoriteBorderRoundedIcon sx={{ fontSize: 18, color: "secondary.light" }} /><Typography variant="caption">{moment.likes}<Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}> appreciate</Box></Typography></Stack>
              <Stack direction="row" spacing={.6} alignItems="center"><ChatBubbleOutlineRoundedIcon sx={{ fontSize: 17 }} /><Typography variant="caption">Respond</Typography></Stack>
              <Stack direction="row" spacing={.6} alignItems="center" sx={{ display: { xs: "none", sm: "flex" } }}><BarChartRoundedIcon sx={{ fontSize: 17 }} /><Typography variant="caption">{moment.views} reached</Typography></Stack>
            </Stack>
            <Tooltip title={copied ? "Copied" : "Copy expression"}>
              <IconButton size="small" onClick={copyMoment} aria-label="Copy expression" sx={{ color: copied ? "info.main" : "text.secondary" }}>
                {copied ? <CheckRoundedIcon fontSize="small" /> : <IosShareRoundedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
