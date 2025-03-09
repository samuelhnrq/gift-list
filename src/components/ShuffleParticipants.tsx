"use client";

import {
  clearGivesToAction,
  shuffleParticipantsAction,
  type GameType,
} from "@/lib/games";
import { Shuffle, Undo } from "@mui/icons-material";
import { Button } from "@mui/material";
import { startTransition, useActionState } from "react";

function ShuffleParticipants({ game }: { game: GameType }) {
  const [, shuffleAction, isShufflePending] = useActionState(
    shuffleParticipantsAction,
    game.id,
  );
  const [, clearAction, isClearPending] = useActionState(
    clearGivesToAction,
    game.id,
  );
  if (game.status === "closed") {
    return <></>;
  }
  if (game.status === "shuffled") {
    return (
      <Button
        startIcon={<Undo />}
        variant="contained"
        onClick={() => startTransition(() => clearAction())}
        disabled={isClearPending}
        sx={{ ml: "auto", mt: 2 }}
        color="primary"
      >
        Clear
      </Button>
    );
  }
  return (
    <Button
      startIcon={<Shuffle />}
      variant="contained"
      onClick={() => startTransition(() => shuffleAction())}
      disabled={isShufflePending}
      sx={{ ml: "auto", mt: 2 }}
      color="secondary"
    >
      Shuffle
    </Button>
  );
}

export default ShuffleParticipants;
