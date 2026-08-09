import { useState } from "react";
import { Box, Fab, IconButton, Paper, Stack, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Diversity2RoundedIcon from "@mui/icons-material/Diversity2Rounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { useLocation, useNavigate } from "react-router-dom";

type BottomNavProps = {
  onCreateMoment: () => void;
  onCreatePersona: () => void;
  onGoLive?: () => void;
};

const navItems = [
  { label: "Feed", path: "/", icon: <HomeRoundedIcon /> },
  { label: "Links", path: "/soul-links", icon: <Diversity2RoundedIcon /> },
  { label: "Inbox", path: "/inbox", icon: <MailRoundedIcon /> },
  { label: "Sanctum", path: "/sanctum", icon: <AutoAwesomeRoundedIcon /> },
];

export default function BottomNav({ onCreateMoment, onCreatePersona, onGoLive }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  function run(action: () => void) {
    action();
    setOpen(false);
  }

  return (
    <>
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            display: { md: "none" },
            position: "fixed",
            inset: 0,
            zIndex: 1190,
            background: "rgba(4,5,13,.62)",
            backdropFilter: "blur(10px)",
          }}
        />
      )}

      <Stack
        spacing={1}
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          zIndex: 1210,
          left: 10,
          right: 10,
          bottom: 10,
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {open && (
          <Paper
            sx={{
              width: "100%",
              maxWidth: 470,
              p: 1.25,
              borderRadius: 3.5,
              pointerEvents: "auto",
              border: "1px solid rgba(235,229,255,.13)",
              background: "rgba(18,19,36,.96)",
              boxShadow: "0 24px 65px rgba(0,0,0,.45)",
            }}
          >
            <Stack direction="row" spacing={1}>
              {[
                { label: "Moment", icon: <EditNoteRoundedIcon />, action: onCreateMoment },
                { label: "Persona", icon: <PersonAddAlt1RoundedIcon />, action: onCreatePersona },
                { label: "World", icon: <PublicRoundedIcon />, action: onGoLive || (() => navigate("/world")) },
              ].map((item) => (
                <Box
                  key={item.label}
                  component="button"
                  onClick={() => run(item.action)}
                  sx={{
                    flex: 1,
                    py: 1.25,
                    color: "text.primary",
                    border: "1px solid rgba(235,229,255,.08)",
                    borderRadius: 2.5,
                    background: "rgba(255,255,255,.025)",
                    cursor: "pointer",
                  }}
                >
                  <Box sx={{ color: "primary.light", lineHeight: 0 }}>{item.icon}</Box>
                  <Typography variant="caption" sx={{ mt: .5, display: "block", fontWeight: 700 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}

        <Paper
          sx={{
            width: "100%",
            maxWidth: 470,
            height: 70,
            borderRadius: 999,
            px: .75,
            pointerEvents: "auto",
            border: "1px solid rgba(235,229,255,.13)",
            background: "rgba(13,14,28,.93)",
            backdropFilter: "blur(26px)",
            boxShadow: "0 16px 48px rgba(0,0,0,.4)",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-around" sx={{ height: "100%" }}>
            {navItems.slice(0, 2).map((item) => (
              <NavButton key={item.path} {...item} active={location.pathname === item.path} onClick={() => navigate(item.path)} />
            ))}

            <Fab
              onClick={() => setOpen((current) => !current)}
              aria-label={open ? "Close create menu" : "Open create menu"}
              sx={{
                width: 56,
                height: 56,
                minHeight: 56,
                mx: .4,
                color: "#0A0914",
                background: "linear-gradient(145deg, #FFD0D6, #A98BFF 76%)",
                boxShadow: "0 10px 35px rgba(169,139,255,.38)",
                "&:hover": { background: "linear-gradient(145deg, #FFDCE0, #B89FFF 76%)" },
              }}
            >
              {open ? <CloseRoundedIcon /> : <AddRoundedIcon />}
            </Fab>

            {navItems.slice(2).map((item) => (
              <NavButton key={item.path} {...item} active={location.pathname === item.path} onClick={() => navigate(item.path)} />
            ))}
          </Stack>
        </Paper>
      </Stack>
    </>
  );
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={label}
      sx={{
        width: 58,
        height: 58,
        borderRadius: 2.5,
        color: active ? "primary.light" : "text.secondary",
        background: active ? "rgba(169,139,255,.10)" : "transparent",
      }}
    >
      <Stack alignItems="center" spacing={.15}>
        {icon}
        <Typography variant="caption" sx={{ fontSize: ".59rem", fontWeight: 700 }}>
          {label}
        </Typography>
      </Stack>
    </IconButton>
  );
}
