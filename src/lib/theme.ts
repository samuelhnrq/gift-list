"use client";

import { createTheme } from "@mui/material";
import { red, teal } from "@mui/material/colors";

export const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: { main: teal[300] },
        secondary: { main: red[400] },
      },
    },
    light: {
      palette: {
        secondary: { main: teal[200] },
        primary: { main: red[400] },
      },
    },
  },
  components: {
    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
      },
    },
  },
});
