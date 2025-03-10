"use client";

import type { GameType } from "@/lib/games";
import { addParticipantAction } from "@/lib/participants";
import { Grid2, LinearProgress, TextField } from "@mui/material";
import { useActionState } from "react";
import GameActions from "./GameActions";

function AddParticipant({ game }: { game: GameType }) {
  const [, action, isPending] = useActionState(addParticipantAction, game.id);

  return (
    <div>
      Add participants:
      <Grid2 container spacing={1} alignItems="start">
        <Grid2 size={{ xs: 12, md: 6 }}>
          <form action={action}>
            <TextField
              fullWidth
              variant="filled"
              label="E-mail"
              required
              disabled={isPending || game.status !== "open"}
              type="email"
              name="email"
            />
            <LinearProgress sx={{ opacity: isPending ? 1 : 0 }} />
          </form>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <GameActions game={game} sx={{ float: "right" }} />
        </Grid2>
      </Grid2>
    </div>
  );
}

export default AddParticipant;
