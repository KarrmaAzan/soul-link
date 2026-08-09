import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate } from "react-router-dom";

const worldLayers = [
  { icon: <ExploreRoundedIcon />, title: "Discover", copy: "Find voices and personas beyond your immediate circle." },
  { icon: <SensorsRoundedIcon />, title: "Go live", copy: "Share in real time without flattening your identity." },
  { icon: <Groups2RoundedIcon />, title: "Gather", copy: "Build public spaces around interests, not follower counts." },
];

export default function World() {
  const navigate = useNavigate();
  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 490, md: 570 },
          overflow: "hidden",
          borderRadius: { xs: 4, md: 5 },
          border: "1px solid rgba(235,229,255,.10)",
          background: "radial-gradient(circle at 50% 45%, rgba(160,123,255,.23), transparent 14rem), radial-gradient(circle at 78% 22%, rgba(255,116,144,.18), transparent 17rem), radial-gradient(circle at 16% 82%, rgba(102,229,194,.14), transparent 20rem), #0C0E1E",
          display: "grid",
          placeItems: "center",
          p: { xs: 3, sm: 5 },
          textAlign: "center",
        }}
      >
        {[0, 1, 2].map((ring) => (
          <Box key={ring} aria-hidden="true" sx={{ position: "absolute", width: { xs: 250 + ring * 105, md: 360 + ring * 155 }, height: { xs: 250 + ring * 105, md: 360 + ring * 155 }, borderRadius: "50%", border: `1px ${ring === 1 ? "dashed" : "solid"} rgba(215,204,255,${.16 - ring * .035})`, animation: `${ring === 1 ? "orbit-reverse" : "orbit"} ${38 + ring * 16}s linear infinite`, "&::before": { content: '""', position: "absolute", width: 7 + ring * 2, height: 7 + ring * 2, borderRadius: "50%", background: ring === 0 ? "#FF8297" : ring === 1 ? "#6CE7C2" : "#A98BFF", left: `${18 + ring * 13}%`, top: `${5 + ring * 8}%`, boxShadow: "0 0 24px currentColor" } }} />
        ))}
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          <Chip icon={<PublicRoundedIcon />} label="The public layer · Coming soon" variant="outlined" sx={{ mb: 3, background: "rgba(8,9,20,.48)", borderColor: "rgba(255,255,255,.16)" }} />
          <Typography variant="h1">Beyond your <Box component="span" sx={{ color: "secondary.light" }}>orbit.</Box></Typography>
          <Typography color="text.secondary" sx={{ mt: 2.5, mx: "auto", maxWidth: 620, fontSize: { sm: "1.08rem" } }}>
            World is Soul Link’s broader discovery layer—a public space designed around context, curiosity, and real identity choice.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" spacing={1.25} sx={{ mt: 3.5 }}>
            <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate("/soul-links")}>Grow your circle first</Button>
            <Button variant="outlined" onClick={() => navigate("/")}>Return to moments</Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,minmax(0,1fr))" }, gap: 1.5 }}>
        {worldLayers.map((layer, index) => (
          <Card key={layer.title} sx={{ p: 2.75, borderRadius: 3.5 }}>
            <Stack spacing={1.75}>
              <Stack direction="row" justifyContent="space-between" alignItems="center"><Box sx={{ width: 44, height: 44, borderRadius: 2.5, display: "grid", placeItems: "center", color: index === 1 ? "secondary.light" : index === 2 ? "info.main" : "primary.light", background: "rgba(169,139,255,.08)" }}>{layer.icon}</Box><Typography variant="caption" color="text.secondary">0{index + 1}</Typography></Stack>
              <Box><Typography variant="h6">{layer.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .6 }}>{layer.copy}</Typography></Box>
            </Stack>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
