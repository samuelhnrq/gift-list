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
        primary: { main: red[400] },
        secondary: { main: teal[300] },
      },
    },
    light: {
      palette: {
        secondary: { main: red[400] },
        primary: { main: teal[200] },
      },
    },
  },
});
