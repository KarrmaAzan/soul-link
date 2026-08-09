import type { ReactNode } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BrandMark from "./BrandMark";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  copy: string;
  children: ReactNode;
};

export default function AuthShell({ eyebrow, title, copy, children }: AuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(360px, .95fr) minmax(480px, 1.05fr)" },
        p: { xs: 1.25, sm: 2, md: 2.5 },
        gap: { md: 2 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 250, sm: 300, md: "calc(100vh - 40px)" },
          borderRadius: { xs: 4, md: 5 },
          border: "1px solid rgba(235,229,255,.11)",
          background:
            "radial-gradient(circle at 68% 27%, rgba(255,112,139,.25), transparent 18rem), radial-gradient(circle at 22% 78%, rgba(94,225,192,.16), transparent 20rem), linear-gradient(145deg, #1A1635 0%, #0E1022 58%, #101425 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 3, sm: 4, md: 6 },
        }}
      >
        <BrandMark />

        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: { xs: 230, md: 410 },
            height: { xs: 230, md: 410 },
            borderRadius: "50%",
            border: "1px solid rgba(202,188,255,.18)",
            right: { xs: -60, md: -50 },
            top: { xs: 20, md: "13%" },
            animation: "orbit 32s linear infinite",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#FF8FA2",
              left: "16%",
              top: "8%",
              boxShadow: "0 0 32px rgba(255,122,145,.9)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: "19%",
              borderRadius: "50%",
              border: "1px dashed rgba(109,231,194,.22)",
            },
          }}
        />

        <Box sx={{ position: "relative", maxWidth: 590, mt: { xs: 7, md: 0 } }}>
          <Chip
            icon={<AutoAwesomeRoundedIcon />}
            label="A quieter social space"
            variant="outlined"
            sx={{ mb: 2.5, borderColor: "rgba(255,255,255,.15)", background: "rgba(8,9,20,.25)" }}
          />
          <Typography variant="h2" sx={{ maxWidth: 540 }}>
            Be every version of <Box component="span" sx={{ color: "primary.light" }}>yourself.</Box>
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2.25, maxWidth: 500, fontSize: { sm: "1.05rem" } }}>
            Build distinct personas, share honest moments, and create connections that feel intentional.
          </Typography>
        </Box>

        <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
          {[["Private", "by design"], ["Personal", "by choice"], ["Connected", "with care"]].map(([top, bottom]) => (
            <Box key={top}>
              <Typography sx={{ fontWeight: 700 }}>{top}</Typography>
              <Typography variant="caption" color="text.secondary">{bottom}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ display: "grid", placeItems: "center", p: { xs: 1.25, sm: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 520,
            p: { xs: 2.5, sm: 4.5 },
            borderRadius: 4,
            border: "1px solid rgba(235,229,255,.09)",
            background: "rgba(16,18,33,.74)",
            backdropFilter: "blur(24px)",
          }}
        >
          <Typography variant="overline" color="primary.light">{eyebrow}</Typography>
          <Typography variant="h3" sx={{ mt: .75 }}>{title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3.5 }}>{copy}</Typography>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
