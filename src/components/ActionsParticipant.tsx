"use client";
import { deleteParticipantAction } from "@/lib/participants";
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
import type { GameParticipant, GameType } from "@/lib/models";

interface ActionsParticipantProps {
  game: GameType;
  ptg: GameParticipant;
}

function ParticipantActions({ game, ptg }: ActionsParticipantProps) {
  const pid = ptg.participant.id;
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
          <Typography sx={{ p: 2 }}>{ptg.target?.userEmail}</Typography>
        </Popover>
      </>
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
