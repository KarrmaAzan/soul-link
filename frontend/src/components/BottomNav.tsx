import { useMemo, useState } from "react";
import { Box, Fab, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useLocation, useNavigate } from "react-router-dom";

type BottomNavProps = {
  onCreateMoment: () => void;
  onCreatePersona: () => void;
  onGoLive?: () => void;
};

type WheelAction = {
  key: string;
  label: string;
  icon: React.ReactNode;
  angle: number;
  onClick: () => void;
};

function YinYangIcon({ open }: { open: boolean }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: 34,
        height: 34,
        borderRadius: "50%",
        overflow: "hidden",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 260ms ease",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, #0f172a 0%, #0f172a 50%, #f8fafc 50%, #f8fafc 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: open
            ? "translate(-50%, -6px)"
            : "translate(-50%, 0px)",
          width: "50%",
          height: "50%",
          borderBottomLeftRadius: "100px",
          borderBottomRightRadius: "100px",
          backgroundColor: "#f8fafc",
          transition: "transform 260ms ease",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: open
            ? "translate(-50%, 6px)"
            : "translate(-50%, 0px)",
          width: "50%",
          height: "50%",
          borderTopLeftRadius: "100px",
          borderTopRightRadius: "100px",
          backgroundColor: "#0f172a",
          transition: "transform 260ms ease",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "#0f172a",
          zIndex: 2,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "75%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "#f8fafc",
          zIndex: 2,
        }}
      />
    </Box>
  );
}

function BottomNav({
  onCreateMoment,
  onCreatePersona,
  onGoLive,
}: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const actions: WheelAction[] = useMemo(
    () => [
      {
        key: "home",
        label: "Home",
        icon: <HomeRoundedIcon fontSize="small" />,
        angle: -150,
        onClick: () => {
          navigate("/");
          setOpen(false);
        },
      },
      {
        key: "world",
        label: "World",
        icon: <PublicRoundedIcon fontSize="small" />,
        angle: -115,
        onClick: () => {
          navigate("/world");
          setOpen(false);
        },
      },
      {
        key: "inbox",
        label: "Inbox",
        icon: <MailOutlineRoundedIcon fontSize="small" />,
        angle: -80,
        onClick: () => {
          navigate("/inbox");
          setOpen(false);
        },
      },
      {
        key: "sanctum",
        label: "Sanctum",
        icon: <AutoAwesomeRoundedIcon fontSize="small" />,
        angle: -45,
        onClick: () => {
          navigate("/sanctum");
          setOpen(false);
        },
      },
      {
        key: "moment",
        label: "Moment",
        icon: <AddPhotoAlternateOutlinedIcon fontSize="small" />,
        angle: 45,
        onClick: () => {
          onCreateMoment();
          setOpen(false);
        },
      },
      {
        key: "persona",
        label: "Persona",
        icon: <PersonAddAlt1RoundedIcon fontSize="small" />,
        angle: 80,
        onClick: () => {
          onCreatePersona();
          setOpen(false);
        },
      },
      {
        key: "live",
        label: "Go Live",
        icon: <RadioButtonCheckedRoundedIcon fontSize="small" />,
        angle: 115,
        onClick: () => {
          if (onGoLive) {
            onGoLive();
          } else {
            navigate("/world");
          }
          setOpen(false);
        },
      },
    ],
    [navigate, onCreateMoment, onCreatePersona, onGoLive]
  );

  return (
    <>
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(3, 7, 18, 0.38)",
            backdropFilter: "blur(8px)",
            zIndex: 1200,
          }}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          left: "50%",
          bottom: -5,
          transform: "translateX(-50%)",
          zIndex: 1300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 280,
            height: 350,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {actions.map((action) => {
            const radius = 110;
            const radians = (action.angle * Math.PI) / 180;
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;

            return (
              <Box
                key={action.key}
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: open
                    ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                    : "translate(-50%, -50%) scale(0.4)",
                  opacity: open ? 1 : 0,
                  transition:
                    "transform 280ms cubic-bezier(.2,.8,.2,1), opacity 180ms ease",
                  transitionDelay: open ? "30ms" : "0ms",
                  pointerEvents: open ? "auto" : "none",
                }}
              >
                <Tooltip title={action.label} placement="top">
                  <Paper
                    elevation={8}
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                    }}
                  >
                    <IconButton
                      onClick={action.onClick}
                      sx={{
                        width: 58,
                        height: 58,
                        color: "text.primary",
                      }}
                    >
                      {action.icon}
                    </IconButton>
                  </Paper>
                </Tooltip>

                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "100%",
                    transform: "translateX(-50%)",
                    mt: 0.75,
                    px: 1,
                    py: 0.35,
                    borderRadius: 999,
                    backgroundColor: "rgba(15,23,42,0.88)",
                    color: "white",
                    whiteSpace: "nowrap",
                    fontSize: "0.7rem",
                    letterSpacing: 0.2,
                  }}
                >
                  {action.label}
                </Typography>
              </Box>
            );
          })}

          <Fab
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              width: 76,
              height: 76,
              minHeight: 76,
              pointerEvents: "auto",
              boxShadow: open
                ? "0 18px 40px rgba(0,0,0,0.24)"
                : "0 12px 28px rgba(0,0,0,0.16)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(245,245,245,0.92) 100%)",
              color: "text.primary",
              border: "1px solid rgba(255,255,255,0.55)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(245,245,245,0.96) 100%)",
              },
            }}
          >
            {open ? (
              <CloseRoundedIcon />
            ) : (
              <YinYangIcon open={open} />
            )}
          </Fab>

        </Box>
      </Box>
    </>
  );
}

export default BottomNav;