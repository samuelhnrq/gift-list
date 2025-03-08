import type { GameType } from "@/lib/games";
import { Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";

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
    </Card>
  );
}

export default GameCard;
