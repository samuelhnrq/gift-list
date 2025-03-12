import { CardGiftcard } from "@mui/icons-material";
import Link from "next/link";
import AuthState from "./AuthState";
import { getSession } from "@/lib/auth";
import { Typography, AppBar, Toolbar } from "@mui/material";

async function NavBar() {
  const session = await getSession();
  return (
    <AppBar position="sticky">
      <Toolbar
        component="nav"
        sx={{
          display: "flex",
          alignItems: "center",
          maxWidth: "xl",
          width: "100%",
          paddingX: { sm: 2, md: null },
          marginX: "auto",
          justifyContent: "space-between",
        }}
      >
        <Link href="/">
          <Typography variant="h5" display="inline" noWrap color="textPrimary">
            <CardGiftcard
              sx={{ verticalAlign: "baseline", color: "secondary.main", mr: 2 }}
            />
            Gift List
          </Typography>
        </Link>
        <AuthState user={session?.user} />
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
