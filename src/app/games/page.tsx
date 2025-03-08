import { assertSession } from "@/auth";
import GameCard from "@/components/GameCard";
import NewGame from "@/components/NewGame";
import { getGames } from "@/lib/games";
import { Grid2 as Grid, Stack, Typography } from "@mui/material";

async function GamesList() {
  const session = await assertSession();
  const games = await getGames();
  return (
    <Stack flex={1} direction="column" width={1}>
      <Typography variant="h5" sx={{ marginY: 4, alignSelf: "start" }}>
        Welcome {session.user.name}
      </Typography>
      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid size={3} key={game.id}>
            <GameCard game={game} />
          </Grid>
        ))}
        {games.length === 0 && (
          <Typography
            variant="subtitle1"
            fontStyle="italic"
            color="textSecondary"
          >
            No games found, create one?
          </Typography>
        )}
      </Grid>
      <NewGame />
    </Stack>
  );
}

export default GamesList;
