import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6",
    },
    secondary: {
      main: "#22c55e",
    },
    background: {
      default: "#0b0b12",
      paper: "#12131c",
    },
    text: {
      primary: "#f5f7fb",
      secondary: "#9aa4b2",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top, rgba(139,92,246,0.12), transparent 30%), radial-gradient(circle at bottom, rgba(34,197,94,0.08), transparent 30%), #0b0b12",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(18, 19, 28, 0.92)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 16,
          paddingBlock: 10,
        },
      },
    },
  },
});

export default theme;
 