"use client";

import {
  clearGivesToAction,
  closeGameAction,
  shuffleParticipantsAction,
} from "@/lib/games";
import type { GameType } from "@/lib/models";
import { Notifications, Shuffle, Undo } from "@mui/icons-material";
import { Button, ButtonGroup, type SxProps, type Theme } from "@mui/material";
import { startTransition, useActionState, type ReactNode } from "react";

function ShuffleParticipants({
  game,
  sx,
}: {
  game: GameType;
  sx?: SxProps<Theme>;
}) {
  const [, shuffleAction, isShufflePending] = useActionState(
    shuffleParticipantsAction,
    game.id,
  );
  return (
    <Button
      startIcon={<Shuffle />}
      onClick={() => startTransition(() => shuffleAction())}
      loading={isShufflePending}
      sx={sx}
    >
      Shuffle
    </Button>
  );
}

function ClearParticipants({
  game,
  sx,
}: {
  game: GameType;
  sx?: SxProps<Theme>;
}) {
  const [, clearAction, isClearPending] = useActionState(
    clearGivesToAction,
    game.id,
  );
  return (
    <Button
      startIcon={<Undo />}
      onClick={() => startTransition(() => clearAction())}
      loading={isClearPending}
      sx={sx}
    >
      Clear
    </Button>
  );
}

function NotifyParticipants({
  game,
  sx,
}: {
  game: GameType;
  sx?: SxProps<Theme>;
}) {
  const [, closeAction, isClosePending] = useActionState(
    closeGameAction,
    game.id,
  );
  return (
    <Button
      endIcon={<Notifications />}
      onClick={() => startTransition(() => closeAction())}
      loading={isClosePending}
      sx={sx}
    >
      Notify
    </Button>
  );
}

function GameActions({
  game,
  sx,
}: {
  game: GameType;
  sx?: SxProps<Theme>;
}): ReactNode {
  const actions: ReactNode[] = [];
  if (game.status === "closed") {
    return actions;
  }
  if (game.status === "shuffled") {
    actions.push(<ClearParticipants game={game} />);
    actions.push(<NotifyParticipants game={game} />);
  }
  if (game.status === "open") {
    actions.push(<ShuffleParticipants game={game} />);
  }
  return (
    <ButtonGroup variant="contained" color="primary" sx={sx}>
      {actions}
    </ButtonGroup>
  );
}

export default GameActions;
