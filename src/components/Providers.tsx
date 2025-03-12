import { theme } from "@/lib/theme";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { PropsWithChildren } from "react";
import { PostHogProvider } from "./PostHog";

function Providers({ children }: PropsWithChildren) {
  return (
    <PostHogProvider>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyles styles={{ a: { textDecoration: "none" } }} />
          <CssBaseline enableColorScheme />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </PostHogProvider>
  );
}

export default Providers;
