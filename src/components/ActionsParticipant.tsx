"use client";
import type { GameType } from "@/lib/games";
import {
  deleteParticipantAction,
  type GameParticipant,
} from "@/lib/participants";
import { Delete } from "@mui/icons-material";
import {
  Chip,
  CircularProgress,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import EditGameParticipant from "./EditGameParticipant";

interface ActionsParticipantProps {
  game: GameType;
  ptg: GameParticipant;
}

function ParticipantActions({
  game,
  ptg: partipantToGame,
}: ActionsParticipantProps) {
  const pid = partipantToGame.participant.id;
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  if (game.status === "shuffled") {
    return (
      <>
        <Chip
          label="Assigned"
          ref={ref}
          size="small"
          color="primary"
          sx={{ userSelect: "none" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        />
        <Popover
          open={open}
          sx={{ pointerEvents: "none" }}
          disableRestoreFocus
          anchorEl={ref.current}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
        >
          <Typography sx={{ p: 2 }}>
            {partipantToGame.target?.userEmail}
          </Typography>
        </Popover>
      </>
    );
  }
  if (game.creator === pid) {
    return (
      <EditGameParticipant game={game} partipantToGame={partipantToGame} />
    );
  }
  if (loading) {
    return <CircularProgress size={24} />;
  }
  return (
    <>
      <EditGameParticipant game={game} partipantToGame={partipantToGame} />
      <IconButton
        onClick={() => {
          setLoading(true);
          deleteParticipantAction(game.id, pid);
        }}
      >
        <Delete />
      </IconButton>
    </>
  );
}

export default ParticipantActions;
