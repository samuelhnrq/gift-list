import { deleteGameAction, type GameType } from "@/lib/games";
import { Delete } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
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
      <CardActions>
        <IconButton onClick={deleteGameAction.bind(null, game.id)}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default GameCard;
