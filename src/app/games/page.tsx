import { assertSession } from "@/lib/auth";
import ListGames from "@/components/game/ListGames";
import { Stack, Typography } from "@mui/material";
import UpsertGame from "@/components/game/UpsertGame";

async function GamesList() {
  const session = await assertSession();
  return (
    <Stack flex={1} direction="column" width={1}>
      <Typography variant="h5" sx={{ marginY: 4, alignSelf: "start" }}>
        Welcome {session.user.name}
      </Typography>
      <ListGames />
      <UpsertGame />
    </Stack>
  );
}

export default GamesList;
