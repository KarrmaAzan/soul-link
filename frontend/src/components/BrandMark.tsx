import { Box, Stack, Typography } from "@mui/material";

type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <Box
        aria-hidden="true"
        sx={{
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          position: "relative",
          flex: "0 0 auto",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: "15% 29%",
            borderRadius: "50%",
            border: "2px solid #C1AEFF",
            transform: "rotate(38deg)",
            boxShadow: "0 0 22px rgba(169,139,255,.35)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: "15% 29%",
            borderRadius: "50%",
            border: "2px solid #FF93A3",
            transform: "rotate(-38deg)",
            boxShadow: "0 0 22px rgba(255,131,149,.28)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: compact ? 6 : 7,
            height: compact ? 6 : 7,
            borderRadius: "50%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "#F7F3FF",
            boxShadow: "0 0 14px rgba(255,255,255,.8)",
          }}
        />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: compact ? "1rem" : "1.14rem",
            fontWeight: 760,
            letterSpacing: "-0.045em",
            lineHeight: 1,
          }}
        >
          soul<span style={{ color: "#A98BFF" }}>link</span>
        </Typography>
        {!compact && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ letterSpacing: "0.13em", textTransform: "uppercase", fontSize: "0.58rem" }}
          >
            identity network
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
