"use client";

import type { GameType } from "@/lib/games";
import { addParticipantAction } from "@/lib/participants";
import { Box, LinearProgress, TextField } from "@mui/material";
import { useActionState } from "react";

function AddParticipant({ game }: { game: GameType }) {
  const [, action, isPending] = useActionState(addParticipantAction, game.id);

  return (
    <Box sx={{ width: "calc(65 * var(--mui-spacing))", maxWidth: "100%" }}>
      Add participants:
      <form action={action}>
        <TextField
          fullWidth
          variant="filled"
          label="E-mail"
          required
          type="email"
          name="email"
        />
        <LinearProgress sx={{ opacity: isPending ? 1 : 0 }} />
      </form>
    </Box>
  );
}

export default AddParticipant;
