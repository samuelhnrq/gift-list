import { deleteGameAction, getGames, type GameType } from "@/lib/games";
import { Delete } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { Suspense } from "react";

function GameCard({ game }: { game: GameType }) {
  return (
    <Card>
      <Link href={`/games/${game.id}`}>
        <CardContent sx={{ color: "text.primary" }}>
          <Typography variant="h6">{game.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {game.createdAt.toLocaleString()}
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        <IconButton onClick={deleteGameAction.bind(null, game.id)}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
}

async function GamesList() {
  const games = await getGames();
  return (
    <Grid container spacing={2}>
      {games.map((game) => (
        <Grid size={{ xs: 12, md: 3 }} key={game.id}>
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
  );
}

function GameCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton width="80%" height={25} />
        <Skeleton width="50%" height={20} sx={{ mb: 2 }} />
      </CardContent>
      <CardActions>
        <Skeleton
          variant="rounded"
          width="10%"
          height={30}
          sx={{ mb: 1, ml: 1 }}
        />
      </CardActions>
    </Card>
  );
}

function GamesListSkeleton() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, md: 3 }}>
          <GameCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

function ListGames() {
  return (
    <Suspense fallback={<GamesListSkeleton />}>
      <GamesList />
    </Suspense>
  );
}

export default ListGames;
