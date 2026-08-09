import { Avatar, Box, ButtonBase, Card, Chip, Stack, Typography } from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { Persona } from "../types/models";

type ExpressionComposerProps = {
  activePersona: Persona | null;
  onCreateMoment: () => void;
  onCreatePersona: () => void;
  onGoLive: () => void;
};

const quickActions = [
  { label: "Write", icon: <EditNoteRoundedIcon />, tone: "primary" },
  { label: "Ask", icon: <FormatQuoteRoundedIcon />, tone: "secondary" },
] as const;

export default function ExpressionComposer({
  activePersona,
  onCreateMoment,
  onCreatePersona,
  onGoLive,
}: ExpressionComposerProps) {
  return (
    <Card
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 4,
        borderColor: "rgba(169,139,255,.2)",
        background:
          "linear-gradient(145deg, rgba(26,24,48,.96), rgba(14,16,30,.94))",
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                background: "linear-gradient(145deg,#7659C9,#C25E7C)",
                fontWeight: 760,
              }}
            >
              {activePersona?.name.charAt(0).toUpperCase() || "?"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary">
                Expressing as
              </Typography>
              <Typography variant="body2" noWrap sx={{ fontWeight: 750 }}>
                {activePersona?.name || "Choose a persona"}
              </Typography>
            </Box>
          </Stack>
          <Chip
            label="Your space"
            size="small"
            sx={{ display: { xs: "none", sm: "flex" }, background: "rgba(108,231,194,.08)", color: "info.main" }}
          />
        </Stack>

        <ButtonBase
          onClick={onCreateMoment}
          sx={{
            width: "100%",
            minHeight: { xs: 72, sm: 82 },
            px: { xs: 2, sm: 2.5 },
            borderRadius: 3,
            justifyContent: "space-between",
            textAlign: "left",
            border: "1px solid rgba(235,229,255,.1)",
            background: "rgba(5,6,15,.38)",
            transition: "border-color 180ms ease, background 180ms ease",
            "&:hover": {
              borderColor: "rgba(169,139,255,.36)",
              background: "rgba(169,139,255,.055)",
            },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 680, color: "text.primary" }}>
              What part of you wants to be seen?
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Share a thought, question, story, or feeling.
            </Typography>
          </Box>
          <Box
            sx={{
              width: 38,
              height: 38,
              flex: "0 0 auto",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "primary.contrastText",
              background: "linear-gradient(145deg,#C3B0FF,#9070E6)",
            }}
          >
            <ArrowForwardRoundedIcon fontSize="small" />
          </Box>
        </ButtonBase>

        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
          {quickActions.map((action) => (
            <ButtonBase
              key={action.label}
              onClick={onCreateMoment}
              sx={{
                px: 1.4,
                py: 0.8,
                gap: 0.7,
                borderRadius: 999,
                color: action.tone === "primary" ? "primary.light" : "secondary.light",
                background: action.tone === "primary" ? "rgba(169,139,255,.08)" : "rgba(255,131,149,.07)",
              }}
            >
              {action.icon}
              <Typography variant="caption" sx={{ fontWeight: 750 }}>{action.label}</Typography>
            </ButtonBase>
          ))}
          <ButtonBase onClick={onCreatePersona} sx={{ px: 1.4, py: .8, gap: .7, borderRadius: 999, color: "text.secondary" }}>
            <PersonAddAlt1RoundedIcon />
            <Typography variant="caption" sx={{ fontWeight: 750 }}>New persona</Typography>
          </ButtonBase>
          <ButtonBase onClick={onGoLive} sx={{ px: 1.4, py: .8, gap: .7, borderRadius: 999, color: "text.secondary" }}>
            <RadioButtonCheckedRoundedIcon sx={{ color: "#FF7188" }} />
            <Typography variant="caption" sx={{ fontWeight: 750 }}>Go live</Typography>
          </ButtonBase>
        </Stack>
      </Stack>
    </Card>
  );
}
