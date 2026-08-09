import { alpha, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#A98BFF",
      light: "#D8CBFF",
      dark: "#7356D8",
      contrastText: "#090812",
    },
    secondary: {
      main: "#FF8395",
      light: "#FFC0C9",
      dark: "#C94E69",
    },
    info: {
      main: "#6CE7C2",
    },
    background: {
      default: "#080914",
      paper: "#111321",
    },
    text: {
      primary: "#F8F6FF",
      secondary: "#A9AAC1",
    },
    divider: "rgba(235, 229, 255, 0.10)",
    error: {
      main: "#FF7188",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI Variable", "Segoe UI", sans-serif',
    h1: {
      fontSize: "clamp(2.55rem, 6vw, 5.6rem)",
      lineHeight: 0.97,
      fontWeight: 760,
      letterSpacing: "-0.06em",
    },
    h2: {
      fontSize: "clamp(2rem, 4vw, 3.65rem)",
      lineHeight: 1.02,
      fontWeight: 740,
      letterSpacing: "-0.05em",
    },
    h3: {
      fontSize: "clamp(1.55rem, 3vw, 2.25rem)",
      lineHeight: 1.08,
      fontWeight: 720,
      letterSpacing: "-0.035em",
    },
    h4: {
      fontWeight: 720,
      letterSpacing: "-0.035em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 680,
      letterSpacing: "-0.015em",
    },
    body1: {
      lineHeight: 1.72,
    },
    body2: {
      lineHeight: 1.62,
    },
    overline: {
      fontWeight: 750,
      letterSpacing: "0.16em",
      fontSize: "0.68rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#080914",
          backgroundImage:
            "radial-gradient(circle at 8% 5%, rgba(124, 92, 234, 0.18), transparent 30rem), radial-gradient(circle at 92% 18%, rgba(255, 103, 130, 0.11), transparent 25rem), radial-gradient(circle at 50% 100%, rgba(75, 212, 177, 0.07), transparent 35rem)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, rgba(20, 22, 39, 0.92), rgba(13, 15, 28, 0.88))",
          border: "1px solid rgba(235, 229, 255, 0.09)",
          boxShadow: "0 22px 70px rgba(0, 0, 0, 0.22)",
          backdropFilter: "blur(22px)",
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
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 999,
          paddingInline: 20,
          transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(120deg, #B49CFF, #8D6FEB)",
          boxShadow: "0 12px 34px rgba(139, 105, 235, 0.24)",
          "&:hover": {
            background: "linear-gradient(120deg, #C2AEFF, #9879F2)",
            boxShadow: "0 16px 38px rgba(139, 105, 235, 0.34)",
          },
        },
        outlined: {
          borderColor: "rgba(235, 229, 255, 0.17)",
          "&:hover": {
            borderColor: "rgba(194, 174, 255, 0.52)",
            backgroundColor: "rgba(169, 139, 255, 0.07)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "rgba(6, 7, 17, 0.44)",
          transition: "background-color 160ms ease, box-shadow 160ms ease",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(235, 229, 255, 0.12)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(235, 229, 255, 0.27)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(11, 12, 26, 0.82)",
            boxShadow: `0 0 0 4px ${alpha("#A98BFF", 0.08)}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 650,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(145deg, rgba(25, 26, 47, 0.98), rgba(11, 12, 25, 0.98))",
          border: "1px solid rgba(235, 229, 255, 0.12)",
          boxShadow: "0 32px 100px rgba(0,0,0,.55)",
        },
      },
    },
  },
});

export default theme;
