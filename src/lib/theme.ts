"use client";

import { createTheme } from "@mui/material";
import { red, green } from "@mui/material/colors";

export const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: { main: green[300] },
        secondary: { main: red[400] },
      },
    },
    light: {
      palette: {
        secondary: { main: green.A200 },
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
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
});
