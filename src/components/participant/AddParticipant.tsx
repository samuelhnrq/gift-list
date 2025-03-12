"use client";

import { addParticipantAction } from "@/lib/participants";
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
} from "@mui/material";
import { useActionState, useId } from "react";
import type { GameType } from "@/lib/models";
import { ArrowForward } from "@mui/icons-material";

function AddParticipant({ game }: { game: GameType }) {
  const [, action, isPending] = useActionState(addParticipantAction, game.id);
  const id = useId();

  return (
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
              <IconButton aria-label="add participant" type="submit" edge="end">
                <ArrowForward />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <LinearProgress sx={{ opacity: isPending ? 1 : 0 }} />
    </form>
  );
}

export default AddParticipant;
