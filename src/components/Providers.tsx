import { theme } from "@/lib/theme";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { PropsWithChildren } from "react";

function Providers({ children }: PropsWithChildren) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ a: { textDecoration: "none" } }} />
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default Providers;
