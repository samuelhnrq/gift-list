"use client";

import { addParticipantAction } from "@/lib/participants";
import {
  FilledInput,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
} from "@mui/material";
import { useActionState, useId } from "react";
import GameActions from "./GameActions";
import type { GameType } from "@/lib/models";
import { ArrowForward } from "@mui/icons-material";

function AddParticipant({ game }: { game: GameType }) {
  const [, action, isPending] = useActionState(addParticipantAction, game.id);
  const id = useId();

  return (
    <div>
      Add participants:
      <Grid2 container spacing={1} alignItems="start">
        <Grid2 size={{ xs: 10, md: 6 }}>
          <form action={action}>
            <FormControl fullWidth variant="filled">
              <InputLabel htmlFor={id}>E-mail</InputLabel>
              <FilledInput
                id={id}
                type="email"
                name="email"
                required
                disabled={isPending || game.status !== "open"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="add participant"
                      type="submit"
                      edge="end"
                    >
                      <ArrowForward />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </form>
          <LinearProgress sx={{ opacity: isPending ? 1 : 0 }} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <GameActions game={game} sx={{ float: "right" }} />
        </Grid2>
      </Grid2>
    </div>
  );
}

export default AddParticipant;
