import { assertSession } from "@/auth";
import ListGames from "@/components/ListGames";
import AddGame from "@/components/AddGame";
import { Stack, Typography } from "@mui/material";

async function GamesList() {
  const session = await assertSession();
  return (
    <Stack flex={1} direction="column" width={1}>
      <Typography variant="h5" sx={{ marginY: 4, alignSelf: "start" }}>
        Welcome {session.user.name}
      </Typography>
      <ListGames />
      <AddGame />
    </Stack>
  );
}

export default GamesList;
