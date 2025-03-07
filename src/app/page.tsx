import { getSession } from "@/auth";
import { getCurrentParticipant } from "@/lib/participants";
import { Box, Typography } from "@mui/material";

export default async function Home() {
  const session = await getSession();

  const p = await getCurrentParticipant();
  return (
    <Box sx={{ flex: "1" }}>
      <Typography>
        Hello world {session?.user?.name}
        Me: {p?.id} {p?.participantGames.length}
      </Typography>
    </Box>
  );
}
