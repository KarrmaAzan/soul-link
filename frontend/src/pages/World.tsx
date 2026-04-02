import { Box, Button, Card, Stack, Typography } from "@mui/material";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { useNavigate } from "react-router-dom";

export default function World() {
  function handleLaunchWorld() {
    alert(
      "World is being built as a separate application and will launch from here soon.",
    );
  }
  const navigate = useNavigate();
  
  return (
    <Box sx={{ width: "100%" }}>
      <Card
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(99,102,241,0.06) 0%, rgba(16,185,129,0.04) 100%)",
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.16) 0%, rgba(16,185,129,0.16) 100%)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <PublicRoundedIcon sx={{ fontSize: 40 }} />
          </Box>

          <Box>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 2,
                color: "text.secondary",
                fontWeight: 700,
              }}
            >
              Soul Link Ecosystem
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Entering the World
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 620, mx: "auto", lineHeight: 1.8 }}
            >
              The World is a separate application within the Soul Link
              ecosystem. It is designed as the broader discovery and network
              layer — a place for public interaction, exploration, and expansion
              beyond the private persona system inside Soul Link.
            </Typography>
          </Box>

          <Card
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 640,
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              textAlign: "left",
            }}
          >
            <Stack spacing={1.25}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                What World is for
              </Typography>

              <Typography variant="body2" color="text.secondary">
                • broader discovery across the ecosystem
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • public-facing interaction and networking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • a larger social layer beyond private persona spaces
              </Typography>
            </Stack>
          </Card>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: "100%", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<LaunchRoundedIcon />}
              onClick={handleLaunchWorld}
              sx={{ minWidth: 200 }}
            >
              Launch World
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/")}
              sx={{ minWidth: 200 }}
            >
              Return to Soul Link
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            This prototype keeps World separate so the core Soul Link experience
            stays focused on identity, personas, and private social interaction.
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
