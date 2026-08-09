import { Button, Card, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Card sx={{ minHeight: 420, p: 4, borderRadius: 5, display: "grid", placeItems: "center", textAlign: "center", background: "radial-gradient(circle at 50% 35%,rgba(169,139,255,.18),transparent 16rem),rgba(15,17,31,.85)" }}>
      <Stack alignItems="center" spacing={2}>
        <Typography variant="overline" color="secondary.light">Signal lost · 404</Typography>
        <Typography variant="h2">This orbit doesn’t exist.</Typography>
        <Typography color="text.secondary">Let’s get you back to somewhere familiar.</Typography>
        <Button variant="contained" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/")}>Back to moments</Button>
      </Stack>
    </Card>
  );
}
