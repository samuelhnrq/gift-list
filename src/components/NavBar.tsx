import { CardGiftcard } from "@mui/icons-material";
import Link from "next/link";
import SignInButton from "./SignInButton";
import { getSession } from "@/auth";
import { Box, Typography } from "@mui/material";

async function NavBar() {
  const session = await getSession();
  return (
    <Box
      component="nav"
      sx={{ paddingY: 2, backgroundColor: "secondary.main" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          maxWidth: "xl",
          marginX: "auto",
          justifyContent: "space-between",
        }}
      >
        <Link href="/">
          <CardGiftcard sx={{ verticalAlign: "sub", color: "primary.main" }} />
          <Typography
            variant="h5"
            display="inline"
            color="textPrimary"
            sx={{ ml: 2 }}
          >
            Gift List
          </Typography>
        </Link>
        <SignInButton user={session?.user} />
      </Box>
    </Box>
  );
}

export default NavBar;
