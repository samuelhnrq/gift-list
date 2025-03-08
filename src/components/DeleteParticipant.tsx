"use client";
import type { GameType } from "@/lib/games";
import { deleteParticipantAction } from "@/lib/participants";
import { Delete } from "@mui/icons-material";
import { CircularProgress, IconButton } from "@mui/material";
import { useState } from "react";

interface DeleteParticipantProps {
  game: GameType;
  participantId: string;
}

function DeleteParticipant({
  game,
  participantId: pid,
}: DeleteParticipantProps) {
  const [loading, setLoading] = useState(false);
  if (game.creator === pid) {
    return <></>;
  }
  if (loading) {
    return <CircularProgress size={24} />;
  }
  return (
    <IconButton
      onClick={() => {
        setLoading(true);
        deleteParticipantAction(game.id, pid);
      }}
    >
      <Delete />
    </IconButton>
  );
}

export default DeleteParticipant;
