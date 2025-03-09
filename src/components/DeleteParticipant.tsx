"use client";
import type { GameType } from "@/lib/games";
import {
  deleteParticipantAction,
  getParticipantsOfGame,
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

interface DeleteParticipantProps {
  game: GameType;
  partipantToGame: Awaited<ReturnType<typeof getParticipantsOfGame>>[number];
}

function ParticipantActions({ game, partipantToGame }: DeleteParticipantProps) {
  const pid = partipantToGame.participant.id;
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const statusChip = game.status === "shuffled" && (
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
          {partipantToGame.target.userEmail}
        </Typography>
      </Popover>
    </>
  );
  if (game.creator === pid) {
    return statusChip;
  }
  if (loading) {
    return <CircularProgress size={24} />;
  }
  return (
    <>
      {statusChip}
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
