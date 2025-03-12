"use client";
import { deleteParticipantAction } from "@/lib/participants";
import { Delete } from "@mui/icons-material";
import {
  Chip,
  CircularProgress,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import EditGameParticipant from "./EditGameParticipant";
import type { GameParticipant, GameType } from "@/lib/models";

interface ActionsParticipantProps {
  game: GameType;
  ptg: GameParticipant;
}

function ParticipantActions({ game, ptg }: ActionsParticipantProps) {
  const pid = ptg.participant.id;
  const [loading, setLoading] = useState(false);
  if (game.status === "shuffled" || game.status === "closed") {
    return (
      <Tooltip title={ptg.target?.userEmail}>
        <Chip
          label="Assigned"
          size="small"
          color="primary"
          sx={{ userSelect: "none" }}
        />
      </Tooltip>
    );
  }
  if (game.creator === pid) {
    return <EditGameParticipant ptg={ptg} />;
  }
  if (loading) {
    return <CircularProgress size={24} />;
  }
  return (
    <>
      <EditGameParticipant ptg={ptg} />
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
