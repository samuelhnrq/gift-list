"use client";

import type { GameType } from "@/lib/games";
import { addParticipantAction } from "@/lib/participants";
import { TextField } from "@mui/material";
import { useActionState } from "react";

function AddParticipant({ game }: { game: GameType }) {
  const [, action] = useActionState(addParticipantAction, game.id);

  return (
    <div>
      Add participants:
      <form action={action}>
        <TextField
          variant="filled"
          label="E-mail"
          required
          type="email"
          name="email"
          sx={{ width: "calc(65 * var(--mui-spacing))", maxWidth: "100%" }}
        />
      </form>
    </div>
  );
}

export default AddParticipant;
