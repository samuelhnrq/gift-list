"use client";
import { amber, purple } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: { main: amber[400] },
        secondary: { main: purple[300] },
      },
    },
  },
  defaultColorScheme: "dark",
});

export default theme;
