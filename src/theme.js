
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#424242", // Very Dark Grey
    },
    secondary: {
      main: "#ffc107",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: '#172b4d',
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h5: {
      fontWeight: 600,
      color: '#424242' // Very Dark Grey
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(33, 150, 243, 0.8)", // Beautiful Blue with transparency
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(173, 216, 230, 0.3)", // Light Blue
            transform: "scale(1.02)",
            transition: "transform 0.2s ease-in-out",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(66, 66, 66, 0.2)", // Dark Grey selection
            "&:hover": {
              backgroundColor: "rgba(66, 66, 66, 0.3)", // Darker Grey on hover
            }
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }
        }
      }
    }
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#bdbdbd", // Lighter Grey for dark mode
    },
    secondary: {
      main: "#ffc107",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#2196f3", // Solid Beautiful Blue
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1E1E1E",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(173, 216, 230, 0.3)", // Light Blue
            transform: "scale(1.05)",
            transition: "transform 0.2s ease-in-out",
          },
        },
      },
    },
  },
});
