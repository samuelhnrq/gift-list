"use client";

import { clearGivesToAction, shuffleParticipantsAction } from "@/lib/games";
import type { GameType } from "@/lib/models";
import { notifyParticipantsAction } from "@/lib/participants";
import { Notifications, Shuffle, Undo } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Snackbar,
  type SxProps,
  type Theme,
} from "@mui/material";
import {
  startTransition,
  useActionState,
  useEffect,
  useState,
  type ReactNode,
} from "react";

function ShuffleParticipants({
  game,
  sx,
}: {
  game: GameType;
  sx?: SxProps<Theme>;
}) {
  const [open, setOpen] = useState(false);
  const [errorMsg, shuffleAction, isShufflePending] = useActionState(
    shuffleParticipantsAction.bind(null, game.id),
    "",
  );
  useEffect(() => {
    if (isShufflePending) {
      setOpen(false);
    }
    if (errorMsg) {
      setOpen(true);
    }
  }, [errorMsg, isShufflePending]);
  return (
    <>
      <Button
        startIcon={<Shuffle />}
        onClick={() => {
          startTransition(() => shuffleAction());
        }}
        loading={isShufflePending}
        sx={sx}
      >
        Shuffle
      </Button>
      <Snackbar
        open={open}
        color=""
        message={errorMsg}
        onClose={() => setOpen(false)}
        autoHideDuration={6000}
      />
    </>
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
  const [, notifyParticipants, isClosePending] = useActionState(
    notifyParticipantsAction,
    game.id,
  );
  return (
    <Button
      endIcon={<Notifications />}
      onClick={() => startTransition(() => notifyParticipants())}
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
    <ButtonGroup
      variant="contained"
      color={game.status === "open" ? "primary" : "secondary"}
      sx={sx}
    >
      {actions}
    </ButtonGroup>
  );
}

export default GameActions;
